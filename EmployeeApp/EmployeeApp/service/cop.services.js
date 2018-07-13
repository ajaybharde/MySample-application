angular.module('cop.services', [])

    .factory('AppService', function ($rootScope, HttpHelpers, $q) {
        return {
            userDetails: function () {
                var defer = $q.defer();

                HttpHelpers.getData('api/user').then(function (response) {
                    $rootScope.UserDetails = response.data;
                    defer.resolve($rootScope.UserDetails);
                });

                return defer.promise;
            },
            appSettings: function () {
                var defer = $q.defer();
                if ($rootScope.AppSettings) {
                    defer.resolve($rootScope.AppSettings);
                } else {
                    HttpHelpers.getData('api/appSettings').then(function (response) {
                        $rootScope.AppSettings = response.data;
                        defer.resolve($rootScope.AppSettings);
                    });
                }
                return defer.promise;
            },
            appConfig: function (refresh) {
                var defer = $q.defer();
                if ($rootScope.AppConfig && !refresh) {
                    defer.resolve($rootScope.AppConfig);
                } else {
                    HttpHelpers.getData('api/appconfig').then(function (response) {
                        $rootScope.AppConfig = response.data;
                        defer.resolve($rootScope.AppConfig);
                    });
                }
                return defer.promise;
            },
            updateConfigItem: function (dto) {
                return HttpHelpers.postData('api/appconfig/item', dto);
            },
            userAuth: function (addUser) {
                // We will authenticate on the server so just pass in dummy credentials
                var dto = { "UserName": "NotRequired", "Password": "NotRequired", "RememberMe": true };
                return HttpHelpers.postData('api/auth/credentials?AddUser=' + addUser, dto);
            }
        };
    })

    .factory('COPDialog', function ($modal) {
        return {
            Confirmation: function (title, message) {

                ctrl = function ($scope, $modalInstance, title) {
                    $scope.title = title;
                    $scope.message = message;
                    $scope.close = function (res) {
                        $modalInstance.close(res);
                    };
                };

                return $modal.open({
                    backdropFade: true,
                    templateUrl: 'partial/dialog/confirmation.html',
                    controller: 'ctrl',
                    resolve: { title: function () { return title; }, message: function () { return message; } }
                }).result.then(function (result) {
                    return result;
                });
            },
            Alert: function (title, message) {

                alertCtrl = function ($scope, $modalInstance, title, message) {
                    $scope.title = title;
                    $scope.message = message;
                    $scope.close = function (res) {
                        $modalInstance.close(res);
                    };
                };

                return $modal.open({
                    backdropFade: true,
                    templateUrl: 'partial/dialog/alert.html',
                    controller: 'alertCtrl',
                    resolve: { title: function () { return title; }, message: function () { return message; } }
                });
            },
            Comments: function (title, message) {

                commentsCtrl = function ($scope, $modalInstance, title, message) {
                    $scope.title = title;
                    $scope.message = message;
                    $scope.close = function (comments) {
                        $modalInstance.close(comments);
                    };
                };

                return $modal.open({
                    backdropFade: true,
                    templateUrl: 'partial/dialog/comments.html',
                    controller: 'commentsCtrl',
                    resolve: { title: function () { return title; }, message: function () { return message; } }
                }).result.then(function (result) {
                    return result;
                });
            },
            FormDialog: function (title, templateUrl, model, referenceData, options) {

                formCtrl = function ($scope, $modalInstance, title, model, referenceData) {
                    $scope.title = title;
                    $scope.submitButtonText = options && options.submitButtonText ? options.submitButtonText : "OK";
                    $scope.showCancelButton = options && options.showCancelButton ? options.showCancelButton : true;
                    $scope.model = model;
                    $scope.referenceData = referenceData;
                    $scope.close = function (res) {
                        $modalInstance.close(res);
                    };

                };

                return $modal.open({
                    backdropFade: true,
                    templateUrl: templateUrl,
                    controller: 'formCtrl',
                    size: options && options.size ? options.size : undefined,
                    resolve: { title: function () { return title; }, model: function () { return model; }, referenceData: function () { return referenceData; } }
                }).result.then(function (result) {
                    return result;
                });
            },

            reportDialog: function (title, templateUrl, model, referenceData, options) {

                formCtrl = function ($scope, $modalInstance, title, model, referenceData) {

                    $scope.title = title;
                    $scope.submitButtonText = options && options.submitButtonText ? options.submitButtonText : "OK";
                    $scope.showCancelButton = options && options.showCancelButton ? options.showCancelButton : true;
                    $scope.model = model;
                    $scope.referenceData = referenceData;
                    $scope.close = function (res) {
                        $modalInstance.close(res);
                    };
                };

                return $modal.open({
                    backdropFade: true,
                    templateUrl: templateUrl,
                    controller: 'formCtrl',
                    size: 'lg',
                    windowClass: 'app-modal-window',
                    resolve: { title: function () { return title; }, model: function () { return model; }, referenceData: function () { return referenceData; } }
                }).result.then(function (result) {
                    return result;
                });
            },

            ExportFormDialog: function (title, templateUrl, model, referenceData, options) {

                formCtrl = function ($scope, $modalInstance, title, model, referenceData) {

                    $scope.title = title;
                    $scope.submitButtonText = options && options.submitButtonText ? options.submitButtonText : "OK";
                    $scope.showCancelButton = options && options.showCancelButton ? options.showCancelButton : true;
                    $scope.model = model;
                    $scope.referenceData = referenceData;
                    $scope.close = function (res) {
                        $modalInstance.close(res);
                    };
                    //$scope.getHeader = function () { return headers; };
                    //debugger;
                    //var blob = new Blob([document.getElementById('table1').innerHTML], {
                    //    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"

                    //});
                    //saveAs(blob, "RowsCount.xls");
                    //};
                    $scope.ExporttoExcel = function () {

                        var table1 = $("#tblHeader")[0];
                        var table = $("#tblExport")[0];

                        //Get header rows/columns        
                        var colLgHeader = table1.rows[0].cells.length;
                        //Get number of rows/columns
                        var rowLength = table.rows.length;
                        var colLength = table.rows[0].cells.length;

                        var tableString = "";
                        //Get column headers
                        for (var i = 0; i < colLgHeader; i++) {
                            tableString += table1.rows[0].cells[i].innerHTML.split(",").join("") + ",";
                        }

                        tableString = tableString.substring(0, tableString.length - 1);
                        tableString += "\r\n";

                        //Get row data
                        for (var j = 0; j < rowLength; j++) {
                            for (var k = 0; k < colLength; k++) {
                                tableString += table.rows[j].cells[k].innerHTML.split(",").join("") + ",";
                            }
                            tableString += "\r\n";
                        }

                        //to get the cersion of IE
                        var rv = -1;
                        if (navigator.appName == "Microsoft Internet Explorer") {
                            var ua = navigator.userAgent;
                            var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
                            if (re.exec(ua) != null)
                                rv = parseFloat(RegExp.$1);
                        }

                        //Save file
                        if (navigator.appName == "Microsoft Internet Explorer" && rv <= 9) {
                            //Optional: If you run into delimiter issues (where the commas are not interpreted and all data is one cell), then use this line to manually specify the delimeter
                            tableString = 'sep=,\r\n' + tableString;

                            myFrame.document.open("application/vnd.ms-excel", "replace");
                            myFrame.document.write(tableString);
                            myFrame.document.close();
                            myFrame.focus();
                            myFrame.document.execCommand('SaveAs', false, 'data.xls');
                        } else {
                            //to work in other browsers
                            var csvData = 'data:application/vnd.ms-excel;charset=utf-8,' + encodeURIComponent(tableString);
                            $('#btnExport').attr({ 'href': csvData, 'target': '_blank', 'download': 'data.xls' });



                        }

                    };

                };

                return $modal.open({
                    backdropFade: true,
                    templateUrl: templateUrl,
                    controller: 'formCtrl',
                    size: 'lg',
                    windowClass: 'app-modal-window',
                    resolve: { title: function () { return title; }, model: function () { return model; }, referenceData: function () { return referenceData; } }
                }).result.then(function (result) {
                    return result;
                });
            }
        };
    })

    .factory('ActiveDirectory', function ($http, $q, $rootScope, HttpHelpers, AppService) {
        return {
            GetADUsers: function (term) {
                var defer = $q.defer();

                if (angular.isUndefined(term) || term.length < 2) {
                    toastr.info('Enter at least two characters', '');
                    defer.resolve();
                } else {
                    AppService.appSettings().then(function (appSettings) {
                        HttpHelpers.getData('api/ad/search/' + term).then(function (response) {
                            $rootScope.busy = false;
                            defer.resolve(response.data);
                        });
                    });
                }

                return defer.promise;
            }
        }
    })

    .factory('LookupService', function ($http, $q, $rootScope, HttpHelpers) {
        return {
            getLookupTypes: function () {
                return HttpHelpers.getData('api/lookuptypes');
            },
            getLookups: function (lookupTypeId) {
                return HttpHelpers.getData(['api/lookups/type/', lookupTypeId].join(''));
            },
            getLookupsByParent: function (parentId) {
                return HttpHelpers.getData(['api/lookups/parent/', parentId].join(''));
            },
            getAllLookups: function () {
                var defer = $q.defer();
                if ($rootScope.dto.Lookups) {
                    defer.resolve($rootScope.dto.Lookups);
                } else {
                    HttpHelpers.getData('api/lookups/all').then(function (response) {
                        $rootScope.busy = false;
                        $rootScope.dto.Lookups = response.data;
                        defer.resolve($rootScope.dto.Lookups);
                    });
                }
                return defer.promise;
            },
            saveLookupType: function (dto) {
                return HttpHelpers.postData('api/lookuptype', dto);
            },
            saveLookup: function (dto) {
                return HttpHelpers.postData('api/lookup', dto);
            }
        };
    })
 .factory('GridService', function ($http, $q, $rootScope, HttpHelpers) {
     return {
         getGridData: function () {
             return HttpHelpers.getData('largeLoad.json');
         },
         getLookups: function (lookupTypeId) {
             return HttpHelpers.getData(['api/lookups/type/', lookupTypeId].join(''));
         },
         getLookupsByParent: function (parentId) {
             return HttpHelpers.getData(['api/lookups/parent/', parentId].join(''));
         },
         getAllLookups: function () {
             var defer = $q.defer();
             if ($rootScope.dto.Lookups) {
                 defer.resolve($rootScope.dto.Lookups);
             } else {
                 HttpHelpers.getData('api/lookups/all').then(function (response) {
                     $rootScope.dto.Lookups = response.data;
                     defer.resolve($rootScope.dto.Lookups);
                 });
             }
             return defer.promise;
         },
         saveLookupType: function (dto) {
             return HttpHelpers.postData('api/lookuptype', dto);
         },
         saveLookup: function (dto) {
             return HttpHelpers.postData('api/lookup', dto);
         }
     };
 })
;