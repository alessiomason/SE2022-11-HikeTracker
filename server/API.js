const dao = require('./dao'); // module for accessing the DB
const user_dao = require('./user-dao'); // module for accessing the users in the DB
const { check, validationResult } = require('express-validator'); // validation middleware
const dayjs = require('dayjs');
const duration = require('dayjs/plugin/duration');
dayjs.extend(duration);
const nodemailer = require('nodemailer');
require('dotenv').config();
const multer = require('multer');
const fs = require("fs");

const storage = multer.diskStorage(
    {
        destination: './images',
        filename: function (req, file, cb) {

            let type;
            let id;

            // It is an hike, hut or parking lot?
            if (req.body['hikeID'] != null) {
                type = "hike";
                id = req.body["hikeID"];
            } else if (req.body['hutID'] != null) {
                type = "hut";
                id = req.body["hutID"];
            } else if (req.body['parkingLotID'] != null) {
                type = "parkingLot";
                id = req.body["parkingLotID"];
            }
            // hike-id.jpg || hut-id.jpg || parkingLot-id.jpg
            cb(null, type + "-" + id + ".jpg");
        }
    }
);

const upload = multer({ storage: storage });

// from https://stackoverflow.com/questions/639695/how-to-convert-latitude-or-longitude-to-meters
function coordinatesDistanceInMeter(lat1, lon1, lat2, lon2) {  // generally used geo measurement function
    const R = 6378.137; // Radius of earth in KM
    const dLat = lat2 * Math.PI / 180 - lat1 * Math.PI / 180;
    const dLon = lon2 * Math.PI / 180 - lon1 * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return d * 1000; // meters
}

