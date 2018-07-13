angular.module('app').controller('LookupAdminCtrl', function ($scope, $rootScope, $window, LookupService, AppService) {
    'use strict';

    AppService.appSettings().then(function (data) {
        $scope.dto.AppSettings = data;
        $window.document.title = $scope.dto.AppSettings.COPApplName + ': Lookup Configuration';
    });

    $scope.action = "Read";
    $scope.dto = {
        lookupTypes: [],
        lookups: []
    };

    var getLookupTypes = function () {
        
        LookupService.getLookupTypes().then(function (response) {
            $scope.dto.lookupTypes = response.data;
            $rootScope.busy = false;
        });
    }

    $scope.editLookup = function (lookup) {
        $scope.selectedLookup = angular.copy(lookup);
        $scope.action = 'Edit';       
    }
    $scope.createLookup = function () {
        $scope.action = 'Create';  
        $scope.selectedLookup = {};
        $scope.selectedLookup.LookupTypeID = $scope.dto.lookupType.Id;
    }
    $scope.cancelEdit = function () {
        if ($scope.action == 'Create' || ($scope.action == 'Edit' && $scope.selectedLookup.OrderBy == null)) {
           // $scope.lookupRange.pop();
        }
        $scope.action = 'Read';
        $scope.selectedLookup = {};
    }

    $scope.getLookups = function (lookupType) {

        LookupService.getLookups(lookupType.Id).then(function (response) {
           
            $scope.action = 'Read';
            $scope.dto.lookupType = lookupType;
            $scope.dto.lookups = response.data;
            //$scope.maxOrderBy = _.max($scope.dto.lookups, function (item) { return item.OrderBy; }).OrderBy || 0;
            //$scope.lookupRange = _.range(1, $scope.maxOrderBy + 1);
            $rootScope.busy = false;
        });
    };

    $scope.saveLookupType = function (lookupType) {

        LookupService.saveLookupType({ LookupType: lookupType }).then(function (response) {
            $scope.dto.lookupTypes = response.data;
            $rootScope.busy = false;
        });
    };

    $scope.saveLookup = function () {

        var filtered = _.filter($scope.dto.lookups, function (i) { return ((i.Name.trim().toUpperCase() == $scope.selectedLookup.Name.trim().toUpperCase()) && (i.Id != $scope.selectedLookup.Id)); });
        if (filtered.length > 0) {
            $window.alert("Same Name is already present in the database.");
            return ".";
        }

        LookupService.saveLookup({ Lookuphead: $scope.selectedLookup }).then(function (response) {
               

            $scope.dto.lookups = response.data;
            toastr.success($scope.selectedLookup.Name + ' successfully saved', '');
            $scope.action = 'Read';
            $rootScope.busy = false;
        });
    };

    getLookupTypes();
});