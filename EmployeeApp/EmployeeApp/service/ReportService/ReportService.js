angular.module('app').factory('HeadCountReportService', function ($rootScope, HttpHelpers, $q) {
    return {
        getReportLookUPs: function (id) {
            return HttpHelpers.getData(['api/ReportService/Result', id].join(''));

        },
        getReports: function (dto) {
            return HttpHelpers.postData('api/ReportService/Result', dto);
        },
       exportToExcelReports: function (dto) {
           return HttpHelpers.postData('api/ExportToExcelReport', dto);
        },
    };
});