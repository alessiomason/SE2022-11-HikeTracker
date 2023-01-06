import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate, Outlet } from 'react-router-dom';
import API from './API';
import HikeForm from './components/HikeForm';
import ParkingForm from './components/ParkingForm';
import HutForm from './components/HutForm';
import EditForm from './components/EditForm';
import VerifyEmailPage from './components/VerifyEmail';
import MyNavbar from './components/Navbar';
import MyHikeManager from './components/pages/HikeManager';
import MyHutManager from './components/pages/HutManager';
import MyParkingManager from './components/pages/ParkingManager';
import HikePage from './components/pages/Hike';
import LinkHike from './components/LinkHike';
import ReferencePoints from './components/ManageRefPoints';
import Home from './components/pages/Home';
import Loading from './components/Loading';
import Footer from './components/Footer';
import HutPage from './components/pages/Hut';
import Profile from './components/pages/Profile';
import OpenPageOnTop from './components/OpenPageOnTop';


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
    const [initialLoading, setInitialLoading] = useState(false);
    const [showEmailAlert, setShowEmailAlert] = useState(false);
    const [hut, setHut] = useState('');

    useEffect(() => {
        const checkAuth = async () => {
            try {
                let user = await API.getUserInfo();
                user.access_right = await API.getUserAccessRight();
                setLoggedIn(true);
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
                if (err.indexOf('not verified') !== -1)
                    setShowEmailAlert(true);
                else
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

    const addGPXTrack = async (gpx) => {
        try {
            const new_hike = await API.addGPXTrack(gpx);
            setDirty(true);
            setInitialLoading(false);
            navigate('/updateHike/' + new_hike[0].id);
        } catch (err) {
            handleError(err);
        }
    }

    function deleteParkingLot(id) {
        API.deleteParkingLot(id)
            .then(() => { setDirty(true); })
            .catch(err => handleError(err));
    }

    function addParkingLot(pl) {
        API.addParkingLot(pl)
            .then(() => { })
            .catch(err => handleError(err));
    }

    function updateParkingLot(pl) {
        API.updateParkingLot(pl)
            .then(() => { })
            .catch(err => handleError(err));
    }

    function deleteHike(id) {
        API.deleteHike(id)
            .then(() => { setDirty(true); })
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

    function deleteHut(id) {
        API.deletHut(id)
            .then(() => { setDirty(true); })
            .catch(err => handleError(err));
    }

    function addHut(hut) {
        API.addHut(hut)
            .then(() => { })
            .catch(err => handleError(err));
    }

    function updateHut(hut) {
        API.updateHut(hut)
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


  useEffect(() => {
    if (user.access_right==='hut-worker') {
      API.getHut(user.hut)
        .then((h) => setHut(h))
        .catch(err => console.log(err))
      //setDirty(false);
    }
  }, [user]);


    function Layout() {
        return (
            <>
                <MyNavbar setShowLogin={setShowLogin} setShowSignup={setShowSignup} loggedIn={loggedIn} doLogout={doLogout} user={user} />
                <Outlet />
                <Footer />
            </>
        );
    }

    return (
        <OpenPageOnTop>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={initialLoading ? <Loading /> : <Home showEmailAlert={showEmailAlert} setShowEmailAlert={setShowEmailAlert} user={user}
                        setShowLogin={setShowLogin} showLogin={showLogin} loggedIn={loggedIn} doLogin={doLogin} message={message} setMessage={setMessage}
                        showSignup={showSignup} setShowSignup={setShowSignup} doSignUp={doSignUp} />} />

                    <Route path="hike/:hikeId" element={<HikePage user={user} loggedIn={loggedIn} setShowLogin={setShowLogin} />} />
                    <Route path="hikeManager" element={<MyHikeManager updateHike={updateHike} deleteHike={deleteHike} user={user} />} />
                    <Route path="hutManager" element={<MyHutManager updateHut={updateHut} deleteHut={deleteHut} user={user} />} />
                    <Route path="parkingManager" element={<MyParkingManager
                        updateParkingLot={updateParkingLot} deleteParkingLot={deleteParkingLot} user={user} />} />
                    <Route path='verify-email' element={<VerifyEmailPage setShowLogin={setShowLogin} />} />
                    <Route path="newHike/" element={loggedIn && user.access_right === 'local-guide' ? <HikeForm hike={hike} addHike={addHike}
                        addGPXTrack={addGPXTrack} setDirty={setDirty} setInitialLoading={setInitialLoading} /> : <Navigate to='/' />} ></Route>
                    <Route path="newHut/" element={loggedIn && user.access_right === 'local-guide' ?
                        <HutForm addHut={addHut} setDirty={setDirty} /> : <Navigate to='/' />} ></Route>
                    <Route path="newParking/" element={loggedIn && user.access_right === 'local-guide' ?
                        <ParkingForm addParkingLot={addParkingLot} setDirty={setDirty} /> : <Navigate to='/' />} ></Route>
                    <Route path="updateHike/:hikeId/" element={loggedIn && user.access_right === 'local-guide' ? <EditForm hike={hike} updateHike={updateHike}
                        deleteHike={deleteHike} setDirty={setDirty} /> : <Navigate to='/' />} ></Route>
                    <Route path="linkHike/:hikeId/" element={loggedIn && user.access_right === 'local-guide' ? <LinkHike /> : <Navigate to='/' />} ></Route>
                    <Route path="refPoints/:hikeId/" element={loggedIn && user.access_right === 'local-guide' ? <ReferencePoints /> : <Navigate to='/' />} ></Route>
                    <Route path="hut/:hutId" element={<HutPage loggedIn={loggedIn} setShowLogin={setShowLogin} />} />
                    <Route path="profile" element={loggedIn ? <Profile user={user}  setDirty={setDirty} updateHut={updateHut}  doLogout={doLogout} hikes={hike} hut={hut}/> : <Navigate to='/' />} />
                </Route>
            </Routes>
        </OpenPageOnTop>
    );
}

export default App;