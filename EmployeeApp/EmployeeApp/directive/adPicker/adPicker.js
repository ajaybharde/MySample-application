app.directive('adPicker', [function () {
    return {
        templateUrl: 'directive/adPicker/adPicker.tpl.html',
        replace: true,
        restrict: 'A',
        scope: {
            ngModel: '=ngModel',
            initialValue: '=initialValue',
            required: '@valueRequired',
            returnType: '@returnType',
            callback: '&onUserSelect',
            callbackName: '@onUserSelect',
            isRequired: '='
        },
        link: function (scope, elem, attr) {
            // Look for an initial value
            var unbindWatcher = scope.$watch('initialValue', function (newval, oldval) {
                if (angular.isDefined(newval)) {
                    if (newval != null) {
                        unbindWatcher();
                        scope.initialise(newval);
                    }
                }
            }, true);

            scope.$watch('ngModel', function (value) {
                if (!value) {
                    scope.resetAll(true);
                }
            });
        },
        controller: function ($scope, ActiveDirectory) {
            $scope.results = [];
            $scope.mode = "Search";
            $scope.searchTerm = "";
            $scope.selectedUser = "";
            $scope.noMatches = false;
            $scope.selectedIndex = null;

            // A value is being passed into the 
            $scope.initialise = function (userid) {
                //$scope.mode = "Results";
                $scope.searchAD(userid);
            }

            $scope.entSearch = function (event) {
                event.preventDefault();
                $scope.searchAD($scope.searchTerm);
            }

            // Perform the search
            $scope.searchAD = function (userid) {
                if (angular.isDefined(userid)) {
                    if (userid.length >= 2) {
                        $scope.mode = "Searching";
                        $scope.noMatches = false;

                        ActiveDirectory.GetADUsers(userid)
							.then(function (data) {
							    $scope.results = data;

							    if ($scope.results.length == 0) {
							        $scope.mode = "Search";
							        $scope.noMatches = true;
							    }
							    else if ($scope.results.length == 1) {
							        $scope.mode = "SingleResult";
							        $scope.selectedUser = $scope.results[0].DisplayName + " (" + $scope.results[0].SamaccountName + ")";
							        if ($scope.callbackExists())
							            $scope.selectedIndex = 0;
							        else
							            $scope.ngModel = $scope.results[0].SamaccountName;
							    }
							    else if ($scope.results.length > 1) {
							        $scope.mode = "MultiResult";
							    }
							    else {
							        $scope.errorText = "No matches";
							        $scope.mode = "Error";
							    }
							});
                    }
                }
            }

            $scope.selectDropDownOption = function () {
                if (angular.isDefined($scope.selectedIndex) && $scope.selectedIndex !== "" && $scope.selectedIndex !== null)
                    if ($scope.selectedIndex >= 0) {
                        if (!$scope.callbackExists())
                            $scope.ngModel = $scope.results[$scope.selectedIndex].SamaccountName;
                    }
            }

            $scope.checkRequired = function (chkMode) {
                if (!$scope.isRequired)
                    return false;
                else if ($scope.mode == 'Searching' || $scope.mode == 'Search')
                    return true;
                else if ($scope.mode == chkMode)
                    return true;
                else
                    return false;
            }

            $scope.runCallBack = function () {
                $scope.callback({ user: $scope.results[$scope.selectedIndex] });
                $scope.resetAll(true);
            }

            // Returns true if there is a callback function
            $scope.callbackExists = function () {
                return angular.isDefined($scope.callbackName);
            }

            $scope.resetAll = function (clear) {
                if (angular.isDefined($scope.ngModel))
                    $scope.ngModel = "";
                $scope.results = [];
                $scope.mode = "Search";
                if (clear)
                    $scope.searchTerm = "";
                $scope.selectedUser = "";
            }
        }
    }
}]);