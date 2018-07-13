// Config Controller
angular.module('app').controller('ConfigCtrl', function ($scope, $rootScope, $window, AppService, Constants) {
    'use strict';

    // Initilise all data
    $scope.constants = Constants;
    $scope.dto = {};

    AppService.appSettings().then(function (data) {
        $scope.dto.AppSettings = data;
        $window.document.title = $scope.dto.AppSettings.COPApplName + ': Application Configuration';
    });

    $scope.ConfigItemsDataSource = new kendo.data.DataSource({
        transport: {
            read: {
                url: 'api/appconfig',
                contentType: "application/json",
                dataType: "json"
            },
            update: {
                url: 'api/appconfig',
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                type: "post"
            },
            parameterMap: function (options, operation) {
                if (operation !== "read" && options.models) {
                    return '{ "AppConfig": ' + kendo.stringify(options.models[0]) + ' }'
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
                        editable: false
                    },
                    Value: {
                        editable: true
                    }
                }
            }
        }
    });
});