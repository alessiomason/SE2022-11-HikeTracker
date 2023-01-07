const dao = require('../dao'); // module for accessing the DB
const user_dao = require('../user-dao'); // module for accessing the DB

describe("test parking lots functions", () => {
    deleteAllParkingLotsTest();
    createUser();
    newParkingLotTest();
  test("Test for get given parking lot id", async () => {
    // With given id (1), gets specific parkingID and matches it
    const ParkingID = 1
    const parking = await dao.getParkingById(ParkingID);
    expect(parking[0].parkingID).toStrictEqual(ParkingID);
  });
  deleteAllParkingLotsTest();
  newParkingLotTest();
  test("Test for get list of parking lots", async () => {
    // inserts new parking lot to db and checks the list of parking lots 
    const parkings = await dao.getParkingLots();

    let data = {
      label : "parking test1",
      state: "Italy",
      region: "Piomente",
      description: "parking description test",
      province: "province for parking test",
      municipality: "municipality for parking test",
      lat : 41.234572836822555,
      lon : 15.21816437203666,
      altitude : 1240,
      total : 40,
      occupied: 35,
      authorID: 1
     
  };
    const parking =  await dao.addParking(data.label,
      data.state,
      data.region,
      data.province,
      data.municipality,
      data.description,
      data.lat,
      data.lon,
      data.altitude,
      data.total,
      data.occupied,
      data.authorID);

    // parking;
    const parkingList = await dao.getParkingLots();
    expect(parkings.length + 1).toStrictEqual(parkingList.length);
  });



})

describe("CRUD Parking Lot functions", () => {
    deleteAllParkingLotsTest();
    newParkingLotTest();
    updateParkingLotTest();
    deleteParkingLotTest();
});

function deleteAllParkingLotsTest() {
  test('delete db for parkingLots', async () => {
    await dao.deleteAllParkingLots();
    let res = await dao.getParkingLots();
    expect(res.length).toStrictEqual(0);
  });
}

function newParkingLotTest() {
  test('create new parking lot', async () => {
    await dao.deleteAllParkingLots();
    let res = await dao.getParkingLots();
    expect(res.length).toStrictEqual(0);

    let data = {
        label : "parking test1",
        state: "Italy",
        region: "Piomente",
        description: "parking description test",
        province: "province for parking test",
        municipality: "municipality for parking test",
        lat : 41.234572836822555,
        lon : 15.21816437203666,
        altitude : 1240,
        total : 40,
        occupied: 35,
        authorID: 1
       
    };

    await dao.addParking(data.label,
      data.state,
      data.region,
      data.province,
      data.municipality,
      data.description,
      data.lat,
      data.lon,
      data.altitude,
      data.total,
      data.occupied,
      data.authorID);

    res = await dao.getParkingLots();
    expect(res.length).toStrictEqual(1);

    res = await dao.getParkingById(1);
    let parking = res[0];

    expect(parking.label).toStrictEqual(data.label);
    expect(parking.description).toStrictEqual(data.description);
    expect(parking.lat).toStrictEqual(data.lat);
    expect(parking.lon).toStrictEqual(data.lon);
    expect(parking.altitude).toStrictEqual(data.altitude);
    expect(parking.province).toStrictEqual(data.province);
    expect(parking.municipality).toStrictEqual(data.municipality);
    expect(parking.total).toStrictEqual(data.total);
    expect(parking.occupied).toStrictEqual(data.occupied);
  });
}

function updateParkingLotTest() {
  test('update a parking lot', async () => {

    await dao.deleteAllParkingLots();
    let res = await dao.getParkingLots();
    expect(res.length).toStrictEqual(0);


    let data = {
        label : "parking test1",
        state: "Italy",
        region: "Piomente",
        description: "parking description test",
        province: "province for parking test",
        municipality: "municipality for parking test",
        lat : 41.234572836822555,
        lon : 15.21816437203666,
        altitude : 1240,
        total : 40,
        occupied: 35,
        authorID: 1
       
    };

    await dao.addParking(data.label,
        data.state,
        data.region,
        data.province,
        data.municipality,
        data.description,
        data.lat,
        data.lon,
        data.altitude,
        data.total,
        data.occupied,
        data.authorID);

    res = await dao.getParkingById(1);
    expect(res.length).toStrictEqual(1);

    let id = 1;

    let newData = {
        label : "parking test1 update",
        state: "Italy",
        region: "Piomente2",
        description: "parking description test update",
        province: "province for parking test update",
        municipality: "municipality for parking test update",
        lat : 41.234572836822555,
        lon : 15.21816437203666,
        altitude : 1300,
        total : 50,
        occupied: 40,
        authorID: 1
    };

    await dao.updateParking(newData.label,
        data.state,
        data.region,
        newData.province,
        newData.municipality,
        newData.description,
        newData.lat,
        newData.lon,
        newData.altitude,
        newData.total,
        newData.occupied,
      id);

    res = await dao.getParkingLots();
    expect(res.length).toStrictEqual(1);
    res = await dao.getParkingById(1);
    expect(res.length).toStrictEqual(1);
    let parking = res[0];

    expect(parking.label).toStrictEqual(newData.label);
    expect(parking.description).toStrictEqual(newData.description);
    expect(parking.lat).toStrictEqual(newData.lat);
    expect(parking.lon).toStrictEqual(newData.lon);
    expect(parking.altitude).toStrictEqual(newData.altitude);
    expect(parking.description).toStrictEqual(newData.description);
    expect(parking.province).toStrictEqual(newData.province);
    expect(parking.municipality).toStrictEqual(newData.municipality);
    expect(parking.total).toStrictEqual(newData.total);
    expect(parking.occupied).toStrictEqual(newData.occupied);
  });
}

function deleteParkingLotTest() {
  test('delete a parking lot', async () => {

    await dao.deleteAllParkingLots();
    let res = await dao.getParkingLots();
    expect(res.length).toStrictEqual(0);


    
    let data = {
        label : "parking test1",
        state: "Italy",
        region: "Piomente",
        description: "parking description test",
        province: "province for parking test",
        municipality: "municipality for parking test",
        lat : 41.234572836822555,
        lon : 15.21816437203666,
        altitude : 1240,
        total : 40,
        occupied: 35,
        authorID: 1
       
    };

    await dao.addParking(data.label,
        data.state,
        data.region,
        data.province,
        data.municipality,
        data.description,
        data.lat,
        data.lon,
        data.altitude,
        data.total,
        data.occupied,
        data.authorID);

    res = await dao.getParkingLots();
    expect(res.length).toStrictEqual(1);

    let id = await dao.getLastPArkingLotId();

    await dao.deleteParking(id);
    res = await dao.getParkingLots();
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