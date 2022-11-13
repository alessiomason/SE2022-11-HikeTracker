import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route, Outlet,} from 'react-router-dom';
import MyGPXLayout from './GPXLayout';
import API from './API';
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

  function addGPXTrack(GPXFile) {
    API.addGPXTrack(GPXFile)
    .then(() => { })
    .catch( err => handleError(err));
  }


  function handleError(err) {
    console.log(err);
  }

  function Layout(props) {

    return (

      <>
        <MyNavbar />
        <Outlet />
        <Footer />
      </>

    );
  }

  return (

      <Routes>
        <Route path="/" element={<Layout />}>
        <Route index element={<Home />}/>
          <Route path="gpx/" element={<MyGPXLayout addGPXTrack={addGPXTrack} />} ></Route>
        </Route>
      </Routes>
      
  );
}

export default App;
