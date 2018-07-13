angular.module('app').factory('HeadCountSearchService', function ($rootScope, HttpHelpers, $q) {
    return {
        getReportLookUPs: function (id) {
            return HttpHelpers.getData(['api/SearchResultService/Result', id].join(''));

        },
        getReports: function (dto) {
            return HttpHelpers.postData('api/SearchResultService/Result', dto);
        },

    };
});