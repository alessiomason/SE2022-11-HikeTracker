import HikesCards from '../HikeCards';
import MyTopHome from '../TopHome';
import MyFilterSection from '../FilterSection';
import MyModalLogin from '../ModalLogin';
import MyModalSignup from '../ModalSignup';
import '../../App.css';

function Home(props) {

  return (
    <>
    
      <MyTopHome setShowEmailAlert={props.setShowEmailAlert} showEmailAlert={props.showEmailAlert}/>
      <MyModalLogin setShowLogin={props.setShowLogin} showLogin={props.showLogin} user={props.user} loggedIn={props.loggedIn} doLogin={props.doLogin} message={props.message} setMessage={props.setMessage} />
      <MyModalSignup setShowEmailAlert={props.setShowEmailAlert} setShowSignup={props.setShowSignup} showSignup={props.showSignup} setMessage={props.setMessage} doSignUp={props.doSignUp} message={props.message} />
      <MyFilterSection />
      <HikesCards user={props.user} />
    </>
  );
}

export default Home;
