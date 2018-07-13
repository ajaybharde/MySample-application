/// <reference path="../dialog/reportDialog/CheckLocationCount.html" />
/// <reference path="../dialog/reportDialog/CheckLocationCount.html" />
angular.module('app').controller('HomeCtrl', function ($scope, $rootScope, $window, $location, AppService, COPDialog, fileDialog) {


    AppService.appSettings().then(function (data) {
        $scope.dto.AppSettings = data;
        $window.document.title = $scope.dto.AppSettings.COPApplName;
    });

    $scope.tabs = [{
        title: 'Boxes',
        selected: 1
    }, {
        title: 'Core',
        selected: 2
    }, {
        title: 'Items',
        selected: 3
    }
    ];

    $scope.dto = {
        BoxNames: [],
        ItemNames: [],
        DataToExport: [],
        FileName: [],
        selectedItem: ''
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

    $scope.checkAvailableFile = function () {

    };

    $scope.selectedBox = $scope.dto.BoxNames[0];
    $scope.selectedItem = $scope.dto.ItemNames[0];

    var currentdate = new Date();
    $scope.selectedBoxDate = currentdate;
    $scope.selectedItemDate = currentdate;

    $scope.newThings = {};


    $scope.SKPBoxNotInESR = {};
    $scope.ESRNotInSKP = {};



    $scope.currentTab = 1;


    $scope.onClickTab = function (tab) {

        $scope.currentTab = tab.selected;
    }

    $scope.isActiveTab = function (tabActive) {

        return tabActive == $scope.currentTab;
    }

    $scope.datePickerOptions = {
        parseFormats: ["yyyy-MM-dd"]
    };

    var getBoxNames = function () {
        BoxService.getBoxNames().then(function (response) {
            $scope.dto.BoxNames = response.data;

        });

    }
    var getItemNames = function () {
        $rootScope.busy = true;
        ItemService.getItemNames().then(function (response) {
            $scope.dto.ItemNames = response.data;
            $rootScope.busy = false;
        });


    }

    $scope.EmptySKPBox = function () {
        COPDialog.Confirmation("Warning", "Are you sure you want to Empty the SKP Box Table?").then(function (result) {
            if (result) {
                BoxService.EmptyBoxes().then(function (response) {
                    $rootScope.busy = false;
                    toastr.success('Box Table emptied successfully');
                })
            }
        })
    }

    $scope.BoxUpdateSnapshot = function () {
        BoxService.UpdateSnapshotDate({ SnapshotDate: moment($scope.selectedBoxDate).toDate() }).then(function (response) {
            $rootScope.busy = false;
            toastr.success('Snapshot updated successfully', '');
        });
    }

    $scope.ItemUpdateSnapshot = function () {
        ItemService.UpdateSnapshotDate({ SnapshotDate: moment($scope.selectedItemDate).toDate() }).then(function (response) {
            $rootScope.busy = false;
            toastr.success('Snapshot updated successfully', '');
        });

    }

    $scope.EmptyItemBox = function () {
        COPDialog.Confirmation("Warning", "Are you sure you want to Empty the Item Table?").then(function (result) {
            if (result) {
                ItemService.EmptyItems().then(function (response) {
                    $rootScope.busy = false;
                    toastr.success('Item Table emptied successfully', '');

                });
            }
        })
    }


    $scope.ImportBox = function () {
        if ($scope.selectedBox === undefined || $scope.selectedBox === null || $scope.selectedBox === '') {
            toastr.error("Please select the Client before  Import");
            return;
        }



        var selected = angular.fromJson($scope.selectedBox);

        BoxService.CheckBoxClient(selected.BoxName).then(function (response) {
            if (response.data === "true") {
                $rootScope.busy = false;
                COPDialog.Confirmation("Warning", "Client already Exists ,Do you want to continue?").then(function (result) {
                    if (result) {
                        BoxService.importBox($scope.selectedBox).then(function (response) {
                            if (response.data.success === true) {
                                $rootScope.busy = false;
                                angular.toJson($scope.selectedBox);
                                toastr.success(selected.BoxName + ' data imported successfully from ' + response.data.message);
                            }
                            else {
                                if (response.data.success === false) {
                                    $rootScope.busy = false;
                                    toastr.error(response.data.message);
                                }
                                else {
                                    $rootScope.busy = false;
                                    toastr.error(response.data.message);
                                }
                            }

                        });
                    }
                    else {
                        return;
                    }
                });
            }
            else {
                BoxService.importBox($scope.selectedBox).then(function (response) {
                    if (response.data.success === true) {
                        $rootScope.busy = false;
                        angular.toJson($scope.selectedBox);
                        toastr.success(selected.BoxName + ' data imported successfully from ' + response.data.message);
                    }
                    else {
                        if (response.data.success === false) {
                            $rootScope.busy = false;
                            toastr.error(response.data.message);
                        }
                        else {
                            $rootScope.busy = false;
                            toastr.error(response.data.message);
                        }
                    }

                });
            }

        });
    }

    $scope.ImportItem = function () {

        var selected = angular.fromJson($scope.selectedItem);
        if ($scope.selectedItem === undefined || $scope.selectedItem === null || $scope.selectedItem === '') {
            toastr.error("Please select the Client before  Import");
            return;
        }
       

        ItemService.CheckItemClient(selected.ItemName).then(function (response) {
            if (response.data === "true") {
                $rootScope.busy = false;
                COPDialog.Confirmation("Warning", "Client already Exists ,Do you want to continue?").then(function (result) {
                    if (result) {
                        ItemService.importItem($scope.selectedItem).then(function (response) {
                            if (response.data.success === true) {
                                $rootScope.busy = false;
                                angular.toJson($scope.selectedItem);
                                toastr.success(selected.ItemName + ' data imported successfully from  ' + response.data.message);
                            }
                            else {
                                if (response.data.success === false) {
                                    $rootScope.busy = false;
                                    toastr.error(response.data.message);
                                }
                                else {
                                    $rootScope.busy = false;
                                    toastr.error(response.data.message);
                                }
                            }
                        });
                    }
                    else {
                        return;
                    }
                });
            }
            else {
                ItemService.importItem($scope.selectedItem).then(function (response) {
                    if (response.data.success === true) {
                        $rootScope.busy = false;
                        angular.toJson($scope.selectedItem);
                        toastr.success(selected.ItemName + ' data imported successfully from  ' + response.data.message);
                    }
                    else {
                        if (response.data.success === false) {
                            $rootScope.busy = false;
                            toastr.error(response.data.message);
                        }
                        else {
                            $rootScope.busy = false;
                            toastr.error(response.data.message);
                        }
                    }


                });
            }

        });
    }

    $scope.MatchCoreBoxestoESearch = function () {
        CoreService.MatchCoreBoxes().then(function (response) {
            toastr.success(' successfully Matched');
            $rootScope.busy = false;
        });
    }



    /* Box*/
    $scope.dto.SKPBoxNotInESR = {};
    $scope.showSKPNotESearch = function () {
        $scope.ResetPaging();
        COPDialog.ExportFormDialog("Test", "partial/dialog/reportDialog/SKPBoxNotInUKBox.html", $scope.dto).then(function (result) {

            if (result !== undefined) {
            }
        });
    };
    $scope.dto.SKPBoxNotInESR.ExportToExcel = function () {
        // window.open('api/ExportToExcelSKPBoxNotInESR');
        $window.location = 'api/ExportToExcelSKPBoxNotInESR';
        // $window.location = 'api/ExportToExcelSKPBoxNotInESR';
        return;
    };
    $scope.ExportBoxLoadFile = function () {

        $window.location = 'api/GetBoxLoadFileCSV';
    };
    $scope.dto.SKPBoxNotInESR.getSKPBoxNotInESRPagedGridData = function (currentPage, pageItems, filterBy, filterByFields, orderBy, orderByReverse) {
        var data;
        $rootScope.busy = true;
        currentPage = currentPage == undefined ? 0 : currentPage;

        var previousPage = $scope.dto.PagingData.currentPage;
        $scope.dto.PagingData.page = currentPage === 0 ? 1 : currentPage + 1;
        $scope.dto.PagingData.filterByFields = filterByFields;
        $scope.dto.PagingData.orderBy = orderBy === null ? '' : orderBy;
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

        BoxService.SKPBoxNotInEsearch($scope.dto).then(function (response) {
            $scope.dto.SKPBoxNotInESR.data = response.data;
            if (response.data.length > 0) {
                $scope.dto.PagingData.gridTotalCount = response.data[0].TotalCount;
            }
            $rootScope.busy = false;

        });
    };




    $scope.dto.ESRNotInSKP = {};
    $scope.showESearchNotSKP = function () {
        $scope.ResetPaging();
        COPDialog.ExportFormDialog("Test", "partial/dialog/reportDialog/ESRBoxNotInSKP.html", $scope.dto).then(function (result) {
            if (result !== undefined) {
                $scope.newThings = result;              //Rebind any grids here.
            }
        });

    };
    $scope.dto.ESRNotInSKP.ExportToExcel = function () {
        $window.location = 'api/ExportToExcelESRBOXNotInSKP';
        return;
    };
    $scope.dto.ESRNotInSKP.getESearchNotSKPPagedGridData = function (currentPage, pageItems, filterBy, filterByFields, orderBy, orderByReverse) {
        var data;
        $rootScope.busy = true;
        currentPage = currentPage == undefined ? 0 : currentPage;

        var previousPage = $scope.dto.PagingData.currentPage;
        $scope.dto.PagingData.page = currentPage === 0 ? 1 : currentPage + 1;
        $scope.dto.PagingData.filterByFields = filterByFields;
        $scope.dto.PagingData.orderBy = orderBy === null ? '' : orderBy;
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

        BoxService.ESearchBoxNotInSKP($scope.dto).then(function (response) {
            $scope.dto.ESRNotInSKP.data = response.data;
            if (response.data.length > 0) {
                $scope.dto.PagingData.gridTotalCount = response.data[0].TotalCount;
            }
            $rootScope.busy = false;

        });
    };

    /* Count of Rows */
    $scope.dto.CountOfRows = {};
    $scope.showCountSKP = function () {
        $scope.ResetPaging();
        $scope.dto.CountOfRows.getCountOfRowsPagedGridData();
        COPDialog.FormDialog("Count of Rows", "partial/dialog/reportDialog/RowsCount.html", $scope.dto).then(function (result) {

            if (result !== undefined) {
                $scope.newThings = result;                //Rebind any grids here.

            }
        });



    };

    $scope.dto.CountOfRows.ExportToExcelCountOfrows = function () {
        $window.location = 'api/ExportToExcelCountOfrows';
        return;
    };
    $scope.dto.CountOfRows.getCountOfRowsPagedGridData = function (currentPage, pageItems, filterBy, filterByFields, orderBy, orderByReverse) {
        var data;
        $rootScope.busy = true;
        currentPage = currentPage == undefined ? 0 : currentPage;

        var previousPage = $scope.dto.PagingData.currentPage;
        $scope.dto.PagingData.page = currentPage === 0 ? 1 : currentPage + 1;
        $scope.dto.PagingData.filterByFields = filterByFields;
        $scope.dto.PagingData.orderBy = orderBy === null ? '' : orderBy;
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

        BoxService.CountOfRows().then(function (response) {
            $scope.Headers = ["h1", "h2", "h3"]
            $scope.dto.CountOfRows.data = response.data;
            $rootScope.busy = false;

        });
    };



    /* Box Location */
    $scope.dto.BoxLocations = {};
    $scope.showCheckBoxLocation = function () {
        $scope.ResetPaging();
        $scope.dto.BoxLocations.getBoxLocationsPagedGridData();
        COPDialog.FormDialog("Box Locations", "partial/dialog/reportDialog/CheckBoxLocation.html", $scope.dto).then(function (result) {
            if (result !== undefined) {
                $scope.newThings = result;                //Rebind any grids here.
            }
        });

    };
    $scope.dto.BoxLocations.ExportToExcelBoxLocation = function () {
        $window.location = 'api/ExportToExcelBoxLocation';
        return;
    };
    $scope.dto.BoxLocations.getBoxLocationsPagedGridData = function (currentPage, pageItems, filterBy, filterByFields, orderBy, orderByReverse) {
        var data;
        $rootScope.busy = true;
        currentPage = currentPage == undefined ? 0 : currentPage;

        var previousPage = $scope.dto.PagingData.currentPage;
        $scope.dto.PagingData.page = currentPage === 0 ? 1 : currentPage + 1;
        $scope.dto.PagingData.filterByFields = filterByFields;
        $scope.dto.PagingData.orderBy = orderBy === null ? '' : orderBy;
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

        BoxService.BoxLocations().then(function (response) {
            $rootScope.busy = false;
            $scope.dto.BoxLocations.data = response.data;

        });
    };


    $scope.MatchBoxestoESearch = function () {
        BoxService.MatchBoxEsearch().then(function (response) {
            toastr.success(' successfully Matched');
            $rootScope.busy = false;
        });
    }




    /* Core  Box*/
    $scope.dto.CoreESRnotinSKP = {};
    $scope.showCoreESearchNotSKP = function () {
        $scope.ResetPaging();
        COPDialog.ExportFormDialog("Core Box Locations", "partial/dialog/reportDialog/CoreEsearchNotInSKP.html", $scope.dto).then(function (result) {
            if (result !== undefined) {
                $scope.newThings = result;               //Rebind any grids here.
            }
        });

    };
    $scope.dto.CoreESRnotinSKP.ExportToExcel = function () {
        $window.location = 'api/CoreService/ExportToExcelESRBOXNotInSKP';
        return;
    };
    $scope.CoreExportBoxLoadFile = function () {
        $window.location = 'api/CoreService/GetBoxLoadFileCSV';
    };
    $scope.dto.CoreESRnotinSKP.getCoreESearchNotSKPPagedGridData = function (currentPage, pageItems, filterBy, filterByFields, orderBy, orderByReverse) {
        var data;
        $rootScope.busy = true;
        currentPage = currentPage == undefined ? 0 : currentPage;

        var previousPage = $scope.dto.PagingData.currentPage;
        $scope.dto.PagingData.page = currentPage === 0 ? 1 : currentPage + 1;
        $scope.dto.PagingData.filterByFields = filterByFields;
        $scope.dto.PagingData.orderBy = orderBy === null ? '' : orderBy;
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

        CoreService.ESearchCoreBoxNotInSKP($scope.dto).then(function (response) {
            $scope.dto.CoreESRnotinSKP.data = response.data;
            if (response.data.length > 0) {
                $scope.dto.PagingData.gridTotalCount = response.data[0].TotalCount;
            }
            $rootScope.busy = false;

        });


    };



    $scope.dto.CoreSKPnotinESR = {};
    $scope.showCoreSKPNotESearch = function () {
        $scope.ResetPaging();
        COPDialog.ExportFormDialog("Core Box Locations", "partial/dialog/reportDialog/CoreSKPNotInEsearch.html", $scope.dto).then(function (result) {
            if (result !== undefined) {
                $scope.newThings = result;               //Rebind any grids here.
            }
        });


    };
    $scope.dto.CoreSKPnotinESR.ExportToExcel = function () {
        $window.location = 'api/CoreService/ExportToExcelSKPBoxNotInESR';
        return;
    };
    $scope.dto.CoreSKPnotinESR.getCoreSKPNotEsearchPagedGridData = function (currentPage, pageItems, filterBy, filterByFields, orderBy, orderByReverse) {
        var data;
        $rootScope.busy = true;
        currentPage = currentPage == undefined ? 0 : currentPage;
        var previousPage = $scope.dto.PagingData.currentPage;
        $scope.dto.PagingData.page = currentPage === 0 ? 1 : currentPage + 1;
        $scope.dto.PagingData.filterByFields = filterByFields;
        $scope.dto.PagingData.orderBy = orderBy === null ? '' : orderBy;
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

        CoreService.SKPCoreBoxNotInESearch($scope.dto).then(function (response) {
            $scope.dto.CoreSKPnotinESR.data = response.data;
            if (response.data.length > 0) {
                $scope.dto.PagingData.gridTotalCount = response.data[0].TotalCount;
            }

            $rootScope.busy = false;

        });

    };



    $scope.dto.Item = {};
    $scope.showItemClientCount = function () {
        $scope.ResetPaging();
        $scope.dto.Item.GetPagedItemCount();
        COPDialog.FormDialog("Test", "partial/dialog/reportDialog/ItemClientCount.html", $scope.dto).then(function (result) {
            if (result !== undefined) {
                $scope.newThings = result;
                $rootScope.busy = false;//Rebind any grids here.
            }
        });
    };
    $scope.dto.Item.ExportToExcelItemClientCount = function () {
        $window.location = 'api/ExportToExcelItemClientCount';
        return;
    };
    $scope.dto.Item.GetPagedItemCount = function (currentPage, pageItems, filterBy, filterByFields, orderBy, orderByReverse) {
        var data;
        $rootScope.busy = true;
        currentPage = currentPage == undefined ? 0 : currentPage;
        var previousPage = $scope.dto.PagingData.currentPage;
        $scope.dto.PagingData.page = currentPage === 0 ? 1 : currentPage + 1;
        $scope.dto.PagingData.filterByFields = filterByFields;
        $scope.dto.PagingData.orderBy = orderBy === null ? '' : orderBy;
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

        ItemService.CountOfItem($scope.dto).then(function (response) {
            $scope.dto.Item.data = response.data;
            $scope.dto.PagingData.gridTotalCount = response.data.length;
            $rootScope.busy = false;


        });
    }


    /* Core box Locations */
    $scope.dto.CoreBoxLocations = {};
    $scope.showCoreBoxLocation = function () {
        $scope.ResetPaging();
        CoreService.CoreBoxByLocation().then(function (response) {

            $scope.dto.CoreBoxLocations.data = response.data;
            $rootScope.busy = false;
            COPDialog.FormDialog("Core Box Locations", "partial/dialog/reportDialog/CoreBoxLocation.html", $scope.dto).then(function (result) {
                if (result !== undefined) {
                    //Rebind any grids here.
                }
            });
        });
    };
    $scope.dto.CoreBoxLocations.ExportToExcelCoreBoxLocation = function () {
        $window.location = 'api/ExportToExcelCoreBoxLocation';
        return;
    };




    /* Core box Match Summary */
    $scope.dto.Summary = {};
    $scope.showCoreBoxMatchSummary = function () {
        $scope.ResetPaging();
        CoreService.MatchSummary().then(function (response) {
            $scope.dto.Summary.data = response.data;
            $rootScope.busy = false;
            COPDialog.FormDialog("Core Box Locations", "partial/dialog/reportDialog/CoreBoxMatchSummary.html", $scope.dto).then(function (result) {
                if (result !== undefined) {
                    //Rebind any grids here.
                }
            });
        });
    };
    $scope.dto.Summary.ExportToExcelCoreBoxMatchSummary = function () {
        $window.location = 'api/ExportToExcelCoreBoxMatchSummary';
        return;
    };



    /* Core Item*/
    $scope.dto.Coreitem = {};
    $scope.showViewCoreItem = function () {
        $scope.ResetPaging();

        CoreService.ViewCoreItem().then(function (response) {
            $scope.dto.Coreitem.data = response.data;
            $rootScope.busy = false;
            COPDialog.ExportFormDialog("Core Items", "partial/dialog/reportDialog/ViewCoreItem.html", $scope.dto).then(function (result) {
                if (result !== undefined) {
                    $scope.newThings = result;               //Rebind any grids here.
                }
            });
        });
    };
    $scope.dto.Coreitem.ExportToExcelCoreItem = function () {
        $window.location = 'api/ExportToExcelCoreItem';
        return;
    };



    getBoxNames();
    getItemNames();
});