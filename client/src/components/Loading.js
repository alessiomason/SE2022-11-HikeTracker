import { Container } from "react-bootstrap";
import ReactLoading from "react-loading";

function Loading(props) {

    return (

        <Container fluid className='top-container'>
            <h1>Loading</h1>
            <ReactLoading type="bars" color="#FFFFFF"
                height={100} width={50} />
        </Container>

    );
}

export default Loading;
