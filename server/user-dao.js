'use strict';

/* Data Access Object (DAO) module for accessing users */

const sqlite = require('sqlite3');
const crypto = require('crypto');

// open the database
const db = new sqlite.Database('hike_tracker.db', (err) => {
	if (err) throw err;
});

// get the user identified by {id}
exports.getUserById = (id) => {
	return new Promise((resolve, reject) => {
		const sql = `SELECT * FROM USER WHERE id=?`;

		db.get(sql, [id], (err, row) => {
			if (err) {
				reject(err);
				return;
			}

			if (row == undefined) {
				resolve({ error: 'User not found.' });
			} else {
				const user = {
					id: row.id,
					username: row.username
				};

				resolve(user);
			}
		});
	});
};

exports.getUser = (username, password) => {
	return new Promise((resolve, reject) => {
		const sql = 'SELECT * FROM USER WHERE username = ?';
		db.get(sql, [username], (err, row) => {
			if (err) { reject(err); }
			else if (row === undefined) { resolve(false); }
			else {
				const user = { id: row.id, username: row.username, access_right: row.accessRight };

				const salt = row.salt;
				crypto.scrypt(password, salt, 32, (err, hashedPassword) => {
					if (err) reject(err);

					const passwordHex = Buffer.from(row.hash, 'hex');

					if (!crypto.timingSafeEqual(passwordHex, hashedPassword))
						resolve(false);
					else resolve(user);
				});
			}
		});
	});
};