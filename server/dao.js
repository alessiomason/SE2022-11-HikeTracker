'use strict';

/* Data Access Object (DAO) module for accessing riddles and answers */

const sqlite = require('sqlite3');

// open the database
const db = new sqlite.Database('db/hike_tracker.db', (err) => {
    if (err) throw err;
});

exports.addPoint = (hikeID, lat, lon,alt,SP,EP,RP,label) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO Points(HikeID,Lat,Lon,Altitude,SP,EP,RP,Label) VALUES(?, ?,?, ?,?,?,?,?)'
        db.run(sql, [hikeID, lat, lon,alt,SP,EP,RP,label], function (err) {
            if (err) reject(err);
            resolve();
        });
    });
}

exports.deletePointsByHikeID = (hikeID) => {
    return new Promise((resolve, reject) => {
        db.run("DELETE FROM Points WHERE HikeID = ?", [hikeID], (err) => {
            if (err) reject(err);
            else resolve(null);
        });
    });
};

exports.deleteAllPoints = () => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM Points';
        db.all(sql, (err) => {
            if (err) reject(err);
            resolve();
        });
    });
}

exports.addHut = (hutName, hutDescription, lat, lon, altitude, beds, province, municipality) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO Huts(Name, Description, Lat, Lon, Altitude, Beds, Province, Municipality) VALUES(?, ?, ?, ?, ?, ?, ?, ?)'
        db.run(sql, [hutName, hutDescription, lat, lon, altitude, beds, province, municipality], function (err) {
            if (err) reject(err);
            resolve();
        });
    });

}

exports.getHuts = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM Huts';
        db.all(sql, [], (err, rows) => {
            if (err) reject(err);
            const huts = rows.map((h) => ({ 
                id: h.HutID, 
                hutName: h.Name,
                hutDescription: h.Description,
                lat: h.Lat,
                lon: h.Lon,
                altitude: h.Altitude,
                beds: h.Beds,
                province: h.Province,
                municipality: h.Municipality
            }));
            resolve(huts);
        });
    });
}


exports.deleteHut = (hutID) => {
    return new Promise((resolve, reject) => {
        db.run("DELETE FROM Huts WHERE HutID = ?", [hutID], (err) => {
            if (err) reject(err);
            else resolve(null);
        });
    });
};


exports.deleteAllHuts = () => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM Huts';
        db.all(sql, (err) => {
            if (err) reject(err);
            resolve();
        });
    });
}

exports.getHut = (hutID) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM Huts WHERE HutID = ?';
        db.all(sql, [hutID], (err, rows) => {
            if (err) reject(err);
            else {
                if (rows.length === 0) resolve(undefined);
                else {
                    const hut = rows.map((h) => ({id: h.HutID,
                                                  hutName: h.Name,
                                                  hutDescription: h.Description,
                                                  lat: h.Lat,
                                                  lon: h.Lon,
                                                  altitude: h.Altitude,
                                                  beds: h.Beds,
                                                  province: h.Province,
                                                  municipality: h.Municipality}));
                    resolve(hut);
                }
            }
        });
    });
}

exports.updateHut = (name, description, lat, lon, altitude, beds, province, municipality, id) => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE Huts SET Name=?, Description=?, Lat=?, Lon=?, Altitude= ?, Beds=?, Province=?, Municipality=? WHERE HutID=?'
        db.run(sql, [name, description, lat, lon, altitude, beds, province, municipality, id], function (err) {
            if (err) reject(err);
            resolve();
        });
    });
}


exports.addHike = (trackName, len, time, ascent, diff, description,province,municipality) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO Hikes(Label, Length, ExpTime,Ascent,Difficulty,Description,Province,Municipality) VALUES(?,?,?,?,?,?,?,?)'
        db.run(sql, [trackName, len, time, ascent, diff, description,province,municipality], function (err) {
            if (err) reject(err);
            resolve();
        });
    });

}

exports.getLastHikeID = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM Hikes ORDER BY HikeID DESC LIMIT 1';
        db.get(sql, [], (err, row) => {
            if (err) reject(err);
            let hike;
            if (row === undefined) hike = { id: 0 }
            else hike = { id: row.HikeID }

            resolve(hike.id);
        });
    });
}
exports.getStartPointOfHike = (hikeID) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM Points  WHERE HikeID=? and SP=?';
        db.get(sql, [hikeID,1], (err, row) => {
            if (err) reject(err);
            let point;
            if (row === undefined) point = { lat: null, lon: null ,alt: null}
            else point = { lat: row.Lat, lon: row.Lon,alt: row.Altitude }

            resolve(point);
        });
    });
}
exports.getEndPointOfHike = (hikeID) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM Points  WHERE HikeID=? and EP=?';
        db.get(sql, [hikeID,1], (err, row) => {
            if (err) reject(err);
            let point;
            if (row === undefined) point = { lat: null, lon: null ,alt: null}
            else point = { lat: row.Lat, lon: row.Lon,alt: row.Altitude }

            resolve(point);
        });
    });
}


exports.getHikes = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM HIKES';
        db.all(sql, [], (err, rows) => {
            if (err) reject(err);
            const hikes = rows.map((h) => ({ id: h.HikeID, label: h.Label, length: h.Length, expTime: h.ExpTime, ascent: h.Ascent, difficulty: h.Difficulty, description: h.Description, province: h.Province, municipality: h.Municipality }));
            resolve(hikes);
        });
    });
}

exports.getParkingLots = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM ParkingLots';
        db.all(sql, [], (err, rows) => {
            if (err) reject(err);
            const pls = rows.map((pl) => ({ id: pl.ParkingID, label: pl.Label, 
                description: pl.Description, province: pl.Province, municipality: pl.Municipality,
            lat: pl.Lat, lon: pl.Lon, altitude: pl.Altitude, total: pl.Total, occupied: pl.Occupied }));
            resolve(pls);
        });
    });
}


