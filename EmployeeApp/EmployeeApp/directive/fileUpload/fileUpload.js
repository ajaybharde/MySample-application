app.directive('fileUpload', [function () {
    return {
        restrict: 'EA',
        replace: false,
        scope: {
            action: '@',
            documentVersionId: '@',
            uploadTypeId: '@',
            callback: '&onUpload',
            result: '='
        },
        template:
            "<div>" +
            "<div class='form-group' ng-hide='uploading' >" +
                "<div class='input-group'>" +
                "<textarea ng-show='false' rows='3' class='form-control input-sm' placeholder='Optional document description' ng-model='dto.DisplayName'></textarea><br />" +
                "<form enctype='multipart/form-data' id='uploadForm'>" +
                "<label>Document to upload" +
                "  <div class='uploader form-inline'>" +
                "  <div class='form-group'>" +
                "   <input type='file' name='file' style='width:400px' id='file' class='form-control input-sm' ng-model='dto.Name_File' />" +
                "  </div>" +
                "  <div class='form-group'>" +
                "   <button type='button' class='btn btn-default btn-file btn-primary btn-sm' ng-click='uploadFile()'>Upload</button>{{fileSizeCheck}}" +
                "  </div>" +
                "  </div>" +
                "</form>" +
                "  </div>" +
            "</div><br/>" +
            "<div ng-show='uploading'>" +
                "<img src='img/spinner.gif' />&nbsp;Uploading file, please wait. This can take up to 2 minutes when uploading a document depending on the file size." +
            "</div>" +
            "<div ng-show='result==\"SUCCESS\"' class='alert alert-success'>Your file has uploaded successfully. You can now close this window. </div>" +
            "<div ng-show='result==\"ERROR\"' class='alert alert-danger'>An error occured uploading your file.</div>" +
            "<div ng-show='result==\"TOOBIG\"' class='alert alert-warning'>Your file is greater than 25MB in size and cannot be uploaded. Please read the help for authors entitled 'My file exceeds 25MB in size'</div>" +
            "</div>",
        controller: ['$scope', '$rootScope', function ($scope, $rootScope) {
            $scope.progress = 0;
            $scope.avatar = '';
            $scope.dto = {

            };
            $scope.uploading = false;
            $scope.Name_File = "";
            $scope.Extension = "";
            $scope.result = "";
            $scope.fileSizeCheck = "";

            // When a file is chosen from the browse
            $('#file').bind('change', function () {
                $scope.$apply(function () {
                    $scope.result = "";
                    $scope.Name_File = $('#file').val();
                    $scope.Extension = $scope.Name_File.split('.')[$scope.Name_File.split('.').length - 1];
                });
                //$scope.checkFileSize();
            });


            $scope.checkFileSize = function () {
                if ($scope.dto.DocumentFileTypeId == 1 && $scope.fileExt != "docx") {
                    alert("Please select a word document saved in the docx format.");
                    return false;
                }

                var $form = $('#uploadForm');

                $form.attr('action', 'api/file/checksize');

                var $file = $('#file');
                if ($file.val() == '' || $file.val() == 'undefined') {
                    return false;
                }

                $form.ajaxSubmit({
                    data: { model: '' },
                    type: 'POST',
                    uploadProgress: function (event, position, total, percentComplete) {
                        $scope.progress = percentComplete;
                    },
                    error: function (event, statusText, responseText, form) {
                        $form.removeAttr('action');

                        $scope.$apply(function () {
                            $scope.fileSizeCheck = "ERROR";
                            //	$scope.uploading = false;
                        });
                    },
                    success: function (responseText, statusText, xhr, form) {
                        $form.removeAttr('action');

                        $scope.$apply(function () {
                            $scope.fileSizeCheck = responseText;
                            //$scope.uploading = false;
                        });

                        //$scope.callback();
                    },
                });
            };

            // Upload the file
            $scope.uploadFile = function () {

                $scope.uploading = true;

                var $form = $('#uploadForm');

                $form.attr('action', $scope.action);

                // Check for the file
                var $file = $('#file');
                if ($file.val() == '' || $file.val() == 'undefined') {
                    return false;
                }



                $scope.dto.HeadCountID = $scope.documentVersionId;
                $scope.dto.UploadType = $scope.uploadTypeId;
                // Set the model to upload with the file
                var model = $scope.dto;

                $form.ajaxSubmit({
                    data: { model: angular.toJson(model) },
                    type: 'POST',
                    uploadProgress: function (event, position, total, percentComplete) {
                        $scope.progress = percentComplete;
                    },
                    error: function (event, statusText, responseText, form) {
                        $form.removeAttr('action');

                        $scope.$apply(function () {
                            $scope.result = "ERROR";
                            $scope.uploading = false;
                        });
                    },
                    success: function (responseText, statusText, xhr, form) {
                        $form.removeAttr('action');

                        $scope.$apply(function () {
                            $scope.result = responseText;
                            $scope.uploading = false;
                        });

                        $scope.callback();
                    },
                });
            }
        }],
    };
}]);

