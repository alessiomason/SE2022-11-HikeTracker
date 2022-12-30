import React, { useState, useEffect } from 'react';
import { Button, Container, Row, Col, Form, FloatingLabel } from "react-bootstrap";
import { TrackedHikesInfoTable, TrackedHikesInfoModal } from './TrackedHikesInfo';
import '../styles/ProfileHiker.css';
import '../styles/ProfileHutWorker.css';
import { default as Params } from '../icons/equalizer.svg';
import API from '../API';

function ProfileHiker() {

  const [task1, setTask1] = useState("stats");

  return (
    <Container fluid className="">
      <Row className="box-btn mb-5">
        <Button className={(task1 === "stats") ? 'user-btn-fix me-2 margin-bottom2' : 'user-btn me-2 margin-bottom2'} onClick={() => setTask1("stats")}> Your Hikes </Button>
        <Button className={(task1 === "filter") ? 'user-btn-fix mx-2 margin-bottom2' : 'user-btn mx-2 margin-bottom2'} onClick={() => setTask1("filter")}> Your Filters </Button>
        <Button className={(task1 === "param") ? 'user-btn-fix ms-2' : 'user-btn ms-2 '} onClick={() => setTask1("param")}> Your Parameters </Button>
      </Row>
      {(task1 === "stats") ? <YourStats /> : (task1 === "filter") ? <YourFilter /> : <YourParameter />}

    </Container>
  );
}

function YourStats() {
  const [dirty, setDirty] = useState(true);
  const [hike, setHike] = useState({});
  const [dirtyHike, setDirtyHike] = useState(false);    // allows showing of the map only when loading of the hike is done
  const [trackedHikes, setTrackedHikes] = useState([]);
  const [trackedHikesInfoModalShow, setTrackedHikesInfoModalShow] = useState(false);  // state to show the modal, if true, contains the id of the tracked hike currently showing

  useEffect(() => {
    if (dirty) {
      API.getTrackedHikesByUserID()
        .then((trackedHikes) => setTrackedHikes(trackedHikes))
        .catch(err => console.log(err));

      setDirty(false);
    }
  }, [dirty]);

  useEffect(() => {
    if (trackedHikesInfoModalShow) {
      const hikeID = trackedHikes.find(th => th.id === trackedHikesInfoModalShow).hikeID;

      if (hikeID !== hike.id) {
        setDirtyHike(true);

        API.getHike(hikeID)
          .then((hike) => {
            setHike(hike);
            setDirtyHike(false);
          })
          .catch(err => console.log(err));
      }
    }
  }, [trackedHikesInfoModalShow]);

  return (
    <Row style={{ '--main-color': '#494681',  '--faded-main-color': 'rgba(73, 70, 129, 0.1)' }}>
      <Col xs={{ span: 10, offset: 1 }}>
        {trackedHikes.length > 0 && <TrackedHikesInfoTable inProfilePage trackedHikes={trackedHikes} setTrackedHikesInfoModalShow={setTrackedHikesInfoModalShow} />}
        {trackedHikes.length > 0 && <TrackedHikesInfoModal inProfilePage show={trackedHikesInfoModalShow} onHide={() => setTrackedHikesInfoModalShow(false)} hike={hike} dirtyHike={dirtyHike} trackedHikes={trackedHikes} style={{ '--main-color': '#494681',  '--faded-main-color': 'rgba(73, 70, 129, 0.1)' }} />}
      </Col>
    </Row>
  );
}


