import HikesCards from '../HikeCards';
import MyTopHome from '../TopHome';
import MyFilterSection from '../FilterSection';
import MyModalLogin from '../ModalLogin';
import MyModalSignup from '../ModalSignup';
import '../../App.css';
import React, { useState,useEffect } from 'react';
import API from '../../API.js';

function Home(props) {

  const [minLength,setMinLength] = useState(0);
  const [maxLength,setMaxLength] = useState(100000);
  const [minTime,setMinTime] = useState(0);
  const [maxTime,setMaxTime] = useState(24);
  const [minAscent,setMinAscent] = useState(0);
  const [maxAscent,setMaxAscent] = useState(10000);
  const [difficulty,setDifficulty] = useState(null);
  const [municipality,setMunicipality] = useState(null);
  const [province,setProvince] = useState(null);
  const [startPoint,setStartPoint] = useState (null);
  const [endPoint,setEndPoint] = useState (null);
  const [refPoint,setRefPoint] = useState (null);

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
    
      <MyTopHome setShowEmailAlert={props.setShowEmailAlert} showEmailAlert={props.showEmailAlert}/>
      <MyModalLogin setShowLogin={props.setShowLogin} showLogin={props.showLogin} user={props.user} loggedIn={props.loggedIn} doLogin={props.doLogin} message={props.message} setMessage={props.setMessage} />
      <MyModalSignup setShowEmailAlert={props.setShowEmailAlert} setShowSignup={props.setShowSignup} showSignup={props.showSignup} setMessage={props.setMessage} doSignUp={props.doSignUp} message={props.message} />
      <MyFilterSection  hikes={hikes} minLength={minLength} setMinLength={setMinLength} maxLength={maxLength} setMaxLength={setMaxLength} minTime={minTime} setMinTime={setMinTime} maxTime={maxTime} setMaxTime={setMaxTime}
                        minAscent={minAscent} setMinAscent={setMinAscent} maxAscent={maxAscent} setMaxAscent={setMaxAscent} difficulty={difficulty} setDifficulty={setDifficulty} 
                        municipality={municipality}  setMunicipality={setMunicipality} province={province} setProvince={setProvince} startPoint={startPoint} setStartPoint={setStartPoint} refPoint={refPoint} setRefPoint={setRefPoint} endPoint={endPoint} setEndPoint={setEndPoint}/>
      <HikesCards user={props.user} setMinLength={setMinLength} minLength={minLength} maxLength={maxLength} minTime={minTime} maxTime={maxTime} minAscent={minAscent} maxAscent={maxAscent} difficulty={difficulty}  municipality={municipality} province={province} startPoint={startPoint} endPoint={endPoint} refPoint={refPoint}
                  hikes={hikes}   />
    </>
  );
}

export default Home;
