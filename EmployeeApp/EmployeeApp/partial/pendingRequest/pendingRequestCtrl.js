angular.module('app').controller('pendingRequestCtrl', function ($scope, $rootScope, $window, $location, AppService, HeadcountService, COPDialog, PendingRequestService) {

    // ----- Declares ----- //
    $window.document.title = 'Search';


    // Data for the page

    $scope.dto.SearchOptions =
        {
            FreeText: ''
        };
    $scope.dto.PagingData = {
        pageSize: 20,
        page: 1,
        gridTotalCount: null,
        coloumnSearch: false,
        currentPage: 0,
        filterBy: '',
        filterByFields: null,
        orderBy: '',
        orderByReverse: false
    };
    $scope.ResetPaging = function () {
        $scope.dto.PagingData.pageSize = 20;
        $scope.dto.PagingData.page = 1;
        $scope.dto.PagingData.gridTotalCount = null;
        $scope.dto.PagingData.coloumnSearch = false;
        $scope.dto.PagingData.currentPage = 0;
        $scope.dto.PagingData.filterBy = '';
        $scope.dto.PagingData.filterByFields = null;
        $scope.dto.PagingData.orderBy = '';
        $scope.dto.PagingData.orderByReverse = false;

    };

    $scope.dto.PedingRequestCriteriaDTO = {};
    $scope.generateSelectedReports = function () {
        $scope.dto.generateReports();
    };

    $scope.dto.generateReports = function (currentPage, pageItems, filterBy, filterByFields, orderBy, orderByReverse) {
        $scope.results = [];
        var data;
        $rootScope.busy = true;

        $scope.dto.PedingRequestCriteriaDTO.FreeText = $scope.dto.SearchOptions.FreeText == undefined ? '' : $scope.dto.SearchOptions.FreeText;

        currentPage = currentPage == undefined ? 0 : currentPage;

        var previousPage = $scope.dto.PagingData.currentPage;
        $scope.dto.PagingData.page = currentPage === 0 ? 1 : currentPage + 1;
        $scope.dto.PagingData.filterByFields = filterByFields;
        if (orderBy != null) {
            switch (orderBy.trim()) {
                case "LineManagerName":
                    orderBy = "LM.Surname";
                    break;
                case "ApproveManagerName":
                    orderBy = "AM.Surname";
                    break;
                case "Personnel_NO":
                    orderBy = "H.Personnel_NO";
                    break;
                case "UserID":
                    orderBy = "H.UserID";
                    break;
                case "FullName":
                    orderBy = "H.Surname";
                    break;
                case "SAP_PositionID":
                    orderBy = "H.SAP_PositionID";
                    break;
                case "PositionName":
                    orderBy = "H.PositionName";
                    break;
                case "LocalPositionCode":
                    orderBy = "H.LocalPositionCode";
                    break;
                case "OrganizationName":
                    orderBy = "O.OrganizationName";
                    break;
                case "HiringCompanyName":
                    orderBy = "Hr.HiringCompanyName";
                    break;
                case "StartDate":
                    orderBy = "H.StartDate";
                    break;
                case "ExpectedEndDate":
                    orderBy = "H.ExpectedEndDate";
                    break;
                case "ActualEndDate":
                    orderBy = "H.ActualEndDate";
                    break;
                default:
                    orderBy = "H.Surname";
            }
        }
        $scope.dto.PagingData.orderBy = orderBy === null || orderBy == 'FullName' ? 'H.Surname' : orderBy;
        $scope.dto.PagingData.orderByReverse = orderByReverse;

        $scope.dto.PagingData.pageItems = pageItems;

        if (filterBy) {

        }
        else {
            $scope.dto.PagingData.filterBy = null;
        }
        if (filterByFields != null && Object.keys(filterByFields).length != 0) {
            if (previousPage == currentPage) {
                $scope.dto.PagingData.page = 1;
                $scope.dto.PagingData.currentPage = 0;
            }
        }
        else
            $scope.dto.PagingData.filterByFields = null;


        PendingRequestService.getReports({ PagingData: $scope.dto.PagingData, RptCriteria: $scope.dto.PedingRequestCriteriaDTO }).then(function (response) {
            $scope.dto.results = response.data;
            if (response.data.length > 0) {
                $scope.dto.PagingData.gridTotalCount = response.data[0].TotalCount;
            }
            else {
                $scope.ResetPaging();
            }
            $rootScope.busy = false;
        });
    };

    $scope.ShowHeadcountForm = function (id) {        
        $location.path('/headcount/' + id);       
    };
    $scope.createNewAuthorization = function () {       
        $location.path('/headcount/0');        
    };


});