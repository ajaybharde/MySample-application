angular.module('app').controller('searchCtrl', function ($scope, $rootScope, $window, $location, AppService, HeadcountService, COPDialog, fileDialog, HeadCountReportService, HeadCountSearchService) {

    // ----- Declares ----- //
    $window.document.title = 'Search';


    // Data for the page
    $scope.dto = {
        SearchOptions: {
            Surname: "",
            Forename: "",            
            Personnel_NO  : "",
            SAP_PositionID : "",
            UserID : "",            
            OrganizationID: -1,
            HiringCompanyID: -1,
            LineManagerID: -1,            
            FreeText: "",
            ShowAdvanced: false
        },
        ddl:
            {
                Organization: [],
                HiringCompany: [],
                LineManager: [],
                Status: []
            },
        showAdvanced: false,
        searchType: "standard"
    };

    $scope.dto.SearchCriteriaDTO = {};


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

    $scope.dto.SearchOptions = {
        ShowAdvanced: true
    };

    $scope.$watch('dto.searchType', function () {
        switch ($scope.dto.searchType) {
            case "standard":
                $scope.dto.SearchOptions.ShowAdvanced = false;
                $scope.clearSearchOptions();
                break;
            case "advanced":
                $scope.dto.SearchOptions.ShowAdvanced = true;                
                $scope.clearSearchOptions();
                break;
            default:
        }
    });

    $scope.clearSearchOptions = function () {

        $scope.dto.SearchOptions.Surname = "";
        $scope.dto.SearchOptions.Forename = "";
        $scope.dto.SearchOptions.Personnel_NO  = "";
        $scope.dto.SearchOptions.SAP_PositionID = "";
        $scope.dto.SearchOptions.UserID = "";
        $scope.dto.SearchOptions.LocalPositionCode = "";
        $scope.dto.SearchOptions.OrganizationID = -1;
        $scope.dto.SearchOptions.HiringCompanyID = -1;
        $scope.dto.SearchOptions.LineManagerID = -1;
        $scope.dto.SearchOptions.StatusID = -1;
        $scope.dto.SearchOptions.FreeText = "";
        $scope.clearGrid();

    }
    $scope.clearGrid = function ()
    {
        $scope.dto.results = [];
        $scope.ResetPaging();
    }


    $scope.getDropDowns = function () {
        HeadCountReportService.getReportLookUPs().then(function (response) {            
            
            response.data.OrganizationCol.splice(0, 0, { Id: -1, Name: "All" });
            response.data.HiringCompanyCol.splice(0, 0, { Id: -1, Name: "All" });
            response.data.LineManagerCol.splice(0, 0, { Id: -1, Name: "All" });          
            
            $scope.dto.ddl.Organization = response.data.OrganizationCol;
            $scope.dto.ddl.HiringCompany = response.data.HiringCompanyCol;
            $scope.dto.ddl.LineManager = response.data.LineManagerCol;
           
            $rootScope.busy = false;
        });
    };

    $scope.search = function () {
    }



    $scope.generateSelectedReports = function () {
        $scope.dto.generateReports();
    };

    $scope.dto.generateReports = function (currentPage, pageItems, filterBy, filterByFields, orderBy, orderByReverse) {
        $scope.results = [];
        var data;
        $rootScope.busy = true;

        $scope.dto.SearchCriteriaDTO.Surname = $scope.dto.SearchOptions.Surname == undefined || $scope.dto.SearchOptions.Surname == "" ? '' : $scope.dto.SearchOptions.Surname;
        $scope.dto.SearchCriteriaDTO.Forename = $scope.dto.SearchOptions.Forename == undefined || $scope.dto.SearchOptions.Forename == "" ? '' : $scope.dto.SearchOptions.Forename;
        $scope.dto.SearchCriteriaDTO.Personnel_NO = $scope.dto.SearchOptions.Personnel_NO == undefined || $scope.dto.SearchOptions.Personnel_NO == "" ? '' : $scope.dto.SearchOptions.Personnel_NO;
        $scope.dto.SearchCriteriaDTO.SAP_PositionID = $scope.dto.SearchOptions.SAP_PositionID == undefined || $scope.dto.SearchOptions.SAP_PositionID == "" ? '' : $scope.dto.SearchOptions.SAP_PositionID;
        $scope.dto.SearchCriteriaDTO.UserID = $scope.dto.SearchOptions.UserID == undefined || $scope.dto.SearchOptions.UserID == "" ? '' : $scope.dto.SearchOptions.UserID;
        $scope.dto.SearchCriteriaDTO.OrganizationID = $scope.dto.SearchOptions.OrganizationID == undefined || $scope.dto.SearchOptions.OrganizationID == "" ? '-1' : $scope.dto.SearchOptions.OrganizationID;
        $scope.dto.SearchCriteriaDTO.HiringCompanyID = $scope.dto.SearchOptions.HiringCompanyID == undefined || $scope.dto.SearchOptions.HiringCompanyID == "" ? '-1' : $scope.dto.SearchOptions.HiringCompanyID;
        $scope.dto.SearchCriteriaDTO.LineManagerID = $scope.dto.SearchOptions.LineManagerID == undefined || $scope.dto.SearchOptions.LineManagerID == "" ? '-1' : $scope.dto.SearchOptions.LineManagerID;
        $scope.dto.SearchCriteriaDTO.FreeText = $scope.dto.SearchOptions.FreeText == undefined ? '' : $scope.dto.SearchOptions.FreeText;
        $scope.dto.SearchCriteriaDTO.ShowAdvanced = $scope.dto.SearchOptions.ShowAdvanced == undefined ? false : $scope.dto.SearchOptions.ShowAdvanced;
        $scope.dto.SearchCriteriaDTO.LocalPositionCode = $scope.dto.SearchOptions.LocalPositionCode == undefined ? false : $scope.dto.SearchOptions.LocalPositionCode;


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


        HeadCountSearchService.getReports({ PagingData: $scope.dto.PagingData, RptCriteria: $scope.dto.SearchCriteriaDTO }).then(function (response) {
            $scope.dto.results = response.data;
            if (response.data.length > 0) {
                $scope.dto.PagingData.gridTotalCount = response.data[0].TotalCount;
            } else {
                $scope.ResetPaging();
            }
            $rootScope.busy = false;
        });
    }
    $scope.ShowHeadcountForm = function (id) {        
        $location.path('/headcount/' + id);      
    };
    $scope.createNewAuthorization = function () {        
        $location.path('/headcount/0');       
    };

    $scope.getDropDowns();



});