// get a specific parking lot
exports.getParkingById = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM PARKINGLOTS WHERE ParkingID = ?';
        db.all(sql, [id], (err, row) => {
            if (err) reject(err);
            const parking = row.map((p) => ({ parkingID: p.ParkingID, label: p.Label, province: p.Province, municipality: p.Municipality, description: p.Description, lat:p.Lat, lon:p.Lon, altitude:p.Altitude, total: p.Total, occupied: p.Occupied  }));
            resolve(parking);
        });
    });
}
//Add new parking lot
exports.addParking = (Label,Province,Municipality,Description,Lat,Lon,Altitude,Total, Occupied) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO PARKINGLOTS(Label, Province, Municipality, Description, Lat, Lon, Altitude,Total, Occupied) VALUES(?, ?, ?, ?,?,?,?,?,?)'
        db.run(sql, [Label, Province, Municipality, Description, Lat, Lon, Altitude,Total, Occupied], function (err) {
            if (err) reject(err);
            resolve();
        });
    });
}

// UPDATE parking lot
exports.updateParking = (Label,Province,Municipality,Description,Lat,Lon,Altitude,Total,Occupied,parkingID) => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE PARKINGLOTS SET Label=?, Province=?, Municipality=?,Description=?, Lat=?, Lon=?, Altitude=?, Total=?, Occupied=?   WHERE ParkingID=?'
        db.run(sql, [Label,Province,Municipality,Description,Lat,Lon,Altitude,Total,Occupied,parkingID], function (err) {
            if (err) reject(err);
            resolve();
        });
    });
}
//Delete parking lot
exports.deleteParking = (ParkingID) => {
    return new Promise((resolve, reject) => {
        db.run("DELETE FROM PARKINGLOTS WHERE ParkingID = ?", [ParkingID], (err) => {
            if (err) reject(err);
            else resolve(null);
        });
    });
};


exports.getHikesRefPoints = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM Points WHERE RF=?';
        db.all(sql, [1], (err, rows) => {
            if (err) reject(err);
            const refpoints = rows.map((r) => ({
                 id: r.PointID, hikeId: r.HikeID,label: r.Label, lat: r.Lat, lon: r.Lon }));
            resolve(refpoints);
        });
    });
}

exports.getHike = (hikeID) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM HIKES WHERE HikeID = ?';
        db.all(sql, [hikeID], (err, rows) => {
            if (err) reject(err);
            else {
                if (rows.length === 0) resolve(undefined);
                else {
                    const hike = rows.map((h) => ({ id: h.HikeID, label: h.Label, length: h.Length, expTime: h.ExpTime, ascent: h.Ascent, difficulty: h.Difficulty, description: h.Description, province: h.Province, municipality: h.Municipality }));
                    resolve(hike);
                }
            }
        });
    });
}

exports.getHikePoints = (hikeID) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM POINTS WHERE HikeID = ?';
        db.all(sql, [hikeID], (err, rows) => {
            if (err) reject(err);
            const points = rows.map((p) => ({ pointID: p.PointID, label: p.Label, latitude: p.Lat, longitude: p.Lon, startPoint: p.SP, endPoint: p.EP, referencePoint: p.RP }));
            resolve(points);
        });
    });
}

exports.deleteHike = (hikeID) => {
    return new Promise((resolve, reject) => {
        db.run("DELETE FROM HIKES WHERE HikeID = ?", [hikeID], (err) => {
            if (err) reject(err);
            else resolve(null);
        });
    });
};

exports.deleteAllHikes = () => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM Hikes';
        db.all(sql, (err) => {
            if (err) reject(err);
            resolve();
        });
    });
}

exports.newHike = (label, length, expTime, ascent, difficulty, description, province, municipality) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO Hikes(Label, Length, ExpTime,Ascent,Difficulty,Description,Province,Municipality) VALUES(?,?,?,?,?,?,?,?)'
        db.run(sql, [label, length, expTime, ascent, difficulty, description, province, municipality], function (err) {
            if (err) reject(err);
            resolve();
        });
    });
}

exports.updateHike = (label, length, expTime, ascent, difficulty, description, province, municipality, hikeId) => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE HIKES SET label=?,length=?,expTime=?,ascent=?,difficulty=?,description=?,province=?,municipality=? WHERE HikeId=?'
        db.run(sql, [label, length, expTime, ascent, difficulty, description, province, municipality, hikeId], function (err) {
            if (err) reject(err);
            resolve();
        });
    });
}

exports.getStartPoint = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM POINTS WHERE SP = 1';
        db.all(sql, [], (err, rows) => {
            if (err) reject(err);
            const startPoint = rows.map((sp) => ({ hikeID: sp.HikeID, pointID:sp.PointID, label: sp.Label }));
            resolve(startPoint);
        });
    });
}

exports.getEndPoint = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM POINTS WHERE EP = 1';
        db.all(sql, [], (err, rows) => {
            if (err) reject(err);
            const endPoint = rows.map((ep) => ({ hikeID: ep.HikeID, pointID:ep.PointID, label: ep.Label }));
            resolve(endPoint);
        });
    });
}

exports.getReferencePoint = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM POINTS WHERE RP = 1';
        db.all(sql, [], (err, rows) => {
            if (err) reject(err);
            const referencePoint = rows.map((rp) => ({ hikeID: rp.HikeID, pointID:rp.PointID, label: rp.Label }));
            resolve(referencePoint);
        });
    });
}