import HikesCards from '../HikeCards';
import MyTopHome from '../TopHome';
import MyFilterSection from '../FilterSection';
import MyModalLogin from '../ModalLogin';
import '../../App.css';

function Home(props) {
  return (
    <>
      <MyTopHome />
      <MyModalLogin setShowLogin={props.setShowLogin} showLogin={props.showLogin} user={props.user} loggedIn={props.loggedIn} doLogin={props.doLogin} message={props.message} setMessage={props.setMessage} />
      <MyFilterSection />
      <HikesCards user={props.user} />
    </>
  );
}

export default Home;
