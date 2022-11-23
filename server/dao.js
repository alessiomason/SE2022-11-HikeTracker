'use strict';

/* Data Access Object (DAO) module for accessing riddles and answers */

const sqlite = require('sqlite3');

// open the database
const db = new sqlite.Database('hike_tracker.db', (err) => {
    if (err) throw err;
});
exports.addPoint = (hikeID, lat, lon,SP,EP,RP) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO Points(HikeID,Lat,Lon,SP,EP,RP) VALUES(?, ?, ?,?,?,?)'
        db.run(sql, [hikeID, lat, lon,SP,EP,RP], function (err) {
            if (err) reject(err);
            resolve();
        });
    });
}

exports.addHut = (hutName, PointID, hutDescription) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO Huts(Name, PointID, Description) VALUES(?, ?, ?)'
        db.run(sql, [hutName, PointID, hutDescription], function (err) {
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
            const huts = rows.map((h) => ({ id: h.HutID, hutName: h.Name, point: h.PointID, hutDescription: h.Description }));
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


exports.getHut = (hutID) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM Huts WHERE HutID = ?';
        db.all(sql, [hutID], (err, rows) => {
            if (err) reject(err);
            else {
                if (rows.length === 0) resolve(undefined);
                else {
                    const hike = rows.map((h) => ({ id: h.HutID, hutName: h.Name, point: h.PointID, hutDescription: h.Description}));
                    resolve(hike);
                }
            }
        });
    });
}

exports.updateHut = (hutID, hutName, pointID, hutDescription) => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE Huts SET Name=?, PointID=?, Description=? WHERE HutID=?'
        db.run(sql, [hutName, pointID, hutDescription, hutID], function (err) {
            if (err) reject(err);
            resolve();
        });
    });
}


exports.addHike = (trackName, len, time, ascent, diff, description,province,municipality) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO Hikes(Label, Length, ExpTime,Ascent,Difficulty,Description,Province,Municipality) VALUES(?, ?, ?, ?, ?,?,?,?)'
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
            if (row === undefined) point = { lat: null, lon: null }
            else point = { lat: row.Lat, lon: row.Lon }

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
            if (row === undefined) point = { lat: null, lon: null }
            else point = { lat: row.Lat, lon: row.Lon }

            resolve(point);
        });
    });
}


exports.getHikes = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM HIKES';
        db.all(sql, [], (err, rows) => {
            if (err) reject(err);
            const hikes = rows.map((h) => ({ id: h.HikeID, label: h.Label, length: h.Length, expTime: h.ExpTime, ascent: h.Ascent, difficulty: h.Difficulty, description: h.Description }));
            resolve(hikes);
        });
    });
}
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
                    const hike = rows.map((h) => ({ id: h.HikeID, label: h.Label, length: h.Length, expTime: h.ExpTime, ascent: h.Ascent, difficulty: h.Difficulty, description: h.Description }));
                    resolve(hike);
                }
            }
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

exports.newHike = (label, length, expTime, ascent, difficulty, description) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO HIKES(label,length,expTime,ascent,difficulty,description) VALUES(?, ?, ?, ?, ?, ?)'
        db.run(sql, [label, length, expTime, ascent, difficulty, description], function (err) {
            if (err) reject(err);
            resolve();
        });
    });
}

exports.updateHike = (label, length, expTime, ascent, difficulty, description, hikeId) => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE HIKES SET label=?, length=?,expTime=?,ascent=?,difficulty=?,description=? WHERE HikeId=?'
        db.run(sql, [label, length, expTime, ascent, difficulty, description, hikeId], function (err) {
            if (err) reject(err);
            resolve();
        });
    });
}
