'use strict';

/* Data Access Object (DAO) module for accessing riddles and answers */

const sqlite = require('sqlite3');

// open the database
const db = new sqlite.Database('hike_tracker.db', (err) => {
	if (err) throw err;
});
exports.addGPXTrack = (trackName, pointsArray) => {
	return new Promise((resolve, reject) => {
		const sql = 'INSERT INTO CLIENT(name, idTicket, serviceType) VALUES(?, ?, ?)'
		db.run(sql, [nameClient, idTicket, idService], function (err) {  
		  if (err) {
			reject(err);
			return;
		  }
		  resolve(idTicket);
		});







		
	  });
}