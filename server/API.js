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
const maxSize = 10 * 1024 * 1024; // 10 MB

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
            } else if (req.body['myHutID'] != null) {
                type = `myHut-${req.body['posID']}`
                id = req.body["myHutID"];
            }
            // hike-id.jpg || hut-id.jpg || parkingLot-id.jpg || myHut-pos-id.jpg
            cb(null, type + "-" + id + ".jpg");
        }
    }
);

const upload = multer({ storage: storage, limits: { fileSize: maxSize } });

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

            let ascent = endPointElev - startPointElev;
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
            res.status(200).json(huts[0]);
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
            if (hutPoints.length !== 0) {
                // se sono start point/end point --> ERRORE
                if (hutPoints.filter((p) => p.startPoint === 1 || p.endPoint === 1).length !== 0) {
                    res.status(500).json({ error: 'The hut could not be deleted, it is a start/end point!' })
                } else {
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
            } else {
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
            let id = req.params.id;
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
            if (parkingPoints.length !== 0) {
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
        let state = req.body.state;
        let region = req.body.region;
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
            const hike = await dao.newHike(label, length, expTime, ascent, difficulty_level, description, state, region, province, municipality);
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

    //GET ReferencePoint (for filters)

    app.get('/api/referencePoint', async (req, res) => {
        try {
            const rp = await dao.getReferencePoint();
            res.status(200).json(rp);
        }
        catch (err) {
            res.status(500).end();
        }
    });


    app.get('/api/referencePoint/:id', async (req, res) => {
        try {
            const pointID = req.params.id;
            const rp = await dao.getReferencePointID(pointID);
            res.status(200).json(rp);
        }
        catch (err) {
            res.status(500).end();
        }
    });

    // Mark a point as a new Reference Point
    app.put('/api/newReferencePoint/:id', async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(422).json({ errors: errors.array() });

        const pointID = req.params.id;

        try {

            await dao.setNewReferencePoint(pointID);
            res.status(201).json().end();

        } catch (err) {
            res.status(500).json({ error: `Database error during update of the hut` });
        }

    });

    // Mark a point as NOT-a-Reference-Point
    app.put('/api/clearReferencePoint/:id', async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(422).json({ errors: errors.array() });

        const pointID = req.params.id;

        try {

            await dao.clearReferencePoint(pointID);
            res.status(201).json().end();

        } catch (err) {
            res.status(500).json({ error: `Database error during update of the hut` });
        }

    });

    // start hike
    app.post('/api/trackedHikes/:hikeID', async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(422).json({ errors: errors.array() });

        const hikeID = req.params.hikeID;
        const userID = req.user.id;

        const nOfRefPoints = await dao.getNOfHikeRefPoints(hikeID);
        const progress = '0/' + nOfRefPoints;

        // if startTime is undefined, current time is retrieved
        const startTime = dayjs(req.body.startTime).format();

        try {
            await dao.startHike(hikeID, userID, progress, startTime);
            res.status(200).json().end();
        } catch (err) {
            res.status(500).json({ error: `Database error while starting the hike.` });
        }

    });

    // get tracked hikes by hikeID and userID
    app.get('/api/trackedHikes/:hikeID', async (req, res) => {
        const hikeID = req.params.hikeID;
        const userID = req.user.id;

        try {
            const trackedHikes = await dao.getTrackedHikesByHikeIDAndUserID(hikeID, userID);
            for (const trackedHike of trackedHikes)
                trackedHike.pointsReached = await dao.getTrackedHikePoints(trackedHike.id, trackedHike.hikeID);
            res.status(200).json(trackedHikes);
        }
        catch (err) {
            res.status(500).end();
        }
    });

    // get tracked hikes by userID
    app.get('/api/trackedHikes', async (req, res) => {
        const userID = req.user.id;

        try {
            const trackedHikes = await dao.getTrackedHikesByUserID(userID);
            for (const trackedHike of trackedHikes)
                trackedHike.pointsReached = await dao.getTrackedHikePoints(trackedHike.id, trackedHike.hikeID);
            res.status(200).json(trackedHikes);
        }
        catch (err) {
            res.status(500).end();
        }
    });

    // record reference point reached
    app.post('/api/trackedHikes/:trackedHikeID/refPoints/:pointID', async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(422).json({ errors: errors.array() });

        const trackedHikeID = req.params.trackedHikeID;
        const pointID = req.params.pointID;

        // if time is undefined, current time is retrieved
        const time = dayjs(req.body.time).format();

        const hike = await dao.getHikeByTrackedHikeId(trackedHikeID);
        const referencePoints = await dao.getReferencePointsByHike(hike.id);
        let i;
        for (i = 0; i < referencePoints.length; i++) {
            if (referencePoints[i].pointID > pointID)   // find first reference point not reached, count the ones reached
                break;
        }
        const progress = i + '/' + referencePoints.length;

        try {
            await dao.recordReferencePointReached(trackedHikeID, pointID, time);
            await dao.updateTrackedHikeProgress(trackedHikeID, progress);

            res.status(200).json().end();
        } catch (err) {
            res.status(500).json({ error: `Database error while record the reference point as reached.` });
        }

    });

    // terminate hike
    app.put('/api/trackedHikes/:id', async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(422).json({ errors: errors.array() });

        const trackedHikeID = req.params.id;
        const userID = req.user.id;

        // if endTime is undefined, current time is retrieved
        const endTime = dayjs(req.body.endTime).format();

        try {
            const hike = await dao.getHikeByTrackedHikeId(trackedHikeID);
            const nOfRefPoints = await dao.getNOfHikeRefPoints(hike.id);
            const progress = nOfRefPoints + '/' + nOfRefPoints;     // all reference point have been reached, even if not marked as such
            await dao.terminateHike(trackedHikeID, endTime, progress);

            const hikePoints = await dao.getHikePoints(hike.id);
            const hikePointsAltitudes = hikePoints.map(p => p.altitude);
            let hikeHighestAltitude = null;
            if (hikePointsAltitudes.length > 0) // to avoid using Math.max() on empty array, which returns Infinity
                hikeHighestAltitude = Math.max(...hikePointsAltitudes);

            const userStats = await dao.getUserStats(userID);

            const hikeTime = dayjs.duration(dayjs(endTime) - dayjs(hike.startTime)).asHours();
            const hikePace = dayjs.duration(dayjs(endTime) - dayjs(hike.startTime)).asMinutes() / hike.length * 1000;
            userStats.hikesFinished += 1;
            userStats.walkedLength += hike.length;
            userStats.totalHikeTime += hikeTime;
            userStats.totalAscent += hike.ascent;
            if (userStats.highestAltitude === null || hikeHighestAltitude > userStats.highestAltitude)
                userStats.highestAltitude = hikeHighestAltitude;
            if (userStats.highestAltitudeRange === null || hike.ascent > userStats.highestAltitudeRange)
                userStats.highestAltitudeRange = hike.ascent;
            if (userStats.longestHikeByKmID === null || hike.length > userStats.longestHikeByKmLength) {
                userStats.longestHikeByKmID = hike.id;
                userStats.longestHikeByKmLength = hike.length;
            }
            if (userStats.longestHikeByHoursID === null || hikeTime > userStats.longestHikeByHoursTime) {
                userStats.longestHikeByHoursID = hike.id;
                userStats.longestHikeByHoursTime = hikeTime;
            }
            if (userStats.shortestHikeByKmID === null || hike.length < userStats.shortestHikeByKmLength) {
                userStats.shortestHikeByKmID = hike.id;
                userStats.shortestHikeByKmLength = hike.length;
            }
            if (userStats.shortestHikeByHoursID === null || hikeTime < userStats.shortestHikeByHoursTime) {
                userStats.shortestHikeByHoursID = hike.id;
                userStats.shortestHikeByHoursTime = hikeTime;
            }
            if (userStats.fastestPacedHikeID === null || hikePace < userStats.fastestPacedHikePace) {
                userStats.fastestPacedHikeID = hike.id;
                userStats.fastestPacedHikePace = hikePace;
            }

            await dao.updateUserStats(userID, userStats);
            res.status(200).json().end();
        } catch (err) {
            res.status(500).json({ error: `Database error while terminating the hike.` });
        }

    });

    // cancel ongoing hike
    app.delete('/api/trackedHikes/:id', async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(422).json({ errors: errors.array() });

        const trackedHikeID = req.params.id;

        try {
            await dao.deleteTrackedHikePoints(trackedHikeID);
            await dao.deleteTrackedHike(trackedHikeID);
            res.status(204).json().end();
        } catch (err) {
            res.status(500).json({ error: `Database error while canceling the ongoing hike.` });
        }

    });

    // stop hike
    app.patch('/api/trackedHikes/:id', async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(422).json({ errors: errors.array() });

        const trackedHikeID = req.params.id;

        // if stopTime is undefined, current time is retrieved
        const stopTime = dayjs(req.body.stopTime).format();

        try {
            await dao.stopHike(trackedHikeID, stopTime);
            res.status(200).json().end();
        } catch (err) {
            res.status(500).json({ error: `Database error while starting the hike.` });
        }

    });

    //Add a weather alert
    app.post('/api/newWeatherAlert', async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(422).json({ errors: errors.array() });

        try {
            const type = req.body.type;
            const radius = req.body.radius;
            const lat = req.body.lat;
            const lon = req.body.lon;
            const time = req.body.time;
            const description = req.body.description;

            await dao.addWeatherAlert(type, radius, lat, lon, time, description);
            res.status(201).json().end();
        } catch (err) {
            console.log(err)
            res.status(500).json({ error: err });
        }
    });

    // get weather alerts
    app.get('/api/weatherAlert', async (req, res) => {
        try {
            const weatherAlert = await dao.getWeatherAlerts();
            // get only future weather alerts
            const weatherAlertFiltered = weatherAlert.filter((w) => dayjs(w.time).format() > dayjs().format());
            res.status(200).json(weatherAlertFiltered);
        }
        catch (err) {
            res.status(500).end();
        }
    });

    // delete weather alert
    app.delete('/api/weatherAlert/:id', async (req, res) => {
        const weatherAlertID = req.params.id;
        try {
            await dao.deleteWeatherAlert(weatherAlertID);
            res.status(200).end();
        }
        catch (err) {
            res.status(500).json({ error: 'The weather alert could not be deleted' });
        }
    });

    // get linked huts
    app.get('/api/linkedHut/', async (req, res) => {
        try {
            const linkedHuts = await dao.getLinkedHuts()
            res.status(200).json(linkedHuts);
        }
        catch (err) {
            console.log(err)
            res.status(500).end();
        }
    });

    //Add a hike condition
    app.post('/api/newHikeCondition', async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(422).json({ errors: errors.array() });

        try {
            const hikeID = req.body.hikeID;
            const hutID = req.body.hutID;
            const typeCondition = req.body.typeCondition;
            const description = req.body.description;

            await dao.addHikeCondition(hikeID, hutID, typeCondition, description);
            res.status(201).json().end();
        } catch (err) {
            console.log(err)
            res.status(500).json({ error: err });
        }
    });

    // get hike conditions
    app.get('/api/hikeCondition', async (req, res) => {
        try {
            const hikeCondition = await dao.getHikeConditions();
            res.status(200).json(hikeCondition);
        }
        catch (err) {
            res.status(500).end();
        }
    });

    // delete hike condition
    app.delete('/api/hikeCondition/:id', async (req, res) => {
        const conditionID = req.params.id;
        try {
            await dao.deleteHikeCondition(conditionID);
            res.status(200).end();
        }
        catch (err) {
            res.status(500).json({ error: 'The hike condition could not be deleted' });
        }
    });

    app.put('/api/uploadMyHutImage/:id', upload.single('file'), async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(422).json({ errors: errors.array() });

        const hutId = req.params.id;

        try {
            let result = await dao.getHut(hutId);
            if (result.error)
                res.status(404).json(result);
            else {
                await dao.increaseImages(result[0].images + 1, result[0].id);
                res.status(201).end();
            }
        } catch (err) {
            res.status(500).json({ error: `Error during upload of my hut's image` });
        }
    });

    // get tracked hikes by userID
    app.get('/api/hutsImages/:id', async (req, res) => {
        const hutID = req.params.id;
        let hutImages = [];
        hutImages.push({
            posID: 0,
            image: `http://localhost:3001/images/hut-${hutID}.jpg`
        })
        try {

            let result = await dao.getHut(hutID);
            if (result.error)
                res.status(404).json(result);
            else {
                for(let i = 0; i < result[0].images; i++){
                    hutImages.push({
                        posID: i+1,
                        image: `http://localhost:3001/images/myHut-${i+1}-${hutID}.jpg`
                    })
                }
                res.status(200).json(hutImages);
            }
        }
        catch (err) {
            res.status(500).end();
        }
    });

    // get tracked hikes by userID
    app.get('/api/userStats', async (req, res) => {
        const userID = req.user.id;

        try {
            const userStats = await dao.getUserStats(userID);
            res.status(200).json(userStats);
        }
        catch (err) {
            res.status(500).end();
        }
    });

    app.put('/api/validate/:id', async (req, res) => {
        const userID = req.params.id;
        try {
            const _userID = await dao.validateUser(userID, 1);
            res.status(200).json({ validated: true, userID: _userID });
        }
        catch (err) {
            res.status(500).end();
        }

    });

    // POST /signup
    // signup
    app.post('/api/signup', async function (req, res) {
        // save user
        let user;

        console.log(req.body)

        // if the email already registered if statement will run.
        if (await user_dao.checkEmail(req.body.email)) {
            
            return res.status(401).json({ error: 'This email already registered' });
        }

        if (req.body.hut) {
            user = await user_dao.newHutWorker(req.body.email, req.body.password, req.body.accessRight, req.body.hut);
        } else {
            user = await user_dao.newUser(req.body.email, req.body.password, req.body.accessRight);
        }


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