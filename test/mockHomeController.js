var sinon = require('sinon');
var q = require('q');
var extend = require('extend');

var deviceList = [
    {id: 'foo'}
];
var actionResponse = {
    response: {id: '1'}
};
var levelResponse = "50";
var rampRateResponse = "1000";
var onLevelResponse = "75";

var lightActions = {
    turnOff: sinon.stub().returns(q(actionResponse)),
    turnOn: sinon.stub().returns(q(actionResponse)),
    turnOffFast: sinon.stub().returns(q(actionResponse)),
    turnOnFast: sinon.stub().returns(q(actionResponse)),
    brighten: sinon.stub().returns(q(actionResponse)),
    dim: sinon.stub().returns(q(actionResponse)),
    on: sinon.stub(),
    level: sinon.stub().returns(q(levelResponse)),
    rampRate: sinon.stub().returns(q(rampRateResponse)),
    onLevel: sinon.stub().returns(q(onLevelResponse))
};

var mockInsteonClass = {
    constructor: function() {
        extend(this, mockInsteonClass.methods);
    },
    methods: {
        connect: sinon.stub().returns(q()),
        links: sinon.stub().returns(q(deviceList)),
        light: sinon.stub().returns(lightActions)
    }
};

mockInsteonClass.constructorSpy = sinon.spy(mockInsteonClass, 'constructor');

module.exports = {
    Insteon: mockInsteonClass.constructorSpy,
    $class: mockInsteonClass,
    $lightActions: lightActions,
    $reset: function() {
        mockInsteonClass.constructorSpy.reset();
        mockInsteonClass.methods.connect.reset();
        mockInsteonClass.methods.light.reset();
        mockInsteonClass.methods.links.reset();
        lightActions.turnOff.reset();
        lightActions.turnOn.reset();
        lightActions.turnOffFast.reset();
        lightActions.turnOnFast.reset();
        lightActions.brighten.reset();
        lightActions.dim.reset();
        lightActions.level.reset();
        lightActions.rampRate.reset();
        lightActions.onLevel.reset();
    },
    $data: {
        deviceList: deviceList,
        actionResponse: actionResponse,
        levelResponse: levelResponse,
        rampRateResponse:rampRateResponse,
        onLevelResponse:onLevelResponse
    }

};