const dao = require('../dao'); // module for accessing the DB
const user_dao = require('../user-dao'); // module for accessing the DB

describe("test Huts functions", () => {
    deleteAllHutsTest();
    createUser()
    newHutTest();
    deleteAllHutsTest();
    newHutTest();
    updateHutTest();
    deleteAllHutsTest();
    newHutTest();
    deleteHutTest()
    newHutTest(); //create dummy one

})


function deleteAllHutsTest() {
    test('deletes huts records', async () => {
        await dao.deleteAllHuts();
        let res = await dao.deleteAllHuts();
        console.log(res)
        expect(typeof(res)).toStrictEqual(typeof(undefined));
    });
}



function updateHutTest() {
    test('updates new hut', async () => {
        res = await dao.getHuts();
        expect(res.length).toStrictEqual(1);

        let hut = res[0];
        let id = hut.id

        let newData = {
            name: "Lagazuoi Mountain Hut",
            description: "One of the nicest mountain huts",
            lat: 46.234572836822444,
            lon: 12.21816437203585,
            altitude: 1224,
            beds: 80,
            state: "Italy",
            region: "Piedmont",
            province: "Belluno",
            municipality: "Cortina d'Ampezzo",
            author:1,
            images:0

        };
        const respOfUpdate = await dao.updateHut(newData.name, newData.description, newData.lat, newData.lon, newData.altitude, newData.beds,
            newData.state,newData.region,newData.province, newData.municipality, id);


        res = await dao.getHut(id);
        let newHut = res[0];

        expect(newHut.hutName).toStrictEqual(newData.name);
        expect(newHut.hutDescription).toStrictEqual(newData.description);
        expect(newHut.lat).toStrictEqual(newData.lat);
        expect(newHut.lon).toStrictEqual(newData.lon);
        expect(newHut.altitude).toStrictEqual(newData.altitude);
        expect(newHut.beds).toStrictEqual(newData.beds);
        expect(newHut.province).toStrictEqual(newData.province);
        expect(newHut.municipality).toStrictEqual(newData.municipality);
    });
}


function newHutTest() {
    test('creates new hut', async () => {
        let data = {
            name: "Tuckett Mountain Hut",
            description: "A spectacular position surrounded by the sheer peaks of the Brenta Dolomites",
            lat: 46.0755170694556,
            lon: 11.091573714948028,
            altitude: 2272,
            beds: 112,
            state: "Italy",
            region: "Piedmont",
            province: "Trento",
            municipality: "Ragoli",
            author:1,
            images:0

        };

        await dao.addHut(data.name,
            data.description,
            data.lat,
            data.lon,
            data.altitude,
            data.beds,
            data.state,
            data.region,
            data.province,
            data.municipality,
            data.author,
            data.images);

        res = await dao.getHuts();
        expect(res.length).toStrictEqual(1);

        let hut = res[0];
        res = await dao.getHut(hut.id);
        
        expect(hut.hutName).toStrictEqual(data.name);
        expect(hut.hutDescription).toStrictEqual(data.description);
        expect(hut.lat).toStrictEqual(data.lat);
        expect(hut.lon).toStrictEqual(data.lon);
        expect(hut.altitude).toStrictEqual(data.altitude);
        expect(hut.beds).toStrictEqual(data.beds);
        expect(hut.province).toStrictEqual(data.province);
        expect(hut.municipality).toStrictEqual(data.municipality);
    });
}


function deleteHutTest() {
    test('delete an hut', async () => {
        res = await dao.getHuts();
        expect(res.length).toStrictEqual(1);

        let hut = res[0];

        await dao.deleteHut(hut.id);
        res = await dao.getHuts();
        expect(res.length).toStrictEqual(0);
    });
}


function createUser() {
    test('create new user', async () => {
  
        const data = {
            email: 'group11@p.it',
            password: 'ciao',
            accessRight: 'hiker'
        };
  
        await user_dao.newUser(data.email, data.password, data.accessRight);
  
    });
  }

