const dao = require('../dao'); // module for accessing the DB
const dayjs = require('dayjs');
const user_dao = require('../user-dao'); // module for accessing the DB

describe("test tracked hikes functions", () => {
    deleteAllTrackedHikesTest();
	createUser();
	startHikeTest();
	deleteAllTrackedHikesTest();
	terminateHikeTest();
	deleteAllTrackedHikesTest();
})

function deleteAllTrackedHikesTest() {
    test('delete all tracked hikes', async () => {
        await dao.deleteAllTrackedHikes();

		let res = await dao.getTrackedHikesByHikeIDAndUserID(1, 3);
        expect(res.length).toStrictEqual(0);

		res = await dao.getTrackedHikesByUserID(3);
        expect(res.length).toStrictEqual(0);
    });
}

function startHikeTest() {
    test('start a new hike', async () => {
		const startTime = dayjs().format();

		await dao.startHike(1, 3, "1/3", startTime);

        let res = await dao.getTrackedHikesByHikeIDAndUserID(1, 3);
        expect(res.length).toStrictEqual(1);
		expect(res[0].hikeID).toStrictEqual(1);
		expect(res[0].startTime).toStrictEqual(startTime);

		res = await dao.getTrackedHikesByUserID(3);
        expect(res.length).toStrictEqual(1);
		expect(res[0].hikeID).toStrictEqual(1);
		expect(1).toStrictEqual(1);
    });
}


function terminateHikeTest() {
    test('terminate an hike', async () => {
		const startTime = dayjs().format();
		const endTime = dayjs().format();

		await dao.startHike(1, 3,"0/0", startTime);
        await dao.terminateHike(1, endTime, "0/0");
		
		let res = await dao.getTrackedHikesByHikeIDAndUserID(1, 3);
        expect(res.length).toStrictEqual(1);
		expect(res[0].hikeID).toStrictEqual(1);
		expect(res[0].startTime).toStrictEqual(startTime);
		expect(res[0].endTime).toStrictEqual(endTime);

		res = await dao.getTrackedHikesByUserID(3);
        expect(res.length).toStrictEqual(1);
		expect(res[0].hikeID).toStrictEqual(1);
		expect(res[0].startTime).toStrictEqual(startTime);
		expect(res[0].endTime).toStrictEqual(endTime);
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