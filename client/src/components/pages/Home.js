import HikesCards from '../HikeCards';
import MyTopHome from '../TopHome';
import MyHutSection from '../HutSection';
import MyParkingSection from '../ParkingSection';
import MyFilterSection from '../FilterSection';
import MyModalLogin from '../ModalLogin';
import MyModalSignup from '../ModalSignup';
import ScrollToTop from '../ScrollToTop';
import '../../App.css';
import React, { useState, useEffect } from 'react';
import API from '../../API.js';

function Home(props, ref) {

    // filters
    const difficultiesList = [
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

  const [minLength, setMinLength] = useState('');
  const [maxLength, setMaxLength] = useState('');
  const [minTime, setMinTime] = useState('');
  const [maxTime, setMaxTime] = useState('');
  const [minAscent, setMinAscent] = useState('');
  const [maxAscent, setMaxAscent] = useState('');
  const [difficulties, setDifficulties] = useState(difficultiesList);
  const [state, setState] = useState('');
  const [region, setRegion] = useState('');
  const [province, setProvince] = useState('');
  const [municipality, setMunicipality] = useState('');

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
      <MyFilterSection hikes={hikes} minLength={minLength} setMinLength={setMinLength} maxLength={maxLength} setMaxLength={setMaxLength} minTime={minTime} setMinTime={setMinTime} maxTime={maxTime} setMaxTime={setMaxTime}
        minAscent={minAscent} setMinAscent={setMinAscent} maxAscent={maxAscent} setMaxAscent={setMaxAscent} difficulties={difficulties} setDifficulties={setDifficulties} difficultiesList={difficultiesList}
        state={state} setState={setState} region={region} setRegion={setRegion} province={province} setProvince={setProvince} municipality={municipality} setMunicipality={setMunicipality} />
      <HikesCards user={props.user} minLength={minLength} maxLength={maxLength} minTime={minTime} maxTime={maxTime} minAscent={minAscent} maxAscent={maxAscent} difficulties={difficulties}
        state={state} region={region} province={province} municipality={municipality}
        hikes={hikes} />
      <MyHutSection />
      <MyParkingSection   />

    </>
  );
}

export default Home;
