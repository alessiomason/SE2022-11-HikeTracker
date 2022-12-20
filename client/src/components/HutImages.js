import '../styles/HutManager.css';
import { Container, Row, Button } from 'react-bootstrap';
import { useState, } from 'react';
import { default as Close2 } from '../icons/close2.svg';

function MyHutImages(props) {
  
  const imgs = [
    {id:0,value:require('../images/img1.jpg')},
    {id:1,value:require('../images/img2.jpg')},
    {id:2,value:require('../images/img3.jpg')},
    {id:3,value:require('../images/img4.jpg')},
    {id:4,value:require('../images/img5.jpg')},
    {id:5,value:require('../images/img6.jpg')},
    {id:6,value:require('../images/img7.jpg')},
    {id:7,value:require('../images/img8.jpg')},
    {id:8,value:require('../images/img9.jpg')},
  ]

  const [mainImg, setMainImg]=useState(imgs[0]);

  return (
    
    <Container fluid>
      <Row className="box_img">
        <img className=" main_img mb-3" src={mainImg.value} alt="main_image" />
        <Button variant="danger" className="close_btn"><img src={Close2} alt="user_image" /> </Button>
      </Row>
        <Row className="thumb_row">
        {imgs.map((item, index) => (
            <Button key={index} className="box_thumb mb-2" >
              <img className={mainImg.id==index?"clicked thumb_img":"thumb_img"} src={item.value} alt="hut images" onClick={()=>setMainImg(imgs[index])} />
            </Button>
          ))}
        </Row>
      </Container>
   
  );
}

export default MyHutImages;