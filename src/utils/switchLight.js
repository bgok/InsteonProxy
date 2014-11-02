var util = require('util');

var Insteon = require('home-controller').Insteon;
var hub = new Insteon();

var hubIp = process.argv[3];
var deviceId = process.argv[4];
var action = process.argv[2];

var logAndClose = function () {
    console.log(util.format("%s turned %s", deviceId, action));
    hub.close();
};

hub.connect(hubIp, function () {
    if (action === 'on') {
        hub.light(deviceId).turnOn().then(logAndClose);
    } else if (action === 'off') {
        hub.light(deviceId).turnOff().then(logAndClose);
    } else {
        console.log(util.format('unknown action: %s', action));
    }
});
