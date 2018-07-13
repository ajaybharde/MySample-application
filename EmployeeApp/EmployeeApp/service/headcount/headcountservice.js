//Headcount Service
angular.module('app').factory('HeadcountService', function ($rootScope, HttpHelpers, $q, $http) {

    return {
        getHeadcounts: function (dto) {

            return HttpHelpers.postData('api/SearchService/Result', dto);

        },
        getHeadcountById: function (id) {

            return HttpHelpers.getData(['api/HeadCount/', id].join(''));


        },
        getLookups: function (lookupTypeId) {
            return HttpHelpers.getData(['api/lookups/type/', lookupTypeId].join(''));
        },
        getLookupsByParent: function (parentId) {
            return HttpHelpers.getData(['api/lookups/parent/', parentId].join(''));
        },
        getHeadcountLookups: function () {
            var defer = $q.defer();
            HttpHelpers.getData('api/HeadCount/HeadCountlookups').then(function (response) {
                defer.resolve(response.data);
                $rootScope.busy = false;
            });
            return defer.promise;
        },
        saveLookupType: function (dto) {
            return HttpHelpers.postData('api/lookuptype', dto);
        },
        saveLookup: function (dto) {
            return HttpHelpers.postData('api/lookup', dto);
        },
        UploadFilesForm: function (dto) {
            return HttpHelpers.postData('api/uploadfiles', dto);
        },
        UpdateHeadcount: function (dto) {
            return HttpHelpers.putData('api/HeadCount', dto);
        },
        AddNewHeadcount: function (dto) {
            return HttpHelpers.postData('api/HeadCount', dto);
        },
        DeleteFileByFileId: function (id) {

            return HttpHelpers.deleteData('api/file/' + id + '/delete');


        },

        sendEmail: function (dto) {
            var request = { Surname: dto.Surname, Forename: dto.Forename };
            return HttpHelpers.getData('api/Email/sendemail?' + $.param(request), request);
        },
        CheckMemberExists: function (dto) {
            var data = { Surname: dto.Surname, Forename: dto.Forename, HeadcountId: dto.Id };
            return HttpHelpers.getData('api/HeadCountCheck?' + $.param(data), data);
        },

        CheckSapPersonnelNoExists: function (value) {

            var data = { Personnel_No: value.Personnel_No, headcountId: value.headcountId };
            var url = 'api/HeadCount/SapPersonnelNoCheck?' + $.param(data);
            return $http.get(url)
              .then(function (response) {
                  return response;
              })
              .catch(function (response) {
                  toastr.error(response);
                  return response;
              });
            //return HttpHelpers.getData();
        },
        CheckSapPositionIDExists: function (value) {

            var data = { SAP_PositionID: value.SAP_PositionID, headcountId: value.headcountId };
            var url = 'api/HeadCount/SapPositionIDCheck?' + $.param(data);
            return $http.get(url)
              .then(function (response) {
                  return response;
              })
              .catch(function (response) {
                  toastr.error(response);
                  return response;
              });
            //return HttpHelpers.getData();
        },
        CheckLocalPositionCodeExists: function (value) {

            var data = { LocalPositionCode: value.LocalPositionCode, headcountId: value.headcountId };
            var url = 'api/HeadCount/LocalPositionCodeCheck?' + $.param(data);
            return $http.get(url)
              .then(function (response) {
                  return response;
              })
              .catch(function (response) {
                  toastr.error(response);
                  return response;
              });
            //return HttpHelpers.getData();
        }
    };
});