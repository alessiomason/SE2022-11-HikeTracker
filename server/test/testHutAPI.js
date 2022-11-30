const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
let agent = chai.request.agent(app);

describe('test UPDATE Hut APIs', () => {
    deleteAllHuts();
    getHuts(200, 0);
    createHut(201, "Lagazuoi Mountain Hut", "One of the nicest mountain huts", 46.234572836822444, 12.21816437203585, 
    1224, 80, "Belluno", "Cortina d'Ampezzo");
    updateHut(422, "Tuckett Mountain Hut", "A spectacular position surrounded by the sheer peaks of the Brenta Dolomites",
    46.0755170694556, 11.091573714948028, 2272, 112, "Trento", "Ragoli",1);
    getHuts(200, 1);
   
})

describe('test DELETE Hut APIs', () => {
    deleteAllHuts();
    getHuts(200, 0);
    createHut(201, "Lagazuoi Mountain Hut", "One of the nicest mountain huts", 46.234572836822444, 12.21816437203585, 
    1224, 80, "Belluno", "Cortina d'Ampezzo");
    getHuts(200, 1);
    deleteAllHuts();
    getHuts(200, 0);
})

describe('test CREATION and READ Hut APIs', () => {
    deleteAllHuts();
    getHuts(200, 0);
    createHut(201, "Lagazuoi Mountain Hut", "One of the nicest mountain huts", 46.234572836822444, 12.21816437203585, 
    1224, 80, "Belluno", "Cortina d'Ampezzo");
    getHuts(200, 1);
    createHut(422, "Tuckett Mountain Hut", "A spectacular position surrounded by the sheer peaks of the Brenta Dolomites",
    46.0755170694556, 11.091573714948028, 2272, 112, "Trento", "Ragoli");
    getHuts(200, 2);
})

function deleteAllHuts() {
    it('clean db for Hut APIs', function (done) {

        agent.delete('/api/deleteAllHuts')
            .then(function (res) {
                res.should.have.status(204);
                done();
            });
    });
}

function getHuts(expectedHTTPStatus, length) {
    it('getting Huts from the system', function (done) {
        agent.get('/api/huts')
            .then(function (r) {
                r.should.have.status(expectedHTTPStatus);
                r.body.length.should.have.equal(length);
                done();
            }).catch(done);
    });
}

function getHutByID(expectedHTTPStatus, HutID, expectedNumberOfPoints) {
    it('getting an Hut from the system by HutID', function (done) {
        agent.get('/api/hut/' + HutID)
            .then(function (r) {
                r.should.have.status(expectedHTTPStatus);
                r.body.points.length.should.have.equal(expectedNumberOfPoints);
                done();
            }).catch(done);
    });
}

function createHut(expectedHTTPStatus, name, description, lat, lon, altitude, beds, province, municipality, hutId) {
    it('creating a Hut in the system', function (done) {
        let Hut = {
            name : name,
            description : description,
            lat : lat,
            lon : lon,
            altitude : altitude,
            beds: beds,
            province: province,
            municipality: municipality
        };
        agent.post('/api/addHut')
            .send(Hut)
            .then(function (r1) {
                r1.should.have.status(expectedHTTPStatus);
                agent.get('/api/huts')
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

function updateHut(expectedHTTPStatus, name, description, lat, lon, altitude, beds, province, municipality, hutId) {
    it('update an Hut in the system', function (done) {
        let Hut = {
            id: hutId,
            name : name,
            description : description,
            lat : lat,
            lon : lon,
            altitude : altitude,
            beds: beds,
            province: province,
            municipality: municipality
        };
        agent.put('/api/updateHut/' + Hut.id)
            .send(Hut)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            }).catch(done);
    });
}

function deleteHut(expectedHTTPStatus, id) {
    it('delete an Hut from the system', function (done) {
        let Hut = {
            id: id
        }
        agent.delete('/api/huts/' + id)
            .send(Hut)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            }).catch(done);
    });
}

