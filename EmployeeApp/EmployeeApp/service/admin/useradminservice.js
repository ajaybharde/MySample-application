angular.module('app').factory('UserAdminService', function (HttpHelpers) {
    return {
        getAuthUsers: function () {
            return HttpHelpers.getData('api/users');
        },
        getAuthUsersByRole: function (userRole) {
            var url = 'api/users/';
            if (userRole !== null) {
                url += userRole;
            }
            return HttpHelpers.getData(url);
        },
        updateRole: function (username, roles) {
            var dto = {
                Roles: roles
            };
            var url = 'api/user/' + username + '/roles';
            return HttpHelpers.postData(url, dto);
        },
        addUser: function (accountName) {
            if (angular.isUndefined(accountName)) {
                toastr.error('An account name must be specified', '');
                return;
            }

            return HttpHelpers.postData('api/user/' + encodeURI(accountName));
        },
        removeUser: function (accountName) {
            return HttpHelpers.deleteData('api/user/' + encodeURI(accountName));
        },
        getAccessLog: function (accountName) {
            var user = angular.isDefined(accountName) ? accountName : '';
            return HttpHelpers.getData('api/user/accesslog/' + encodeURI(user));
        },
        getStats: function (accountName) {
            var user = angular.isDefined(accountName) ? accountName : '';
            return HttpHelpers.getData('api/user/accesslog/hits/' + encodeURI(user));
        },
        getUsers: function () {
            return HttpHelpers.getData('api/user/accesslog/users');
        },
        getRoleList: function () {
            return HttpHelpers.getData('api/user/RoleList');
        }

    };
});
