const APIURL = new URL('http://localhost:3001/api/');

function addGPXTrack(gpxJSON) {
    // call: POST /api/addGPXTrack

    return new Promise((resolve, reject) => {
        fetch(new URL('addGPXTrack', APIURL), {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(gpxJSON),
        }).then((response) => {
            if (response.ok)
                resolve(response.json());
            else {
                // analyze the cause of error
                response.json()
                    .then((obj) => { reject(obj); }) // error message in the response body
                    .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
            }
        }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
    });
}

function addHike(hike) {
    // call: POST /api/newHike
    return new Promise((resolve, reject) => {
        fetch(new URL('newHike', APIURL), {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ label: hike.label, length: hike.length, expTime: hike.expTime, ascent: hike.ascent, difficulty: hike.difficulty, description: hike.description, province: hike.province, municipality: hike.municipality }),

        }).then((response) => {
            if (response.ok)
                resolve(null);
            else {
                // analyze the cause of error
                response.json()
                    .then((message) => { reject(message); }) // error message in the response body
                    .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
            }
        }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
    });
}

function addParkingLot(pl) {
    // call: POST /api/newParkingLot
    return new Promise((resolve, reject) => {
        fetch(new URL('newParkingLot', APIURL), {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },

            body: JSON.stringify({
                label: pl.label, description: pl.description, state: pl.state, region: pl.region, province: pl.province,
                municipality: pl.municipality, lat: pl.lat, lon: pl.lon, altitude: pl.altitude,
                total: pl.total, occupied: pl.occupied
            }),

        }).then((response) => {
            if (response.ok)
                resolve(response.json());
            else {
                // analyze the cause of error
                response.json()
                    .then((message) => { reject(message); }) // error message in the response body
                    .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
            }
        }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
    });
}

