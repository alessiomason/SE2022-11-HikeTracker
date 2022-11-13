import '../../App.css';
import Cards from '../Cards';
import MyTopHome from '../TopHome';
import MyFilterSection from '../FilterSection';

function Home(props) {
  return (
    <>
      <MyTopHome />
      <MyFilterSection />
      <Cards user={props.user} />
    </>
  );
}

export default Home;
