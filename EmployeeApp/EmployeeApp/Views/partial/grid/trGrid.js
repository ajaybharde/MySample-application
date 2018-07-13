angular.module('app').controller('trGridCtrl', function ($scope, $rootScope, $window, LookupService, GridService, AppService) {
    'use strict';

    AppService.appSettings().then(function (data) {
        $scope.dto.AppSettings = data;
        $window.document.title = $scope.dto.AppSettings.COPApplName + ': Lookup Configuration';
    });

    $scope.action = "Read";
    $scope.dto = {
        lookupTypes: [],
        lookups: [],
        gridData: [],
        pageSize: 5,
        page: 1
       

    };

    var getLookupTypes = function () {
        LookupService.getLookupTypes().then(function (response) {
            $scope.dto.lookupTypes = response.data;
        });
    }

    $scope.editLookup = function (lookup) {
        $scope.selectedLookup = angular.copy(lookup);

        if (lookup.StartDate) {
            $scope.selectedLookup.StartDate = moment(lookup.StartDate).toDate();
        }
        if (lookup.EndDate) {
            $scope.selectedLookup.EndDate = moment(lookup.EndDate).toDate();
        }

        $scope.maxOrderBy = _.max($scope.dto.lookups, function (item) { return item.OrderBy; }).OrderBy;
        $scope.lookupRange = _.range(1, $scope.maxOrderBy + 1);
        $scope.action = 'Edit';
        if (lookup.OrderBy == null) {
            $scope.lookupRange.push($scope.maxOrderBy + 1);
        }
    }
    $scope.createLookup = function () {
        $scope.action = 'Create';
        $scope.lookupRange.push($scope.maxOrderBy + 1);
        $scope.selectedLookup = {};
        $scope.selectedLookup.LookupTypeID = $scope.dto.lookupType.Id;
    }
    $scope.cancelEdit = function () {
        if ($scope.action == 'Create' || ($scope.action == 'Edit' && $scope.selectedLookup.OrderBy == null)) {
            $scope.lookupRange.pop();
        }
        $scope.action = 'Read';
        $scope.selectedLookup = {};
    }

    $scope.getLookups = function (lookupType) {
        LookupService.getLookups(lookupType.Id).then(function (response) {
            $scope.action = 'Read';
            $scope.dto.lookupType = lookupType;
            $scope.dto.lookups = response.data;
            $scope.maxOrderBy = _.max($scope.dto.lookups, function (item) { return item.OrderBy; }).OrderBy || 0;
            $scope.lookupRange = _.range(1, $scope.maxOrderBy + 1);
        });
    };

    $scope.saveLookupType = function (lookupType) {
        LookupService.saveLookupType({ LookupType: lookupType }).then(function (response) {
            $scope.dto.lookupTypes = response.data;
        });
    };

    $scope.saveLookup = function () {
        LookupService.saveLookup({ Lookup: $scope.selectedLookup }).then(function (response) {
            $scope.dto.lookups = response.data;
            toastr.success($scope.selectedLookup.Name + ' successfully saved', '');
            $scope.action = 'Read';
        });
    };

    $scope.setPagingData = function (data, page, pageSize) {
        var pagedData = data.slice((page - 1) * pageSize, page * pageSize);
        $scope.dto.gridData = pagedData;
        $scope.gridTotalCount = data.length;
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    };
    $scope.getPagedGridData = function (currentPage, pageItems, filterBy, filterByFields, orderBy, orderByReverse) {
        currentPage = currentPage === 0 ? $scope.dto.page : currentPage + 1;
        setTimeout(function () {
            GridService.getGridData().then(function (largeLoad) {
                $scope.setPagingData(largeLoad.data, currentPage, pageItems);
                $rootScope.busy = false;
            });
        }, 100);
    };
    //$scope.getPagedGridData($scope.dto.page, $scope.dto.pageSize, '', '', '', '');
});