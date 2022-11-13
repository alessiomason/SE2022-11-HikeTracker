import '../../App.css';
import Cards from '../Cards';
import MyTopHome from '../TopHome';
import MyFilterSection from '../FilterSection';

function Home() {
  return (
    <>
      <MyTopHome />
      <MyFilterSection />
      <Cards />
    </>
  );
}

export default Home;
