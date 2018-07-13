// About Controller
angular.module('app').controller('AboutCtrl', function ($scope, $rootScope, $window,  AppService) {
    'use strict';

    // Initilise all data
    $scope.dto = {};

    AppService.userDetails().then(function (data) {
        $scope.dto.UserDetails = data;
        $rootScope.busy = false;
    });

    AppService.appSettings().then(function (data) {
        $scope.dto.AppSettings = data;
        $window.document.title = $scope.dto.AppSettings.COPApplName + ': About';
        $rootScope.busy = false;
    });
});