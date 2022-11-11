const dao = require('./dao'); // module for accessing the DB
const user_dao = require('./user-dao'); // module for accessing the users in the DB
const { check, validationResult } = require('express-validator'); // validation middleware

module.exports.useAPIs = function useAPIs(app, isLoggedIn) {


    // add new service type
    app.post('/api/addGPXTrack', async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        try {
        let hikes=[];
            for (let j = 0; j < req.body.features.length; j++) {
                let element = req.body.features[j];
                if (element.properties.name === '') {
                    return res.status(422).json({ error: `Description name of track can not be empty.` });
                }
                label = element.properties.name;
                pointsArray = element.geometry.coordinates;
                ascent = pointsArray[pointsArray.length - 1][2] - pointsArray[0][2];


                hikes.concat( await dao.addHike(label, null, null, ascent, null, ""));
                const hikeID = await dao.getLastHikeID();
                console.log(hikeID);
                for (let i = 0; i < pointsArray.length; i++) {
                    await dao.addPoint(hikeID, pointsArray[i][1], pointsArray[i][0]); //lat and lon in the json representation are swapped
                }

            }

            res.status(201).json(hikes).end();
        } catch (err) {

            res.status(500).json({ error: err });
        }


    });

}
