const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
let agent = chai.request.agent(app);

describe('test UPDATE hike APIs', () => {
    deleteAllHikes();
    getHikes(200, 0);
    createHike(201, "Gran Paradiso", 205000, 100, 230, "Professional hiker", "Alpine challenge 0");
    updateHike(422, 1, "", 20500, 10, 23, "Professional hiker", "Alpine challenge");
    getHikes(200, 1);
    updateHike(201, 1, "Gran Paradiso", 20500, 10, 23, "Professional hiker", "Alpine challenge");
    getHikes(200, 1);
})

describe('test DELETE hike APIs', () => {
    deleteAllHikes();
    getHikes(200, 0);
    createHike(201, "Gran Paradiso", 205000, 100, 230, "Professional hiker", "Alpine challenge 0");
    getHikes(200, 1);
    deleteHike(200, 1);
    getHikes(200, 0);
})

describe('test CREATION and READ hike APIs', () => {
    deleteAllHikes();
    getHikes(200, 0);
    createHike(201, "Gran Paradiso", 20500, 10, 23, "Professional hiker", "Alpine challenge");
    getHikes(200, 1);
    createHike(422, "", 9500, 4, 6, "Hiker", "Best hike in the Dolomites");
    getHikes(200, 1);
    createHike(201, "Tre Cime di LavaredoTre Cime di Lavaredo", 9500, 4, 6, "Hiker", "Best hike in the Dolomites");
    createHike(201, "Sentiero degli Dei", 8000, 5, 13, "Tourist", "Best hike for a sun-kissed stroll");
    getHikes(200, 3);
    createHike(422, "", 11400, 7, 1353.053467, "Hiker", "Considered the highest of the Alps for centuries");
    getHikes(200, 3);
    createHike(201, "Rocciamelone", 11400, 7, 1353.053467, "Hiker", "Considered the highest of the Alps for centuries");
    createHike(201, "Corno Grande", 9000, 7, 665, "Hiker", "Best hike for climbing a mountain");
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

function createHike(expectedHTTPStatus, label, length, expTime, ascent, difficulty, description) {
    it('creating a hike in the system', function (done) {
        let hike = {
            label : label,
            length : length,
            expTime : expTime,
            ascent : ascent,
            difficulty : difficulty,
            description: description
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

function updateHike(expectedHTTPStatus, id, newLabel, newLength, newExpTime, newAscent, newDifficulty, newDescription) {
    it('update an hike in the system', function (done) {
        let hike = {
            id: id,
            label : newLabel,
            length : newLength,
            expTime : newExpTime,
            ascent : newAscent,
            difficulty : newDifficulty,
            description: newDescription
        };
        agent.put('/api/updateHike/')
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
        agent.delete('/api/hikes/')
            .send(hike)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            }).catch(done);
    });
}