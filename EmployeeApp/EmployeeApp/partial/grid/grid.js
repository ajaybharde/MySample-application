angular.module('app').controller('GridCtrl', function ($scope, $rootScope, $window, LookupService, GridService, AppService) {
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



    /* Grid Logic */
    $scope.filterOptions = {
        filterText: "",
        useExternalFilter: true
    };
    $scope.totalServerItems = 0;
    $scope.pagingOptions = {
        pageSizes: [5, 10, 20],
        pageSize: 5,
        currentPage: 1
    };
    $scope.setPagingData = function (data, page, pageSize) {
        var pagedData = data.slice((page - 1) * pageSize, page * pageSize);
        $scope.myData = pagedData;
        $scope.totalServerItems = data.length;
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    };
    $scope.getPagedDataAsync = function (pageSize, page, searchText) {
        setTimeout(function () {
            var data;
            if (searchText) {
                var ft = searchText.toLowerCase();
                $http.get('largeLoad.json').success(function (largeLoad) {
                    data = largeLoad.filter(function (item) {
                        $rootScope.busy = false;
                        return JSON.stringify(item).toLowerCase().indexOf(ft) != -1;
                    });
                    $scope.setPagingData(data, page, pageSize);
                    $rootScope.busy = false;
                });
            } else {

                GridService.getGridData().then(function (largeLoad) {
                    $rootScope.busy = false;
                    $scope.setPagingData(largeLoad.data, page, pageSize);
                });

                
            }
        }, 100);
    };

    $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);

    $scope.$watch('pagingOptions', function (newVal, oldVal) {
        if (newVal !== oldVal && newVal.currentPage !== oldVal.currentPage) {
            $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
        }
    }, true);
    $scope.$watch('filterOptions', function (newVal, oldVal) {
        if (newVal !== oldVal) {
            $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
        }
    }, true);

    $scope.gridOptions = {
        data: 'myData',
        enablePaging: true,
        showFooter: true,
        totalServerItems: 'totalServerItems',
        pagingOptions: $scope.pagingOptions,
        filterOptions: $scope.filterOptions
    };



    //getLookupTypes();
});