
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

function addHike(hike) {
	// call: POST /api/newHike
  return new Promise((resolve, reject) => {
	  fetch(new URL('newHike', APIURL), {
		method: 'POST',
		credentials: 'include',
		headers: {
		  'Content-Type': 'application/json',
		},
		body: JSON.stringify({label:hike.label,length:hike.length,expTime:hike.expTime,ascent:hike.ascent,difficulty:hike.difficulty,description:hike.description }),
	  
	  }).then((response) => {
		if (response.ok) {
		  resolve(null);
		} else {
		  // analyze the cause of error
		  response.json()
			.then((message) => { reject(message); }) // error message in the response body
			.catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
		}
	  }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
	});
}

function updateHike(hike) {
	// call: PUT /api/updateHike
	return new Promise((resolve, reject) => {
	  fetch(new URL('updateHike', APIURL), {
		method: 'PUT',
		credentials: 'include',
		headers: {
		  'Content-Type': 'application/json',
		},
		body: JSON.stringify(hike),
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


async function getHikes() {
	// call /api/gethikes
	const response = await fetch(new URL('hikes', APIURL));
		const hikes = await response.json();
		if (response.ok) {
			return hikes.map((u) => ({ id: u.id, label: u.label, length: u.length, expTime:u.expTime,ascent:u.ascent,difficulty:u.difficulty,description:u.description }))
		} else {
			throw hikes;
		}
}

function deleteHike(id) {
	// call: DELETE /api/hikes
	console.log(id);
	return new Promise((resolve, reject) => {
	  fetch(new URL(`hikes`, APIURL), {
		method: 'DELETE',
		credentials: 'include',
		headers: {
		  'Content-Type': 'application/json',
		},
		body: JSON.stringify({id:id}),
	  }).then((response) => {
		if (response.ok) {
		  resolve(null);
		} else {
		  // analyze the cause of error
		  response.json()
			.then((message) => { reject(message); }) // error message in the response body
			.catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
		}
	  }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
	});
}


const API={addGPXTrack,deleteHike,getHikes,addHike,updateHike};
export default API;

