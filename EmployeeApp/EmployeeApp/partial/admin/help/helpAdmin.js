// Help Admin Controller
angular.module('app').controller('HelpAdminCtrl', function ($scope, $rootScope, $modal, $window, COPDialog, AppService, HelpService, Constants) {
    'use strict';

    // Initilise all data
    $scope.constants = Constants;
    $scope.dto = {};

    AppService.appSettings().then(function (data) {
        $scope.dto.AppSettings = data;
        $window.document.title = $scope.dto.AppSettings.COPApplName + ': Help Configuration';
    });

    $scope.newHelp = function (templateUrl) {
        $scope.newHelpItem = {};
        COPDialog.FormDialog("Create New Help Item", 'newHelpItemTemplate.html', $scope.newHelpItem).then(function (result) {
            if (result !== undefined) {
                HelpService.createHelp({ HelpItem: result }).then(function () {
                    $scope.bindGrid();
                });
            }
        });
    };

    $scope.helpColDef = [
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
            ], width: '190px'
        }
    ]

    $scope.delete = function (dataItem) {
        COPDialog.Confirmation("Warning", "<h5>Are you sure you want to delete this record?</h5>").then(function (result) {
            if (result) {
                $scope.HelpItemsDataSource.remove(dataItem);
                $scope.HelpItemsDataSource.sync();
            }
        });
    }

    $scope.bindGrid = function () {
        $scope.HelpItemsDataSource = new kendo.data.DataSource({
            transport: {
                read: {
                    url: 'api/help',
                    contentType: "application/json",
                    dataType: "json"
                },
                update: {
                    url: 'api/help',
                    dataType: "json",
                    contentType: "application/json; charset=utf-8",
                    type: "put"
                },
                create: {
                    url: 'api/help',
                    dataType: "json",
                    contentType: "application/json; charset=utf-8",
                    type: "post"
                },
                destroy: {
                    url: 'api/help',
                    dataType: "json",
                    contentType: "application/json; charset=utf-8",
                    type: "delete"
                },
                parameterMap: function (options, operation) {
                    if (operation !== "read" && options.models) {
                        return '{ "HelpItem": ' + kendo.stringify(options.models[0]) + ' }'
                    }
                }
            },
            requestEnd: function (e) {
                $scope.$emit('HelpChanged');
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