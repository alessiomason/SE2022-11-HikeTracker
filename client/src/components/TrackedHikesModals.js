import { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Modal, Card } from 'react-bootstrap';
import DateTimePicker from 'react-datetime-picker';
import { default as Img1 } from '../images/image3.jpg';
const dayjs = require('dayjs');

function MyImageModal(props) {
	return (
		<Modal show={props.show} onHide={props.onHide} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
			<Modal.Header closeButton className='box-modal hike-page-modal-header'>
				<Modal.Title id="contained-modal-title-vcenter">
					{props.hikeLabel}
				</Modal.Title>
			</Modal.Header>
			<Modal.Body className='box-modal hike-page-modal-body'>
				<Row>
					<Col md={12} className="modal-img-box">
						<img src={`http://localhost:3001/images/hike-${props.hikeId}.jpg`}
							onError={({ currentTarget }) => {
								currentTarget.onerror = null; // prevents looping
								currentTarget.src = Img1;
							}} alt="photo" className="modal-imgs" />
					</Col>
				</Row>

			</Modal.Body>

		</Modal>
	);
}

function StartTerminateHikeModal(props) {
	const [startTerminateLabel, setStartTerminateLabel] = useState(props.show); // copied into a state only on modal show, this avoids erratic behaviour on modal hide
	const [currentTime, setCurrentTime] = useState(dayjs());
	const [adjustedTime, setAdjustedTime] = useState(new Date());
	const [currentTimeClassName, setCurrentTimeClassName] = useState('selected-card');
	const [adjustedTimeClassName, setAdjustedTimeClassName] = useState('deselected-card');
	const [selectedTime, setSelectedTime] = useState('current');

	const handleSelection = (selected) => {
		if (selected === 'current') {
			setCurrentTimeClassName('selected-card');
			setAdjustedTimeClassName('deselected-card');
			setSelectedTime('current');
		} else if (selected === 'adjusted') {
			setCurrentTimeClassName('deselected-card');
			setAdjustedTimeClassName('selected-card');
			setSelectedTime('adjusted');
		}
	}

	const handleStartTerminateHike = () => {
		if (props.show === 'start') {
			if (selectedTime === 'adjusted')
				props.startHike(dayjs(adjustedTime).format());
			else
				props.startHike();
		} else if (props.show === 'terminate') {
			if (selectedTime === 'adjusted')
				props.terminateHike(dayjs(adjustedTime).format());
			else
				props.terminateHike();
		}
	}

	let setIntervalsToUpdateCurrentTime = [];

	useEffect(() => {
		if (props.show) {
			setCurrentTime(dayjs());

			const setIntervalToUpdateCurrentTime = setInterval(() => {		// update the elapsed time every second
				setCurrentTime(dayjs());
			}, 1000);

			setIntervalsToUpdateCurrentTime.push(setIntervalToUpdateCurrentTime);
		}

		return () => {		// stop setInterval on page leave
			setIntervalsToUpdateCurrentTime.forEach(s => clearInterval(s));
		};
	}, [props.show])

	return (
		<Modal show={props.show} onShow={() => setStartTerminateLabel(props.show)} onHide={props.onHide} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
			<Modal.Header closeButton className='box-modal hike-page-modal-header'>
				<Modal.Title id="contained-modal-title-vcenter">{startTerminateLabel === 'start' ? 'Start' : 'Terminate'} hike</Modal.Title>
			</Modal.Header>
			<Modal.Body className='box-modal hike-page-modal-body'>
				<Container>
					{startTerminateLabel === 'terminate' && <Row className='modal-info-row'>
						<h6>Mark the end point as reached and terminate the hike.</h6>
						<p>Please mark any reference point of which you wish to record the time of reach before proceeding:
							the remaining ones will be marked as reached upon termination.
						</p>
					</Row>}
					<Row>
						<Col md={6} className='d-flex justify-content-center'>
							<Card className={'tracked-hikes-card ' + currentTimeClassName} onClick={() => handleSelection('current')}>
								<Card.Body className='tracked-hikes-card-body'>
									<Card.Title className='tracked-hikes-card-title text-center'>
										{startTerminateLabel === 'start' ? 'Start' : 'Terminate'} with current time
									</Card.Title>
									<Card.Text className='text-center'>
										{currentTime.format('MMM DD, YYYY h:mm:ss a')}
									</Card.Text>
								</Card.Body>
							</Card>
						</Col>
						<Col md={6} className='d-flex justify-content-center'>
							<Card className={'tracked-hikes-card ' + adjustedTimeClassName} onClick={() => handleSelection('adjusted')}>
								<Card.Body className='tracked-hikes-card-body'>
									<Card.Title className='tracked-hikes-card-title text-center'>
										Adjust {startTerminateLabel === 'start' ? 'start' : 'termination'} time
									</Card.Title>
									<div className='d-flex justify-content-center'>
										<DateTimePicker format='MM/dd/y h:mm:ss a' value={adjustedTime} onChange={setAdjustedTime} disabled={selectedTime !== 'adjusted'} />
									</div>
								</Card.Body>
							</Card>
						</Col>
					</Row>
					<Row className='btn-row'>
						<Button className={"mx-1 mt-2 slide " + (startTerminateLabel === 'start' ? 'start_btn' : 'terminate_btn')} type="submit" onClick={handleStartTerminateHike}>{startTerminateLabel === 'start' ? 'Start' : 'Terminate'} hike</Button>
					</Row>
				</Container>
			</Modal.Body>

		</Modal>
	);
}

