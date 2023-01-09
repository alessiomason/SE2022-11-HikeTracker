// const chai = require('chai');
// const chaiHttp = require('chai-http');
// chai.use(chaiHttp);
// chai.should();

// const app = require('../server');
// let agent = chai.request.agent(app);



// describe('test get Parking Lots APIs', () => {
//     getParkingLotById(200, 1, 1);
       
// })

// describe('test create Parking Lots APIs', () => {

//     createParkingLot(201, "Parking lot label 1", "state", "region", "Province 1","Municipality demo1", "description 1",  41.234572836822555, 15.21816437203666, 
//     1000, 80, 40, 35, 1);   
// })
// describe('test update Parking Lots APIs', () => {
//     updateParkingLot(201, "Parking lot label 1 updated", "state", "region", "Province 1 updated","Municipality demo1 updated", "description 1 updated",  41.234572836822555, 15.21816437203666, 
//     1000, 80, 60,1);
// })
// describe('test get all Parking Lots APIs', () => {
//     getParkingLots(200,1);
// })
// describe('test delete Parking Lots APIs', () => {
//     deleteParking(200,1);
// })




// function deleteAllParkingLots() {
//     it('clean db for Parking APIs', function (done) {

//         agent.delete('/api/deleteAllParkingLots')
//             .then(function (res) {
//                 res.should.have.status(204);
//                 done();
//             });
//     });
// }

// function getParkingLots(expectedHTTPStatus, length) {
//     it('getting all parking lots from the system', function (done) {
//         agent.get('/api/parkingLots')
//             .then(function (r) {
//                 r.should.have.status(expectedHTTPStatus);
//                 r.body.length.should.have.equal(length);
//                 done();
//             }).catch(done);
//     });
// }

// function getParkingLotById(expectedHTTPStatus, ParkingID, expectedNumberOfPoints) {
//     it('getting a parking lot from the system by ParkingID', function (done) {
//         agent.get('/api/parkingLots/' + ParkingID)
//             .then(function (r) {
//                 r.should.have.status(expectedHTTPStatus);
//                 r.body.length.should.have.equal(expectedNumberOfPoints);
//                 done();
//             }).catch(done);
//     });
// }

// function createParkingLot(expectedHTTPStatus, label, state, region, province, municipality, description, lat, lon, altitude, total, occupied ) {
//     it('creating a parking lot in the system', function (done) {
//         let parking = {
//             label : label,
//             state: state,
//             region: region,
//             total : total,
//             lat : lat,
//             lon : lon,
//             altitude : altitude,
//             description: description,
//             province: province,
//             municipality: municipality,
//             occupied: occupied
//         };
//         agent.post('/api/newParkingLot')
//             .send(parking)
//             .then(function (r1) {
//                 r1.should.have.status(expectedHTTPStatus);
//                 agent.get('/api/parkingLots')
//                     .then(function (r2) {
//                         if (r1.status != 422) {
//                             if (r2.body.length == 0) {
//                                 r2.should.have.status(500);
//                             }
//                         }
//                         r2.should.have.status(200);
//                         done();
//                     }).catch(done);
//             }).catch(done);
//     });
// }

// function updateParkingLot(expectedHTTPStatus, label, province, municipality, description, lat, lon, altitude, total, occupied,ParkingID ) {
//     it('update an Hut in the system', function (done) {
//         let parking = {
//             ParkingID: ParkingID,
//             label : label,
//             total : total,
//             lat : lat,
//             lon : lon,
//             altitude : altitude,
//             description: description,
//             province: province,
//             municipality: municipality,
//             occupied: occupied
//         };
//         agent.put('/api/parkingLots/' + parking.ParkingID)
//             .send(parking)
//             .then(function (res) {
//                 res.should.have.status(expectedHTTPStatus);
//                 done();
//             }).catch(done);
//     });
// }

// function deleteParking(expectedHTTPStatus, ParkingID) {
//     it('delete a Parking lot from the system', function (done) {
//         let parking = {
//             ParkingID: ParkingID
//         }
//         agent.delete('/api/parkingLots/' + parking.ParkingID)
//             .send(parking)
//             .then(function (res) {
//                 res.should.have.status(expectedHTTPStatus);
//                 done();
//             }).catch(done);
//     });
// }

