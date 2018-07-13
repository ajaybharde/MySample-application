angular.module('app').constant('Constants', {
    userAdminColDef: [
        { field: 'DisplayName', title: 'User', width: '200px' },
        {
            field: 'Roles',
            title: 'Role(s)',
            template:
                '<span ng-init="editing=false">' +
                    '<a ng-show="!editing" ng-click="editing=!editing" href="" style="text-decoration: none;border-bottom-width: 1px;">#: Roles.join(\', \') # </a>' +
                    '<div ng-show="editing" class="form-inline">' +
                    '<select default-role="Guest" style="visibility: hidden; width:510px" placeholder="Select the Role" ui-select2 multiple ng-model="dataItem.Roles" ng-change="updateRole(dataItem)">' +
                    '<option value="ReadonlyUser">ReadonlyUser</option>' +
                    '<option value="FacilitiesAdmin">FacilitiesAdmin</option>' +
                    '<option value="SecurityTeam">SecurityTeam</option>' +
                    '<option value="SystemAdmin">SystemAdmin</option>' +
                    '</select>' +
                    '<button ng-click="editing=!editing" type="button" class="close" aria-hidden="true" style="float: none;vertical-align: middle;">&times;</button>' +
                    '</div>' +
                    '</span>'
        }
    ],
    //'<option value="Admin">Admin</option>' +
    userAccessLogColDef: [
        { field: 'UserId', title: 'UserId', width: '200px' },
        { field: 'DateAccessed', title: 'DateAccessed', template: '#: moment(DateAccessed).format("DD MMM YYYY HH:mm:ss") #' }
    ],
    settingsColDef: [
        { field: 'Name', title: 'Setting Name' },
        { field: 'Value', title: 'Value' },
        { command: [{ name: "edit", iconClass: "glyphicon glyphicon-edit space-right" }], width: "190px" }
    ]
});
