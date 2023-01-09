// const chai = require('chai');
// const chaiHttp = require('chai-http');
// chai.use(chaiHttp);
// let should = chai.should();

// const app = require('../server');
// const gpx = require('./lombardo.json');
// let agent = chai.request.agent(app);


// describe('test creation of hikes by GPX file', () => {
//     deleteAllHikes();
//     getHikes(200, 0);
//     createHikeByGPX(201, gpx);
//     getHikes(200, 1);
//     getHikeByID(200, 1, 223)
//     deleteHike(200, 1);
//     getHikes(200, 0);
    
// })

// describe('test UPDATE hike APIs', () => {
//     deleteAllHikes();
//     getHikes(200, 0);
//     createHike(201, "Monte Vandalino", 4414.9799873036545, 4, 862.6788329999997, 2, "Sentiero per Monte Vandalino.","Italy", "Piedmont", "Torino", 'Torre Pellice');
//     updateHike(422, 1, "", 20500, 10, 23, "Professional hiker", "Alpine challenge", "Piemonte", "Cogne");
//     getHikes(200, 1);
//     updateHike(201, "Monte Vandalino2", 4414.9799873036545, 4, 862.6788329999997, 2, "Sentiero per Monte Vandalino.","Italy", "Piedmont", "Torino", 'Torre Pellice');;
//     getHikes(200, 1);
// })

// describe('test DELETE hike APIs', () => {
//     deleteAllHikes();
//     getHikes(200, 0);
//     createHike(201, "Monte Vandalino", 4414.9799873036545, 4, 862.6788329999997, 2, "Sentiero per Monte Vandalino.","Italy", "Piedmont", "Torino", 'Torre Pellice');
//     getHikes(200, 1);
//     deleteAllHikes();
//     getHikes(200, 0);
// })

// describe('test CREATION and READ hike APIs', () => {
//     deleteAllHikes();
//     getHikes(200, 0);
//     createHike(201, "Monte Vandalino", 4414.9799873036545, 4, 862.6788329999997, 2, "Sentiero per Monte Vandalino.","Italy", "Piedmont", "Torino", 'Torre Pellice');
//     getHikes(200, 1);
//     createHike(201, "Monte Vandalino1", 4414.9799873036545, 4, 862.6788329999997, 2, "Sentiero per Monte Vandalino.","Italy", "Piedmont", "Torino", 'Torre Pellice');
//     getHikes(200, 2);
//     createHike(201, "Monte Vandalino2", 4414.9799873036545, 4, 862.6788329999997, 2, "Sentiero per Monte Vandalino.","Italy", "Piedmont", "Torino", 'Torre Pellice');
//     createHike(201, "Monte Vandalino3", 4414.9799873036545, 4, 862.6788329999997, 2, "Sentiero per Monte Vandalino.","Italy", "Piedmont", "Torino", 'Torre Pellice');
//     getHikes(200, 4);
//     createHike(201, "Monte Vandalino4", 4414.9799873036545, 4, 862.6788329999997, 2, "Sentiero per Monte Vandalino.","Italy", "Piedmont", "Torino", 'Torre Pellice');
//     getHikes(200, 5);
//     createHike(201, "Monte Vandalino5", 4414.9799873036545, 4, 862.6788329999997, 2, "Sentiero per Monte Vandalino.","Italy", "Piedmont", "Torino", 'Torre Pellice');
//     createHike(201, "Monte Vandalino", 4414.9799873036545, 4, 862.6788329999997, 2, "Sentiero per Monte Vandalino.","Italy", "Piedmont", "Torino", 'Torre Pellice');
//     getHikes(200, 7);
// })

// function deleteAllHikes() {
//     it('clean db for hike APIs', function (done) {

//         agent.delete('/api/deleteAllHikes')
//             .then(function (res) {
//                 res.should.have.status(204);
//                 done();
//             });
//     });
// }

// function getHikes(expectedHTTPStatus, length) {
//     it('getting hikes from the system', function (done) {
//         agent.get('/api/hikes')
//             .then(function (r) {
//                 r.should.have.status(expectedHTTPStatus);
//                 r.body.length.should.have.equal(length);
//                 done();
//             }).catch(done);
//     });
// }

// function getHikeByID(expectedHTTPStatus, hikeID, expectedNumberOfPoints) {
//     it('getting an hike from the system by hikeID', function (done) {
//         agent.get('/api/hike/' + hikeID)
//             .then(function (r) {
//                 r.should.have.status(expectedHTTPStatus);
//                 r.body.points.length.should.have.equal(expectedNumberOfPoints);
//                 done();
//             }).catch(done);
//     });
// }

// function createHike(expectedHTTPStatus, label, length, expTime, ascent, difficulty, description, state, region, province, municipality) {
//     it('creating a hike in the system', function (done) {
//         let hike = {
//             label : label,
//             length : length,
//             expTime : expTime,
//             ascent : ascent,
//             difficulty : difficulty,
//             description: description,
//             state: state,
//             region: region,
//             province: province,
//             municipality: municipality
//         };
//         agent.post('/api/newHike')
//             .send(hike)
//             .then(function (r1) {
//                 r1.should.have.status(expectedHTTPStatus);
//                 agent.get('/api/hikes')
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

// function updateHike(expectedHTTPStatus, id, newLabel, newLength, newExpTime, newAscent, newDifficulty, newDescription, newState, newRegion, newProvince, newMunicipality) {
//     it('update an hike in the system', function (done) {
//         let hike = {
//             id: id,
//             label : newLabel,
//             length : newLength,
//             expTime : newExpTime,
//             ascent : newAscent,
//             difficulty : newDifficulty,
//             description: newDescription,
//             state: newState,
//             region: newRegion,
//             province: newProvince,
//             municipality: newMunicipality
//         };
//         agent.put('/api/updateHike/' + hike.id)
//             .send(hike)
//             .then(function (res) {
//                 res.should.have.status(expectedHTTPStatus);
//                 done();
//             }).catch(done);
//     });
// }

// function deleteHike(expectedHTTPStatus, id) {
//     it('delete an hike from the system', function (done) {
//         let hike = {
//             id: id
//         }
//         agent.delete('/api/hikes/' + id)
//             .send(hike)
//             .then(function (res) {
//                 res.should.have.status(expectedHTTPStatus);
//                 done();
//             }).catch(done);
//     });
// }

// function createHikeByGPX(expectedHTTPStatus, jsonGPX) {
//     it('create an hike by gpx', function (done ) {
//         agent.post('/api/addGPXTrack')
//             .send(jsonGPX)
//             .then(function (r1) {
//                 r1.should.have.status(expectedHTTPStatus);
//                 agent.get('/api/hikes')
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