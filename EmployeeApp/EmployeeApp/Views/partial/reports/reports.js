angular.module('app').controller('reportCtrl', function ($scope, $rootScope, $window, $location, AppService, HeadcountService, COPDialog, fileDialog, HeadCountReportService, HttpHelpers, $q) {

    // ----- Declares ----- //
    $window.document.title = 'Report';


    // Data for the page
    $scope.dto = {
        SearchOptions: {
            Surname: "",
            Forename: "",
            SAP_Org_Chart: -1,
            C_BAY: -1,
            SecurityPassID: -1,
            OrganizationID: -1,
            HiringCompanyID: -1,
            LineManagerID: -1,
            FreeText: "",
            ShowAdvanced: false
        },
        ddl:
            {
                SAP_Org_Chart: [],
                C_BAY: [],
                SecurityPass: [],
                Organization: [],
                HiringCompany: [],
                LineManager: [],
                Status: []
            },
        showAdvanced: true,
        searchType: "standard"
    };   

    $scope.tooltip = {
        "title": "Export To Excel"
       
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

    $scope.dto.ReportCriteriaDTO = {};

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
        $scope.dto.SearchOptions.SAP_Org_Chart = -1;
        $scope.dto.SearchOptions.C_BAY = -1;
        $scope.dto.SearchOptions.Active = -1;
        $scope.dto.SearchOptions.SecurityPassID = -1;
        $scope.dto.SearchOptions.OrganizationID = -1;
        $scope.dto.SearchOptions.HiringCompanyID = -1;
        $scope.dto.SearchOptions.LineManagerID = -1;
        $scope.dto.SearchOptions.FreeText = "";
        $scope.dto.generateReports();       

    }
    $scope.clearGrid = function () {
        $scope.dto.results = [];
        $scope.ResetPaging();
    }

    $scope.getDropDowns = function () {        

        HeadCountReportService.getReportLookUPs().then(function (response) {
            response.data.SAP_ORG_Col.splice(0, 0, { Id: -1, Name: "All" });
            response.data.C_BAY_Col.splice(0, 0, { Id: -1, Name: "All" });
            response.data.Active_Col.splice(0, 0, { Id: -1, Name: "All" });
            response.data.SecurityPassCol.splice(0, 0, { Id: -1, Name: "All" });
            response.data.OrganizationCol.splice(0, 0, { Id: -1, Name: "All" });
            response.data.HiringCompanyCol.splice(0, 0, { Id: -1, Name: "All" });
            response.data.LineManagerCol.splice(0, 0, { Id: -1, Name: "All" });
            response.data.StatusCol.splice(0, 0, { Id: -1, Name: "All" });            
            $scope.dto.ddl.SAP_Org_Chart = response.data.SAP_ORG_Col;
            $scope.dto.ddl.C_BAY = response.data.C_BAY_Col;
            $scope.dto.ddl.Active = response.data.Active_Col;
            $scope.dto.ddl.SecurityPass = response.data.SecurityPassCol;
            $scope.dto.ddl.Organization = response.data.OrganizationCol;
            $scope.dto.ddl.HiringCompany = response.data.HiringCompanyCol;
            $scope.dto.ddl.LineManager = response.data.LineManagerCol;
            $scope.dto.ddl.Status = response.data.StatusCol;
            $rootScope.busy = false;
        });
        
    };

   

    $scope.generateSelectedReports = function () {       
        $scope.dto.generateReports();
    };

    $scope.dto.generateReports = function (currentPage, pageItems, filterBy, filterByFields, orderBy, orderByReverse) {
        
        $scope.results = [];
        var data;
        $rootScope.busy = true;

        $scope.dto.ReportCriteriaDTO.SAP_Org_Chart = $scope.dto.SearchOptions.SAP_Org_Chart == undefined || $scope.dto.SearchOptions.SAP_Org_Chart == ""? '-1' : $scope.dto.SearchOptions.SAP_Org_Chart;
        $scope.dto.ReportCriteriaDTO.C_BAY = $scope.dto.SearchOptions.C_BAY == undefined || $scope.dto.SearchOptions.C_BAY == "" ? '-1' : $scope.dto.SearchOptions.C_BAY;
        $scope.dto.ReportCriteriaDTO.Active = $scope.dto.SearchOptions.Active == undefined || $scope.dto.SearchOptions.Active == "" ? '-1' : $scope.dto.SearchOptions.Active;
        $scope.dto.ReportCriteriaDTO.SecurityPassID = $scope.dto.SearchOptions.SecurityPassID == undefined || $scope.dto.SearchOptions.SecurityPassID == "" ? '-1' : $scope.dto.SearchOptions.SecurityPassID;
        $scope.dto.ReportCriteriaDTO.OrganizationID = $scope.dto.SearchOptions.OrganizationID == undefined || $scope.dto.SearchOptions.OrganizationID == "" ? '-1' : $scope.dto.SearchOptions.OrganizationID;
        $scope.dto.ReportCriteriaDTO.HiringCompanyID = $scope.dto.SearchOptions.HiringCompanyID == undefined || $scope.dto.SearchOptions.HiringCompanyID == "" ? '-1' : $scope.dto.SearchOptions.HiringCompanyID;
        $scope.dto.ReportCriteriaDTO.LineManagerID = $scope.dto.SearchOptions.LineManagerID == undefined || $scope.dto.SearchOptions.LineManagerID == "" ? '-1' : $scope.dto.SearchOptions.LineManagerID;
        $scope.dto.ReportCriteriaDTO.FreeText = $scope.dto.SearchOptions.FreeText == undefined ? '' : $scope.dto.SearchOptions.FreeText;
        $scope.dto.ReportCriteriaDTO.ShowAdvanced = $scope.dto.SearchOptions.ShowAdvanced == undefined ? true : $scope.dto.SearchOptions.ShowAdvanced;


       
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
        $scope.dto.PagingData.orderBy = orderBy === null || orderBy=='FullName' ? 'H.Surname' : orderBy;
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

    
        HeadCountReportService.getReports({ PagingData: $scope.dto.PagingData, RptCriteria: $scope.dto.ReportCriteriaDTO }).then(function (response) {
        $scope.dto.results = response.data;
            if (response.data.length > 0) {
                $scope.dto.PagingData.gridTotalCount = response.data[0].TotalCount;
            }
            else {
                $scope.ResetPaging();
            }
            $rootScope.busy = false;
        });
    }
    $scope.getDropDowns();
    $scope.ExportToExcel = function (currentPage, pageItems, filterBy, filterByFields, orderBy, orderByReverse) {
        

        var SAP_Org_Chart = $scope.dto.SearchOptions.SAP_Org_Chart == undefined || $scope.dto.SearchOptions.SAP_Org_Chart == "" ? '-1' : $scope.dto.SearchOptions.SAP_Org_Chart;
        var C_BAY = $scope.dto.SearchOptions.C_BAY == undefined || $scope.dto.SearchOptions.C_BAY == "" ? '-1' : $scope.dto.SearchOptions.C_BAY;
        var Active = $scope.dto.SearchOptions.Active == undefined || $scope.dto.SearchOptions.Active == "" ? '-1' : $scope.dto.SearchOptions.Active;
        var SecurityPassID = $scope.dto.SearchOptions.SecurityPassID == undefined || $scope.dto.SearchOptions.SecurityPassID == "" ? '-1' : $scope.dto.SearchOptions.SecurityPassID;
        var OrganizationID = $scope.dto.SearchOptions.OrganizationID == undefined || $scope.dto.SearchOptions.OrganizationID == "" ? '-1' : $scope.dto.SearchOptions.OrganizationID;
        var HiringCompanyID = $scope.dto.SearchOptions.HiringCompanyID == undefined || $scope.dto.SearchOptions.HiringCompanyID == "" ? '-1' : $scope.dto.SearchOptions.HiringCompanyID;
        var LineManagerID = $scope.dto.SearchOptions.LineManagerID == undefined || $scope.dto.SearchOptions.LineManagerID == "" ? '-1' : $scope.dto.SearchOptions.LineManagerID;
      
        var request = {
            SAP_Org_Chart: SAP_Org_Chart,
            C_BAY: C_BAY,
            Active:Active,
            SecurityPassID: SecurityPassID,
            OrganizationID: OrganizationID,
            HiringCompanyID: HiringCompanyID,
            LineManagerID: LineManagerID

        };
        $window.location = 'api/ExportToExcelReport?' + $.param(request);

        $rootScope.busy = false;    
        
    }
    
});