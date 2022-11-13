const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
let agent = chai.request.agent(app);

describe('test hike APIs', () => {
    deleteAllHikes();
    getHikes(200, 0);
    createHike(201, "Untitled", null, null, 22.9999980926514, "Tourist", "Description 1");
    getHikes(200, 1);
    createHike(422, "", null, null, 1353.053467, "Hiker");
    getHikes(200, 1);
    createHike(201, "rocciamelone vero", null, null, 1353.053467, "Hiker");
    createHike(201, "rocciamelone vero", null, null, 1353.053467, "Hiker");
    createHike(201, "rocciamelone vero", null, null, 1353.053467, "Hiker");
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
        let ticket = {
            label : label,
            length : length,
            expTime : expTime,
            ascent : ascent,
            difficulty : difficulty,
            description: description
        };
        agent.post('/api/newHike')
            .send(ticket)
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