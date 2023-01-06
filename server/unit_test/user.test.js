const user_dao = require('../user-dao'); // module for accessing the DB
const dao = require('../dao');

describe("CRUD Users functions", () => {
    deleteAllUsersTest();
    newUserTest();
   newHutWorkerTest();
    updateUserStatsTest();
});

function deleteAllUsersTest() {
    test('delete db', async () => {
        await user_dao.deleteAllUsers();
        let res = await user_dao.getUsers();
        expect(res.length).toStrictEqual(0);
    });
}


function newHutWorkerTest()
{
    test('create new hut worker', async () => {
        await user_dao.deleteAllUsers();
        let res = await user_dao.getUsers();
        expect(res.length).toStrictEqual(0);

        const data = {
            email: 'u1@p.it',
            password: 'ciao',
            accessRight: 'hut-worker',
            hut: '12'
        };

        await user_dao.newHutWorker(data.email, data.password, data.accessRight,data.hut);

        res = await user_dao.getUsers();
        expect(res.length).toStrictEqual(1);

        const user = await user_dao.getUser('u1@p.it', 'ciao');

        expect(user.email).toStrictEqual(data.email);
        expect(user.access_right).toStrictEqual(data.accessRight);
        expect(user.verified).toStrictEqual(0);

        const userById = await user_dao.getUserById(1);

        expect(userById.email).toStrictEqual(data.email);
        expect(userById.access_right).toStrictEqual(data.accessRight);
        expect(userById.verified).toStrictEqual(0);


        await user_dao.deleteAllUsers();
        res = await user_dao.getUsers();
        expect(res.length).toStrictEqual(0);
    });
}


function newUserTest() {
    test('create new user', async () => {
        await user_dao.deleteAllUsers();
        let res = await user_dao.getUsers();
        expect(res.length).toStrictEqual(0);

        const data = {
            email: 'u1@p.it',
            password: 'ciao',
            accessRight: 'hiker'
        };

        await user_dao.newUser(data.email, data.password, data.accessRight);

        res = await user_dao.getUsers();
        expect(res.length).toStrictEqual(1);

        const user = await user_dao.getUser('u1@p.it', 'ciao');

        expect(user.email).toStrictEqual(data.email);
        expect(user.access_right).toStrictEqual(data.accessRight);
        expect(user.verified).toStrictEqual(0);

        const userById = await user_dao.getUserById(1);

        expect(userById.email).toStrictEqual(data.email);
        expect(userById.access_right).toStrictEqual(data.accessRight);
        expect(userById.verified).toStrictEqual(0);

        await user_dao.deleteAllUsers();
        res = await user_dao.getUsers();
        expect(res.length).toStrictEqual(0);
    });
}

function updateUserStatsTest() {
    test("update user's stats", async () => {
        await user_dao.deleteAllUsers();
        let res = await user_dao.getUsers();
        expect(res.length).toStrictEqual(0);

        const data = {
            email: 'u1@p.it',
            password: 'ciao',
            accessRight: 'hiker'
        };

        await user_dao.newUser(data.email, data.password, data.accessRight);
        let userStats = await dao.getUserStats(1);
        expect(userStats.hikesFinished).toStrictEqual(0);
        expect(userStats.walkedLength).toStrictEqual(0.0);
        expect(userStats.totalHikeTime).toStrictEqual(0.0);
        expect(userStats.totalAscent).toStrictEqual(0.0);
        expect(userStats.highestAltitude).toStrictEqual(null);
        expect(userStats.highestAltitudeRange).toStrictEqual(null);
        expect(userStats.longestHikeByKmID).toStrictEqual(null);
        expect(userStats.longestHikeByKmLength).toStrictEqual(null);
        expect(userStats.longestHikeByHoursID).toStrictEqual(null);
        expect(userStats.longestHikeByHoursTime).toStrictEqual(null);
        expect(userStats.shortestHikeByKmID).toStrictEqual(null);
        expect(userStats.shortestHikeByKmLength).toStrictEqual(null);
        expect(userStats.shortestHikeByHoursID).toStrictEqual(null);
        expect(userStats.shortestHikeByHoursTime).toStrictEqual(null);
        expect(userStats.fastestPacedHikeID).toStrictEqual(null);
        expect(userStats.fastestPacedHikePace).toStrictEqual(null);

        const fakeUserStats = {
            hikesFinished: 3,
            walkedLength: 3741.74,
            totalHikeTime: 5675.9,
            totalAscent: 876.9,
            highestAltitude: 4354.82,
            highestAltitudeRange: 665.7,
            longestHikeByKmID: 1,
            longestHikeByKmLength: 986.543,
            longestHikeByHoursID: 2,
            longestHikeByHoursTime: 56754.756,
            shortestHikeByKmID: 4,
            shortestHikeByKmLength: 344.5534,
            shortestHikeByHoursID: 3,
            shortestHikeByHoursTime: 4324.55,
            fastestPacedHikeID: 18,
            fastestPacedHikePace: 4324.543
        };

        await dao.updateUserStats(1, fakeUserStats);
        userStats = await dao.getUserStats(1);
        expect(userStats.hikesFinished).toStrictEqual(fakeUserStats.hikesFinished);
        expect(userStats.walkedLength).toStrictEqual(fakeUserStats.walkedLength);
        expect(userStats.totalHikeTime).toStrictEqual(fakeUserStats.totalHikeTime);
        expect(userStats.totalAscent).toStrictEqual(fakeUserStats.totalAscent);
        expect(userStats.highestAltitude).toStrictEqual(fakeUserStats.highestAltitude);
        expect(userStats.highestAltitudeRange).toStrictEqual(fakeUserStats.highestAltitudeRange);
        expect(userStats.longestHikeByKmID).toStrictEqual(fakeUserStats.longestHikeByKmID);
        expect(userStats.longestHikeByKmLength).toStrictEqual(fakeUserStats.longestHikeByKmLength);
        expect(userStats.longestHikeByHoursID).toStrictEqual(fakeUserStats.longestHikeByHoursID);
        expect(userStats.longestHikeByHoursTime).toStrictEqual(fakeUserStats.longestHikeByHoursTime);
        expect(userStats.shortestHikeByKmID).toStrictEqual(fakeUserStats.shortestHikeByKmID);
        expect(userStats.shortestHikeByKmLength).toStrictEqual(fakeUserStats.shortestHikeByKmLength);
        expect(userStats.shortestHikeByHoursID).toStrictEqual(fakeUserStats.shortestHikeByHoursID);
        expect(userStats.shortestHikeByHoursTime).toStrictEqual(fakeUserStats.shortestHikeByHoursTime);
        expect(userStats.fastestPacedHikeID).toStrictEqual(fakeUserStats.fastestPacedHikeID);
        expect(userStats.fastestPacedHikePace).toStrictEqual(fakeUserStats.fastestPacedHikePace);

        await user_dao.deleteAllUsers();
        res = await user_dao.getUsers();
        expect(res.length).toStrictEqual(0);
    });
}