function YourFilter() {
  return (

    <Row className="margin-x box-center">

      <Row>
        <Col lg={4} md={6} sm={12} xs={12} className="p-2 ">
          <Col className="val-user-box3 p-4 ">
            <Row>
              <h5 className="filter-hiker-title mb-3"> Length (meters) </h5>
            </Row>
            <Row>
              <Col md={12}>
                <FloatingLabel controlId="floatingInput" label="Minimum Length" className="mb-3">
                  <Form.Control required={true} type='number' step="any" min={0} placeholder="#" value={"140"} />
                </FloatingLabel>
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <FloatingLabel controlId="floatingInput" label="Maximum Length" className="mb-3">
                  <Form.Control required={true} type='number' step="any" min={0} placeholder="#" />
                </FloatingLabel>
              </Col>
            </Row>
            <Row className='btn_box'>
              <Button variant="danger" className="cancel-btn2 mx-2 " >Undo</Button>
              <Button variant="success" type='submit' className="save-btn2 mx-2 ">Save</Button>
            </Row>
          </Col>
        </Col>

        <Col lg={4} md={6} sm={12} xs={12} className="p-2 ">
          <Col className="val-user-box3 p-4 ">
            <Row>
              <h5 className="filter-hiker-title mb-3"> Ascent (meters) </h5>
            </Row>
            <Row>
              <Col md={12}>
                <FloatingLabel controlId="floatingInput" label="Minimum Ascent" className="mb-3">
                  <Form.Control required={true} type='number' step="any" min={0} placeholder="#" value={"140"} />
                </FloatingLabel>
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <FloatingLabel controlId="floatingInput" label="Maximum Ascent" className="mb-3">
                  <Form.Control required={true} type='number' step="any" min={0} placeholder="#" />
                </FloatingLabel>
              </Col>
            </Row>
            <Row className='btn_box'>
              <Button variant="danger" className="cancel-btn2 mx-2 " >Undo</Button>
              <Button variant="success" type='submit' className="save-btn2 mx-2 ">Save</Button>
            </Row>
          </Col>
        </Col>

        <Col lg={4} md={12} sm={12} xs={12} className="p-2 ">
          <Col className="val-user-box3 p-4 ">
            <Row>
              <h5 className="filter-hiker-title mb-3"> Expected Time (hours)</h5>
            </Row>
            <Row>
              <Col md={12}>
                <FloatingLabel controlId="floatingInput" label="Minimum Time" className="mb-3">
                  <Form.Control required={true} type='number' step="any" min={0} placeholder="#" value={"140"} />
                </FloatingLabel>
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <FloatingLabel controlId="floatingInput" label="Maximum Time" className="mb-3">
                  <Form.Control required={true} type='number' step="any" min={0} placeholder="#" />
                </FloatingLabel>
              </Col>
            </Row>
            <Row className='btn_box'>
              <Button variant="danger" className="cancel-btn2 mx-2 " >Undo</Button>
              <Button variant="success" type='submit' className="save-btn2 mx-2 ">Save</Button>
            </Row>
          </Col>
        </Col>
      </Row>

      <Row>
        <Col lg={4} md={6} sm={12} xs={12}>
          <Row>
            <Col className="p-2 ">
              <Col className="val-user-box3 p-4 ">
                <Row>
                  <h5 className="filter-hiker-title mb-3"> Difficulty </h5>
                </Row>
                <Row>
                  <Col md={12}>
                    <Form.Check inline label="Tourist" type="checkbox" id="1" className="mb-3" />
                    <Form.Check inline label="Hiker" type="checkbox" id="2" className="mb-3" />
                    <Form.Check inline label="Pro Hiker" type="checkbox" id="3" className="mb-3" />
                  </Col>
                </Row>
                <Row className='btn_box'>
                  <Button variant="danger" className="cancel-btn2 mx-2 " >Undo</Button>
                  <Button variant="success" type='submit' className="save-btn2 mx-2 ">Save</Button>
                </Row>
              </Col>
            </Col>
          </Row>

          <Row>
            <Col className="p-2 ">
              <Col className="val-user-box3 p-4 ">
                <Row>
                  <h5 className="filter-hiker-title mb-3"> Locality </h5>
                </Row>
                <Row>
                  <Col md={12} >
                    <FloatingLabel controlId="floatingSelect" label="State" className="form-sel2 mb-3">
                      <Form.Select aria-label="Floating label select example" placeholder="State">
                        <option>~ Choose a State ~</option>
                        <option value="1"> Open</option>
                        <option value="2">Close</option>
                        <option value="3">Partly blocked</option>
                        <option value="4">Requires special gear</option>
                      </Form.Select>
                    </FloatingLabel>
                  </Col>
                </Row>
                <Row>
                  <Col md={12} >
                    <FloatingLabel controlId="floatingSelect" label="Region" className="form-sel2 mb-3">
                      <Form.Select aria-label="Floating label select example" placeholder="Region">
                        <option>~ Choose a Region ~</option>
                        <option value="1"> Open</option>
                        <option value="2">Close</option>
                        <option value="3">Partly blocked</option>
                        <option value="4">Requires special gear</option>
                      </Form.Select>
                    </FloatingLabel>
                  </Col>
                </Row>
                <Row>
                  <Col md={12} >
                    <FloatingLabel controlId="floatingSelect" label="Province" className="form-sel2 mb-3">
                      <Form.Select aria-label="Floating label select example" placeholder="Province">
                        <option>~ Choose a Province ~</option>
                        <option value="1"> Open</option>
                        <option value="2">Close</option>
                        <option value="3">Partly blocked</option>
                        <option value="4">Requires special gear</option>
                      </Form.Select>
                    </FloatingLabel>
                  </Col>
                </Row>
                <Row>
                  <Col md={12} >
                    <FloatingLabel controlId="floatingSelect" label="Municipality" className="form-sel2 mb-3">
                      <Form.Select aria-label="Floating label select example" placeholder="Municipality">
                        <option>~ Choose a Municipality ~</option>
                        <option value="1"> Open</option>
                        <option value="2">Close</option>
                        <option value="3">Partly blocked</option>
                        <option value="4">Requires special gear</option>
                      </Form.Select>
                    </FloatingLabel>
                  </Col>
                </Row>
                <Row className='btn_box'>
                  <Button variant="danger" className="cancel-btn2 mx-2 " >Undo</Button>
                  <Button variant="success" type='submit' className="save-btn2 mx-2 ">Save</Button>
                </Row>
              </Col>
            </Col>
          </Row>
        </Col>

        <Col lg={8} md={6} sm={12} xs={12} className="p-2 ">
          <Col className="val-user-box3 p-4 ">
            <Row>
              <h5 className="filter-hiker-title mb-3"> Point on the Map </h5>
            </Row>
            <Row className="px-2 mb-4">
              <Col md={12} className="filter-hike-map-box ">

              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={12}>
                <h6>Choose a point on the Map and a radius value:</h6>
              </Col>
            </Row>
            <Row className="mb-4 hike-filter-range">
              <Col md={12} >
                <Row >
                  <Col xs={1} className="px-0 mx-0 box-center">1 km</Col>
                  <Col xs={10} className="box-center " >
                    <input type='range' min={1} max={5} step={1} className='my-slider back-bar' />
                  </Col>
                  <Col xs={1} className="px-0 mx-0 box-center" >5 km</Col>
                </Row>
              </Col>
            </Row>
            <Row className='btn_box'>
              <Button variant="danger" className="cancel-btn2 mx-2 " >Undo</Button>
              <Button variant="success" type='submit' className="save-btn2 mx-2 ">Save</Button>
            </Row>
          </Col>
        </Col>
      </Row>
    </Row>
  );
}

