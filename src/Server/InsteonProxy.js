var Insteon = require('home-controller').Insteon;
var hub = new Insteon();
var express = require('express');
var app = express();
var util = require('util');

app.get('/devices', function(reg, res) {
    hub.links()
        .then(function(deviceList) {
            if (deviceList) {
                res.status(200).json(deviceList).end();
            } else {
                res.status(404).end();
            }
        });
});


app.get('/light/:id/:action', function(req, res){
    var id = req.params.id,
        action = req.params.action,
        deviceHandle = hub.light(id),
        actionPromise, statusFieldName;

    switch (action) {
        case 'on':
            actionPromise = deviceHandle.turnOn();
            break;
        case 'onFast':
            actionPromise = deviceHandle.turnOnFast();
            break;
        case 'off':
            actionPromise =  deviceHandle.turnOff();
            break;
        case 'offFast':
            actionPromise = deviceHandle.turnOffFast();
            break;
        case 'brighten':
            actionPromise = deviceHandle.brighten();
            break;
        case 'dim':
            actionPromise = deviceHandle.dim();
            break;
        case 'level':
            statusFieldName = 'level';
            actionPromise = deviceHandle.level();
            break;
        case 'rampRate':
            statusFieldName = 'rampRate';
            actionPromise = deviceHandle.rampRate();
            break;
        case 'onLevel':
            statusFieldName = 'onLevel';
            actionPromise = deviceHandle.onLevel();
            break;
    }

    if (actionPromise) {
        actionPromise.then(function (status) {
            if (status.response) {
                res.status(200).json(status.response).end();
            } else if (status) {
                var returnValue = {};
                returnValue[statusFieldName] = status;
                res.status(200).json(returnValue).end();
            } else {
                res.status(404).json({
                    error: {
                        message: "communication failed"
                    }
                }).end();
            }
        });
    } else {
        res.status(404).json({
            error: {
                message: "unknown action"
            }
        }).end();
    }
});

hub.connect(process.env.HUB_IP, function () {
    app.listen(3000);
});

module.exports = app;

//var desklamp = hub.light('2c5fd1');
//
//function log(event) {
//    return function() {
//        util.log(util.format('%s: %j', event, arguments));
//    };
//}
//
//desklamp.on('turnOn', log('turnOn'));
//desklamp.on('turnOnFast', log('turnOnFast'));
//desklamp.on('brightened', log('brightened'));
//desklamp.on('turnOff', log('turnOff'));
//desklamp.on('turnOffFast', log('turnOffFast'));
//desklamp.on('dimmed', log('dimmed'));
