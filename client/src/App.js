import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate, Outlet } from 'react-router-dom';
import API from './API';
import LoginForm from './components/ModalLogin';
import MySignUpForm from './components/ModalSignup';
import HikeForm from './components/HikeForm';
import EditForm from './components/EditForm(to delete)';
import VerifyEmailPage from './components/VerifyEmail(to delete)';
import MyNavbar from './components/Navbar';
import MyHikeManager from './components/pages/HikeManager';
import MyHutManager from './components/pages/HutManager';
import MyParkingManager from './components/pages/ParkingManager';
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
    const [showLogin, setShowLogin] = useState(false);
    const [showSignup, setShowSignup] = useState(false);
    const [showEmailAlert, setShowEmailAlert] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                let user = await API.getUserInfo();
                user.access_right = await API.getUserAccessRight();
                setLoggedIn(true);
                setShowLogin(false);
                setShowSignup(false);
                setUser(user);
            } catch (err) {
                handleError(err);
            }
        };
        checkAuth();
    }, []);

    const doSignUp = (credentials) => {
        API.signup(credentials)
            .then(() => {
                {/*navigate('/verify-email');*/}
                setShowSignup(false);
                setShowEmailAlert(true);
            })
            .catch(err => setMessage(err))
    }

    const doLogin = (credentials) => {
        API.login(credentials)
            .then(user => {
                setLoggedIn(true);
                setShowLogin(false);
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

    useEffect(() => {
        if (showEmailAlert) {
          const timeId = setTimeout(() => {
            setShowEmailAlert(() => false);
          }, 5000)
          return () => {
            clearTimeout(timeId)
          }
        }
      }, [showEmailAlert]);

    function addGPXTrack(gpx) {
        API.addGPXTrack(gpx)
            .then(() => { })
            .catch(err => handleError(err));
    }

    function deleteHike(id) {
        API.deleteHike(id)
            .then(() => { setDirty(true); navigate("/") })
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
            .then((h) => { setHike(h); setDirty(false); })
            .catch(err => handleError(err));
    }, [dirty]);

    function Layout() {
        return (
            <>
                <MyNavbar setShowLogin={setShowLogin} setShowSignup={setShowSignup} loggedIn={loggedIn} doLogout={doLogout} />
                <Outlet />
                <Footer />
            </>
        );
    }

    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<Home showEmailAlert={showEmailAlert} setShowEmailAlert={setShowEmailAlert} user={user} setShowLogin={setShowLogin} showLogin={showLogin} loggedIn={loggedIn} doLogin={doLogin} message={message} setMessage={setMessage} showSignup={showSignup} setShowSignup={setShowSignup} doSignUp={doSignUp}/>} />
                <Route path="hikeManager" element={<MyHikeManager/>}/>
                <Route path="hutManager" element={<MyHutManager/>}/>
                <Route path="parkingManager" element={<MyParkingManager/>}/>
                <Route path='verify-email' element={<VerifyEmailPage />} />
                <Route path="newHike/" element={loggedIn && user.access_right === 'local-guide' ? <HikeForm hike={hike} addHike={addHike} addGPXTrack={addGPXTrack} setDirty={setDirty} /> : <Navigate to='/' />} ></Route>
                <Route path="updateHike/:hikeId/" element={loggedIn && user.access_right === 'local-guide' ? <EditForm hike={hike} updateHike={updateHike} deleteHike={deleteHike} setDirty={setDirty} /> : <Navigate to='/' />} ></Route>
            </Route>
        </Routes>
    );
}

export default App;