app.directive('fileUploadDoctype', [function () {
    return {
        restrict: 'EA',
        replace: false,
        scope: {
            action: '@',
            documentTypeId: '@',
            callback: '&onUpload'
        },
        template:
            "<div>" +
                "<div ng-hide='uploading' >" +
                    "<form enctype='multipart/form-data' id='uploadForm'>" +
                    "  <div class='uploader'>" +
                    "    <table style='width: 100%;border: 0px solid Yellow;'>" +
                    "       <tr>" +
                    "           <td><input type='file'	name='file' id='file' class='form-control input-sm' /></td>" +
                    "           <td style='width: 60px;text-align: right;'><button type='button' class='btn btn-primary btn-sm' ng-click='uploadFile()'>Upload</button></td>" +
                    "       </tr>" +
                    "    </table>" +
                    "  </div>" +
                    "</form>" +
                "</div>" +
                "<div ng-show='uploading'>" +
                    "<img src='css/spinner.gif' />&nbsp;uploading file..." +
                "</div>" +
            "</div>",
        controller: ['$scope', '$rootScope', function ($scope, $rootScope) {
            $scope.progress = 0;
            $scope.avatar = '';
            $scope.dto = {};
            $scope.uploading = false;
            $scope.fileName = "";
            $scope.fileExt = "";

            $('#file').bind('change', function () {
                $scope.$apply(function () {
                    $scope.fileName = $('#file').val();
                    $scope.fileExt = $scope.fileName.split('.')[$scope.fileName.split('.').length - 1];
                });
                //this.files[0].size gets the size of your file.
                //  var si = this.files[0].size;

            });

            $scope.uploadFile = function () {
                // if the document is being uploaded and it is not a document
                if (($scope.fileExt != "doc" && $scope.fileExt != "docx")) {
                    alert("Only word documents can be uploaded.");
                    return false;
                }

                $scope.uploading = true;

                var $form = $('#uploadForm');//.parents('form');

                var $file = $('#file');
                var t = $file.val();
                if ($file.val() == '') {
                    return false;
                }

                $form.attr('action', $scope.action);

                $scope.dto.DocumentTypeId = $scope.documentTypeId;

                var model = $scope.dto;//{ DocumentFileTypeId: '1', Description: 'your mother' };

                $form.ajaxSubmit({
                    data: { model: angular.toJson(model) },
                    type: 'POST',
                    uploadProgress: function (event, position, total, percentComplete) {
                        //$scope.$apply(function () {
                        // upload the progress bar during the upload
                        $scope.progress = percentComplete;
                        //});

                    },
                    error: function (event, statusText, responseText, form) {

                        // remove the action attribute from the form
                        $form.removeAttr('action');

                        $scope.$apply(function () {
                            $scope.uploading = false;
                            $scope.onError({
                                event: event,
                                responseText: responseText,
                                statusText: statusText,
                                form: form,
                            });
                        });
                    },
                    success: function (responseText, statusText, xhr, form) {
                        $scope.$apply(function () {
                            $scope.uploading = false;
                        });

                        var ar = $file.val().split('\\');
                        filename = ar[ar.length - 1];

                        // remove the action attribute from the form
                        $form.removeAttr('action');

                        $scope.callback();
                    },
                });

            }
        }],
    };
}]);

