import HikesCards from '../HikeCards';
import MyTopHome from '../TopHome';
import MyFilterSection from '../FilterSection';
import MyModalLogin from '../ModalLogin';
import MyModalSignup from '../ModalSignup';
import '../../App.css';
import React, { useState,useEffect } from 'react';
import API from '../../API.js';

function Home(props) {

  // filters
  const [minLength,setMinLength] = useState('');
  const [maxLength,setMaxLength] = useState('');
  const [minTime,setMinTime] = useState('');
  const [maxTime,setMaxTime] = useState('');
  const [minAscent,setMinAscent] = useState('');
  const [maxAscent,setMaxAscent] = useState('');
  const [difficulty,setDifficulty] = useState('');

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
                        minAscent={minAscent} setMinAscent={setMinAscent} maxAscent={maxAscent} setMaxAscent={setMaxAscent} difficulty={difficulty} setDifficulty={setDifficulty} />
      <HikesCards user={props.user} minLength={minLength} maxLength={maxLength} minTime={minTime} maxTime={maxTime} minAscent={minAscent} maxAscent={maxAscent} difficulty={difficulty}
                  hikes={hikes}   />
    </>
  );
}

export default Home;
