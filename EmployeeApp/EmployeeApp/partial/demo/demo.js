// Demo Controller
angular.module('app').controller('DemoCtrl', function ($scope, $rootScope, $window, COPDialog, HttpHelpers, AppService, demoService) {
    'use strict';

    // Initilise all data
    $scope.dto = {};
    $scope.dto.Users = [];
    $scope.oneAtATime = true;
    $scope.date1 = new Date();

    $scope.newThingy = {};
    $scope.newThingy.Property1 = "Property 1";


    $scope.groups = [
      {
          title: 'Dynamic Group Header - 1',
          content: 'Dynamic Group Body - 1'
      },
      {
          title: 'Dynamic Group Header - 2',
          content: 'Dynamic Group Body - 2'
      }
    ];

    $scope.items = ['Item 1', 'Item 2', 'Item 3'];

    $scope.addItem = function () {
        var newItemNo = $scope.items.length + 1;
        $scope.items.push('Item ' + newItemNo);
    };

    AppService.userDetails().then(function (data) {
        $scope.dto.UserDetails = data;
    });

    AppService.appSettings().then(function (data) {
        $scope.dto.AppSettings = data;
        $window.document.title = $scope.dto.AppSettings.COPApplName + ': Demo';
    });

    $scope.oneAtATime = true;

    $scope.addItem = function () {
        var newItemNo = $scope.items.length + 1;
        $scope.items.push('Item ' + newItemNo);
    };

    $scope.datePickerOptions = {
        parseFormats: ["yyyy-MM-dd"]
    };

    $scope.addUser = function (action, user) {
        if (action == 'add') {
            $scope.dto.Users.push(user);
        }
        else {
            $scope.dto.Users.splice($scope.dto.Users.indexOf(user), 1)
        }
    }

    $scope.sendEmail = function () {
        HttpHelpers.getData('api/demo/sendemail')
            .success(function () {
                toastr.success('Email sent successfully.', '');
            });
    };

    $scope.mainGridOptions = {
        dataSource: {
            type: "odata",
            transport: {
                read: "http://demos.telerik.com/kendo-ui/service/Northwind.svc/Employees"
            },
            pageSize: 5,
            serverPaging: true,
            serverSorting: true
        },
        sortable: true,
        pageable: true,
        groupable: true,
        dataBound: function () {
            this.expandRow(this.tbody.find("tr.k-master-row").first());
        },
        columns: [{
            field: "FirstName",
            title: "First Name",
            width: "120px"
        }, {
            field: "LastName",
            title: "Last Name",
            width: "120px"
        }, {
            field: "Country",
            width: "120px"
        }, {
            field: "City",
            width: "120px"
        }, {
            field: "Title"
        }]
    };

    $scope.showConfirmation = function () {
        COPDialog.Confirmation("Confirmation", "Are you sure that you want to do that?");
    };

    $scope.showAlert = function () {
        COPDialog.Alert("Alert", "Something bad has happened.");
    };

    $scope.showComment = function () {
        COPDialog.Comments("Comment", "This is a comment.");
    };

    $scope.showFormDialog = function () {
        COPDialog.FormDialog("Create New Thingy", "demoFormTemplate.html", $scope.newThingy).then(function (result) {
            if (result !== undefined) {
                $scope.newThingy = result;
                //Rebind any grids here.
            }
        });
    };
});