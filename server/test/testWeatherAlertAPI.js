const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
let agent = chai.request.agent(app);


describe('test weather alert APIs', () => {
    deleteWeatherAlert(200, 1);
    deleteWeatherAlert(200, 2);
    deleteWeatherAlert(200, 3);
    deleteWeatherAlert(200, 4);
    deleteWeatherAlert(200, 5);
    deleteWeatherAlert(200, 6);
    getWeatherAlerts(200, 0);
    createWeatherAlert(201, "Snowy", 20, 45.17731777167853, 7.090988159179688, "2023-01-27T02:52:00.000Z", "Attention, snow!");
    getWeatherAlerts(200, 1);
    deleteWeatherAlert(200, 1);
})

function getWeatherAlerts(expectedHTTPStatus, length) {
    it('getting weather alerts from the system', function (done) {
        agent.get('/api/weatherAlert')
            .then(function (r) {
                r.should.have.status(expectedHTTPStatus);
                r.body.length.should.have.equal(length);
                done();
            }).catch(done);
    });
}

function createWeatherAlert(expectedHTTPStatus, type, radius, lat, lon, time, description) {
    it('creating a weather alert in the system', function (done) {
        let weatherAlert = {
            type : type,
            radius : radius,
            lat : lat,
            lon : lon,
            time : time,
            description: description
        };
        agent.post('/api/newWeatherAlert')
            .send(weatherAlert)
            .then(function (r1) {
                r1.should.have.status(expectedHTTPStatus);
                agent.get('/api/weatherAlert')
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

function deleteWeatherAlert(expectedHTTPStatus, id) {
    it('delete a weather alert from the system', function (done) {
        agent.delete('/api/weatherAlert/' + id)
            .send()
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            }).catch(done);
    });
}