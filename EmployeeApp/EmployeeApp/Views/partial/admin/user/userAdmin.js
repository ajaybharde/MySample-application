angular.module('app').controller('UserAdminCtrl',
    function ($scope, $rootScope, $http, $window, AppService, UserAdminService, HttpHelpers, Constants) {
        'use strict';

        $scope.constants = Constants;
        $scope.dto = {};
        $scope.userSelected = false;
        $scope.filterOptions = { filterText: '' };
        $scope.selectedTab = 1;
        $scope.selectedRoles = [];

        AppService.appSettings().then(function (data) {
            $scope.dto.AppSettings = data;
            $window.document.title = $scope.dto.AppSettings.COPApplName + ': Headcount';
        });

        $scope.getRoleList = function () {
            UserAdminService.getRoleList().then(function (response) {
                $scope.dto.RoleList = response.data;
                $rootScope.busy = false;
            });
        };

        $scope.getAuthUsers = function () {
            UserAdminService.getAuthUsers().then(function (response) {
                $scope.dto.AuthUsers = response.data;
                $rootScope.busy = false;
            });
        };

        $scope.getAuthUsersByRole = function (role) {
            UserAdminService.getAuthUsersByRole(role).then(function (response) {
                $scope.dto.AuthUsers = response.data;
                $rootScope.busy = false;
            });
        };

        $scope.updateRole = function (row) {
            UserAdminService.updateRole(row.UserName, row.Roles).then(function (response) {
                $rootScope.busy = false;
                toastr.success(row.DisplayName + ' updated to role [' + row.Roles + ']', '');
                _.find($scope.dto.AuthUsers, { Id: response.data.Id }).Roles = response.data.Roles;
                $scope.getAuthUsers();
            });
        };

        $scope.addUser = function (action, user) {
            if (_.some($scope.dto.AuthUsers, { 'UserName': user.SamaccountName })) {
                $rootScope.busy = false;
                toastr.warning('User \'' + user.DisplayName + '\' already exists', '');
                return;
            }
            UserAdminService.addUser(user.SamaccountName).then(function (response) {
                $rootScope.busy = false;
                toastr.success(user.DisplayName + ' successfully added', '');
                $scope.dto.AuthUsers = response.data;
                $rootScope.busy = false;
            });
        };

        $scope.removeUser = function (row) {
            UserAdminService.removeUser(row.entity.UserName).then(function (response) {
                $rootScope.busy = false;
                toastr.success(row.entity.DisplayName + ' removed', '');
                $scope.dto.AuthUsers = response.data;
            });
        };

        $scope.dto.UserAccessLog = new kendo.data.DataSource({
            transport: {
                read: {
                    url: 'api/user/accesslog/',
                    dataType: "json"
                }
            },
            pageSize: 20
        });

        $scope.getStats = function (userId) {
            UserAdminService.getStats(userId).then(function (response) {
                $rootScope.busy = false;
                $scope.dto.Stats = response.data;
            });
        };
        $scope.getUsers = function () {
            UserAdminService.getUsers().then(function (response) {
                $scope.dto.Users = response.data;
                $rootScope.busy = false;

            });
        };
        $scope.exportToCSV = function () {
            $window.location.href = "api/user/accesslog?format=csv";
        };

        $scope.selecteTab = function (tabNo) {
            $scope.selectedTab = tabNo;
            $(window).resize();
        }

        $scope.onDataBound = function (e) {
            var grid = e.sender;
            if (grid.dataSource.group() && grid.dataSource.group().length > 0) {
                var groupList = $(".k-grouping-row");

                for (var i = 0; i < groupList.length; i++) {
                    var firstGroup = groupList[i];
                    if (firstGroup) {
                        grid.collapseGroup(firstGroup);
                    }
                }
            }
        };

        $scope.chart = {
            type: "PieChart",
            displayed: true,
            options: {
                chartArea: { left: 40, top: 10, width: "85%", height: "85%" },
                width: '100%',
                fontSize: 12,
                height: 350,
                hAxix: {},
                vAxis: {}
            }
        };

        //$scope.getStats();
        //$scope.getUsers();
        $scope.getAuthUsers();
    });