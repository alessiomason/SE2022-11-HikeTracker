const dao = require('../dao'); // module for accessing the DB

describe("test Weather Alert functions", () => {
    deleteAllWeatherAlertTest();
    newWeatherAlert();
    deleteAllWeatherAlertTest();
    newWeatherAlert();
    deleteWeatherAlertTest();
  })

function deleteAllWeatherAlertTest() {
    test('delete db', async () => {
      await dao.deleteAllWeatherAlerts();
      let res = await dao.getWeatherAlerts();
      expect(res.length).toStrictEqual(0);
    });
}

function newWeatherAlert() {
    test('creates new weather alert', async () => {
        let data = {
            type: "Snowy", 
            radius: 20, 
            lat: 45.17731777167853, 
            lon: 7.090988159179688, 
            time: "2023-01-27T02:52:00.000Z", 
            description: "Attention, snow!" 
        };

        await dao.addWeatherAlert(
            data.type,
            data.radius,
            data.lat,
            data.lon,
            data.time,
            data.description);

        res = await dao.getWeatherAlerts();
        expect(res.length).toStrictEqual(1);
    });
}

function deleteWeatherAlertTest() {
    test('delete a weather alert', async () => {
        res = await dao.getWeatherAlerts();
        expect(res.length).toStrictEqual(1);

        let weatherAlert = res[0];

        await dao.deleteWeatherAlert(weatherAlert.weatherAlertID);
        res = await dao.getWeatherAlerts();
        expect(res.length).toStrictEqual(0);
    });
}