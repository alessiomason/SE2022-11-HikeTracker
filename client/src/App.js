import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route, useNavigate, Outlet } from 'react-router-dom';
import MyGPXLayout from './GPXLayout';
import API from './API';
import { useState, useEffect } from 'react';
import LoginForm from './components/LoginForm';
import HikeForm from './components/Hikeform';
import Editform from './components/EditForm';
import MySignUpForm from './components/SignUpForm';
import VerifyEmailPage from './components/VerifyEmail';
import MyNavbar from './components/Navbar';
import Home from './components/pages/Home';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <App2 />
    </Router>
  );
}

function App2() {

  const navigate = useNavigate();

  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState({});
  const [message, setMessage] = useState('');
  const [hike, setHike] = useState('');
  const [dirty, setDirty] = useState(false);

  /* 
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await API.getUserInfo();
        setLoggedIn(true);
        setUser(user);
      } catch (err) {
        handleError(err);
      }
    };
    checkAuth();
  }, []);
  */

  const doSignUp = (credentials) => {
    API.signup(credentials)
      .then(() => {
        navigate('/verify-email');
      })
      .catch(err => {
        setMessage(err);
      })
  }

  const doLogin = (credentials) => {
    API.login(credentials)
      .then(user => {
        setLoggedIn(true);
        setUser(user);
        setMessage('');
        navigate('/');
      })
      .catch(err => {
        if (err.indexOf('not verified') != -1)
          navigate('/verify-email');

        setMessage(err);
      })
  }

  const doLogout = async () => {
    await API.logout();
    setLoggedIn(false);
    setUser({});
    setDirty(true);
    navigate('/');
  }

  function addGPXTrack(gpx) {

    API.addGPXTrack(gpx)
      .then(() => { })
      .catch(err => handleError(err));
  }

  function deleteHike(id) {

    API.deleteHike(id)
      .then(() => { setDirty(true); navigate("./") })
      .catch(err => handleError(err));
  }

  function addHike(hike) {

    API.addHike(hike)
      .then(() => { })
      .catch(err => handleError(err));
  }

  function updateHike(hike) {

    API.updateHike(hike)
      .then(() => { })
      .catch(err => handleError(err));
  }

  function handleError(err) {
    console.log(err);
  }

  useEffect(() => {
    API.getHikes()
      .then((h) => { setHike(h); setDirty(false) })
      .catch(err => handleError(err));

  }, [dirty]);

  function Layout() {
    return (
      <>
        <MyNavbar loggedIn={loggedIn} doLogout={doLogout} />
        <Outlet />
        <Footer />
      </>
    );
  }

  return (

    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home user={user} />} />
        <Route path='login' element={<LoginForm loggedIn={loggedIn} user={user} doLogin={doLogin} message={message} setMessage={setMessage} />}> </Route>
        <Route path='signup' element={<MySignUpForm doSignUp={doSignUp} setMessage={setMessage} />} />
        <Route path='verify-email' element={<VerifyEmailPage />} />
        <Route path="gpx/" element={<MyGPXLayout addGPXTrack={addGPXTrack} />} ></Route>
        <Route path="newHike/" element={<HikeForm hike={hike}  addHike={addHike} addGPXTrack={addGPXTrack} setDirty={setDirty}/>} ></Route>
        <Route path="updateHike/:hikeId/" element={<Editform hike={hike}
          updateHike={updateHike} deleteHike={deleteHike} setDirty={setDirty} />} ></Route>
      </Route>
    </Routes>

  );
}

export default App;
