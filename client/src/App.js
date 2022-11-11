import './App.css';
import { BrowserRouter as Router, Routes, Route,} from 'react-router-dom';
import MyGPXLayout from './GPXLayout';
import API from './API';
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

  return (

    <Routes>
      <Route path="/">
      <Route path="gpx/" element={<MyGPXLayout addGPXTrack={addGPXTrack}/>} ></Route>
      </Route>
    </Routes>

  );
}

export default App;
