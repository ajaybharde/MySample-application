/// <reference path="../partial/Building/Building.html" />
/// <reference path="../partial/Building/Building.html" />
/// <reference path="../partial/Building/Building.html" />
/// <reference path="../directive/attachment/attachment.tpl.html" />
/// <reference path="../directive/attachment/attachment.tpl.html" />
/// <reference path="../partial/HeadcountBoxSearch/HeadcountBoxSearch.html" />
/// <reference path="../partial/HeadcountBoxSearch/HeadcountBoxSearch.html" />
var app = angular.module('app', [
    'ngRoute',
    'ngSanitize',
    'ui',
    'ui.bootstrap',
    'cop.filters',
    'cop.directives',
    'cop.services',
    'googlechart',
    'ui.select',
    'xeditable',
    //'ngMockE2E',
    'kendo.directives',
    'ngAnimate',
    'ngGrid',
    'trNgGrid',
    'ngCsv',
    'DWand.nw-fileDialog',
    'mgcrea.ngStrap.tooltip',
    'mgcrea.ngStrap.datepicker',
    
    'ui.select2',
    'angularFileUpload'


]);

angular.module('app').config(function ($routeProvider, $animateProvider, $datepickerProvider) {
    'use strict';

    $animateProvider.classNameFilter(/animate/);
    angular.extend($datepickerProvider.defaults, {
        dateFormat: 'dd MMM yyyy',
        startWeek: 1


    });
    $routeProvider.
        when('/', { templateUrl: 'partial/start/start.html' }).
        when('/home', { templateUrl: 'partial/home/home.html' }).
        when('/about', { templateUrl: 'partial/about/about.html' }).
        when('/upload', { templateUrl: 'directive/attachment/attachment.tpl.html' }).
        when('/reports', { templateUrl: 'partial/reports/reports.html' }).
        when('/search', { templateUrl: 'partial/search/search.html' }).
        when('/pendingRequest', { templateUrl: 'partial/pendingRequest/pendingRequest.html' }).
        when('/reports', { templateUrl: 'partial/reports/reports.html' }).
        when('/admin/config', { templateUrl: 'partial/admin/config/config.html' }).
        when('/admin/users', { templateUrl: 'partial/admin/user/userAdmin.html' }).
        when('/admin/lookups', { templateUrl: 'partial/admin/lookup/lookupAdmin.html' }).
        when('/admin/reports', { templateUrl: 'partial/admin/reports/reportsAdmin.html' }).
        when('/admin/help', { templateUrl: 'partial/admin/help/helpAdmin.html' }).
        when('/headcount', { templateUrl: 'partial/headcount/headcountForm.html' }).
        when('/headcount/:Id', { templateUrl: 'partial/headcount/headcountForm.html' }).

    otherwise({ redirectTo: '/' });
});

angular.module('app').run(function ($rootScope, AppService) {
    var toastr = window.toastr;
    toastr.options.timeOut = 2500;
    toastr.options.positionClass = 'toast-bottom-right';
    TrNgGrid.tableCssClass = "tr-ng-grid table table-condensed-more";
    $rootScope.$on('$routeChangeStart', function () {
        $rootScope.busy = true;
        if (typeof (current) !== 'undefined') {
            $templateCache.remove(current.templateUrl);
        }
        //AppService.userAuth(false);
    });
});

angular.module('app').controller('SetupCtrl', function ($scope, $rootScope, $location, $window, AppService, ReportsService, HelpService) {
    $scope.dto = {};
    AppService.userAuth(true).then(function (data) {
        AppService.userDetails(false).then(function (data) {
            $scope.dto.UserDetails = data;

        });
        //ReportsService.updateReports().then(function (data) {
        //    $scope.dto.HasReports = function () { return 1 > 0; };
        //});

        AppService.appSettings().then(function (response) {
            $scope.dto.AppSettings = response;
        });
        $scope.getHelp();
    });

    
    $scope.getHelp = function () {
        HelpService.getHelp().then(function (response) {
            $scope.dto.Help = response;

            $scope.dto.HasHelp = function () { return $scope.dto.Help.length > 0; };
        });
        $rootScope.busy = false;
    }

    $scope.isActive = function (viewLocation) {
        var location = $location.path() == '/' ? $location.path() : $location.path().substr(1, $location.path().length - 1);
        return (location.substring(0, viewLocation.length) === viewLocation);
    };

    $scope.$on('HelpChanged', function (event, data) {
        $scope.getHelp();
    });

});
