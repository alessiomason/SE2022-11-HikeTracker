import HikesCards from '../HikeCards';
import MyTopHome from '../TopHome';
import MyFilterSection from '../FilterSection';
import '../../App.css';

function Home(props) {
    return (
        <>
            <MyTopHome />
            <MyFilterSection />
            <HikesCards user={props.user} />
        </>
    );
}

export default Home;
