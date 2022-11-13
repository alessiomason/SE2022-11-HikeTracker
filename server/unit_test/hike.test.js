
const dao = require('../dao'); // module for accessing the DB


describe("test Hikes functions", () => {
   
    test("Test for get given hike id", async () => {
        // With given id (2), get specific hikeID and matches it
        const hikeID = 2
        const hike = await dao.getHike(hikeID);
        expect(hike[0].id).toStrictEqual(hikeID);
      });

    test("Test for get list of hikes", async () => {
        // insert new hike to hikes db and checks the list of hikes can we get or not
        const hikes = await dao.getHikes();
        const hike = await dao.newHike("26-GIU-13",null,null,667.751708984375,1,null)
        const hikesList = await dao.getHikes();
        expect(hikes.length + 1).toStrictEqual(hikesList);
      });
    
    
    
})