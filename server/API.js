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




app.get('/api/hikes', async (req, res) => {
    try {
        const hikes = await dao.getHikes();
        res.status(200).json(hikes);
    }
    catch (err) {
        res.status(500).end();
    }
});

app.delete('/api/hikes', async (req, res) => {
    console.log("hikes"+req.body.id)
    const hikeID = req.body.id;
    try {
        await dao.deleteHike(hikeID);
        res.status(200).end();
    }
    catch (err) {
        res.status(500).json({error : 'The hike could not be deleted'});
    }
});

app.post('/api/newHike',  async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    // check if the desription of the hike is empty 
    if (req.body.label === ''){
        return res.status(422).json({ error: `Label of the hike can not be empty.`});
    }
    label = req.body.label;
    length = req.body.length;
    expTime = req.body.expTime;
    ascent = req.body.ascent;
    difficulty = req.body.difficulty;
    description = req.body.description;
            
    try {
        const hike = await dao.newHike(label,length,expTime,ascent,difficulty,description);
        res.status(201).json(hike).end();
    } catch (err) {
        
        res.status(500).json({ error: `Database error during creation of a new hike.`});
    }
    
});

// update hike
app.put('/api/updateHike',  async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    // check if the new desription of the hike is empty 
    if (req.body.label === ''){
        return res.status(422).json({ error: `New name of the hike can not be empty.`});
    }
    hikeId = req.body.id
    label = req.body.label;
    length = req.body.length;
    expTime = req.body.expTime;
    ascent = req.body.ascent;
    difficulty = req.body.difficulty;
    description = req.body.description;
            
            
    try {
        const hikes = await dao.updateHike(label,length,expTime,ascent,difficulty,description,hikeId);
        res.status(201).json(hikes).end();
    } catch (err) {
    
        res.status(500).json({ error: `Database error during update of the service name.`});
    }
    
});

}
