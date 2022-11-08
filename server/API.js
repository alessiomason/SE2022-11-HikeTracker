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
console.log(req.body.features);
        try {

                let element=req.body.features[0];        
                if (element.properties.name === '') {
                    return res.status(422).json({ error: `Description name of track can not be empty.` });
                }
                trackName = element.properties.name;
                pointsArray=element.geometry.coordinates;

              //  const service = await dao.addGPXTrack(trackName);
               // for (point in pointsArray){
             //       await dao.addPoint(point[0],point);
               // }
             res.status(201).json(service).end();
        } catch (err) {

            res.status(500).json({ error: `Database error during creation of a new service.` });
        }


    });

}
