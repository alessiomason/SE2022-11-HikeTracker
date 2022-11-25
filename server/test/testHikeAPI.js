const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
const gpx = require('./lombardo.json');
let agent = chai.request.agent(app);


describe('test creation of hikes by GPX file', () => {
    deleteAllHikes();
    getHikes(200, 0);
    createHikeByGPX(201, gpx);
    getHikes(200, 1);
    getHikeByID(200, 1, 223)
    deleteHike(200, 1);
    getHikes(200, 0);
    
})

describe('test UPDATE hike APIs', () => {
    deleteAllHikes();
    getHikes(200, 0);
    createHike(201, "Gran Paradiso", 205000, 100, 230, "Professional hiker", "Alpine challenge 0", "Piemonte", "Cogne");
    updateHike(422, 1, "", 20500, 10, 23, "Professional hiker", "Alpine challenge", "Piemonte", "Cogne");
    getHikes(200, 1);
    updateHike(201, 1, "Gran Paradiso", 20500, 10, 23, "Professional hiker", "Alpine challenge", "Piemonte", "Cogne");
    getHikes(200, 1);
})

describe('test DELETE hike APIs', () => {
    deleteAllHikes();
    getHikes(200, 0);
    createHike(201, "Gran Paradiso", 205000, 100, 230, "Professional hiker", "Alpine challenge 0", "Piemonte", "Cogne");
    getHikes(200, 1);
    deleteAllHikes();
    getHikes(200, 0);
})

describe('test CREATION and READ hike APIs', () => {
    deleteAllHikes();
    getHikes(200, 0);
    createHike(201, "Gran Paradiso", 20500, 10, 23, "Professional hiker", "Alpine challenge", "Piemonte", "Cogne");
    getHikes(200, 1);
    createHike(422, "", 9500, 4, 6, "Hiker", "Best hike in the Dolomites", "Trentino Alto Adige", "Belluno");
    getHikes(200, 1);
    createHike(201, "Tre Cime di Lavaredo", 9500, 4, 6, "Hiker", "Best hike in the Dolomites", "Trentino Alto Adige", "Belluno");
    createHike(201, "Sentiero degli Dei", 8000, 5, 13, "Tourist", "Best hike for a sun-kissed stroll", "Campania", "Salerno");
    getHikes(200, 3);
    createHike(422, "", 11400, 7, 1353.053467, "Hiker", "Considered the highest of the Alps for centuries", "Piemonte", "Torino");
    getHikes(200, 3);
    createHike(201, "Rocciamelone", 11400, 7, 1353.053467, "Hiker", "Considered the highest of the Alps for centuries", "Piemonte", "Torino");
    createHike(201, "Corno Grande", 9000, 7, 665, "Hiker", "Best hike for climbing a mountain", "Abruzzo", "Teramo");
    getHikes(200, 5);
})

function deleteAllHikes() {
    it('clean db for hike APIs', function (done) {

        agent.delete('/api/deleteAllHikes')
            .then(function (res) {
                res.should.have.status(204);
                done();
            });
    });
}

function getHikes(expectedHTTPStatus, length) {
    it('getting hikes from the system', function (done) {
        agent.get('/api/hikes')
            .then(function (r) {
                r.should.have.status(expectedHTTPStatus);
                r.body.length.should.have.equal(length);
                done();
            }).catch(done);
    });
}

function getHikeByID(expectedHTTPStatus, hikeID, expectedNumberOfPoints) {
    it('getting an hike from the system by hikeID', function (done) {
        agent.get('/api/hike/' + hikeID)
            .then(function (r) {
                r.should.have.status(expectedHTTPStatus);
                r.body.points.length.should.have.equal(expectedNumberOfPoints);
                done();
            }).catch(done);
    });
}

function createHike(expectedHTTPStatus, label, length, expTime, ascent, difficulty, description, province, municipality) {
    it('creating a hike in the system', function (done) {
        let hike = {
            label : label,
            length : length,
            expTime : expTime,
            ascent : ascent,
            difficulty : difficulty,
            description: description,
            province: province,
            municipality: municipality
        };
        agent.post('/api/newHike')
            .send(hike)
            .then(function (r1) {
                r1.should.have.status(expectedHTTPStatus);
                agent.get('/api/hikes')
                    .then(function (r2) {
                        if (r1.status != 422) {
                            if (r2.body.length == 0) {
                                r2.should.have.status(500);
                            }
                        }
                        r2.should.have.status(200);
                        done();
                    }).catch(done);
            }).catch(done);
    });
}

function updateHike(expectedHTTPStatus, id, newLabel, newLength, newExpTime, newAscent, newDifficulty, newDescription, newProvince, newMunicipality) {
    it('update an hike in the system', function (done) {
        let hike = {
            id: id,
            label : newLabel,
            length : newLength,
            expTime : newExpTime,
            ascent : newAscent,
            difficulty : newDifficulty,
            description: newDescription,
            province: newProvince,
            municipality: newMunicipality
        };
        agent.put('/api/updateHike/' + hike.id)
            .send(hike)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            }).catch(done);
    });
}

function deleteHike(expectedHTTPStatus, id) {
    it('delete an hike from the system', function (done) {
        let hike = {
            id: id
        }
        agent.delete('/api/hikes/' + id)
            .send(hike)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            }).catch(done);
    });
}

function createHikeByGPX(expectedHTTPStatus, jsonGPX) {
    it('create an hike by gpx', function (done ) {
        agent.post('/api/addGPXTrack')
            .send(jsonGPX)
            .then(function (r1) {
                r1.should.have.status(expectedHTTPStatus);
                agent.get('/api/hikes')
                    .then(function (r2) {
                        if (r1.status != 422) {
                            if (r2.body.length == 0) {
                                r2.should.have.status(500);
                            }
                        }
                        r2.should.have.status(200);
                        done();
                    }).catch(done);
            }).catch(done);
    });
}