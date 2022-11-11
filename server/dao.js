'use strict';

/* Data Access Object (DAO) module for accessing riddles and answers */

const sqlite = require('sqlite3');

// open the database
const db = new sqlite.Database('hike_tracker.db', (err) => {
	if (err) throw err;
});
exports.addPoint = (hikeID,lat,lon) => {
	return new Promise((resolve, reject) => {
		const sql = 'INSERT INTO Points(HikeID,Lat,Lon) VALUES(?, ?, ?)'
		db.run(sql, [hikeID,lat, lon], function (err) {  
		  if (err) {
			reject(err);
			return;
		  }
		  resolve();
		});		
	  });
}

exports.addHike= (trackName, len,time,ascent,diff,description) => {
	return new Promise((resolve, reject) => {
		const sql = 'INSERT INTO Hikes(Label, Length, ExpTime,Ascent,Difficulty,Description) VALUES(?, ?, ?, ?, ?, ?)'
		db.run(sql, [trackName, len,time,ascent,diff,description], function (err) {  
		  if (err) {
			reject(err);
			return;
		  }
		  resolve();
		});		
	  });

}

exports.getLastHikeID = () => {
	return new Promise((resolve, reject) => {
		const sql = 'SELECT * FROM Hikes ORDER BY HikeID DESC LIMIT 1';
		db.get(sql, [], (err, row) => {
			if (err) {
				reject(err);
				return;
			}
			let hike;
			if (row === undefined) {
				 hike = { id: 0}
			} else {
				 hike = { id: row.HikeID}
			}
			
			resolve(hike.id);
		});
	});
}
exports.getStartPointOfHike = (hikeID) => {
	return new Promise((resolve, reject) => {
		const sql = 'SELECT * FROM Points  WHERE HikeID=? ORDER BY PointID ASC LIMIT 1';
		db.get(sql, [hikeID], (err, row) => {
			if (err) {
				reject(err);
				return;
			}
			let point;
			if (row === undefined) {
				 point = { id: 0}
			} else {
				 point = { id: row.PointID}
			}
			
			resolve(point.id);
		});
	});
}
exports.getEndPointOfHike = (hikeID) => {
	return new Promise((resolve, reject) => {
		const sql = 'SELECT * FROM Points  WHERE HikeID=? ORDER BY PointID DESC LIMIT 1';
		db.get(sql, [hikeID], (err, row) => {
			if (err) {
				reject(err);
				return;
			}
			let point;
			if (row === undefined) {
				 point = { id: 0}
			} else {
				 point = { id: row.PointID}
			}
			
			resolve(point.id);
		});
	});
}