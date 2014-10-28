var request = require('request');
var proxyquire = require('proxyquire').noCallThru();
var sinon = require('sinon');
var mockHomeController = require('../test/mockHomeController');

describe('Server', function () {
    var server;

    beforeEach(function () {
        proxyquire('../src/InsteonProxy.js', {
            'home-controller': mockHomeController
        });
    });

    afterEach(function() {
        mockHomeController.$reset();
    });

    beforeEach(function () {
        server = require('../src/InsteonProxy');
    });

    it('should instantiate an Insteon object', function() {
        assert.ok(mockHomeController.Insteon.calledOnce);
    });

    it('should set up a connection to the insteon hub', function() {
        assert.ok(mockHomeController.$class.methods.connect.calledOnce);

    });

    describe('/devices endpoint', function () {
        it('should call the links endpoint of the hub');
        it('should return a list of devices');
    });

    describe('/light endpoint', function () {
        it('should call the light endpoint of the hub');
        it('should accept the \'on\' action');
    });
});
