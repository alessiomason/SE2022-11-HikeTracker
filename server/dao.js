'use strict';

/* Data Access Object (DAO) module for accessing riddles and answers */

const sqlite = require('sqlite3');

// open the database
const db = new sqlite.Database('hike_tracker.db', (err) => {
	if (err) throw err;
});
exports.addPoint = (lat,lon,elevation) => {
	return new Promise((resolve, reject) => {
		const sql = 'INSERT INTO Points(Lat, Lon, Elevation) VALUES(?, ?, ?)'
		db.run(sql, [lat, lon, elevation], function (err) {  
		  if (err) {
			reject(err);
			return;
		  }
		  resolve(idTicket);
		});		
	  });
}

exports.addHike= (trackName, len,time,ascent,diff,description) => {
	return new Promise((resolve, reject) => {
		const sql = 'INSERT INTO Hikes(Label, Lenght, ExpTime,Ascent,Difficulty,Description) VALUES(?, ?, ?, ?, ?, ?)'
		db.run(sql, [trackName, len,time,ascent,diff,description], function (err) {  
		  if (err) {
			reject(err);
			return;
		  }
		  resolve(idTicket);
		});







		
	  });
}