const dao = require('../dao'); // module for accessing the DB
const dayjs = require('dayjs');

describe("test tracked hikes functions", () => {
    deleteAllTrackedHikesTest();
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

		await dao.startHike(1, 3, startTime);

        let res = await dao.getTrackedHikesByHikeIDAndUserID(1, 3);
        expect(res.length).toStrictEqual(1);
		expect(res[0].hikeID).toStrictEqual(1);
		expect(res[0].startTime).toStrictEqual(startTime);

		res = await dao.getTrackedHikesByUserID(3);
        expect(res.length).toStrictEqual(1);
		expect(res[0].hikeID).toStrictEqual(1);
		expect(res[0].startTime).toStrictEqual(startTime);
    });
}


function terminateHikeTest() {
    test('terminate an hike', async () => {
		const startTime = dayjs().format();
		const endTime = dayjs().format();

		await dao.startHike(1, 3, startTime);
        await dao.terminateHike(1, endTime);
		
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
