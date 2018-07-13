angular.module('cop.services').factory('HttpHelpers', function ($http, $rootScope, $window) {

    var showInfo = function (msg) {
        if (angular.isDefined(msg)) {
            toastr.info(msg);
        }
    };
    var showSuccess = function (msg) {
        if (angular.isDefined(msg)) {
            toastr.success(msg);
        }
    };

    var showError = function (response) {
        try {

            //If there is a server errror, use it
            if (response.data && response.data.ResponseStatus.Message) {

                toastr.error("<strong>" + response.data.ResponseStatus.ErrorCode + "</strong>: " + response.data.ResponseStatus.Message, "Request failed");
                $rootScope.busy = false;
            } else {
                //Otherwise use HTTP status
                toastr.error("<strong>" + response.status + "</strong>: " + response.statusText, "Request failed");
                $rootScope.busy = false;
            }

        } catch (ex) {
            toastr.error("An error occurred", "Request failed");
            $rootScope.busy = false;
        }
    };

    var httpHelpers = {

        getData: function (url) {
            $rootScope.busy = true;
            return $http.get(url)
              .then(function (response) {
                  return response;
              })
              .catch(function (response) {
                  showError(response);
                  return response;
              });
        },
        postData: function (url, dto,toast) {
            $rootScope.busy = true;
            return $http.post(url, dto)
                .then(function (response) {
                    $rootScope.busy = false;
                    if (toast) {
                        showSuccess(toast);
                    }
                    return response;
                })
                .catch(function (response) {
                    $rootScope.busy = false;
                    showError(response);
                    return response;
              });
        },
        putData: function (url, dto, toast) {
            $rootScope.busy = true;
            return $http.put(url, dto)
                .then(function (response) {
                    $rootScope.busy = false;
                    if (toast) {
                        showSuccess(toast);
                    }
                    return response;
                })
              .catch(function (response) {
                  $rootScope.busy = false;
                  showError(response);
            });
        },
        deleteData: function (url, toast) {
            $rootScope.busy = true;
            // TODO: Sort out url with slash then id
            return $http['delete'](url)
                .then(function (response) {
                    $rootScope.busy = false;
                    if (toast) {
                        showSuccess(toast);
                    }
                    return response;
                })
                .catch(function (response) {
                    $rootScope.busy = false;
                    showError(response);
                });
        }
    };
    return httpHelpers;
});