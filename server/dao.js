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


exports.getHikes = () => {
	return new Promise((resolve, reject) => {
	  const sql = 'SELECT * FROM HIKES';
	  db.all(sql, [], (err, rows) => {
		if (err) {
		  reject(err);
		  return;
		}
		const hikes = rows.map((h) => ({ id: h.HikeID, label: h.Label, length: h.Length,expTime: h.ExpTime,ascent: h.Ascent,difficulty: h.Difficulty, description: h.Description  }));
		resolve(hikes);
	  });
	});
}

exports.getHike = (hikeID) => {
	return new Promise((resolve, reject) => {
	  const sql = 'SELECT * FROM HIKES WHERE HikeID	=?';
	  db.all(sql,  [hikeID], (err, rows) => {
		if (err) {
		  reject(err);
		  return;
		}
		else{
			if (rows.length === 0){
                resolve(undefined);
			}
			else {
				const hike = rows.map((h) => ({ id: h.HikeID, label: h.Label, length: h.Length,expTime: h.ExpTime,ascent: h.Ascent,difficulty: h.Difficulty, description: h.Description  }));
				resolve(hike);
			}
		}
	  });
	});
}	

exports.deleteHike = (hikeID) => {
	return new Promise((resolve, reject) => {
		db.run("DELETE FROM HIKES WHERE HikeID	=?", [hikeID], (err) => {
			if (err) {
				reject(err);
			} else {
				resolve(null);
			}
		});
	});
};

exports.deleteAllHikes = () => {
	return new Promise((resolve, reject) => {
		const sql = 'DELETE FROM Hikes';
		db.all(sql, [], (err, rows) => {
		  if (err) {
			reject(err);
			return;
		  }
		  resolve();
		});
	  });
}

exports.newHike = (label,length,expTime,ascent,difficulty,description) => {
	return new Promise((resolve, reject) => {
		const sql = 'INSERT INTO HIKES(label,length,expTime,ascent,difficulty,description) VALUES(?, ?,?,?,?,?)'
		db.run(sql, [label,length,expTime,ascent,difficulty,description], function (err) {  
		  if (err) {
			console.log(err);
			reject(err);
			return;
		  }
		  resolve();
		});
	  });
}

exports.updateHike = (label,length,expTime,ascent,difficulty,description,hikeId) => {
	return new Promise((resolve, reject) => {
		const sql = 'UPDATE HIKES SET label=?, length=?,expTime=?,ascent=?,difficulty=?,description=?   WHERE HikeId=?'
		db.run(sql, [label,length,expTime,ascent,difficulty,description,hikeId], function (err) {  
		  if (err) {
			reject(err);
			return;
		  }
		  resolve();
		});
	  });
}
