var Insteon = require('home-controller').Insteon;
var hub = new Insteon();
var express = require('express');
var app = express();
var util = require('util');

app.get('/light/:id/on', function(req, res){
    var id = req.params.id;
    hub.light(id).turnOn()
        .then(function (status) {
            if(status.response) {
                res.status(200).end();
            } else {
                res.status(404).end();
            }
        });
});

app.get('/light/:id/off', function(req, res){
    var id = req.params.id;
    hub.light(id).turnOff()
        .then(function (status) {
            if(status.response) {
                res.status(200).end();
            } else {
                res.status(404).end();
            }
        });
});

hub.connect(process.env.HUB_IP, function () {
    app.listen(3000);
});

hub.links().then(function(devices) {
    util.log("%j", devices);
});


var desklamp = hub.light('2c5fd1');

function log(event) {
    return function() {
        util.log(util.format('%s: %j', event, arguments));
    };
}

desklamp.on('turnOn', log('turnOn'));
desklamp.on('turnOnFast', log('turnOnFast'));
desklamp.on('brightened', log('brightened'));
desklamp.on('turnOff', log('turnOff'));
desklamp.on('turnOffFast', log('turnOffFast'));
desklamp.on('dimmed', log('dimmed'));
