import { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Modal, Table, Badge } from 'react-bootstrap';
import HikeMap from '../../HikeMap';
import '../../../styles/TrackedHikes.css';
const dayjs = require('dayjs');
const duration = require('dayjs/plugin/duration');
dayjs.extend(duration);

function TrackedHikesInfoTable(props) {
	const ongoingHike = props.trackedHikes.filter(th => th.endTime === null || th.endTime === undefined).pop();
	const [ongoingHikeElapsedTime, setOngoingHikeElapsedTime] = useState(ongoingHike ? dayjs.duration(dayjs() - dayjs(ongoingHike.startTime)) : undefined);
	const completedHikes = props.trackedHikes.filter(th => th.endTime !== null && th.endTime !== undefined);

	let tempOngoingHikes = props.trackedHikes.filter(th => th.endTime === null || th.endTime === undefined);
	for (let tempOngoingHike of tempOngoingHikes)
		tempOngoingHike.elapsedTime = dayjs.duration(dayjs() - dayjs(tempOngoingHike.startTime));
	const [ongoingHikes, setOngoingHikes] = useState( props.inProfilePage ? [tempOngoingHikes] : []);

	let setIntervalsToUpdateElapsedTime = [];

	useEffect(() => {		// update ongoing hike elapsed time
		if (!props.inProfilePage && ongoingHike) {
			setOngoingHikeElapsedTime(dayjs.duration(dayjs() - dayjs(ongoingHike.startTime)));

			const setIntervalToUpdateElapsedTime = setInterval(() => {		// update the elapsed time every second
				setOngoingHikeElapsedTime(dayjs.duration(dayjs() - dayjs(ongoingHike.startTime)));
			}, 1000);

			setIntervalsToUpdateElapsedTime.push(setIntervalToUpdateElapsedTime);
		}

		return () => {		// stop setInterval on page leave
			setIntervalsToUpdateElapsedTime.forEach(s => clearInterval(s));
		};
	}, [ongoingHike])

	useEffect(() => {	// update all ongoing hikes elapsed time (in profile page)
		if (props.inProfilePage) {
			let tempOngoingHikes = props.trackedHikes.filter(th => th.endTime === null || th.endTime === undefined);
			for (let tempOngoingHike of tempOngoingHikes)
				tempOngoingHike.elapsedTime = dayjs.duration(dayjs() - dayjs(tempOngoingHike.startTime));
			setOngoingHikes(tempOngoingHikes);

			const setIntervalToUpdateElapsedTime = setInterval(() => {		// update the elapsed time every second
				let tempOngoingHikes = props.trackedHikes.filter(th => th.endTime === null || th.endTime === undefined);
				for (let tempOngoingHike of tempOngoingHikes)
					tempOngoingHike.elapsedTime = dayjs.duration(dayjs() - dayjs(tempOngoingHike.startTime));
				setOngoingHikes(tempOngoingHikes);
			}, 1000);

			setIntervalsToUpdateElapsedTime.push(setIntervalToUpdateElapsedTime);
		}

		return () => {		// stop setInterval on page leave
			setIntervalsToUpdateElapsedTime.forEach(s => clearInterval(s));
		};
	}, []);

	return (
		<>
			{!props.inProfilePage && ongoingHike && <Row className='tracked-hikes-row'>
				<h3 className='sub-title'>Ongoing hike</h3>
				<p>Start time: {dayjs(ongoingHike.startTime).format('MMM DD, YYYY h:mm a')}</p>
				<p>Progress: {ongoingHike.progress} reference points reached</p>
				<p>Elapsed time: {ongoingHikeElapsedTime?.format('H [h] mm [m] ss [s]')}</p>
			</Row>}
			{completedHikes.length > 0 &&
				<Row className='tracked-hikes-row'>
					<h3 className='sub-title'>{props.inProfilePage ? 'Tracked hikes' : 'Completed hikes'}</h3>
					<Table striped responsive>
						<thead>
							<tr>
								<th>#</th>
								{props.inProfilePage && <th>Hike</th>}
								<th>Date</th>
								<th>Time</th>
								<th>Status</th>
								<th>Progress</th>
							</tr>
						</thead>
						<tbody>
							{completedHikes.concat(ongoingHikes).sort((a, b) => (a.id > b.id ? 1 : -1)).map((th, i) => {
								return (
									<tr key={th.id} className='align-middle'>
										<td>{i + 1}</td>
										{props.inProfilePage && <td className='wide-td'>{th.hikeLabel}</td>}
										<td>{dayjs(th.startTime).format('MMM DD, YYYY')}</td>
										<td>
											{th.status === 'ongoing' ?
												th.elapsedTime.format('H [h] mm [m]') :
												dayjs.duration(dayjs(th.endTime) - dayjs(th.startTime)).format('H [h] mm [m]')}
										</td>
										<td><Badge bg={th.status === 'completed' ? 'success' : 'info'}>{th.status}</Badge></td>
										<td>{th.progress ? th.progress + ' reference points reached' : 'Not recorded'}</td>
										<td><Button className='see-more-btn' onClick={() => props.setTrackedHikesInfoModalShow(th.id)}>See more</Button></td>
									</tr>
								);
							})}
						</tbody>
					</Table>
				</Row>}
		</>
	);
}

