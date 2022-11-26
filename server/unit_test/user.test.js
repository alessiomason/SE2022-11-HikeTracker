const user_dao = require('../user-dao'); // module for accessing the DB

describe("CRUD Users functions", () => {
    deleteAllUsersTest();
    newUserTest();
});

function deleteAllUsersTest() {
    test('delete db', async () => {
        await user_dao.deleteAllUsers();
        let res = await user_dao.getUsers();
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