module.exports.useAPIs = function useAPIs(app, isLoggedIn) {

    // add new service type
    app.post('/api/addGPXTrack', async (req, res) => {
        const errors = validationResult(req);
        let length = 0;
        let lat_prev = 0.0;
        let lon_prev = 0.0;
        if (!errors.isEmpty())
            return res.status(422).json({ errors: errors.array() });

        try {


            let element = req.body.features[0];
            if (element.properties.name === '') {
                return res.status(422).json({ error: `Description name of track can not be empty.` });
            }

            let label = element.properties.name;
            let desc = element.properties.desc;
            let state = '';
            let region = '';
            let province = '';
            let municipality = '';
            const hikeID = await dao.getLastHikeID() + 1;
            let startPointElev = null;
            let endPointElev = null;
            let coordinatesArray = [];
            let refPointsArray = [];

            for (let j = 0; j < req.body.features.length; j++) {
                if (req.body.features[j].geometry.type == 'Point') {
                    refPointsArray.push(req.body.features[j]);
                } else {
                    coordinatesArray.push(req.body.features[j]);
                }
            }

            for (let k = 0; k < coordinatesArray.length; k++) {
                let pointsArray = coordinatesArray[k].geometry.coordinates;
                for (let i = 0; i < pointsArray.length; i++) {
                    if (i == 0 & k == 0) { ///primo punto
                        await dao.addPoint(hikeID, pointsArray[i][1], pointsArray[i][0], pointsArray[i][2], 1, 0, 0, "");
                        startPointElev = pointsArray[i][2];
                        length = 0;
                        lat_prev = pointsArray[i][1];
                        lon_prev = pointsArray[i][0];
                        const response = await fetch(new URL(`https://nominatim.openstreetmap.org/reverse?format=json&accept-language=en&zoom=10&lat=${pointsArray[i][1]}&lon=${pointsArray[i][0]}`));
                        const reverseNom = await response.json();
                        if (response.ok) {
                            state = reverseNom.address.country;
                            region = reverseNom.address.state;
                            province = reverseNom.address.county;
                            municipality = reverseNom.address.city || reverseNom.address.town || reverseNom.address.village || reverseNom.address.municipality
                                || reverseNom.address.isolated_dwelling || reverseNom.address.croft || reverseNom.address.hamlet;
                        }
                    } else if (i == (pointsArray.length - 1) & k == (coordinatesArray.length - 1)) { ///ultimo punto
                        await dao.addPoint(hikeID, pointsArray[i][1], pointsArray[i][0], pointsArray[i][2], 0, 1, 0, "");
                        endPointElev = pointsArray[i][2];
                        length += coordinatesDistanceInMeter(lat_prev, lon_prev, pointsArray[i][1], pointsArray[i][0]);
                    } else {
                        await dao.addPoint(hikeID, pointsArray[i][1], pointsArray[i][0], pointsArray[i][2], 0, 0, 0, ""); //lat and lon in the json representation are swapped

                        if (i == 0) {
                            let prevArray = coordinatesArray[k - 1].geometry.coordinates;
                            lat_prev = prevArray[prevArray.length - 1][1];
                            lon_prev = prevArray[prevArray.length - 1][0];
                        } else {
                            lat_prev = pointsArray[i - 1][1];
                            lon_prev = pointsArray[i - 1][0];
                        }

                        length += coordinatesDistanceInMeter(lat_prev, lon_prev, pointsArray[i][1], pointsArray[i][0]);
                    }
                }
            }

            for (let i = 0; i < refPointsArray.length; i++) { //aggiunta ref points
                let pointsArray = refPointsArray[i].geometry.coordinates;
                let rp_desc = refPointsArray[i].properties.desc;
                await dao.addPoint(hikeID, pointsArray[1], pointsArray[0], pointsArray[2], 0, 0, 1, rp_desc);
            }
            // let startPoint = await dao.getStartPointOfHike(hikeID);
            // let endPoint = await dao.getEndPointOfHike(hikeID);
            let ascent = endPointElev - startPointElev;
            // const length = measure(startPoint.lat, startPoint.lon, endPoint.lat, endPoint.lon);
            await dao.addHike(label, length, null, ascent, null, desc, state, region, province, municipality, req.user.id);
            let hike = await dao.getHike(hikeID)
            res.status(201).json(hike).end();
        } catch (err) {
            console.log(err)
            res.status(500).json({ error: err });
        }


    });

    app.post('/api/addHut', async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(422).json({ errors: errors.array() });

        try {

            const name = req.body.name;
            const description = req.body.description;
            const lat = req.body.lat;
            const lon = req.body.lon;
            const altitude = req.body.altitude;
            const beds = req.body.beds;
            const state = req.body.state;
            const region = req.body.region;
            const province = req.body.province;
            const municipality = req.body.municipality;

            const hut = await dao.addHut(name, description, lat, lon, altitude, beds, state, region, province, municipality, req.user.id);

            res.status(201).json(hut.id).end();
        } catch (err) {
            console.log(err)
            res.status(500).json({ error: err });
        }

    });

    app.post('/api/addPoint', async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(422).json({ errors: errors.array() });

        try {

            const hikeID = req.body.hikeID;
            const SP = req.body.SP;
            const EP = req.body.EP;
            const RP = req.body.RP;
            const hutID = req.body.hutID;
            const lat = req.body.lat;
            const lon = req.body.lon;
            const alt = req.body.altitude;
            const label = req.body.label;
            const parkingID = req.body.parkingID;

            // mi occupo della cancellazione dello start/end point precedente solo se SP o EP !=0
            if ((SP !== 0 || EP !== 0)) {
                // verifico che ci sia uno start point e un end point associato all'hike corrente
                let hikePoints = [];
                hikePoints = await dao.getHikePoints(hikeID);
                const hikeStartPoint = hikePoints.filter((p) => p.startPoint === 1).pop();
                const hikeEndPoint = hikePoints.filter((p) => p.endPoint === 1).pop();

                // se si, rimuovo flag a seconda del valore SP e EP
                if (hikeStartPoint.startPoint === 1 && SP === 1) {
                    if (hikeStartPoint.hutID !== 0 || hikeStartPoint.parkingID !== 0) {
                        // se lo start point era un hut/parking lot, lo cancello dalla tabella Points
                        await dao.deletePointByPointID(hikeStartPoint.pointID);
                    } else {
                        // rimuovo flag SP di hikeStartPoint, ma continua a far parte del tracciato
                        await dao.updatePoint(hikeStartPoint.pointID, 0, hikeStartPoint.endPoint);
                    }

                } else if (hikeEndPoint.endPoint === 1 && EP === 1) {
                    if (hikeEndPoint.hutID !== 0 || hikeEndPoint.parkingID !== 0) {
                        // se l'end point era un hut/parking lot, lo cancello dalla tabella Points
                        await dao.deletePointByPointID(hikeEndPoint.pointID);
                    } else {
                        // rimuovo flag EP di hikeEndPoint
                        await dao.updatePoint(hikeEndPoint.pointID, hikeEndPoint.startPoint, 0);
                    }

                }
                // se no, nulla
            }
            // aggiungo un nuovo punto in tabella, che sarà start o end point

            const point = await dao.addPoint(hikeID, lat, lon, alt, SP, EP, RP, label, hutID, parkingID);
            res.status(201).json(point).end();
        } catch (err) {
            console.log(err)
            res.status(500).json({ error: err });
        }

    });


    app.put('/api/uploadHutImage/:id', upload.single('file'), async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(422).json({ errors: errors.array() });

        const hutId = req.params.id;

        try {
            let result = await dao.getHut(hutId);
            if (result.error)
                res.status(404).json(result);
            else {
                res.status(201).end();
            }
        } catch (err) {
            res.status(500).json({ error: `Error during upload of the hut's image` });
        }
    });

    app.put('/api/uploadParkingLotImage/:id', upload.single('file'), async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(422).json({ errors: errors.array() });

        const parkingLotID = req.params.id;

        try {
            let result = await dao.getParkingById(parkingLotID);
            if (result.error)
                res.status(404).json(result);
            else {
                res.status(201).end();
            }
        } catch (err) {
            res.status(500).json({ error: `Error during upload of the parking lot's image` });
        }
    });


    app.get('/api/huts', async (req, res) => {
        try {
            const huts = await dao.getHuts();
            res.status(200).json(huts);
        }
        catch (err) {
            console.log(err)
            res.status(500).end();
        }
    });

    app.get('/api/hut/:id', async (req, res) => {
        const hutID = req.params.id;

        try {
            const huts = await dao.getHut(hutID);
            res.status(200).json(huts);
        }
        catch (err) {
            console.log(err)
            res.status(500).end();
        }
    });

    app.delete('/api/huts/:id', async (req, res) => {
        const hutID = req.params.id;
        const path = `./images/hut-${hutID}.jpg`;
        try {
            // verifico la presenza dell'hut nella tabella Points
            const hutPoints = await dao.getHutPoints(hutID);
            if(hutPoints.length !== 0){
                    // se sono start point/end point --> ERRORE
                if(hutPoints.filter((p) => p.startPoint === 1 || p.endPoint === 1).length !== 0){
                    res.status(500).json({ error: 'The hut could not be deleted, it is a start/end point!' })
                }else{
                    // ci sono degli hut linkati, possono essere cancellati sempre problemi -> CANCELLO
                    await dao.deletePointsByHutID(hutID);
                    await dao.deleteHut(hutID);
                    // cancello l'eventuale immagine associata
                    try {
                        fs.unlinkSync(path);
                    } catch {
                    }
                    res.status(200).end();
                }
            }else {
                // non ci sono né hut linkati, né hut settati come start/end point -> CANCELLO
                await dao.deleteHut(hutID);
                // cancello l'eventuale immagine associata
                try {
                    fs.unlinkSync(path);
                } catch {
                }
                res.status(200).end();
            }
        }
        catch (err) {
            res.status(500).json({ error: 'The hut could not be deleted' });
        }
    });


    app.put('/api/updateHut/:id', upload.single('file'), async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(422).json({ errors: errors.array() });

        const hutId = req.params.id;

        try {
            let result = await dao.getHut(hutId);
            if (result.error)
                res.status(404).json(result);
            else {
                let name = req.body["name"];
                let description = req.body["description"];
                let lat = req.body["lat"];
                let lon = req.body["lon"];
                let altitude = req.body["altitude"];
                let beds = req.body["beds"];
                let state = req.body["state"];
                let region = req.body["region"];
                let province = req.body["province"];
                let municipality = req.body["municipality"];

                const huts = await dao.updateHut(name, description, lat, lon, altitude, beds, state, region, province, municipality, hutId);
                res.status(201).json(huts).end();
            }
        } catch (err) {
            res.status(500).json({ error: `Database error during update of the hut` });
        }

    });


    app.delete('/api/deleteAllHuts', async (req, res) => {
        try {
            await dao.deleteAllHuts();
            res.status(204).end();

        } catch (e) {
            res.status(500).end();
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

    app.get('/api/parkingLots', async (req, res) => {
        try {
            const pls = await dao.getParkingLots();
            res.status(200).json(pls);
        }
        catch (err) {
            res.status(500).end();
        }
    });


    // GET a specific parking lot
    app.get('/api/parkingLots/:id', async (req, res) => {
        try {
            id = req.params.id;
            const parking = await dao.getParkingById(id);
            res.status(200).json(parking);
        }
        catch (err) {
            res.status(500).end();
        }
    });

    //Add a parking lot
    app.post('/api/newParkingLot', async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(422).json({ errors: errors.array() });

        try {
            const label = req.body.label;
            const state = req.body.state;
            const region = req.body.region;
            const province = req.body.province;
            const municipality = req.body.municipality;
            const description = req.body.description;
            const lat = req.body.lat;
            const lon = req.body.lon;
            const altitude = req.body.altitude;
            const total = req.body.total;
            const occupied = req.body.occupied;

            const parking = await dao.addParking(label, state, region, province, municipality, description, lat, lon, altitude, total, occupied, req.user.id);
            res.status(201).json(parking.id).end();
        } catch (err) {
            console.log(err)
            res.status(500).json({ error: err });
        }

    });

    //update parking 
    app.put('/api/parkingLots/:id', upload.single('file'), async (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        // check if the id of the parking lot is empty 
        if (req.body["parkingLotID"] === '') {
            return res.status(422).json({ error: `Insert the id of a parking lot that you want to update.` });
        }
        let parkingID = req.params.id;
        let label = req.body["label"];
        let state = req.body["state"];
        let region = req.body["region"];
        let province = req.body["province"];
        let municipality = req.body["municipality"];
        let description = req.body["description"];
        let lat = req.body["lat"];
        let lon = req.body["lon"];
        let altitude = req.body["altitude"];
        let total = req.body["total"];
        let occupied = req.body["occupied"];
        try {
            const parking = await dao.updateParking(label, state, region, province, municipality, description, lat, lon, altitude, total, occupied, parkingID);
            res.status(201).json(parking).end();
        } catch (err) {

            res.status(500).json({ error: `Database error during update of the service name.` });
        }

    });
    // DELETE parking lot
    app.delete('/api/parkingLots/:id', async (req, res) => {
        const ParkingID = req.params.id;
        const path = `./images/parkingLot-${ParkingID}.jpg`;
        try {
            // verifico la presenza del parking lot nella tabella Points
            const parkingPoints = await dao.getParkingPoints(ParkingID);
            if (parkingPoints.length !== 0){
                // se ci sono --> ERRORE
                res.status(500).json({ error: 'The parking lot could not be deleted, it is a start/end point' });
            } else {
                // posso cancellare il parking lot senza problemi --> CANCELLO
                await dao.deleteParking(ParkingID);
                // cancello l'eventuale immagine associata
                try {
                    fs.unlinkSync(path);
                } catch {
                }
                res.status(200).end();
            }
        }
        catch (err) {
            res.status(500).json({ error: 'Database error during update of the service name.' });
        }
    });

    // DELETE All parking lots
    app.delete('/api/deleteAllParkingLots/', async (req, res) => {
        try {
            await dao.deleteAllParkingLots();
            res.status(200).end();
        }
        catch (err) {
            res.status(500).json({ error: 'Database error during update of the service name.' });
        }
    });



    app.get('/api/hikesrefpoints', async (req, res) => {
        try {
            const refpoints = await dao.getHikesRefPoints();
            res.status(200).json(refpoints);
        }
        catch (err) {
            res.status(500).end();
        }
    });


    app.get('/api/hike/:id', async (req, res) => {
        const hikeID = req.params.id;
        try {
            const hike = await dao.getHike(hikeID);
            if (hike == undefined) res.status(404).end();
            hike[0].points = await dao.getHikePoints(hikeID);
            res.status(200).json(hike[0]);
        }
        catch (err) {
            res.status(500).end();
        }
    });


    app.delete('/api/hikes/:id', async (req, res) => {
        const hikeID = req.params.id;
        const path = `./images/hike-${hikeID}.jpg`;
        try {
            await dao.deleteHike(hikeID);
            await dao.deletePointsByHikeID(hikeID);
            res.status(200).end();
        }
        catch (err) {
            res.status(500).json({ error: 'The hike could not be deleted' });
        }
        try {
            fs.unlinkSync(path);
        } catch {
        }
    });

    // delete all hikes
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
        let province = req.body.province;
        let municipality = req.body.municipality;

        try {
            const hike = await dao.newHike(label, length, expTime, ascent, difficulty_level, description, province, municipality);
            res.status(201).json(hike).end();
        } catch (err) {
            res.status(500).json({ error: `Database error during creation of a new hike.` });
        }

    });

    /*
    // update hike
    app.put('/api/updateHike/:id', async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(422).json({ errors: errors.array() });

        // check if the new desription of the hike is empty 
        if (req.body.label === '')
            return res.status(422).json({ error: `New name of the hike can not be empty.` });

        const hikeId = req.params.id;

        try {
            let result = await dao.getHike(hikeId);
            if (result.error)
                res.status(404).json(result);
            else {
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
                let state = req.body.state;
                let region = req.body.region;
                let province = req.body.province;
                let municipality = req.body.municipality;

                const hikes = await dao.updateHike(label, length, expTime, ascent, difficulty_level, description, state, region, province, municipality, hikeId);
                res.status(201).json(hikes).end();
            }
        } catch (err) {
            res.status(500).json({ error: `Database error during update of the service name.` });
        }

    });
    */

    // update hike
    app.put('/api/updateHike/:id', upload.single('file'), async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(422).json({ errors: errors.array() });

        // check if the new desription of the hike is empty 
        if (req.body["label"] === '')
            return res.status(422).json({ error: `New name of the hike can not be empty.` });

        const hikeId = req.params.id;

        try {
            let result = await dao.getHike(hikeId);
            if (result.error)
                res.status(404).json(result);
            else {
                let label = req.body["label"];
                let length = req.body["length"];
                let expTime = req.body["expTime"];
                let ascent = req.body["ascent"];
                let difficulty = req.body["difficulty"];
                let difficulty_level = 0;

                if (difficulty == "Tourist")
                    difficulty_level = 1;
                else if (difficulty == "Hiker")
                    difficulty_level = 2;
                else if (difficulty == "Professional hiker")
                    difficulty_level = 3;

                let description = req.body["description"];
                let state = req.body["state"];
                let region = req.body["region"];
                let province = req.body["province"];
                let municipality = req.body["municipality"];

                const hikes = await dao.updateHike(label, length, expTime, ascent, difficulty_level, description, state, region, province, municipality, hikeId);
                res.status(201).json(hikes).end();
            }
        } catch (err) {
            res.status(500).json({ error: `Database error during update of the service name.` });
        }

    });



    //GET StartPoint (for filters)

    app.get('/api/startPoint', async (req, res) => {
        try {
            const sp = await dao.getStartPoint();
            res.status(200).json(sp);
        }
        catch (err) {
            res.status(500).end();
        }
    });

    //GET EndPoint (for filters)

    app.get('/api/endPoint', async (req, res) => {
        try {
            const ep = await dao.getEndPoint();
            res.status(200).json(ep);
        }
        catch (err) {
            res.status(500).end();
        }
    });

    //GET ReferncePoint (for filters)

    app.get('/api/referencePoint', async (req, res) => {
        try {
            const rp = await dao.getReferencePoint();
            res.status(200).json(rp);
        }
        catch (err) {
            res.status(500).end();
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