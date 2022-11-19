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

function addHike(hike) {
    // call: POST /api/newHike
    return new Promise((resolve, reject) => {
        fetch(new URL('newHike', APIURL), {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ label: hike.label, length: hike.length, expTime: hike.expTime, ascent: hike.ascent, difficulty: hike.difficulty, description: hike.description }),

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

function updateHike(hike) {
    // call: PUT /api/updateHike/:id
    return new Promise((resolve, reject) => {
        fetch(new URL('updateHike/' + hike.id, APIURL), {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(hike),
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
    // call /api/gethikes
    const response = await fetch(new URL('hikes', APIURL));
    const hikes = await response.json();
    if (response.ok)
        return hikes.map((u) => ({ id: u.id, label: u.label, length: u.length, expTime: u.expTime, ascent: u.ascent, difficulty: u.difficulty, description: u.description }))
    else throw hikes;
}
async function getHikesRefPoints() { 
    //this api can be used for the hikes filtering, as the ref points are taken from the points table, so all of them are associated with an hike
    // call:  GET /api/hikesrefpoints
    const response = await fetch(new URL('hikesrefpoints', APIURL));
    const refpoints = await response.json();
    if (response.ok)
        return refpoints.map((u) => ({ id: u.id, hikeId: u.hikeId,label: u.label, lat: u.lat, lon: u.lon }))
    else throw refpoints;
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

const API = { addGPXTrack, deleteHike, getHikes, addHike, updateHike, signup, verifyEmail, login, logout, getUserInfo, getUserAccessRight,getHikesRefPoints };
export default API;