function StopHikeModal(props) {
	const [currentTime, setCurrentTime] = useState(dayjs());
	const [adjustedTime, setAdjustedTime] = useState(new Date());
	const [currentTimeClassName, setCurrentTimeClassName] = useState('selected-card');
	const [adjustedTimeClassName, setAdjustedTimeClassName] = useState('deselected-card');
	const [selectedTime, setSelectedTime] = useState('current');

	const handleSelection = (selected) => {
		if (selected === 'current') {
			setCurrentTimeClassName('selected-card');
			setAdjustedTimeClassName('deselected-card');
			setSelectedTime('current');
		} else if (selected === 'adjusted') {
			setCurrentTimeClassName('deselected-card');
			setAdjustedTimeClassName('selected-card');
			setSelectedTime('adjusted');
		}
	}

	const handleStopHike = () => {
		if (selectedTime === 'adjusted')
			props.stopHike(dayjs(adjustedTime).format());
		else
			props.stopHike();
	}

	let setIntervalsToUpdateCurrentTime = [];

	useEffect(() => {
		if (props.show) {
			setCurrentTime(dayjs());

			const setIntervalToUpdateCurrentTime = setInterval(() => {		// update the elapsed time every second
				setCurrentTime(dayjs());
			}, 1000);

			setIntervalsToUpdateCurrentTime.push(setIntervalToUpdateCurrentTime);
		}

		return () => {		// stop setInterval on page leave
			setIntervalsToUpdateCurrentTime.forEach(s => clearInterval(s));
		};
	}, [props.show])

	return (
		<Modal show={props.show} onHide={props.onHide} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
			<Modal.Header closeButton className='box-modal hike-page-modal-header'>
				<Modal.Title id="contained-modal-title-vcenter">Stop ongoing hike</Modal.Title>
			</Modal.Header>
			<Modal.Body className='box-modal hike-page-modal-body'>
				<Container>
					<Row className='modal-info-row'>
						<h6>If you wish not to terminate the ongoing hike, but still want to save your progress, stop the hike.</h6>
						<p>All the previously reached reference points will be saved.</p>
					</Row>
					<Row>
						<Col md={6} className='d-flex justify-content-center'>
							<Card className={'tracked-hikes-card ' + currentTimeClassName} onClick={() => handleSelection('current')}>
								<Card.Body className='tracked-hikes-card-body'>
									<Card.Title className='tracked-hikes-card-title text-center'>
										Stop with current time
									</Card.Title>
									<Card.Text className='text-center'>
										{currentTime.format('MMM DD, YYYY h:mm:ss a')}
									</Card.Text>
								</Card.Body>
							</Card>
						</Col>
						<Col md={6} className='d-flex justify-content-center'>
							<Card className={'tracked-hikes-card ' + adjustedTimeClassName} onClick={() => handleSelection('adjusted')}>
								<Card.Body className='tracked-hikes-card-body'>
									<Card.Title className='tracked-hikes-card-title text-center'>
										Adjust stopping time
									</Card.Title>
									<div className='d-flex justify-content-center'>
										<DateTimePicker format='MM/dd/y h:mm:ss a' value={adjustedTime} onChange={setAdjustedTime} disabled={selectedTime !== 'adjusted'} />
									</div>
								</Card.Body>
							</Card>
						</Col>
					</Row>
					<Row className='btn-row'>
						<Button className={"mx-1 mt-2 slide stop_btn"} type="submit" onClick={handleStopHike}>Stop hike</Button>
					</Row>
				</Container>
			</Modal.Body>

		</Modal>
	);
}

