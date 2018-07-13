//Reports Service
angular.module('app').factory('ReportsService', function ($rootScope, HttpHelpers, $q) {

    return {
        createReport: function (report) {
            var defer = $q.defer();
            HttpHelpers.postData('api/reports', report,"Report created").then(function (response) {
                defer.resolve(response.data);
            });
            return defer.promise;
        },
        //updateReports: function () {
        //    var defer = $q.defer();
        //    //HttpHelpers.getData('api/reports').then(function (response) {
        //    HttpHelpers.getData('SearchData.json').then(function (response) {              
        //        $rootScope.Reports = response.data;
        //        defer.resolve($rootScope.Reports);
        //    });
        //    return defer.promise;
        //},
        getReports: function () {
            return $rootScope.Reports;
        }
    };
});