const dao = require('../dao'); // module for accessing the DB

describe("test parking lots functions", () => {
    deleteAllParkingLotsTest();
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
    const parking = await dao.addParking("Parking lot test for adding", "Province test for adding", "Municipality test for adding","Description test for adding", 1,1,1,1,0 );
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
        description: "parking description test",
        province: "province for parking test",
        municipality: "municipality for parking test",
        lat : 41.234572836822555,
        lon : 15.21816437203666,
        altitude : 1240,
        total : 40,
        occupied: 35
       
    };

    await dao.addParking(data.label,
      data.province,
      data.municipality,
      data.description,
      data.lat,
      data.lon,
      data.altitude,
      data.total,
      data.occupied);

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
        description: "parking description test",
        province: "province for parking test",
        municipality: "municipality for parking test",
        lat : 41.234572836822555,
        lon : 15.21816437203666,
        altitude : 1240,
        total : 40,
        occupied: 35
       
    };

    await dao.addParking(data.label,
        data.province,
        data.municipality,
        data.description,
        data.lat,
        data.lon,
        data.altitude,
        data.total,
        data.occupied);

    res = await dao.getParkingById(1);
    expect(res.length).toStrictEqual(1);

    let id = 1;

    let newData = {
        label : "parking test1 update",
        description: "parking description test update",
        province: "province for parking test update",
        municipality: "municipality for parking test update",
        lat : 41.234572836822555,
        lon : 15.21816437203666,
        altitude : 1300,
        total : 50,
        occupied: 40
    };

    await dao.updateParking(newData.label,
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
        description: "parking description test",
        province: "province for parking test",
        municipality: "municipality for parking test",
        lat : 41.234572836822555,
        lon : 15.21816437203666,
        altitude : 1240,
        total : 40,
        occupied: 35
       
    };

    await dao.addParking(data.label,
        data.province,
        data.municipality,
        data.description,
        data.lat,
        data.lon,
        data.altitude,
        data.total,
        data.occupied);

    res = await dao.getParkingLots();
    expect(res.length).toStrictEqual(1);

    let id = await dao.getLastPArkingLotId();

    await dao.deleteParking(id);
    res = await dao.getParkingLots();
    expect(res.length).toStrictEqual(0);
  });
}
