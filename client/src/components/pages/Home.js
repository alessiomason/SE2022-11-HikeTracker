import MyTopHome from '../TopHome';
import MyHikesSection from '../HikesSection';
import MyHutSection from '../HutSection';
import MyParkingSection from '../ParkingSection';
import MyModalLogin from '../ModalLogin';
import MyModalSignup from '../ModalSignup';
import ScrollToTop from '../ScrollToTop';
import '../../App.css';

function Home(props) {

  return (
    <>

      <ScrollToTop />
      <MyTopHome setShowEmailAlert={props.setShowEmailAlert} showEmailAlert={props.showEmailAlert} />
      <MyModalLogin setShowLogin={props.setShowLogin} showLogin={props.showLogin} showEmailAlert={props.showEmailAlert} setShowEmailAlert={props.setShowEmailAlert} user={props.user} loggedIn={props.loggedIn} doLogin={props.doLogin} message={props.message} setShowSignup={props.setShowSignup} setMessage={props.setMessage} />
      <MyModalSignup setShowLogin={props.setShowLogin} showEmailAlert={props.showEmailAlert} setShowEmailAlert={props.setShowEmailAlert} setShowSignup={props.setShowSignup} showSignup={props.showSignup} setMessage={props.setMessage} doSignUp={props.doSignUp} message={props.message} />
      <MyHikesSection user={props.user} />
      <MyHutSection />
      <MyParkingSection   />

    </>
  );
}

export default Home;
