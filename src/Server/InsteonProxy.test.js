var request = require('supertest');
var proxyquire = require('proxyquire').noCallThru();
var sinon = require('sinon');
var mockHomeController = require('../../test/mockHomeController');
var _ = require('lodash');

_.templateSettings.interpolate = /{{([\s\S]+?)}}/g;

describe('Server', function () {
    var server;

    beforeEach(function () {
        server = proxyquire(__dirname + '/InsteonProxy.js', {
            'home-controller': mockHomeController
        });
    });

    afterEach(function() {
        mockHomeController.$reset();
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
        it('should call the links() endpoint of the hub and return a list of devices', function(done) {
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
        var actionTestCases = _([
            {action: 'off', targetActionMethod: mockHomeController.$lightActions.turnOff},
            {action: 'on', targetActionMethod: mockHomeController.$lightActions.turnOn},
            {action: 'offFast', targetActionMethod: mockHomeController.$lightActions.turnOffFast},
            {action: 'onFast', targetActionMethod: mockHomeController.$lightActions.turnOnFast},
            {action: 'brighten', targetActionMethod: mockHomeController.$lightActions.brighten},
            {action: 'dim', targetActionMethod: mockHomeController.$lightActions.dim}
        ]);
        actionTestCases.each(function(testCase) {
            it(_.template('should respond to /light/#/{{action}}', {action: testCase.action}), function(done) {
                request(server)
                    .get(_.template('/light/1/{{action}}', {action: testCase.action}))
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .end(function(res) {
                        assert.ok(mockHomeController.$class.methods.light.calledOnce, 'light() not called');
                        assert.ok(mockHomeController.$class.methods.light.calledWith('1'), 'light() not called with correct parameter');
                        assert.ok(testCase.targetActionMethod.calledOnce, 'action method not called');
                        assert.ok(testCase.targetActionMethod.calledWith(), 'action method should not be called with a parameter');
                        done();
                    });
            });
        });
        var statusTestCases = _([
            {
                status: 'level',
                targetStatusMethod: mockHomeController.$lightActions.level,
                expectedResponse: mockHomeController.$data.levelResponse
            },
            {
                status: 'rampRate',
                targetStatusMethod: mockHomeController.$lightActions.rampRate,
                expectedResponse: mockHomeController.$data.rampRateResponse
            },
            {
                status: 'onLevel',
                targetStatusMethod: mockHomeController.$lightActions.onLevel,
                expectedResponse: mockHomeController.$data.onLevelResponse
            }
        ]);
        statusTestCases.each(function(testCase) {
            it(_.template('should return the {{status}} setting when /light/#/{{status}} is called', {status: testCase.status}), function(done) {
                var expectedResponse = {};
                expectedResponse[testCase.status] = testCase.expectedResponse;
                request(server)
                    .get(_.template('/light/1/{{status}}', {status: testCase.status}))
                    .expect(200, expectedResponse)
                    .expect('Content-Type', /json/)
                    .end(function(res) {
                        assert.ok(mockHomeController.$class.methods.light.calledOnce, 'light() not called');
                        assert.ok(mockHomeController.$class.methods.light.calledWith('1'), 'light() not called with correct parameter');
                        assert.ok(testCase.targetStatusMethod.calledOnce, 'status method not called');
                        assert.ok(testCase.targetStatusMethod.calledWith(), 'status method should not be called with a parameter');
                        done();
                    });
            });
        });
    });
});
