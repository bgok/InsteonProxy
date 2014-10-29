var request = require('supertest');
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
        assert.ok(mockHomeController.$class.methods.connect.calledWith(
            sinon.match(process.env.HUB_IP), sinon.match.typeOf("function")
        ));
    });

    describe('/devices endpoint', function () {
        it('should call the links endpoint of the hub and return a list of devices', function(done) {
            request(server)
                .get('/devices')
                .expect(200, mockHomeController.$data.deviceList)
                .expect('Content-Type', /json/)
                .end(function() {
                    assert.ok(mockHomeController.$class.methods.links.calledOnce);
                    assert.ok(mockHomeController.$class.methods.links.calledWith());
                    done();
                });
        });
    });

    describe('/light endpoint', function () {
        var testCases = [
            {action: 'off', targetActionMethod: mockHomeController.$lightActions.turnOff},
            {action: 'on', targetActionMethod: mockHomeController.$lightActions.turnOn},
            {action: 'offFast', targetActionMethod: mockHomeController.$lightActions.turnOffFast},
            {action: 'onFast', targetActionMethod: mockHomeController.$lightActions.turnOnFast},
            {action: 'brighten', targetActionMethod: mockHomeController.$lightActions.brighten},
            {action: 'dim', targetActionMethod: mockHomeController.$lightActions.dim}
        ];
        testCases.forEach(function(testCase) {
            it('should respond to /light/#/' + testCase.action, function(done) {
                request(server)
                    .get('/light/1/' + testCase.action)
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .end(function(res) {
                        assert.ok(mockHomeController.$class.methods.light.calledOnce, 'light() not called');
                        assert.ok(mockHomeController.$class.methods.light.calledWith('1'), 'light() not called with correct parameter');
                        assert.ok(testCase.targetActionMethod.calledOnce, 'turnOff() not called');
                        assert.ok(testCase.targetActionMethod.calledWith(), 'turnOff() not called with no parameter');
                        done();
                    });
            });
        });
    });
});
