import '../styles/TopHome.css';
import MyCarousel from './Carousel';
import { Alert, Container } from "react-bootstrap";

function MyTopHome(props) {

    return (

        <Container fluid className='top-container'>
            <MyCarousel className="carousel" />
            {(props.showEmailAlert) ?
                <Alert className="mx-5" variant="success" onClose={() => props.setShowEmailAlert(false)} dismissible>
                    <Alert.Heading>Verify email</Alert.Heading>
                    <p> Please click on the link in the email you received to verify your account. </p>
                </Alert> : false
            }
            <h1>HIKE TRACKER</h1>
            <p>Start a new adventure</p>
            
            {/*
                <Row className='input-group mt-4 mx-auto search-container '>
                    <InputGroup className="mb-3">
                        <Form.Control placeholder="Insert locations, titles, etc" />
                        <Button variant="success">Search</Button>
                    </InputGroup>
                </Row>
            */}
            
        </Container>

    );
}

export default MyTopHome;
