import './App.css';
import { BrowserRouter as Router, Routes, Route,} from 'react-router-dom';

function App() {
  return (
    <Router>
      <App2 />
    </Router>
  );
}

function App2() {

  return (

    <Routes>
      <Route path="/">
      </Route>
    </Routes>

  );
}

export default App;