function uploadParkingLotImage(parkingLotID, image) {

    const parkingLotData = new FormData();
    parkingLotData.append('parkingLotID', parkingLotID);
    parkingLotData.append('file', image);

    // call: PUT /api/uploadParkingLotImage/:id
    return new Promise((resolve, reject) => {
        fetch(new URL('uploadParkingLotImage/' + parkingLotID, APIURL), {
            method: 'PUT',
            credentials: 'include',
            body: parkingLotData
        }).then((response) => {
            if (response.ok)
                resolve(null);
            else {
                // analyze the cause of error
                response.json()
                    .then((obj) => { reject(obj); }) // error message in the response body
                    .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
            }
        }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
    });

}

function addHut(hut) {
    // call: POST /api/addHut
    return new Promise((resolve, reject) => {
        fetch(new URL('addHut', APIURL), {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },

            body: JSON.stringify({
                name: hut.name,
                description: hut.description,
                lat: hut.lat,
                lon: hut.lon,
                altitude: hut.altitude,
                beds: hut.beds,
                state: hut.state,
                region: hut.region,
                province: hut.province,
                municipality: hut.municipality,
                email: hut.email,
                phone: hut.phone,
                website: hut.website
            }),

        }).then((response) => {
            if (response.ok)
                resolve(response.json());
            else {
                // analyze the cause of error
                response.json()
                    .then((message) => { reject(message); }) // error message in the response body
                    .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
            }
        }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
    });
}

function updateHike(hike) {

    const dataHike = new FormData();
    dataHike.append('hikeID', hike.id);
    dataHike.append('label', hike.label);
    dataHike.append('length', hike.length);
    dataHike.append('expTime', hike.expTime);
    dataHike.append('ascent', hike.ascent);
    dataHike.append('difficulty', hike.difficulty);
    dataHike.append('description', hike.description);
    dataHike.append('state', hike.state);
    dataHike.append('region', hike.region);
    dataHike.append('province', hike.province);
    dataHike.append('municipality', hike.municipality);
    dataHike.append('file', hike.image);

    // call: PUT /api/updateHike/:id
    return new Promise((resolve, reject) => {
        fetch(new URL('updateHike/' + hike.id, APIURL), {
            method: 'PUT',
            credentials: 'include',
            body: dataHike
        }).then((response) => {
            if (response.ok)
                resolve(null);
            else {
                // analyze the cause of error
                response.json()
                    .then((obj) => { reject(obj); }) // error message in the response body
                    .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
            }
        }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
    });
}

function updateParkingLot(pl) {

    const dataParkingLot = new FormData();
    dataParkingLot.append('parkingLotID', pl.id);
    dataParkingLot.append('label', pl.label);
    dataParkingLot.append('description', pl.description);
    dataParkingLot.append('lat', pl.lat);
    dataParkingLot.append('lon', pl.lon);
    dataParkingLot.append('altitude', pl.altitude);
    dataParkingLot.append('state', pl.state);
    dataParkingLot.append('region', pl.region);
    dataParkingLot.append('province', pl.province);
    dataParkingLot.append('municipality', pl.municipality);
    dataParkingLot.append('total', pl.total);
    dataParkingLot.append('occupied', pl.occupied);
    dataParkingLot.append('file', pl.image);

    // call: PUT /api/parkingLots/:id
    return new Promise((resolve, reject) => {
        fetch(new URL('parkingLots/' + pl.id, APIURL), {
            method: 'PUT',
            credentials: 'include',
            body: dataParkingLot
        }).then((response) => {
            if (response.ok)
                resolve(null);
            else {
                // analyze the cause of error
                response.json()
                    .then((obj) => { reject(obj); }) // error message in the response body
                    .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
            }
        }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
    });
}

function updateHut(hut) {

    const dataHut = new FormData();
    dataHut.append('hutID', hut.id);
    dataHut.append('name', hut.name);
    dataHut.append('description', hut.description);
    dataHut.append('lat', hut.lat);
    dataHut.append('lon', hut.lon);
    dataHut.append('altitude', hut.altitude);
    dataHut.append('beds', hut.beds);
    dataHut.append('state', hut.state);
    dataHut.append('region', hut.region);
    dataHut.append('province', hut.province);
    dataHut.append('municipality', hut.municipality);
    dataHut.append('file', hut.image);
    dataHut.append('email', hut.email);
    dataHut.append('phone', hut.phone);
    dataHut.append('website', hut.website);

    // call: PUT /api/updateHut/:id
    return new Promise((resolve, reject) => {
        fetch(new URL('updateHut/' + hut.id, APIURL), {
            method: 'PUT',
            credentials: 'include',
            body: dataHut
        }).then((response) => {
            if (response.ok)
                resolve(null);
            else {
                // analyze the cause of error
                response.json()
                    .then((obj) => { reject(obj); }) // error message in the response body
                    .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
            }
        }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
    });
}

function uploadHutImage(hutID, image) {

    const dataHut = new FormData();
    dataHut.append('hutID', hutID);
    dataHut.append('file', image);

    // call: PUT /api/uploadHutImage/:id
    return new Promise((resolve, reject) => {
        fetch(new URL('uploadHutImage/' + hutID, APIURL), {
            method: 'PUT',
            credentials: 'include',
            body: dataHut
        }).then((response) => {
            if (response.ok)
                resolve(null);
            else {
                // analyze the cause of error
                response.json()
                    .then((obj) => { reject(obj); }) // error message in the response body
                    .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
            }
        }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
    });
}



//Set new Reference point

function setNewReferencePoint(pointID) {


    // call: PUT /api/newReferencePoint/:id
    return new Promise((resolve, reject) => {
        fetch(new URL('newReferencePoint/' + pointID, APIURL), {
            method: 'PUT',
            credentials: 'include',
            body: null
        }).then((response) => {
            if (response.ok)
                resolve(null);
            else {
                // analyze the cause of error
                response.json()
                    .then((obj) => { reject(obj); }) // error message in the response body
                    .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
            }
        }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
    });
}


// Clear a Reference point
function clearReferencePoint(pointID) {


    // call: PUT /api/newReferencePoint/:id
    return new Promise((resolve, reject) => {
        fetch(new URL('clearReferencePoint/' + pointID, APIURL), {
            method: 'PUT',
            credentials: 'include',
            body: null
        }).then((response) => {
            if (response.ok)
                resolve(null);
            else {
                // analyze the cause of error
                response.json()
                    .then((obj) => { reject(obj); }) // error message in the response body
                    .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
            }
        }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
    });
}



async function getHikes() {
    // call /api/hikes
    const response = await fetch(new URL('hikes', APIURL));
    const hikes = await response.json();
    if (response.ok)
        return hikes.map((h) => ({
            id: h.id,
            label: h.label,
            length: h.length,
            expTime: h.expTime,
            ascent: h.ascent,
            difficulty: h.difficulty,
            description: h.description,
            state: h.state,
            region: h.region,
            province: h.province,
            municipality: h.municipality,
            startPoint: h.startPoint,
            author: h.author,
            authorId: h.authorId
        }))
    else throw hikes;
}

async function getParkingLots() {
    // call /api/parkingLots
    const response = await fetch(new URL('parkingLots', APIURL));
    const pls = await response.json();
    if (response.ok)
        return pls.map((pl) => ({
            id: pl.id, label: pl.label,
            description: pl.description, state: pl.state, region: pl.region, province: pl.province, municipality: pl.municipality,
            lat: pl.lat, lon: pl.lon, altitude: pl.altitude,
            total: pl.total, occupied: pl.occupied, author: pl.author,authorId: pl.authorId
        }))
    else throw pls;
}

async function getHuts() {
    // call /api/huts
    const response = await fetch(new URL('huts', APIURL));
    const huts = await response.json();
    if (response.ok)
        return huts.map((h) => ({
            id: h.id,
            name: h.hutName,
            description: h.hutDescription,
            lat: h.lat,
            lon: h.lon,
            altitude: h.altitude,
            beds: h.beds,
            state: h.state,
            region: h.region,
            province: h.province,
            municipality: h.municipality,
            author: h.author,
            authorId: h.authorId,
            email: h.email,
            phone: h.phone,
            website: h.website
        }))
    else throw huts;
}

async function getHut(id) {
    // call /api/hut/:id
    const response = await fetch(new URL('hut/' + id, APIURL));
    const hut = await response.json();
    if (response.ok)
        return ({
            id: hut.id,
            name: hut.hutName,
            description: hut.hutDescription,
            lat: hut.lat,
            lon: hut.lon,
            altitude: hut.altitude,
            beds: hut.beds,
            state: hut.state,
            region: hut.region,
            province: hut.province,
            municipality: hut.municipality,
            author: hut.author,
            authorId: hut.authorId,
            email: hut.email,
            phone: hut.phone,
            website: hut.website
        });
    else throw hut;
}

async function getHikesRefPoints() {
    //this api can be used for the hikes filtering, as the ref points are taken from the points table, so all of them are associated with an hike
    // call:  GET /api/hikesrefpoints
    const response = await fetch(new URL('hikesrefpoints', APIURL));
    const refpoints = await response.json();
    if (response.ok)
        return refpoints.map((u) => ({ id: u.id, hikeId: u.hikeId, label: u.label, lat: u.lat, lon: u.lon }))
    else throw refpoints;
}

async function getStartPoint() {
    // call /api/startPoint
    const response = await fetch(new URL('startPoint', APIURL));
    const startPoints = await response.json();
    if (response.ok)
        return startPoints;
    else throw startPoints;
}

async function getEndPoint() {
    // call /api/endPoint
    const response = await fetch(new URL('endPoint', APIURL));
    const endPoints = await response.json();
    if (response.ok)
        return endPoints;
    else throw endPoints;
}

async function getReferencePoint() {
    // call /api/referencePoint
    const response = await fetch(new URL('referencePoint', APIURL));
    const referencePoint = await response.json();
    if (response.ok)
        return referencePoint;
    else throw referencePoint;
}

function AddPoint(point) {
    // call: POST /api/addPoint


    return new Promise((resolve, reject) => {
        fetch(new URL('addPoint', APIURL), {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                hikeID: point.hikeID,
                lat: point.lat,
                lon: point.lon,
                altitude: point.altitude,
                SP: point.SP,
                EP: point.EP,
                RP: point.RP,
                label: point.label,
                hutID: point.hutID,
                parkingID: point.parkingID
            }),
        }).then((response) => {
            if (response.ok)
                resolve(null);
            else {
                // analyze the cause of error
                response.json()
                    .then((message) => { reject(message); }) // error message in the response body
                    .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
            }
        }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
    });
}


async function getHike(id) {
    // call /api/hike
    const response = await fetch(new URL('hike/' + id, APIURL));
    const hike = await response.json();
    if (response.ok)
        return ({
            id: hike.id,
            label: hike.label,
            length: hike.length,
            expTime: hike.expTime,
            ascent: hike.ascent,
            difficulty: hike.difficulty,
            description: hike.description,
            state: hike.state,
            region: hike.region,
            province: hike.province,
            municipality: hike.municipality,
            points: hike.points,
            author: hike.author
        });
    else throw hike;
}

function deleteHike(id) {
    // call: DELETE /api/hikes/:id
    return new Promise((resolve, reject) => {
        fetch(new URL('hikes/' + id, APIURL), {
            method: 'DELETE',
            credentials: 'include'
        }).then((response) => {
            if (response.ok)
                resolve(null);
            else {
                // analyze the cause of error
                response.json()
                    .then((message) => { reject(message); }) // error message in the response body
                    .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
            }
        }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
    });
}

function deleteParkingLot(id) {
    // call: DELETE /api/parkingLots/:id
    return new Promise((resolve, reject) => {
        fetch(new URL('parkingLots/' + id, APIURL), {
            method: 'DELETE',
            credentials: 'include'
        }).then((response) => {
            if (response.ok)
                resolve(null);
            else {
                // analyze the cause of error
                response.json()
                    .then((message) => { reject(message); }) // error message in the response body
                    .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
            }
        }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
    });
}

function deletHut(id) {
    // call: DELETE /api/huts/:id
    return new Promise((resolve, reject) => {
        fetch(new URL('huts/' + id, APIURL), {
            method: 'DELETE',
            credentials: 'include'
        }).then((response) => {
            if (response.ok)
                resolve(null);
            else {
                // analyze the cause of error
                response.json()
                    .then((message) => { reject(message); }) // error message in the response body
                    .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
            }
        }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
    });
}

function startHike(hikeID, startTime) {
    // call: POST /api/trackedHikes/:hikeID
    return new Promise((resolve, reject) => {
        fetch(new URL('trackedHikes/' + hikeID, APIURL), {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },

            body: JSON.stringify({ startTime }),

        }).then((response) => {
            if (response.ok)
                resolve();
            else {
                // analyze the cause of error
                response.json()
                    .then((message) => { reject(message); }) // error message in the response body
                    .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
            }
        }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
    });
}

async function getTrackedHikesByHikeIDAndUserID(hikeID) {
    // call /api/trackedHikes/:hikeID
    const response = await fetch(new URL('trackedHikes/' + hikeID, APIURL), { credentials: 'include' });
    const trackedHikes = await response.json();
    if (response.ok)
        return trackedHikes.map((th) => ({
            id: th.id,
            hikeID: th.hikeID,
            hikeLabel: th.hikeLabel,
            status: th.status,
            progress: th.progress,
            startTime: th.startTime,
            endTime: th.endTime,
            pointsReached: th.pointsReached
        }))
    else throw trackedHikes;
}

async function getTrackedHikesByUserID() {
    // call /api/trackedHikes/
    const response = await fetch(new URL('trackedHikes', APIURL), { credentials: 'include' });
    const trackedHikes = await response.json();
    if (response.ok)
        return trackedHikes.map((th) => ({
            id: th.id,
            hikeID: th.hikeID,
            hikeLabel: th.hikeLabel,
            status: th.status,
            progress: th.progress,
            startTime: th.startTime,
            endTime: th.endTime,
            pointsReached: th.pointsReached
        }))
    else throw trackedHikes;
}

function recordReferencePointReached(trackedHikeID, pointID, time) {
    // call: POST /api/trackedHikes/:trackedHikeID/refPoints/:pointID
    return new Promise((resolve, reject) => {
        fetch(new URL('trackedHikes/' + trackedHikeID + '/refPoints/' + pointID, APIURL), {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },

            body: JSON.stringify({ time }),

        }).then((response) => {
            if (response.ok)
                resolve();
            else {
                // analyze the cause of error
                response.json()
                    .then((message) => { reject(message); }) // error message in the response body
                    .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
            }
        }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
    });
}

function terminateHike(trackedHikeID, endTime) {
    // call: PUT /api/trackedHikes/:id
    return new Promise((resolve, reject) => {
        fetch(new URL('trackedHikes/' + trackedHikeID, APIURL), {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },

            body: JSON.stringify({ endTime }),

        }).then((response) => {
            if (response.ok)
                resolve();
            else {
                // analyze the cause of error
                response.json()
                    .then((message) => { reject(message); }) // error message in the response body
                    .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
            }
        }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
    });
}

function cancelHike(trackedHikeID) {
    // call: DELETE /api/trackedHikes/:id
    return new Promise((resolve, reject) => {
        fetch(new URL('trackedHikes/' + trackedHikeID, APIURL), {
            method: 'DELETE',
            credentials: 'include'
        }).then((response) => {
            if (response.ok)
                resolve(null);
            else {
                // analyze the cause of error
                response.json()
                    .then((message) => { reject(message); }) // error message in the response body
                    .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
            }
        }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
    });
}

function stopHike(trackedHikeID, stopTime) {
    // call: PATCH /api/trackedHikes/:id
    return new Promise((resolve, reject) => {
        fetch(new URL('trackedHikes/' + trackedHikeID, APIURL), {
            method: 'PATCH',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },

            body: JSON.stringify({ stopTime }),

        }).then((response) => {
            if (response.ok)
                resolve();
            else {
                // analyze the cause of error
                response.json()
                    .then((message) => { reject(message); }) // error message in the response body
                    .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
            }
        }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
    });
}

function addWeatherAlert(weatherAlert) {
    // call: POST /api/newWeatherAlert
    return new Promise((resolve, reject) => {
        fetch(new URL('newWeatherAlert', APIURL), {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                type: weatherAlert.type,
                radius: weatherAlert.radius,
                lat: weatherAlert.lat,
                lon: weatherAlert.lon,
                time: weatherAlert.time,
                description: weatherAlert.description
            })
        }).then((response) => {
            if (response.ok)
                resolve(response.json());
            else {
                // analyze the cause of error
                response.json()
                    .then((message) => { reject(message); }) // error message in the response body
                    .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
            }
        }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
    });
}

async function getWeatherAlerts() {
    // call /api/weatherAlert
    const response = await fetch(new URL('weatherAlert', APIURL));
    const weatherAlerts = await response.json();
    if (response.ok)
        return weatherAlerts.map((w) => ({
            weatherAlertID: w.weatherAlertID,
            type: w.type,
            radius: w.radius,
            lat: w.lat,
            lon: w.lon,
            time: w.time,
            description: w.description
        }))
    else throw weatherAlerts;
}

function deleteWeatherAlert(id) {
    // call: DELETE /api/weatherAlert/:id
    return new Promise((resolve, reject) => {
        fetch(new URL('weatherAlert/' + id, APIURL), {
            method: 'DELETE',
            credentials: 'include'
        }).then((response) => {
            if (response.ok)
                resolve(null);
            else {
                // analyze the cause of error
                response.json()
                    .then((message) => { reject(message); }) // error message in the response body
                    .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
            }
        }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
    });
}

async function getLinkedHuts() {
    // this api can be used for get all linked huts
    // call:  GET /api/linkedHut
    const response = await fetch(new URL('linkedHut/', APIURL));
    const linkedHuts = await response.json();
    if (response.ok)
        return linkedHuts.map((u) => ({ 
            pointID: u.pointID, 
            hikeID: u.hikeID,
            lat: u.lat, 
            lon: u.lon,
            altitude: u.altitude,
            label: u.label,
            hutID: u.hutID 
        }))
    else throw linkedHuts;
}

function addHikeCondition(hikeCondition) {
    // call: POST /api/newHikeCondition
    return new Promise((resolve, reject) => {
        fetch(new URL('newHikeCondition', APIURL), {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                hikeID: hikeCondition.hikeID,
                hutID: hikeCondition.hutID,
                typeCondition: hikeCondition.typeCondition,
                description: hikeCondition.description
            })
        }).then((response) => {
            if (response.ok)
                resolve(response.json());
            else {
                // analyze the cause of error
                response.json()
                    .then((message) => { reject(message); }) // error message in the response body
                    .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
            }
        }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
    });
}

async function getHikeConditions() {
    // call /api/hikeCondition
    const response = await fetch(new URL('hikeCondition', APIURL));
    const hikeConditions = await response.json();
    if (response.ok)
        return hikeConditions.map((w) => ({
            conditionID: w.conditionID,
            hikeID: w.hikeID,
            hutID: w.hutID,
            typeCondition: w.typeCondition,
            description: w.description
        }))
    else throw hikeConditions;
}

function deleteHikeCondition(id) {
    // call: DELETE /api/hikeCondition/:id
    return new Promise((resolve, reject) => {
        fetch(new URL('hikeCondition/' + id, APIURL), {
            method: 'DELETE',
            credentials: 'include'
        }).then((response) => {
            if (response.ok)
                resolve(null);
            else {
                // analyze the cause of error
                response.json()
                    .then((message) => { reject(message); }) // error message in the response body
                    .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
            }
        }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
    });
}

async function getUserStats() {
    // call /api/trackedHikes/
    const response = await fetch(new URL('userStats', APIURL), { credentials: 'include' });
    const userStats = await response.json();
    if (response.ok)
        return ({
            userID: userStats.userID,
            hikesFinished: userStats.hikesFinished,
            walkedLength: userStats.walkedLength,
            totalHikeTime: userStats.totalHikeTime,
            totalAscent: userStats.totalAscent,
            highestAltitude: userStats.highestAltitude,
            highestAltitudeRange: userStats.highestAltitudeRange,
            longestHikeByKmID: userStats.longestHikeByKmID,
            longestHikeByKmLength: userStats.longestHikeByKmLength,
            longestHikeByHoursID: userStats.longestHikeByHoursID,
            longestHikeByHoursTime: userStats.longestHikeByHoursTime,
            shortestHikeByKmID: userStats.shortestHikeByKmID,
            shortestHikeByKmLength: userStats.shortestHikeByKmLength,
            shortestHikeByHoursID: userStats.shortestHikeByHoursID,
            shortestHikeByHoursTime: userStats.shortestHikeByHoursTime,
            fastestPacedHikeID: userStats.fastestPacedHikeID,
            fastestPacedHikePace: userStats.fastestPacedHikePace
        });
    else throw userStats;
}
async function getUserPreferences(id) {
    // call /api/userPreferences/:id
    const response = await fetch(new URL('userPreferences/' + id, APIURL), { credentials: 'include' });
    const userPreferences = await response.json();
    if (response.ok)
        return (userPreferences);
    else throw getUserPreferences;
    }

function addUserPreferences(userPreferences) {

    // call: POST /api/userPrefernces
    return new Promise((resolve, reject) => {
        fetch(new URL('userPreferences', APIURL), {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                minLength:userPreferences.minLength,
                maxLength: userPreferences.maxLength,
                minAscent: userPreferences.minAscent,
                maxAscent: userPreferences.maxAscent,
                minTime: userPreferences.minTime,
                maxTime: userPreferences.maxTime,
                difficulty: userPreferences.difficulty,
                state: userPreferences.state,
                region: userPreferences.region,
                province: userPreferences.province,
                municipality: userPreferences.municipality,
                radius: userPreferences.radius,
                latitude: userPreferences.latitude,
                longitude: userPreferences.longitude

            })
        }).then((response) => {
            if (response.ok)
                resolve(response.json());
            else {
                // analyze the cause of error
                response.json()
                    .then((message) => { reject(message); }) // error message in the response body
                    .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
            }
        }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
    });
}


function updateUserPreferencesRadius(userPreferences) {
    // call: PUT /api/userPreferencesRadius/
    return new Promise((resolve, reject) => {
        fetch(new URL('userPreferencesRadius/' , APIURL), {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                radius: userPreferences.radius,
                latitude: userPreferences.latitude,
                longitude: userPreferences.longitude
            })
        }).then((response) => {
            if (response.ok)
                resolve(null);
            else {
                // analyze the cause of error
                response.json()
                    .then((obj) => { reject(obj); }) // error message in the response body
                    .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
            }
        }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
    });
}


function updateUserPreferencesLength(userPreferences) {

        // call: PUT /api/userPreferencesLength/
        return new Promise((resolve, reject) => {
            fetch(new URL('userPreferencesLength/' , APIURL), {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    minLength: userPreferences.minLength,
                    maxLength: userPreferences.maxLength
                })
            }).then((response) => {
                if (response.ok)
                    resolve(null);
                else {
                    // analyze the cause of error
                    response.json()
                        .then((obj) => { reject(obj); }) // error message in the response body
                        .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
                }
            }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
        });
    }
    
    function updateUserPreferencesAscent(userPreferences) {
            // call: PUT /api/userPreferencesAscent/
            return new Promise((resolve, reject) => {
                fetch(new URL('userPreferencesAscent/' , APIURL), {
                    method: 'PUT',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        minAscent: userPreferences.minAscent,
                        maxAscent: userPreferences.maxAscent
                    })
                }).then((response) => {
                    if (response.ok)
                        resolve(null);
                    else {
                        // analyze the cause of error
                        response.json()
                            .then((obj) => { reject(obj); }) // error message in the response body
                            .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
                    }
                }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
            });
        }

     function updateUserPreferencesTime(userPreferences) {
    // call: PUT /api/userPreferencesTime/
    return new Promise((resolve, reject) => {
        fetch(new URL('userPreferencesTime/' , APIURL), {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                minTime: userPreferences.minTime,
                maxTime: userPreferences.maxTime
            })
        }).then((response) => {
            if (response.ok)
                resolve(null);
            else {
                // analyze the cause of error
                response.json()
                    .then((obj) => { reject(obj); }) // error message in the response body
                    .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
            }
        }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
    });
}

function updateUserPreferencesDifficulty(userPreferences) {
    // call: PUT /api/userPreferencesDifficulty/
    return new Promise((resolve, reject) => {
        fetch(new URL('userPreferencesDifficulty/' , APIURL), {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                difficulty: userPreferences.difficulty
            })
        }).then((response) => {
            if (response.ok)
                resolve(null);
            else {
                // analyze the cause of error
                response.json()
                    .then((obj) => { reject(obj); }) // error message in the response body
                    .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
            }
        }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
    });
}

function updateUserPreferencesLocation(userPreferences) {
    // call: PUT /api/userPreferencesLocation/
    return new Promise((resolve, reject) => {
        fetch(new URL('userPreferencesLocation/' , APIURL), {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                state: userPreferences.state,
                region: userPreferences.region,
                province: userPreferences.province,
                municipality: userPreferences.municipality
            })
        }).then((response) => {
            if (response.ok)
                resolve(null);
            else {
                // analyze the cause of error
                response.json()
                    .then((obj) => { reject(obj); }) // error message in the response body
                    .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
            }
        }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
    });
}


        
        






async function signup(credentials) {
    let response = await fetch(new URL('signup', APIURL), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
    });
    if (response.ok) {
        const user = await response.json();
        return user;
    } else {
        const errDetail = await response.json();
        throw errDetail.message;
    }
}

async function verifyEmail(emailConfirmationToken) {
    return new Promise(async (resolve, reject) => {
        let response = await fetch(new URL('verify-email', APIURL), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ emailConfirmationToken: emailConfirmationToken }),
        });
        if (response.ok)
            resolve(null);
        else {
            const errDetail = await response.json();
            reject(errDetail.message);
        }
    })
}