function YourParameter() {

  return (
    <Row className=" val-user-box3 mx-5 p-4 box-center">
      <Row>
        <Col lg={3} md={6} sm={12} xs={12} className="box-center ">
          <img src={Params} alt="param_image" className="mb-3" />
        </Col>
        <Col lg={3} md={6} sm={12} xs={12} className=" padding-x " >
          <FloatingLabel controlId="floatingInput" label="Total nr of hikes finished" className="mb-3">
            <Form.Control required={true} type="text" disabled readOnly value={"12"}></Form.Control>
          </FloatingLabel>
        </Col>
        <Col lg={3} md={6} sm={12} xs={12} className=" padding-x "  >
          <FloatingLabel controlId="floatingInput" label="Total nr of kms walked" className="mb-3">
            <Form.Control required={true} type="text" disabled readOnly value={"70"}></Form.Control>
          </FloatingLabel>
        </Col>
        <Col lg={3} md={6} sm={12} xs={12} className=" padding-x " >
          <FloatingLabel controlId="floatingInput" label="Highest altitude reached" className="mb-3">
            <Form.Control required={true} type="text" disabled readOnly value={"70"}></Form.Control>
          </FloatingLabel>
        </Col>
      </Row>
      <Row>
        <Col lg={3} md={6} sm={12} xs={12} className=" padding-x " >
          <FloatingLabel controlId="floatingInput" label="Highest altitude range done" className="mb-3">
            <Form.Control required={true} type="text" disabled readOnly value={"70"}></Form.Control>
          </FloatingLabel>
        </Col>
        <Col lg={3} md={6} sm={12} xs={12} className=" padding-x " >
          <FloatingLabel controlId="floatingInput" label="Longest (km) hike completed" className="mb-3">
            <Form.Control required={true} type="text" disabled readOnly value={"12"}></Form.Control>
          </FloatingLabel>
        </Col>
        <Col lg={3} md={6} sm={12} xs={12} className=" padding-x " >
          <FloatingLabel controlId="floatingInput" label="Longest (hours) hike completed" className="mb-3">
            <Form.Control required={true} type="text" disabled readOnly value={"70"}></Form.Control>
          </FloatingLabel>
        </Col>
        <Col lg={3} md={6} sm={12} xs={12} className=" padding-x " >
          <FloatingLabel controlId="floatingInput" label="Shortest (km) hike completed" className="mb-3">
            <Form.Control required={true} type="text" disabled readOnly value={"70"}></Form.Control>
          </FloatingLabel>
        </Col>
      </Row>
      <Row>
        <Col lg={3} md={6} sm={12} xs={12} className=" padding-x " >
          <FloatingLabel controlId="floatingInput" label="Shortest (hours) hike completed" className="mb-3">
            <Form.Control required={true} type="text" disabled readOnly value={"70"}></Form.Control>
          </FloatingLabel>
        </Col>
        <Col lg={3} md={6} sm={12} xs={12} className=" padding-x " >
          <FloatingLabel controlId="floatingInput" label="Average pace (min/km)" className="mb-3">
            <Form.Control required={true} type="text" disabled readOnly value={"12"}></Form.Control>
          </FloatingLabel>
        </Col>
        <Col lg={3} md={6} sm={12} xs={12} className=" padding-x " >
          <FloatingLabel controlId="floatingInput" label="Fastest paced hike (min/km)" className="mb-3">
            <Form.Control required={true} type="text" disabled readOnly value={"70"}></Form.Control>
          </FloatingLabel>
        </Col>
        <Col lg={3} md={6} sm={12} xs={12} className=" padding-x ">
          <FloatingLabel controlId="floatingInput" label="Average vertical ascent speed (m/hour)" className="mb-3">
            <Form.Control required={true} type="text" disabled readOnly value={"70"}></Form.Control>
          </FloatingLabel>
        </Col>
      </Row>
    </Row>
  );
}
export default ProfileHiker;

