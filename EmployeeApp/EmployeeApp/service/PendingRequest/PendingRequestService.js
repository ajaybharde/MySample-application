angular.module('app').factory('PendingRequestService', function ($rootScope, HttpHelpers, $q) {
    return {       
        getReports: function (dto) {
            return HttpHelpers.postData('api/PendingRequestService/Result', dto);
        },

    };
});