async function login(credentials) {
    let response = await fetch(new URL('sessions', APIURL), {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
    });
    if (response.ok) {
        const user = await response.json();
        return user;
    } else {
        const errDetail = await response.json();
        throw errDetail.message;
    }
}

async function logout() {
    await fetch(new URL('sessions/current', APIURL), { method: 'DELETE', credentials: 'include' });
}

async function getUserInfo() {
    const response = await fetch(new URL('sessions/current', APIURL), { credentials: 'include' });
    const userInfo = await response.json();
    if (response.ok)
        return userInfo;
    else throw userInfo;  // an object with the error coming from the server
}

async function getUserAccessRight() {
    const response = await fetch(new URL('sessions/current/access-right', APIURL), { credentials: 'include' });
    const accessRight = await response.json();
    if (response.ok)
        return accessRight;
    else throw accessRight;  // an object with the error coming from the server
}

// external APIs
async function reverseNominatim(latitude, longitude) {
    const response = await fetch(new URL(`https://nominatim.openstreetmap.org/reverse?format=json&accept-language=en&zoom=10&lat=${latitude}&lon=${longitude}`));
    const reverseNom = await response.json();
    if (response.ok)
        return reverseNom;
    else throw reverseNom;
}

const API = {
    addGPXTrack, addParkingLot, AddPoint, deleteParkingLot, updateParkingLot, deleteHike, getHikes, getParkingLots, addHut, updateHut, uploadHutImage,
    uploadParkingLotImage, getHuts, getHut, deletHut, getHike, addHike, updateHike, signup, verifyEmail, login, logout, getUserInfo, getUserAccessRight, getHikesRefPoints,
    getStartPoint, getEndPoint, getReferencePoint, reverseNominatim, setNewReferencePoint, clearReferencePoint, startHike, getTrackedHikesByHikeIDAndUserID,
    getTrackedHikesByUserID, recordReferencePointReached, terminateHike, cancelHike, stopHike, getUserStats, addWeatherAlert, getWeatherAlerts, deleteWeatherAlert, getLinkedHuts,
    addHikeCondition, getHikeConditions, deleteHikeCondition, getUserPreferences, addUserPreferences,
    updateUserPreferencesRadius,updateUserPreferencesLength,updateUserPreferencesAscent,updateUserPreferencesTime,updateUserPreferencesDifficulty,updateUserPreferencesLocation
};
export default API;