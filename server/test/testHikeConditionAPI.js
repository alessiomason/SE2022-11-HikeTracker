const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
let agent = chai.request.agent(app);


describe('test hike condition APIs', () => {
    deleteHikeCondition(200, 1);
    getHikeConditions(200, 0);
    createHikeCondition(201, 1, 14, "Closed", "Attention, street closed!");
    getHikeConditions(200, 1);
    deleteHikeCondition(200, 1);
})

function getHikeConditions(expectedHTTPStatus, length) {
    it('getting hike conditions from the system', function (done) {
        agent.get('/api/hikeCondition')
            .then(function (r) {
                r.should.have.status(expectedHTTPStatus);
                r.body.length.should.have.equal(length);
                done();
            }).catch(done);
    });
}

function createHikeCondition(expectedHTTPStatus, hikeID, hutID, typeCondition, description) {
    it('creating an hike condition in the system', function (done) {
        let hikeCondition = {
            hikeID : hikeID,
            hutID : hutID,
            typeCondition : typeCondition,
            description: description
        };
        agent.post('/api/newHikeCondition')
            .send(hikeCondition)
            .then(function (r1) {
                r1.should.have.status(expectedHTTPStatus);
                agent.get('/api/hikeCondition')
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

function deleteHikeCondition(expectedHTTPStatus, id) {
    it('delete an hike condition from the system', function (done) {
        agent.delete('/api/hikeCondition/' + id)
            .send()
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            }).catch(done);
    });
}