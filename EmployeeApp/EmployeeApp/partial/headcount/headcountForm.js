angular.module('app').controller('headcountFormCtrl', function ($http, $scope, $route, $rootScope, $modal, $window, $location, $upload, AppService, HeadcountService, COPDialog, fileDialog, $q) {
    AppService.userDetails().then(function (data) {
        $scope.dto.UserDetails = data;
    });
    AppService.appSettings().then(function (data) {
        $scope.dto.AppSettings = data;
        $window.document.title = $scope.dto.AppSettings.COPApplName;
    });
    $scope.dto = {
        FromDate: Date(),
        SelectedHiringCompany: '',
        SelectedOrganization: '',
        SelectedSecurityPass: '',
        SelectedSecuPassApprovingManager: '',
        SelectedStatus: '',
        SelectedLineManager: '',
        SelectedPosition: '',
        SelectedLocalPosition: '',
        SelectedLocation: '',

        lookups: [],
        StartDate: null,
        ActualEndDate: null,
        ExpectedEndDate: null,
        HeadcountId: null,

        selectedUploadType: '',

        UploadFileDetailList: [],

        IsDownloadReady: false,

        DisableButton: false,
        makeCompleteFormDisable: true,
        makeSecurityFormDisable: true,
        makeAdminFormDisable: true,
        IsHeadcountForTemporary: false,
        FreezeSecurityPass: false,
        makeButtonHide: true


    };
    $scope.UploadType = {
        Approved_2152_Form: "Approved2152Form",
        Approved_Security_Pass_Form: "ApprovedSecurityPassForm"
    };

    $scope.getHeadcountById = function () {
        var defer = $q.defer();
        $scope.dto.HeadcountId = $route.current.params.Id == null ? 0 : $route.current.params.Id;

        HeadcountService.getHeadcountById($scope.dto.HeadcountId).then(function (response) {
            $scope.dto.Headcount = response.data.HeadCountItem;
            $scope.dto.UploadFileDetailList = response.data.UploadFileDetails;
            if ($scope.dto.Headcount.StatusName === null) {
                $scope.dto.SelectedStatus = '';
            }
            if ($scope.dto.Headcount.HiringCompanyName === null) {
                $scope.dto.SelectedHiringCompany = '';
            }
            if ($scope.dto.Headcount.OrganizationName === null) {
                $scope.dto.SelectedOrganization = '';
            }
            if ($scope.dto.Headcount.SecurityPassName === null) {
                $scope.dto.SelectedSecurityPass == '';
            }
            if ($scope.dto.Headcount.ApproveManagerID === null) {
                $scope.dto.SelectedSecuPassApprovingManager = '';
            }
            if ($scope.dto.Headcount.LineManagerID === null) {
                $scope.dto.SelectedLineManager = '';
            }
            if ($scope.dto.Headcount.PositionName === null) {
                $scope.dto.SelectedPosition = '';
            }
            if ($scope.dto.Headcount.LocalPositionCode === null) {
                $scope.dto.SelectedLocalPosition = '';
            }
            if ($scope.dto.Headcount.LocationID === null) {
                $scope.dto.SelectedLocation = '';
            }
            if (($scope.dto.UserDetails.IsReadOnlyUser == true || $scope.dto.UserDetails.IsSystemAdmin) && $scope.dto.UserDetails.IsSecurityTeam != true && $scope.dto.UserDetails.IsFacilitiesAdmin != true && $scope.dto.UserDetails.IsAdmin != true) {

                $scope.dto.makeCompleteFormDisable = true;
                $scope.dto.makeButtonHide = true;
            }
            else {
                $scope.dto.makeCompleteFormDisable = false;
                $scope.dto.makeButtonHide = false;
            }

            if ($scope.dto.UserDetails.IsSecurityTeam === true && ($scope.dto.UserDetails.IsFacilitiesAdmin != true && $scope.dto.UserDetails.IsAdmin != true)) {
                if ($scope.dto.HeadcountId === 0) {
                    $scope.dto.Headcount.SecurityPassName = 'Temporary';
                    $scope.dto.makeCompleteFormDisable = false;
                    $scope.dto.makeAdminFormDisable = false;
                    $scope.dto.FreezeSecurityPass = true;
                }
                else {
                    if ($scope.dto.Headcount.SecurityPassName != 'Temporary') {
                        $scope.dto.makeSecurityFormDisable = false;
                        $scope.dto.makeAdminFormDisable = true;
                        $scope.dto.makeCompleteFormDisable = true;
                        $scope.dto.makeButtonHide = false;

                    }

                }
            }
            if ($scope.dto.UserDetails.IsAdmin === true && ($scope.dto.UserDetails.IsFacilitiesAdmin != true && $scope.dto.UserDetails.IsSecurityTeam != true)) {
                $scope.dto.makeAdminFormDisable = false;
                $scope.dto.makeSecurityFormDisable = true;
                $scope.dto.makeCompleteFormDisable = true;
                $scope.dto.makeButtonHide = false;

            }
            if ($scope.dto.UserDetails.IsAdmin === true && $scope.dto.UserDetails.IsSecurityTeam === true) {
                $scope.dto.makeAdminFormDisable = false;
                $scope.dto.makeSecurityFormDisable = false;
                $scope.dto.makeCompleteFormDisable = true;
                $scope.dto.makeButtonHide = false;
            }
            if ($scope.dto.UserDetails.IsFacilitiesAdmin) {
                $scope.dto.makeAdminFormDisable = false;
                $scope.dto.makeSecurityFormDisable = false;
                $scope.dto.makeCompleteFormDisable = false;
                $scope.dto.makeButtonHide = false;
            }



            if (response.data.UploadFileDetails.length > 0) {
                _.forEach($scope.dto.UploadFileDetailList, function (item) {
                    if (item.UploadType === 'Approved2152Form') {
                        $scope.dto.Approved2152FormName = item.DisplayName;
                        $scope.Approved2152FormId = item.Id;
                        $scope.dto.IsDownloadReady = true;
                        return;
                    }
                    else {
                        $scope.dto.ApprovedSecurityPassForm = item.DisplayName;
                        $scope.ApprovedSecurityPassFormId = item.Id;
                        $scope.dto.IsDownloadReady = true;
                        return;
                    }
                });
            } else {
                $scope.dto.Approved2152FormName = null;
                $scope.dto.ApprovedSecurityPassForm = null;
            }

            radioOperations($scope.dto.Headcount);
            $scope.GetPreselectedDropdown();

            defer.resolve();
            $rootScope.busy = false;


        });
        
        return defer.promise;
    };

    $scope.clearHeadcountForm = function () {
        if ($scope.dto.Headcount.Id != 0) {
            $route.current.params.Id = $scope.dto.Headcount.Id;
        }
        else {
            $route.current.params.Id = 0;
        }
        $scope.getHeadcountById();
    }

    $scope.getHeadcountLookups = function () {
        HeadcountService.getHeadcountLookups().then(function (response) {
            $scope.dto.lookups = response;
            $scope.getHeadcountById();
            $("#headcountContainer").show();
            $rootScope.busy = false;
        });
    };
    $scope.getHeadcountLookups();
    $scope.$watch('dto.SelectedSecurityPass', function (item) {

        if ($scope.dto.UserDetails != null && $scope.dto.UserDetails.IsSecurityTeam === true && $scope.dto.UserDetails.IsFacilitiesAdmin != true) {
            if (item.SecurityPassName === 'Temporary') {
                $scope.dto.IsHeadcountForTemporary = true;
                $scope.dto.makeCompleteFormDisable = false;
            } else {
                if ($scope.dto.UserDetails) {

                    $scope.dto.makeCompleteFormDisable = $scope.dto.UserDetails.IsSecurityTeam;
                    $scope.dto.makeSecurityFormDisable = false;
                }
            }
        }

    });

    $scope.CheckLocalPositionCode = function () {
        var data = {};
        data.headcountId = $scope.dto.Headcount.Id;
        data.LocalPositionCode = $scope.dto.SelectedLocalPosition.LocalPositionCode;
        HeadcountService.CheckLocalPositionCodeExists(data).then(function (response) {
            if (response.data === 'true') {
                $scope.HeadcountForm.LocalPositionCode.$setValidity('unique', false);
            }
            else {
                $scope.HeadcountForm.LocalPositionCode.$setValidity('unique', true);
                $route.current.params.Id = null;
                $scope.getHeadcountById().then(function () {
                    $scope.dto.Headcount.LocalPositionCode = data.LocalPositionCode;
                    _.filter($scope.dto.lookups.LocalPositionCol, function (item) {
                        if ($scope.dto.Headcount.LocalPositionCode === item.LocalPositionCode.toString()) {
                            $scope.dto.SelectedLocalPosition = item;
                            return;
                        }
                    });
                });
                
            }
        });

    };
    $scope.GetPreselectedDropdown = function () {

        _.filter($scope.dto.lookups.StatusCol, function (item) {
            if ($scope.dto.Headcount.StatusName === item.StatusName) {
                $scope.dto.SelectedStatus = item;
                return;
            }
        });
        _.filter($scope.dto.lookups.HiringCompanyCol, function (item) {
            if ($scope.dto.Headcount.HiringCompanyName === item.HiringCompanyName) {
                $scope.dto.SelectedHiringCompany = item;
                return;
            }
        });
        _.filter($scope.dto.lookups.OrganizationCol, function (item) {
            if ($scope.dto.Headcount.OrganizationName === item.OrganizationName) {
                $scope.dto.SelectedOrganization = item;
                return;
            }
        });
        _.filter($scope.dto.lookups.SecurityPassCol, function (item) {
            if ($scope.dto.Headcount.SecurityPassName === item.SecurityPassName) {
                $scope.dto.SelectedSecurityPass = item;
                return;
            }
        });
        _.filter($scope.dto.lookups.HeadcountUserList, function (item) {
            if ($scope.dto.Headcount.ApproveManagerID === item.Id) {
                $scope.dto.SelectedSecuPassApprovingManager = item;
                return;
            }
        });
        _.filter($scope.dto.lookups.HeadcountUserList, function (item) {
            if ($scope.dto.Headcount.LineManagerID === item.Id) {
                $scope.dto.SelectedLineManager = item;
                return;
            }
        });
        _.filter($scope.dto.lookups.PositionCol, function (item) {
            if ($scope.dto.Headcount.PositionName === item.PositionName.toString()) {
                $scope.dto.SelectedPosition = item;
                return;
            }
        });
        _.filter($scope.dto.lookups.LocalPositionCol, function (item) {
            if ($scope.dto.Headcount.LocalPositionCode === item.LocalPositionCode.toString()) {
                $scope.dto.SelectedLocalPosition = item;
                return;
            }
        });
        _.filter($scope.dto.lookups.LocationCol, function (item) {
            if ($scope.dto.Headcount.LocationID === item.Id) {
                $scope.dto.SelectedLocation = item;
                return;
            }
        });
    };
    $scope.AddNewHeadcountRecord = function () {
        HeadcountService.AddNewHeadcount($scope.dto).then(function (response) {
            $scope.dto.Headcount = response.data.HeadCountItem;


            $scope.dto.UploadFileDetailList = response.data.UploadFileDetails;
            if (response.data.UploadFileDetails.length > 0) {
                _.forEach($scope.dto.UploadFileDetailList, function (item) {
                    if (item.UploadType === 'Approved2152Form') {
                        $scope.dto.Approved2152FormName = item.DisplayName;
                        $scope.Approved2152FormId = item.Id;
                        $scope.dto.IsDownloadReady = true;
                        return;
                    }
                    else {
                        $scope.dto.ApprovedSecurityPassForm = item.DisplayName;
                        $scope.ApprovedSecurityPassFormId = item.Id;
                        $scope.dto.IsDownloadReady = true;
                        return;
                    }
                });
            }

            radioOperations($scope.dto.Headcount);
            $scope.GetPreselectedDropdown();
            $rootScope.busy = false;
            toastr.success('Record created successfully');
        });
    };
    $scope.UpdateHeadcountRecord = function () {
        if ($scope.dto.UserDetails.IsSecurityTeam === true) {
            $scope.dto.Headcount.IsSecurityEdited = true;
            $scope.dto.Headcount.IsSubmitted = false;
        }
        HeadcountService.UpdateHeadcount($scope.dto).then(function (response) {
            $scope.dto.Headcount = response.data.HeadCountItem;

            $scope.dto.UploadFileDetailList = response.data.UploadFileDetails;
            if (response.data.UploadFileDetails.length > 0) {
                _.forEach($scope.dto.UploadFileDetailList, function (item) {
                    if (item.UploadType === 'Approved2152Form') {
                        $scope.dto.Approved2152FormName = item.DisplayName;
                        $scope.Approved2152FormId = item.Id;
                        $scope.dto.IsDownloadReady = true;
                        return;
                    }
                    else {
                        $scope.dto.ApprovedSecurityPassForm = item.DisplayName;
                        $scope.ApprovedSecurityPassFormId = item.Id;
                        $scope.dto.IsDownloadReady = true;
                        return;
                    }
                });
            }
            radioOperations($scope.dto.Headcount);
            $scope.GetPreselectedDropdown();
            $rootScope.busy = false;
            toastr.success('Record updated successfully');
        });
    };

    $scope.saveHeadcountForm = function () {
        var defer = $q.defer();
        $scope.dto.Headcount.StatusID = $scope.dto.SelectedStatus.Id === undefined ? null : $scope.dto.SelectedStatus.Id;
        $scope.dto.Headcount.HiringCompanyID = $scope.dto.SelectedHiringCompany.Id === undefined ? null : $scope.dto.SelectedHiringCompany.Id;
        $scope.dto.Headcount.LineManagerID = $scope.dto.SelectedLineManager.Id === undefined ? null : $scope.dto.SelectedLineManager.Id;
        $scope.dto.Headcount.OrganizationID = $scope.dto.SelectedOrganization.Id === undefined ? null : $scope.dto.SelectedOrganization.Id;
        $scope.dto.Headcount.ApproveManagerID = $scope.dto.SelectedSecuPassApprovingManager.Id === undefined ? null : $scope.dto.SelectedSecuPassApprovingManager.Id;
        $scope.dto.Headcount.SecurityPassID = $scope.dto.SelectedSecurityPass.Id === undefined ? null : $scope.dto.SelectedSecurityPass.Id;
        $scope.dto.Headcount.PositionName = $scope.dto.SelectedPosition.PositionName === undefined ? null : $scope.dto.SelectedPosition.PositionName;
        $scope.dto.Headcount.LocalPositionCode = $scope.dto.SelectedLocalPosition.LocalPositionCode === undefined ? null : $scope.dto.SelectedLocalPosition.LocalPositionCode;
        $scope.dto.Headcount.LocationID = $scope.dto.SelectedLocation.Id === undefined ? null : $scope.dto.SelectedLocation.Id;




        if ($scope.dto.Headcount.I_Phone) {
            $scope.dto.Headcount.I_Phone = $scope.dto.Headcount.I_Phone == '1' ? true : false;
        }
        $scope.dto.Headcount.C_BAY = $scope.dto.Headcount.C_BAY == '1' ? true : false;
        $scope.dto.Headcount.SAP_Org_Chart = $scope.dto.Headcount.SAP_Org_Chart == '1' ? true : false;
        $scope.dto.Headcount.Desk = $scope.dto.Headcount.Desk == '1' ? true : false;
        $scope.dto.Headcount.IsSaved = true;

        if ($scope.dto.Headcount.Id === 0) {
            //check if record already exists and show warning if exists. 
            HeadcountService.CheckMemberExists($scope.dto.Headcount).then(function (response) {
                $rootScope.busy = false;
                if (response.data === 'true') {
                    COPDialog.Confirmation("Warning", "Record already exists with same Surname and Forename. Do you want to save this new record?").then(function (result) {
                        if (result === true) {
                            $scope.AddNewHeadcountRecord();
                            
                        }
                        defer.resolve();

                    });
                }
                else {
                    $scope.AddNewHeadcountRecord();
                }
                
            });
        }
        else {
            //Existing record check the forename and surname

            HeadcountService.CheckMemberExists($scope.dto.Headcount).then(function (response) {
                $rootScope.busy = false;
                if (response.data === 'true') {
                    COPDialog.Confirmation("Warning", "Record already exists with same Surname and Forename. Do you want to update this record?").then(function (result) {
                        if (result === true) {
                            $scope.UpdateHeadcountRecord();
                            
                        }
                        defer.resolve();
                    });
                }
                else {
                    $scope.UpdateHeadcountRecord();
                }
               
            });

        }

        return defer.promise;

    };
    var radioOperations = function (data) {



        if (data.I_Phone) {
            $scope.dto.Headcount.I_Phone = data.I_Phone == true ? '1' : '0';
        }
        $scope.dto.Headcount.C_BAY = data.C_BAY == true ? '1' : '0';
        $scope.dto.Headcount.SAP_Org_Chart = data.SAP_Org_Chart == true ? '1' : '0';
        $scope.dto.Headcount.Desk = data.Desk == true ? '1' : '0';

    };

    $scope.submitHeadcountForm = function (dto) {
        $scope.dto.Headcount.IsSubmitted = true;
        $scope.saveHeadcountForm().then(function () {
            HeadcountService.sendEmail($scope.dto.Headcount).then(function () {
                $rootScope.busy = false
                toastr.success('Email sent successfully')
            });
        });
    };

    $scope.openedExpectedEndDate = false;
    $scope.openedActualEndDate = false;
    $scope.openedStartDate = false;




    /* Will be executed when there is any req of file changed */
    //$scope.$watch('files', function () {
    //    $scope.onFileSelect($scope.files);
    //});

    $scope.onFileSelect = function ($files, filetp) {
        try {
            if ($files && $files.length) {
                for (var i = 0; i < $files.length; i++) {
                    var file = $files[i];
                    $upload.upload({
                        url: 'api/file/upload',
                        fields: { 'username': '' },
                        file: file
                    }).progress(function (evt) {
                        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                        console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
                    }).success(function (data, status, headers, config) {
                        data.HeadCountID = $scope.dto.Headcount.Id;
                        data.UploadType = filetp;
                        if (filetp === 'Approved2152Form') {
                            $scope.dto.Approved2152FormName = data.DisplayName;
                            $scope.dto.IsDownloadReady = false;
                        }
                        else {
                            $scope.dto.ApprovedSecurityPassForm = data.DisplayName;
                            $scope.dto.IsDownloadReady = false;
                        }

                        $scope.dto.UploadFileDetailList.push(data);
                        file = null;
                        $rootScope.busy = false;
                    }).error(function (err) {
                    });
                }
            }
        }
        catch (err) {
            alert(err.message);
        }
    };


    // Gets the file as an attachment
    $scope.getFile = function (fileId) {
        window.location.href = 'api/file/' + fileId;
        return;
    };

    // Delete a file
    $scope.deleteFile = function (fileType, fileId) {
        COPDialog.Confirmation("Warning", "Are you sure you want to remove this File?").then(function (result) {
            if (result === true) {


                _.remove($scope.dto.UploadFileDetailList, { 'UploadType': fileType });
                if (fileType === 'Approved2152Form') {
                    $scope.dto.Approved2152FormName = null;
                }
                else {
                    $scope.dto.ApprovedSecurityPassForm = null;
                }
                if ($scope.dto.IsDownloadReady) {
                    HeadcountService.DeleteFileByFileId(fileId).then(function (response) {
                        var data = response.data;
                        $rootScope.busy = false;
                    });
                }
                toastr.success('File Deleted successfully');
            }


        });
    };


    /* Show upload Dialog */
    $scope.show2152UploadDialog = function () {
        $scope.dto.selectedUploadType = $scope.UploadType.Approved_2152_Form;
        COPDialog.FormDialog("Upload File", "partial/dialog/UploadDialog.html", $scope.dto).then(function (result) {
            if (result !== undefined) {

            }
        });
    };
    $scope.showApprSecuPassFormUploadDialog = function () {
        $scope.dto.selectedUploadType = $scope.UploadType.Approved_Security_Pass_Form;
        COPDialog.FormDialog("Upload File", "partial/dialog/UploadDialog.html", $scope.dto).then(function (result) {
            if (result !== undefined) {

            }
        });
    };


});