function TrackedHikesInfoModal(props) {
	const [trackedHikeID, setTrackedHikeID] = useState(props.show);
	const trackedHike = props.trackedHikes.find(th => th.id === trackedHikeID);
	const [ongoingHikeElapsedTime, setOngoingHikeElapsedTime] = useState(trackedHike && trackedHike.status === 'ongoing' && (dayjs() - dayjs(trackedHike.startTime)));

	const refPointsReachedInTrackedHike = trackedHike?.pointsReached?.sort((a, b) => (a.pointID > b.pointID) ? 1 : -1);

	if (props.hike && props.hike !== {} && props.hike.points) {		// to prevent access in case hike is not loaded
		if (trackedHike && refPointsReachedInTrackedHike.length > 0) {
			const maxRefPointReachedInTrackedHike = refPointsReachedInTrackedHike[refPointsReachedInTrackedHike.length - 1];

			for (let point of props.hike.points) {
				point.reachedInTrackedHike = point.pointID <= maxRefPointReachedInTrackedHike.pointID;    // generic point is before latest reached point

				// search if current point is a previously reached reference point; if so, save time of reach
				const refPointReached = refPointsReachedInTrackedHike.find(refPointReached => point.pointID === refPointReached.pointID);
				point.timeOfReachInTrackedHike = refPointReached ? refPointReached.timeOfReach : undefined;
			}
		} else if (trackedHike && refPointsReachedInTrackedHike.length === 0) {		// set to null, might not be if I previously opened another hike map
			for (let point of props.hike.points) {
				point.reachedInTrackedHike = false;
				point.timeOfReachInTrackedHike = undefined;
			}
		}
	}

	let setIntervalsToUpdateElapsedTime = [];
	useEffect(() => {		// update ongoing hike elapsed time
		if (trackedHike && trackedHike.status === 'ongoing') {
			setOngoingHikeElapsedTime(dayjs.duration(dayjs() - dayjs(trackedHike.startTime)));

			const setIntervalToUpdateElapsedTime = setInterval(() => {		// update the elapsed time every second
				setOngoingHikeElapsedTime(dayjs.duration(dayjs() - dayjs(trackedHike.startTime)));
			}, 1000);

			setIntervalsToUpdateElapsedTime.push(setIntervalToUpdateElapsedTime);
		}

		return () => {		// stop setInterval on page leave
			setIntervalsToUpdateElapsedTime.forEach(s => clearInterval(s));
		};
	}, [trackedHike])

	return (
		<Modal show={props.show} onShow={() => setTrackedHikeID(props.show)} onHide={props.onHide} size="xl" aria-labelledby="contained-modal-title-vcenter" centered>
			<Modal.Header closeButton className='box-modal hike-page-modal-header'>
				<Modal.Title id="contained-modal-title-vcenter">Tracked hike {trackedHike && dayjs(trackedHike.startTime).format(' [-] MMM DD, YYYY')}</Modal.Title>
			</Modal.Header>
			<Modal.Body className='box-modal hike-page-modal-body'>
				<Container>
					<Row>
						<Col lg={5}>
							<Row>
								<Col xs={4} className='stats-names-col d-flex justify-content-end'>Start time</Col>
								<Col>{trackedHike && dayjs(trackedHike.startTime).format('MMM DD, YYYY h:mm:ss a')}</Col>
							</Row>
							{trackedHike && trackedHike.status !== 'ongoing' && <Row>
								<Col xs={4} className='stats-names-col d-flex justify-content-end'>End time</Col>
								<Col>{dayjs(trackedHike.endTime).format('MMM DD, YYYY h:mm:ss a')}</Col>
							</Row>}
							<Row>
								<Col xs={4} className='stats-names-col d-flex justify-content-end'>Time</Col>
								<Col>
									{trackedHike && (trackedHike.status === 'ongoing' && ongoingHikeElapsedTime ? 
										ongoingHikeElapsedTime.format('H [h] mm [m] ss [s]') :
										dayjs.duration(dayjs(trackedHike.endTime) - dayjs(trackedHike.startTime)).format('H [h] mm [m]'))}
								</Col>
							</Row>
							<Row>
								<Col xs={4} className='stats-names-col d-flex justify-content-end'>Status</Col>
								<Col>{trackedHike && <Badge bg={trackedHike.status === 'completed' ? 'success' : 'info'}>{trackedHike.status}</Badge>}</Col>
							</Row>
							<Row>
								<Col xs={4} className='stats-names-col d-flex justify-content-end'>Progress</Col>
								<Col>{trackedHike && trackedHike.progress ? trackedHike.progress + ' reference points reached' : 'Not recorded'}</Col>
							</Row>
							{trackedHike && trackedHike.status !== 'ongoing' && <Row>
								<Col xs={4} className='stats-names-col d-flex justify-content-end'>Pace</Col>
								<Col>{trackedHike && (dayjs.duration(dayjs(trackedHike.endTime) - dayjs(trackedHike.startTime)).asMinutes() / props.hike.length * 1000).toFixed(2)} min/km</Col>
							</Row>}
							{trackedHike && trackedHike.status !== 'ongoing' && <Row>
								<Col xs={4} className='stats-names-col d-flex justify-content-end'>Ascent speed</Col>
								<Col>{trackedHike && (props.hike.ascent / dayjs.duration(dayjs(trackedHike.endTime) - dayjs(trackedHike.startTime)).asHours()).toFixed(2)} m/hour</Col>
							</Row>}

							<Row className='sub-title ref-points-reached'>
								<Col>Reference points reached</Col>
							</Row>
							<Row>
								<Col>
									<Table striped responsive>
										<thead>
											<tr>
												<th>#</th>
												<th>Reference point</th>
												<th>Time of reach</th>
											</tr>
										</thead>
										<tbody>
											{trackedHike?.pointsReached.sort((a, b) => (a.pointID > b.pointID) ? 1 : -1).map((pr, i) => {
												return (
													<tr key={pr.pointID} className='align-middle'>
														<td>{i + 1}</td>
														<td>{pr.label}</td>
														<td className={pr.timeOfReach ? undefined : 'faded-td'}>{pr.timeOfReach ? dayjs(pr.timeOfReach).format('MMM DD, YYYY h:mm:ss a') : 'Time of reach not marked'}</td>
													</tr>
												);
											})}
										</tbody>
									</Table>
								</Col>
							</Row>
						</Col>
						<Col>
							{/* props.hike ensures that the map is rendered only when the hike is loaded  */}
							{props.hike && props.hike !== {} && props.hike.points && props.dirtyHike === false && <HikeMap trackedHikeStatus={trackedHike?.status} length={props.hike.length} points={props.hike.points}
								alreadyLinkedHut={[]} startTime={trackedHike?.startTime} endTime={trackedHike?.endTime} />}
						</Col>
					</Row>
				</Container>
			</Modal.Body>

		</Modal>
	);
}

export { TrackedHikesInfoTable, TrackedHikesInfoModal };