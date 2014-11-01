define(['chai', 'deviceList/DeviceListController', 'deviceList/deviceList.html'], function(chai) {
    var assert = chai.assert;
    var testMessage = 'M.O.A.H.A.S. is now in control';
    var $scope, $compile, controller, template;

    beforeEach(module('moahas'));
    beforeEach(module('deviceList/deviceList.html'));

    beforeEach(inject(function($controller, $rootScope, _$compile_, $templateCache){
        $compile = _$compile_;

        $scope = $rootScope.$new();
        controller = $controller('DeviceListController', { $scope: $scope });
        template = $templateCache.get('deviceList/deviceList.html');
    }));

    describe('DeviceListController', function() {
        it('should have a message in scope', function() {
            assert.equal(testMessage, $scope.helloMessage);
        });
        it('should write the message', function() {
            var element = $compile(template)($scope);
            assert.notInclude(template, testMessage);
            $scope.$digest();
            assert.include(element.html(), testMessage);
        });
        it('should show a list of devices');
        it('should send the "on" action to the device when the on button is clicked');
        it('should persist a device name');
    });
});
