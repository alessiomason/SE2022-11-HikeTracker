import { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Modal, Table, Badge } from 'react-bootstrap';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
const dayjs = require('dayjs');
const duration = require('dayjs/plugin/duration');
dayjs.extend(duration);

function TrackedHikesInfoTable(props) {
	const ongoingHike = props.trackedHikes.filter(th => th.endTime === null || th.endTime === undefined).pop();
	const [ongoingHikeElapsedTime, setOngoingHikeElapsedTime] = useState(ongoingHike ? dayjs.duration(dayjs() - dayjs(ongoingHike.startTime)) : undefined);
	const completedHikes = props.trackedHikes.filter(th => th.endTime !== null && th.endTime !== undefined);

	let setIntervalsToUpdateElapsedTime = [];

	useEffect(() => {
		if (ongoingHike) {
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

	return (
		<>
			{ongoingHike && <Row className='tracked-hikes-row'>
				<h3 className='sub-title'>Ongoing hike</h3>
				<p>Start time: {dayjs(ongoingHike.startTime).format('MMM DD, YYYY h:mm a')}</p>
				<p>Elapsed time: {ongoingHikeElapsedTime?.format('H [h] mm [m] ss [s]')}</p>
			</Row>}
			{completedHikes.length > 0 &&
				<Row className='tracked-hikes-row'>
					<h3 className='sub-title'>Completed hikes</h3>
					<Table striped>
						<thead>
							<tr>
								<th>#</th>
								<th>Date</th>
								<th>Time</th>
								<th>Status</th>
								<th>Progress</th>
							</tr>
						</thead>
						<tbody>
							{completedHikes.map((ch, i) => {
								return (
									<tr key={ch.id} className='align-middle'>
										<td>{i + 1}</td>
										<td>{dayjs(ch.startTime).format('MMM DD, YYYY')}</td>
										<td>{dayjs.duration(dayjs(ch.endTime) - dayjs(ch.startTime)).format('H [h] mm [m]')}</td>
										<td><Badge bg={ch.status === 'completed' ? 'success' : 'info'}>{ch.status}</Badge></td>
										<td>{ch.progress ? ch.progress + ' reference points reached' : 'Not recorded'}</td>
										<td><Button className='see-more-btn' onClick={() => props.setTrackedHikesInfoModalShow(ch.id)}>See more</Button></td>
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

	return (
		<Modal show={props.show} onShow={() => setTrackedHikeID(props.show)} onHide={props.onHide} size="xl" aria-labelledby="contained-modal-title-vcenter" centered>
			<Modal.Header closeButton className='box-modal hike-page-modal-header'>
				<Modal.Title id="contained-modal-title-vcenter">Tracked hike {trackedHikeID}</Modal.Title>
			</Modal.Header>
			<Modal.Body className='box-modal hike-page-modal-body'>
				<Container>
					<Row>
						<Col lg={5}>
							<Row>
								<Col xs={4} className='stats-names-col d-flex justify-content-end'>Start time</Col>
								<Col>{trackedHike && dayjs(trackedHike.startTime).format('MMM DD, YYYY h:mm:ss a')}</Col>
							</Row>
							<Row>
								<Col xs={4} className='stats-names-col d-flex justify-content-end'>End time</Col>
								<Col>{trackedHike && dayjs(trackedHike.endTime).format('MMM DD, YYYY h:mm:ss a')}</Col>
							</Row>
							<Row>
								<Col xs={4} className='stats-names-col d-flex justify-content-end'>Time</Col>
								<Col>{trackedHike && dayjs.duration(dayjs(trackedHike.endTime) - dayjs(trackedHike.startTime)).format('H [h] mm [m]')}</Col>
							</Row>
							<Row>
								<Col xs={4} className='stats-names-col d-flex justify-content-end'>Status</Col>
								<Col>{trackedHike && <Badge bg={trackedHike.status === 'completed' ? 'success' : 'info'}>{trackedHike.status}</Badge>}</Col>
							</Row>
							<Row>
								<Col xs={4} className='stats-names-col d-flex justify-content-end'>Progress</Col>
								<Col>{trackedHike && trackedHike.progress ? trackedHike.progress + ' reference points reached' : 'Not recorded'}</Col>
							</Row>
							<Row>
								<Col xs={4} className='stats-names-col d-flex justify-content-end'>Pace</Col>
								<Col>{trackedHike && (dayjs.duration(dayjs(trackedHike.endTime) - dayjs(trackedHike.startTime)).asMinutes() / props.hike.length * 1000).toFixed(2)} min/km</Col>
							</Row>
							<Row>
								<Col xs={4} className='stats-names-col d-flex justify-content-end'>Ascent speed</Col>
								<Col>{trackedHike && (props.hike.ascent / dayjs.duration(dayjs(trackedHike.endTime) - dayjs(trackedHike.startTime)).asHours()).toFixed(2)} m/hour</Col>
							</Row>

							<Row className='sub-title ref-points-reached'>
								<Col>Reference points reached</Col>
							</Row>
							<Row>
								<Col>
									<Table striped>
										<thead>
											<tr>
												<th>#</th>
												<th>Reference point</th>
												<th>Time of reach</th>
											</tr>
										</thead>
										<tbody>
											
										</tbody>
									</Table>
								</Col>
							</Row>
						</Col>
						<Col>
							<TrackedHikeMap />
						</Col>
					</Row>
				</Container>
			</Modal.Body>

		</Modal>
	);
}

function TrackedHikeMap(props) {

	return (
		<MapContainer className='single-hut-map' center={props.coordinates} zoom={10}>
			<TileLayer
				attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
			/>


		</MapContainer>
	);
}

export { TrackedHikesInfoTable, TrackedHikesInfoModal };