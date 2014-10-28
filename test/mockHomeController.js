var sinon = require('sinon');
var q = require('q');
var extend = require('extend');

function promiseFactory(returned) {
    var deferred = q.defer();
    setTimeout(function () {
        deferred.resolve(returned);
    });
    return deferred.promise;
}

var mockInsteonClass = {
    constructor: function() {
        extend(this, mockInsteonClass.methods);
    },
    methods: {
        connect: sinon.stub().returns(promiseFactory()),
        light: sinon.stub().returns({
            on: sinon.stub()
        })
    }
};

mockInsteonClass.constructorSpy = sinon.spy(mockInsteonClass, 'constructor');


module.exports = {
    Insteon: mockInsteonClass.constructorSpy,
    $class: mockInsteonClass,
    $reset: function() {
        mockInsteonClass.constructorSpy.reset();
        mockInsteonClass.methods.connect.reset();
        mockInsteonClass.methods.light.reset();
    }
};