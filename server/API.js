const dao = require('./dao'); // module for accessing the DB
const user_dao = require('./user-dao'); // module for accessing the users in the DB
const { check, validationResult } = require('express-validator'); // validation middleware
const dayjs = require('dayjs');
const duration = require('dayjs/plugin/duration');
dayjs.extend(duration);
const nodemailer = require('nodemailer');
require('dotenv').config();

module.exports.useAPIs = function useAPIs(app, isLoggedIn) {

    // add new service type
    app.post('/api/addGPXTrack', async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(422).json({ errors: errors.array() });

        try {
            let hikes = [];
            for (let j = 0; j < req.body.features.length; j++) {
                let element = req.body.features[j];
                if (element.properties.name === '') {
                    return res.status(422).json({ error: `Description name of track can not be empty.` });
                }
                let label = element.properties.name;
                let pointsArray = element.geometry.coordinates;
                let ascent = pointsArray[pointsArray.length - 1][2] - pointsArray[0][2];


                hikes.concat(await dao.addHike(label, null, null, ascent, null, ""));
                const hikeID = await dao.getLastHikeID();
                console.log(hikeID);
                for (let i = 0; i < pointsArray.length; i++) {
                    if (i == 0) {
                        await dao.addPoint(hikeID, pointsArray[i][1], pointsArray[i][0], 1, 0,0);
                    } else if (i == pointsArray.length - 1) {
                        await dao.addPoint(hikeID, pointsArray[i][1], pointsArray[i][0], 0, 1,0);
                    } else {
                        await dao.addPoint(hikeID, pointsArray[i][1], pointsArray[i][0], 0, 0,0); //lat and lon in the json representation are swapped
                    }
                }

            }

            res.status(201).json(hikes).end();
        } catch (err) {
            console.log(err)
            res.status(500).json({ error: err });
        }


    });

    app.get('/api/hikes', async (req, res) => {
        try {
            const hikes = await dao.getHikes();
            res.status(200).json(hikes);
        }
        catch (err) {
            res.status(500).end();
        }
    });


    app.get('/api/hike/:id', async (req, res) => {
        const hikeID = req.params.id;
        try {
            const hike = await dao.getHike(hikeID);
            if (hike == undefined) {
                return 404
            }
            res.status(200).json(hike[0]);
        }
        catch (err) {
            res.status(500).end();
        }
    });


    app.delete('/api/hikes', async (req, res) => {
        console.log("hikes" + req.body.id)
        const hikeID = req.body.id;
        try {
            await dao.deleteHike(hikeID);
            res.status(200).end();
        }
        catch (err) {
            res.status(500).json({ error: 'The hike could not be deleted' });
        }
    });

    // delete all tickets
    app.delete('/api/deleteAllHikes', async (req, res) => {
        try {
            await dao.deleteAllHikes();
            res.status(204).end();

        } catch (e) {
            res.status(500).end();
        }
    });

    app.post('/api/newHike', async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(422).json({ errors: errors.array() });


        // check if the desription of the hike is empty 
        if (req.body.label === '')
            return res.status(422).json({ error: `Label of the hike can not be empty.` });
        let label = req.body.label;
        let length = req.body.length;
        let expTime = req.body.expTime;
        let ascent = req.body.ascent;
        let difficulty = req.body.difficulty;
        let difficulty_level = null;

        if (difficulty == "Tourist")
            difficulty_level = 1;
        else if (difficulty == "Hiker")
            difficulty_level = 2;
        else if (difficulty == "Professional hiker")
            difficulty_level = 3;
        let description = req.body.description;

        try {
            const hike = await dao.newHike(label, length, expTime, ascent, difficulty_level, description);
            res.status(201).json(hike).end();
        } catch (err) {
            res.status(500).json({ error: `Database error during creation of a new hike.` });
        }

    });

    // update hike
    app.put('/api/updateHike', async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(422).json({ errors: errors.array() });

        // check if the new desription of the hike is empty 
        if (req.body.label === '')
            return res.status(422).json({ error: `New name of the hike can not be empty.` });

        let hikeId = req.body.id
        let label = req.body.label;
        let length = req.body.length;
        let expTime = req.body.expTime;
        let ascent = req.body.ascent;
        let difficulty = req.body.difficulty;
        let difficulty_level = 0;

        if (difficulty == "Tourist")
            difficulty_level = 1;
        else if (difficulty == "Hiker")
            difficulty_level = 2;
        else if (difficulty == "Professional hiker")
            difficulty_level = 3;

        let description = req.body.description;

        try {
            const hikes = await dao.updateHike(label, length, expTime, ascent, difficulty_level, description, hikeId);
            res.status(201).json(hikes).end();
        } catch (err) {
            res.status(500).json({ error: `Database error during update of the service name.` });
        }

    });

    // POST /signup
    // signup
    app.post('/api/signup', async function (req, res) {
        // save user
        const user = await user_dao.newUser(req.body.email, req.body.password, req.body.accessRight);
        if (!user)
            return res.status(401).json({ error: 'Error in signing up' });

        const mailText = "Thanks for registering to Hike Tracker! Please verify your email by clicking on the following link: http://localhost:3000/verify-email?token=" + user.emailConfirmationToken;
        const mailHTML = `<h3>Thanks for registering to Hike Tracker!</h3>
                          <p>Please verify your email by <a href='http://localhost:3000/verify-email?token=${user.emailConfirmationToken}'>clicking here</a>.</p>`;

        // send verification email
        let transporter = nodemailer.createTransport({
            host: "smtp.studenti.polito.it",
            port: 465,
            secure: true,
            auth: {
                user: process.env.MAIL_USERNAME,
                pass: process.env.MAIL_PASSWORD
            }
        });

        let mailOptions = {
            from: 'Hike Tracker <' + process.env.MAIL_USERNAME + '>',
            to: user.email,
            subject: 'Verify your email',
            text: mailText,
            html: mailHTML
        };

        transporter.sendMail(mailOptions, function (err) {
            if (err)
                console.log("Error " + err);
            else
                console.log("Email sent successfully");
        });

        const userForRes = { id: user.id, email: user.email, access_right: user.access_right, verified: false };
        return res.json(userForRes);
    });

    // POST /verify-email
    // verify email
    app.post('/api/verify-email', async function (req, res) {
        const dateOfRegistration = await user_dao.getDateOfRegistration(req.body.emailConfirmationToken);
        // tempo rimanente = 24 ore - (adesso - dateOfRegistration) = 24 ore - tempo trascorso dalla registrazione
        const remainingTime = Math.round(dayjs.duration({ hours: 24 }).subtract(dayjs.duration(dayjs() - dayjs(dateOfRegistration))).asSeconds());
        if (remainingTime < 0)
            return res.status(403).json({ error: 'Token expired' });
        const verified = await user_dao.verifyEmail(req.body.emailConfirmationToken);
        if (!verified)
            return res.status(401).json({ error: 'Error in verifying email' });

        return res.status(200).end();
    });

}