app.directive('fileUploadProcessflow', [function () {
    return {
        restrict: 'EA',
        replace: false,
        scope: {
            action: '@',
            callback: '&onUpload'
        },
        template:
            "<div>" +
                "<div ng-hide='uploading' >" +
                    "<form enctype='multipart/form-data' id='uploadForm'>" +
                    "  <div class='uploader'>" +
                    "    <table style='width: 100%;'>" +
                    "       <tr>" +
                    "           <td><input type='file'	name='file' id='file' class='form-control input-sm' /></td>" +
                    "           <td style='width: 60px;text-align: right;'><button type='button' class='btn btn-primary btn-sm' ng-click='uploadFile()'>Upload</button></td>" +
                    "       </tr>" +
                    "    </table>" +
                    "  </div>" +
                    "</form>" +
                "</div>" +
                "<div ng-show='uploading'>" +
                    "<img src='css/spinner.gif' />&nbsp;uploading file..." +
                "</div>" +
            "</div>",
        controller: ['$scope', '$rootScope', function ($scope, $rootScope) {
            $scope.progress = 0;
            $scope.avatar = '';
            $scope.dto = {};
            $scope.uploading = false;
            $scope.fileName = "";
            $scope.fileExt = "";

            $('#file').bind('change', function () {
                $scope.$apply(function () {
                    $scope.fileName = $('#file').val();
                    $scope.fileExt = $scope.fileName.split('.')[$scope.fileName.split('.').length - 1];
                });
                //this.files[0].size gets the size of your file.
                //  var si = this.files[0].size;

            });

            $scope.uploadFile = function () {
                // if the document is being uploaded and it is not a document
                if (($scope.fileExt != "xls" && $scope.fileExt != "xlsx")) {
                    alert("Only excel files can be uploaded.");
                    return false;
                }

                $scope.uploading = true;

                var $form = $('#uploadForm');//.parents('form');

                var $file = $('#file');
                var t = $file.val();
                if ($file.val() == '') {
                    return false;
                }

                $form.attr('action', $scope.action);

                $form.ajaxSubmit({
                    type: 'POST',
                    uploadProgress: function (event, position, total, percentComplete) {
                        //$scope.$apply(function () {
                        // upload the progress bar during the upload
                        $scope.progress = percentComplete;
                        //});

                    },
                    error: function (event, statusText, responseText, form) {

                        // remove the action attribute from the form
                        $form.removeAttr('action');

                        $scope.$apply(function () {
                            $scope.uploading = false;
                            $scope.onError({
                                event: event,
                                responseText: responseText,
                                statusText: statusText,
                                form: form,
                            });
                        });
                    },
                    success: function (responseText, statusText, xhr, form) {
                        $scope.$apply(function () {
                            $scope.uploading = false;
                        });

                        var ar = $file.val().split('\\');
                        filename = ar[ar.length - 1];

                        // remove the action attribute from the form
                        $form.removeAttr('action');

                        $scope.callback();
                    },
                });

            }
        }],
    };
}]);

app.directive('fileUploadGen', [function () {
    return {
        restrict: 'EA',
        replace: false,
        scope: {
            action: '@',
            documentVersionId: '@',
            uploadtypeid:'@',
            extensions: '@',
            callback: '&onUpload'
        },
        template:
                "<form enctype='multipart/form-data' id='uploadForm1' style='border: 0px solid Green;'>" +
                "  <div class='uploader'>" +
                "    <table style='width: 100%;border: 0px solid Yellow;'>" +
                "       <tr>" +
                "           <td><input type='file'	name='file' id='file1' class='form-control input-sm' /></td>" +
                "           <td style='width: 60px;text-align: right;'><button type='button' class='btn btn-primary btn-sm' ng-click='uploadFile()'>Upload</button></td>" +
                "       </tr>" +
                "    </table>" +
                "  </div>" +
                "</form>" +
                "<div ng-show='statusString' class='alert' ng-class=\"{true:\'alert-success\',false:\'alert-danger\'}[statusString.indexOf('complete') != -1]\">{{statusString}}</div>" +
                "<div ng-show='uploading'>" +
                    "<img src='css/spinner.gif' />&nbsp;uploading file..." +
                "</div>",
        controller: ['$scope', '$rootScope', function ($scope, $rootScope) {
            $scope.statusString = '';
            $scope.progress = 0;
            $scope.avatar = '';
            $scope.dto = {
                DocumentFileTypeId: 3
            };
            $scope.uploading = false;
            $scope.fileName = "";
            $scope.fileExt = "";

            $('#file1').bind('change', function () {
                $scope.$apply(function () {
                    $scope.statusString = '';
                    $scope.fileName = $('#file1').val();
                    $scope.fileExt = $scope.fileName.split('.')[$scope.fileName.split('.').length - 1];
                });
            });

            $scope.uploadFile = function () {
                // if the document is being uploaded and it is not a document
                if (($scope.extensions.indexOf($scope.fileExt) == -1)) {
                    $scope.uploading = false;
                    $scope.statusString = 'Please select a file of type ' + $scope.extensions;
                    return false;
                }

                $scope.uploading = true;

                var $form = $('#uploadForm1');//.parents('form');

                var $file = $('#file1');
                var t = $file.val();
                if ($file.val() == '') {
                    $scope.uploading = false;
                    $scope.statusString = 'Please select a file.';
                    return false;
                }

                $form.attr('action', $scope.action);

                $scope.dto.DocumentVersionId = $scope.documentVersionId;

                var model = $scope.dto;

                $form.ajaxSubmit({
                    data: { model: angular.toJson(model) },
                    type: 'POST',
                    uploadProgress: function (event, position, total, percentComplete) {
                        $scope.progress = percentComplete;
                    },
                    error: function (event, statusText, responseText, form) {
                        $scope.uploading = false;
                        // remove the action attribute from the form
                        $form.removeAttr('action');

                        $scope.$apply(function () {
                            $scope.uploading = false;
                            $scope.onError({
                                event: event,
                                responseText: responseText,
                                statusText: statusText,
                                form: form,
                            });
                        });
                    },
                    success: function (responseText, statusText, xhr, form) {
                        $scope.uploading = false;
                        $scope.statusString = 'File upload complete.';
                        $scope.$apply(function () {
                            $scope.uploading = false;
                        });

                        var ar = $file.val().split('\\');
                        filename = ar[ar.length - 1];

                        // remove the action attribute from the form
                        $form.removeAttr('action');

                        $scope.callback();
                    },
                });

            }
        }],
    };
}]);


