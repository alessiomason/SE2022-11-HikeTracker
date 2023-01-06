const dao = require('../dao'); // module for accessing the DB

describe("test Weather Alert functions", () => {
    deleteAllHikeConditions();
    newHikeCondition();
    deleteAllHikeConditions();
    newHikeCondition();
    deleteHikeConditionTest();
  })

function deleteAllHikeConditions() {
    test('delete db', async () => {
      await dao.deleteAllHikeConditions()
      let res = await dao.getHikeConditions();
      expect(res.length).toStrictEqual(0);
    });
}

function newHikeCondition() {
    test('creates new hike condition', async () => {
        let data = {
            hikeID: 1, 
            hutID: 14, 
            typeCondition: "Closed",
            description: "Attention, street closed!" 
        };

        await dao.addHikeCondition(
            data.hikeID,
            data.hutID,
            data.typeCondition,
            data.description);

        res = await dao.getHikeConditions();
        expect(res.length).toStrictEqual(1);
    });
}

function deleteHikeConditionTest() {
    test('delete an hike condition', async () => {
        res = await dao.getHikeConditions();
        expect(res.length).toStrictEqual(1);

        let hikeCondition = res[0];

        await dao.deleteHikeCondition(hikeCondition.conditionID);
        res = await dao.getHikeConditions();
        expect(res.length).toStrictEqual(0);
    });
}