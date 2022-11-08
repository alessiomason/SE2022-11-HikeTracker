
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
            if (response.ok) {
                resolve(null);
            } else {
                // analyze the cause of error
                response.json()
                    .then((obj) => { reject(obj); }) // error message in the response body
                    .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
            }
        }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
    });
}

const API={addGPXTrack};
export default API;
