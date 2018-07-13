// Reports Admin Controller
angular.module('app').controller('ReportsAdminCtrl', function ($scope, $rootScope, $modal, $window, COPDialog, AppService, ReportsService, Constants) {
    'use strict';

    // Initilise all data
    $scope.constants = Constants;
    $scope.dto = {};

    AppService.appSettings().then(function (data) {
        $scope.dto.AppSettings = data;
        $window.document.title = $scope.dto.AppSettings.COPApplName + ': Reports Configuration';
    });

    $scope.newReport = function (templateUrl) {
        $scope.newReportItem = {};
        COPDialog.FormDialog("Create New Report", 'newReportItemTemplate.html', $scope.newReportItem).then(function (result) {
            if (result !== undefined) {
                ReportsService.createReport({ ReportItem: result }).then(function () {
                    //ReportsService.updateReports();
                    $scope.bindGrid();
                });
            }
        });
    };

    $scope.reportsColDef = [
        { field: 'Name', title: 'Name' },
        { field: 'Description', title: 'Description' },
        { field: 'Url', title: 'Url' },
        {
            command: [
                { name: "edit", iconClass: "glyphicon glyphicon-edit space-right" },
                {
                    name: "Delete",
                    iconClass: "glyphicon glyphicon-remove space-right",
                    click: function (e) {
                        e.preventDefault();
                        $scope.delete(this.dataItem($(e.target).closest("tr")));
                    }
                }
            ], title: "&nbsp;", width: '190px'
        }
    ]

    $scope.delete = function (dataItem) {
        COPDialog.Confirmation("Warning", "<h5>Are you sure you want to delete this record?</h5>").then(function (result) {
            if (result) {
                $scope.ReportsDataSource.remove(dataItem);
                $scope.ReportsDataSource.sync();
            }
        });
    }

    $scope.bindGrid = function () {
        $scope.ReportsDataSource = new kendo.data.DataSource({
            transport: {
                read: {
                    url: 'api/reports',
                    contentType: "application/json",
                    dataType: "json"
                },
                update: {
                    url: 'api/reports',
                    dataType: "json",
                    contentType: "application/json; charset=utf-8",
                    type: "put"
                },
                create: {
                    url: 'api/reports',
                    dataType: "json",
                    contentType: "application/json; charset=utf-8",
                    type: "post"
                },
                destroy: {
                    url: 'api/reports',
                    dataType: "json",
                    contentType: "application/json; charset=utf-8",
                    type: "delete"
                },
                parameterMap: function (options, operation) {
                    if (operation !== "read" && options.models) {
                        return '{ "ReportItem": ' + kendo.stringify(options.models[0]) + ' }'
                    }
                }
            },
            batch: true,
            schema: {
                model: {
                    id: "Id",
                    fields:
                    {
                        Id: {
                            editable: false,
                        },
                        Name: {
                            editable: true,
                            nullable: false
                        },
                        Description: {
                            editable: true,
                            nullable: false
                        },
                        Url: {
                            editable: true,
                            nullable: false
                        }
                    }
                }
            }

        });
    }

    $scope.bindGrid();
});