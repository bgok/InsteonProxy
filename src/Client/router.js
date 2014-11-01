angular.module('moahas')
    .config(function ($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'deviceList/deviceList.html',
                controller: 'DeviceListController'
            });

        // configure html5 to get links working on jsfiddle
        $locationProvider.html5Mode(true);
    });
