//Help Service
angular.module('app').factory('HelpService', function ($rootScope, HttpHelpers, $q) {

    return {
        createHelp: function (help) {
            var defer = $q.defer();
            HttpHelpers.postData('api/help', help,"Help item created").then(function (response) {
                defer.resolve(response.data);
            });
            return defer.promise;
        }
        , getHelp: function () {
            var defer = $q.defer();
            HttpHelpers.getData('api/help').then(function (response) {
                defer.resolve(response.data);
                $rootScope.busy = false;
            });
            return defer.promise;
        }
    };
});