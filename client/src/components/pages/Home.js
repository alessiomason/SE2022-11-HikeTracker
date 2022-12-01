import MyTopHome from '../TopHome';
import MyHikesSection from '../HikesSection';
import MyHutSection from '../HutSection';
import MyParkingSection from '../ParkingSection';
import MyModalLogin from '../ModalLogin';
import MyModalSignup from '../ModalSignup';
import ScrollToTop from '../ScrollToTop';
import '../../App.css';
import React, { useState, useEffect } from 'react';
import API from '../../API.js';

function Home(props) {

    // filters
    const hikesDifficultiesList = [
      {
        difficulty: 'Tourist',
        level: 1,
        isChecked: true
      },
      {
        difficulty: 'Hiker',
        level: 2,
        isChecked: true
      },
      {
        difficulty: 'Professional hiker',
        level: 3,
        isChecked: true
      }
    ];

  const [hikesMinLength, setHikesMinLength] = useState('');
  const [hikesMaxLength, setHikesMaxLength] = useState('');
  const [hikesMinTime, setHikesMinTime] = useState('');
  const [hikesMaxTime, setHikesMaxTime] = useState('');
  const [hikesMinAscent, setHikesMinAscent] = useState('');
  const [hikesMaxAscent, setHikesMaxAscent] = useState('');
  const [hikesDifficulties, setHikesDifficulties] = useState(hikesDifficultiesList);
  const [hikesState, setHikesState] = useState('');
  const [hikesRegion, setHikesRegion] = useState('');
  const [hikesProvince, setHikesProvince] = useState('');
  const [hikesMunicipality, setHikesMunicipality] = useState('');

  const [hikes, setHikes] = useState([]);
  const [dirty, setDirty] = useState(true);

  useEffect(() => {
    if (dirty) {
      API.getHikes()
        .then((hikes) => setHikes(hikes))
        .catch(err => console.log(err))
      setDirty(false);
    }
  }, [dirty]);

  return (
    <>

      <ScrollToTop />
      <MyTopHome setShowEmailAlert={props.setShowEmailAlert} showEmailAlert={props.showEmailAlert} />
      <MyModalLogin setShowLogin={props.setShowLogin} showLogin={props.showLogin} user={props.user} loggedIn={props.loggedIn} doLogin={props.doLogin} message={props.message} setMessage={props.setMessage} />
      <MyModalSignup setShowEmailAlert={props.setShowEmailAlert} setShowSignup={props.setShowSignup} showSignup={props.showSignup} setMessage={props.setMessage} doSignUp={props.doSignUp} message={props.message} />
      <MyHikesSection user={props.user} hikes={hikes} hikesMinLength={hikesMinLength} setHikesMinLength={setHikesMinLength} hikesMaxLength={hikesMaxLength} setHikesMaxLength={setHikesMaxLength} hikesMinTime={hikesMinTime} setHikesMinTime={setHikesMinTime} hikesMaxTime={hikesMaxTime} setHikesMaxTime={setHikesMaxTime}
        hikesMinAscent={hikesMinAscent} setHikesMinAscent={setHikesMinAscent} hikesMaxAscent={hikesMaxAscent} setHikesMaxAscent={setHikesMaxAscent} hikesDifficulties={hikesDifficulties} setHikesDifficulties={setHikesDifficulties} hikesDifficultiesList={hikesDifficultiesList}
        hikesState={hikesState} setHikesState={setHikesState} hikesRegion={hikesRegion} setHikesRegion={setHikesRegion} hikesProvince={hikesProvince} setHikesProvince={setHikesProvince} hikesMunicipality={hikesMunicipality} setHikesMunicipality={setHikesMunicipality} />
      <MyHutSection />
      <MyParkingSection   />

    </>
  );
}

export default Home;