function ReferencePointReachedModal(props) {
	const pointID = props.show;
	const [currentTime, setCurrentTime] = useState(dayjs());
	const [adjustedTime, setAdjustedTime] = useState(new Date());
	const [currentTimeClassName, setCurrentTimeClassName] = useState('selected-card');
	const [adjustedTimeClassName, setAdjustedTimeClassName] = useState('deselected-card');
	const [selectedTime, setSelectedTime] = useState('current');

	const handleSelection = (selected) => {
		if (selected === 'current') {
			setCurrentTimeClassName('selected-card');
			setAdjustedTimeClassName('deselected-card');
			setSelectedTime('current');
		} else if (selected === 'adjusted') {
			setCurrentTimeClassName('deselected-card');
			setAdjustedTimeClassName('selected-card');
			setSelectedTime('adjusted');
		}
	}

	const handleRefPointReached = () => {
		if (selectedTime === 'adjusted')
			props.recordReferencePointReached(pointID, dayjs(adjustedTime).format());
		else
			props.recordReferencePointReached(pointID);
	}

	let setIntervalsToUpdateCurrentTime = [];

	useEffect(() => {
		if (props.show) {
			setCurrentTime(dayjs());

			const setIntervalToUpdateCurrentTime = setInterval(() => {		// update the elapsed time every second
				setCurrentTime(dayjs());
			}, 1000);

			setIntervalsToUpdateCurrentTime.push(setIntervalToUpdateCurrentTime);
		}

		return () => {		// stop setInterval on page leave
			setIntervalsToUpdateCurrentTime.forEach(s => clearInterval(s));
		};
	}, [props.show])

	return (
		<Modal show={props.show} onHide={props.onHide} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
			<Modal.Header closeButton className='box-modal hike-page-modal-header'>
				<Modal.Title id="contained-modal-title-vcenter">Mark reference point as reached</Modal.Title>
			</Modal.Header>
			<Modal.Body className='box-modal hike-page-modal-body'>
				<Container>
					<Row>
						<Col md={6} className='d-flex justify-content-center'>
							<Card className={'tracked-hikes-card ' + currentTimeClassName} onClick={() => handleSelection('current')}>
								<Card.Body className='tracked-hikes-card-body'>
									<Card.Title className='tracked-hikes-card-title text-center'>
										Mark with current time
									</Card.Title>
									<Card.Text className='text-center'>
										{currentTime.format('MMM DD, YYYY h:mm:ss a')}
									</Card.Text>
								</Card.Body>
							</Card>
						</Col>
						<Col md={6} className='d-flex justify-content-center'>
							<Card className={'tracked-hikes-card ' + adjustedTimeClassName} onClick={() => handleSelection('adjusted')}>
								<Card.Body className='tracked-hikes-card-body'>
									<Card.Title className='tracked-hikes-card-title text-center'>
										Adjust time of reach
									</Card.Title>
									<div className='d-flex justify-content-center'>
										<DateTimePicker format='MM/dd/y h:mm:ss a' value={adjustedTime} onChange={setAdjustedTime} disabled={selectedTime !== 'adjusted'} />
									</div>
								</Card.Body>
							</Card>
						</Col>
					</Row>
					<Row className='btn-row'>
						<Button className={"mx-1 mt-2 slide reach_ref_point_btn"} type="submit" onClick={handleRefPointReached}>Mark as reached</Button>
					</Row>
				</Container>
			</Modal.Body>

		</Modal>
	);
}

export { MyImageModal, StartTerminateHikeModal, StopHikeModal, ReferencePointReachedModal };