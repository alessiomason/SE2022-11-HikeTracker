'use strict';

/* Data Access Object (DAO) module for accessing users */

const sqlite = require('sqlite3');
const crypto = require('crypto');
const dayjs = require('dayjs');

// open the database
const db = new sqlite.Database('db/hike_tracker.db', (err) => {
    if (err) throw err;
});

// get all users
exports.getUsers = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM Users';
        db.all(sql, [], (err, rows) => {
            if (err) reject(err);
            const users = rows.map((u) => ({ id: u.UserId, fullName: u.FullName, email: u.Email, access_right: u.AccessRight, verified: u.Verified,
            hut: u.HutID }));
            resolve(users);
        });
    });
}

// get the user identified by {id}
exports.getUserById = (id) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM Users WHERE UserId = ?`;

        db.get(sql, [id], (err, row) => {
            if (err) reject(err);
            else if (row == undefined) resolve({ error: 'User not found.' });
            else {
                const user = { id: row.UserId, fullName: row.FullName, email: row.Email, access_right: row.AccessRight, verified: row.Verified,
                    hut: row.HutID};
                

                resolve(user);
            }
        });
    });
};

exports.getUser = (email, password) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM Users WHERE Email = ?';
        db.get(sql, [email], (err, row) => {
            if (err) reject(err);
            else if (row === undefined) resolve(false);
            else {
                const user = { id: row.UserId, fullName: row.FullName, email: row.Email, access_right: row.AccessRight, verified: row.Verified,
                hut: row.HutID};

                const salt = row.Salt;
                crypto.scrypt(password, salt, 32, (err, hashedPassword) => {
                    if (err) reject(err);
                    const passwordHex = Buffer.from(row.PasswordHash, 'hex');
                    if (!crypto.timingSafeEqual(passwordHex, hashedPassword))
                        resolve(false);
                    else resolve(user);
                });
            }
        });
    });
};

exports.newUser = (email, password, accessRight) => {
    return new Promise(async (resolve, reject) => {
        const salt = crypto.randomBytes(16);
        const dateOfRegistration = dayjs().format();
        const emailConfirmationToken = crypto.randomBytes(8).toString('hex');

        crypto.scrypt(password, salt, 32, (err, hashedPassword) => {
            if (err) reject(err);
            else {
                const sql = "INSERT INTO Users (Email, PasswordHash, Salt, AccessRight, DateOfRegistration, EmailConfirmationToken) VALUES (?, ?, ?, ?, ?, ?)";
                db.run(sql, [email, hashedPassword, salt, accessRight, dateOfRegistration, emailConfirmationToken], (err) => {
                    if (err) reject(err);
                    else {
                        db.get('SELECT last_insert_rowid() AS ID', (err, row) => {
                            if (err) reject(err);
                            else if (row === undefined) resolve(false);
                            else
                                resolve({ id: row.ID, email: email, access_right: accessRight, verified: false, dateOfRegistration: dateOfRegistration, emailConfirmationToken: emailConfirmationToken });
                        })
                    }
                });
            }
            return hashedPassword;
        });
    });
};
exports.newHutWorker = (email, password, accessRight,hutId) => {
    return new Promise(async (resolve, reject) => {
        const salt = crypto.randomBytes(16);
        const dateOfRegistration = dayjs().format();
        const emailConfirmationToken = crypto.randomBytes(8).toString('hex');

        crypto.scrypt(password, salt, 32, (err, hashedPassword) => {
            if (err) reject(err);
            else {
                const sql = "INSERT INTO Users (Email, PasswordHash, Salt, AccessRight, DateOfRegistration, EmailConfirmationToken,HutID) VALUES (?, ?, ?, ?, ?, ?, ?)";
                db.run(sql, [email, hashedPassword, salt, accessRight, dateOfRegistration, emailConfirmationToken,hutId], (err) => {
                    if (err) reject(err);
                    else {
                        db.get('SELECT last_insert_rowid() AS ID', (err, row) => {
                            if (err) reject(err);
                            else if (row === undefined) resolve(false);
                            else
                                resolve({ id: row.ID, email: email, access_right: accessRight, verified: false, dateOfRegistration: dateOfRegistration, emailConfirmationToken: emailConfirmationToken,hutId: hutId });
                        })
                    }
                });
            }
            return hashedPassword;
        });
    });
};

exports.getDateOfRegistration = (emailConfirmationToken) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT DateOfRegistration FROM Users WHERE EmailConfirmationToken = ?";
        db.get(sql, [emailConfirmationToken], (err, row) => {
            if (err) reject(err);
            else if (row === undefined) resolve(false);
            else resolve(row.DateOfRegistration);
        })
    });
}

exports.getUserAccessRight = (userId) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT AccessRight FROM Users WHERE UserID = ?";
        db.get(sql, [userId], (err, row) => {
            if (err) reject(err);
            else if (row === undefined) resolve(false);
            else resolve(row.AccessRight);
        })
    });
}

exports.verifyEmail = (emailConfirmationToken) => {
    return new Promise(async (resolve, reject) => {
        const sql = "UPDATE Users SET Verified = 1 WHERE EmailConfirmationToken = ?";
        db.run(sql, [emailConfirmationToken], (err) => {
            if (err) reject(err);
            else resolve(true);
        })
    });
};

exports.deleteAllUsers = () => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM Users';
        db.all(sql, (err) => {
            if (err) reject(err);
            resolve();
        });
    });
}


exports.checkEmail = (email) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM Users WHERE Email = ?";
        db.get(sql, [email], (err, row) => {
            if (err) reject(err);
            else if (row === undefined) resolve(false);
            else resolve(true);
        })
    });
}