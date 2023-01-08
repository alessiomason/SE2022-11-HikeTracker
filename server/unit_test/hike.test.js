const dao = require('../dao'); // module for accessing the DB

const user_dao = require('../user-dao'); // module for accessing the DB


describe("test Hikes functions", () => {
  deleteAllHikesTest();
  createUser();
  newHikeTest();
  test("Test for get given hike id", async () => {
    // With given id (1), get specific hikeID and matches it
    const hikeID = 1
    const hike = await dao.getHike(hikeID);
    expect(hike[0].id).toStrictEqual(hikeID);
  });
  deleteAllHikesTest();
})

describe("CRUD Hikes functions", () => {
  deleteAllHikesTest();
  newHikeTest();
  updateHikeTest();
  deleteHikeTest();
});

function deleteAllHikesTest() {
  test('delete db', async () => {
    await dao.deleteAllHikes();
    let res = await dao.getHikes();
    expect(res.length).toStrictEqual(0);
  });
}

function newHikeTest() {
  test('create new hike', async () => {
    await dao.deleteAllHikes();
    let res = await dao.getHikes();
    expect(res.length).toStrictEqual(0);

    let data = {
      label: "Gran Paradiso",
      length: 20500,
      expTime: 10,
      ascent: 23,
      difficulty: "3",
      description: "Alpine challenge",
      state: "Italy",
      region: "Piedmont",
      province: "Torino",
      municipality: "Cogne",
      authorID: 1
    };

    await dao.newHike(data.label,
      data.length,
      data.expTime,
      data.ascent,
      data.difficulty,
      data.description,
      data.state,
      data.region,
      data.province,
      data.municipality,
      data.authorID);

    res = await dao.getHikes();
    expect(res.length).toStrictEqual(1);

    res = await dao.getHike(1);
    let hike = res[0];

    expect(hike.label).toStrictEqual(data.label);
    expect(hike.length).toStrictEqual(data.length);
    expect(hike.expTime).toStrictEqual(data.expTime);
    expect(hike.ascent).toStrictEqual(data.ascent);
    expect(hike.difficulty).toStrictEqual(data.difficulty);
    expect(hike.description).toStrictEqual(data.description);
    expect(hike.province).toStrictEqual(data.province);
    expect(hike.municipality).toStrictEqual(data.municipality);
  });
}

function updateHikeTest() {
  test('update an hike', async () => {

    await dao.deleteAllHikes();
    let res = await dao.getHikes();
    expect(res.length).toStrictEqual(0);


    let data = {
      label: "Gran Paradiso",
      length: 20500,
      expTime: 100,
      ascent: 23,
      difficulty: "3",
      description: "Alpine challenge 0",
      state: "Italy",
      region: "Piedmont",
      province: "Piemonte",
      municipality: "Cogne",
      authorID:1
    };

    await dao.newHike(data.label,
      data.length,
      data.expTime,
      data.ascent,
      data.difficulty,
      data.description,
      data.state,
      data.region,
      data.province,
      data.municipality,
      data.authorID);

    res = await dao.getHikes();
    expect(res.length).toStrictEqual(1);

    let id = 1;

    let newData = {
      label: "Gran ParadisoNew",
      length: 20500,
      expTime: 10,
      ascent: 23,
      difficulty: "3",
      description: "Alpine challengeNew",
      state: "France",
      region: "Piedmont",
      province: "Piemonte",
      municipality: "Cogne",
      authorID: 1
    };

    await dao.updateHike(newData.label,
      newData.length,
      newData.expTime,
      newData.ascent,
      newData.difficulty,
      newData.description,
      newData.state,
      newData.region,
      newData.province,
      newData.municipality,
      id);

    res = await dao.getHikes();
    expect(res.length).toStrictEqual(1);
    res = await dao.getHike(1);
    expect(res.length).toStrictEqual(1);
    let hike = res[0];

    expect(hike.label).toStrictEqual(newData.label);
    expect(hike.length).toStrictEqual(newData.length);
    expect(hike.expTime).toStrictEqual(newData.expTime);
    expect(hike.ascent).toStrictEqual(newData.ascent);
    expect(hike.difficulty).toStrictEqual(newData.difficulty);
    expect(hike.description).toStrictEqual(newData.description);
    expect(hike.province).toStrictEqual(newData.province);
    expect(hike.municipality).toStrictEqual(newData.municipality);
  });
}

function deleteHikeTest() {
  test('delete an hike', async () => {

    await dao.deleteAllHikes();
    let res = await dao.getHikes();
    expect(res.length).toStrictEqual(0);


    let data = {
      label: "Gran Paradiso",
      length: 20500,
      expTime: 100,
      ascent: 23,
      difficulty: "3",
      description: "Alpine challenge 0",
      state: "Italy",
      region: "Piedmont",
      province: "Piemonte",
      municipality: "Cogne",
      authorID:1
    };

    await dao.newHike(data.label,
      data.length,
      data.expTime,
      data.ascent,
      data.difficulty,
      data.description,
      data.state,
      data.region,
      data.province,
      data.municipality,
      data.authorID);

    res = await dao.getHikes();
    expect(res.length).toStrictEqual(1);

    let id = await dao.getLastHikeID();

    await dao.deleteHike(id);
    res = await dao.getHikes();
    expect(res.length).toStrictEqual(0);
  });
}


function createUser() {
  test('create new user', async () => {
      await user_dao.deleteAllUsers();
      let res = await user_dao.getUsers();
      expect(res.length).toStrictEqual(0);

        const data = {
          email: 'group11@p.it',
          password: 'ciao',
          accessRight: 'hiker'
      };

      await user_dao.newUser(data.email, data.password, data.accessRight);

  });
}
