import './App.css';
import { BrowserRouter as Router, Routes, Route,useNavigate} from 'react-router-dom';
import MyGPXLayout from './GPXLayout';
import API from './API';
import { useState,useEffect } from 'react';
import HikeForm from './components/Hikeform';
import Editform from './components/EditForm';




function App() {
  return (
    <Router>
      <App2 />
    </Router>
  );
}

function App2() {

  function addGPXTrack(gpx) {
    
    API.addGPXTrack(gpx)
    .then(() => { })
    .catch( err => handleError(err));
  }


  function handleError(err) {
    console.log(err);
  }

  const navigate = useNavigate();

  const [hike, setHike] = useState ('');
  const [dirty,setDirty]= useState(false);

  function deleteHike(id) {

    API.deleteHike (id)
    .then(() => { setDirty(true) ; navigate("./")})
    .catch( err => handleError(err));
}

function addHike(hike) {
  
  API.addHike(hike)
  .then(() => { })
  .catch( err => handleError(err));
}

function updateHike(hike) {
  
  API.updateHike(hike)
  .then(() => { })
  .catch( err => handleError(err));
  }

  function handleError(err) {
  console.log(err);
}

useEffect(() => {
  API.getHikes()
    .then((h) => { setHike(h); setDirty(false)})
    .catch( err => handleError(err));

}, []);



  return (

    <Routes>
      <Route path="/">
        <Route path="gpx/" element={<MyGPXLayout addGPXTrack={addGPXTrack}/>} ></Route>
        <Route path="newHike/" element={<HikeForm hike={hike}  addHike={addHike}/>} ></Route>
        <Route path="updateHike/:hikeId/" element={<Editform hike={hike}  
                updateHike={updateHike} deleteHike={deleteHike}/>} ></Route>
      </Route>
    </Routes>

  );
}

export default App;