app.directive('fileUploadPeerReview', [function () {
    return {
        restrict: 'EA',
        replace: false,
        scope: {
            action: '@',
            workflowStepUserId: '@',
            callback: '&onUpload'
        },
        template:
            "<div>" +
                "<div ng-hide='state==\"Uploading\" || state==\"Success\"' class=\"space-bottom\" >" +
                    "<form enctype='multipart/form-data' id='uploadFormPeerReview'>" +
                    "  <div class='uploader'>" +
                    "    <table style='width: 100%;'>" +
                    "       <tr>" +
                    "           <td><input type='file'	name='peerReviewFile' id='peerReviewFile' class='form-control input-sm' /></td>" +
                    "           <td style='width: 60px;text-align: right;'><button type='button' class='btn btn-primary btn-sm' ng-click='uploadFile()'>Upload</button></td>" +
                    "       </tr>" +
                    "    </table>" +
                    "  </div>" +
                    "</form>" +
                "</div>" +
                "<div ng-show='state==\"Uploading\"'>" +
                    "<img src='css/spinner.gif' />&nbsp;uploading file..." +
                "</div>" +
            "<div ng-show='state==\"Success\"' class='alert alert-success'>Your file has uploaded successfully. You can now close this window.</div>" +
            "<div ng-show='state==\"Error\"' class='alert alert-danger'>An error occured uploading your file.</div>" +
            "<div ng-show='state==\"TooBig\"' class='alert alert-warning'>Your file is greater than 25MB in size and cannot be uploaded. Please read the help for authors entitled 'My file exceeds 25MB in size'</div>" +
            "</div>",
        controller: ['$scope', '$rootScope', function ($scope, $rootScope) {
            $scope.progress = 0;
            $scope.avatar = '';
            $scope.dto = {};
            $scope.fileName = "";
            $scope.fileExt = "";

            $('#peerReviewFile').bind('change', function () {
                $scope.$apply(function () {
                    $scope.fileName = $('#peerReviewFile').val();
                    $scope.fileExt = $scope.fileName.split('.')[$scope.fileName.split('.').length - 1];
                });
            });

            $scope.uploadFile = function () {

                $scope.state = "Uploading";
                $scope.state = null;
                $scope.dto.WorkflowStepUserId = $scope.workflowStepUserId;
                $scope.fileName = "";
                $scope.fileExt = "";
                $scope.result = "";
                $scope.fileSizeCheck = "";

                var $form = $('#uploadFormPeerReview');//.parents('form');

                var $file = $('#peerReviewFile');
                var t = $file.val();
                if ($file.val() == '') {
                    return false;
                }

                var model = $scope.dto;

                $form.attr('action', $scope.action);

                $form.ajaxSubmit({

                    data: { model: angular.toJson(model) },
                    type: 'POST',
                    uploadProgress: function (event, position, total, percentComplete) {
                        //$scope.$apply(function () {
                        // upload the progress bar during the upload
                        $scope.progress = percentComplete;
                        //});

                    },
                    error: function (event, statusText, responseText, form) {

                        // remove the action attribute from the form
                        $form.removeAttr('action');

                        $scope.$apply(function () {
                            if (event.responseText.indexOf("Maximum file size reached") !== -1) {
                                $scope.state = "TooBig";
                            } else {
                                $scope.state = "Error";
                            }
                            //$scope.onError({
                            //    event: event,
                            //    responseText: responseText,
                            //    statusText: statusText,
                            //    form: form
                            //});
                        });
                    },
                    success: function (responseText, statusText, xhr, form) {
                        $scope.state = "Success";
                        $scope.$apply(function () {
                            $scope.result = responseText;
                        });

                        var ar = $file.val().split('\\');
                        fileName = ar[ar.length - 1];

                        // remove the action attribute from the form
                        $form.removeAttr('action');
                        $scope.callback({ documentFileId: responseText, fileName: fileName });
                    }
                });
            }
        }]
    };
}]);