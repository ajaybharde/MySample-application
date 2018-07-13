app.directive('attachmentList', [function () {
    return {
        templateUrl: 'directive/attachment/attachment.tpl.html',
        replace: true,
        restrict: 'A',
        scope: {
            mode: '=mode',
            attachments: '=ngModel'
        },
        link: function (scope, elem, attr) {
            scope.newAttachment = {};
            scope.newAttachment.Type = 0;
        },
        controller: function ($scope) {
            var s = $scope;

            $scope.addAttachment = function () {
                $scope.invalid = false;
                $scope.statusString = null;

                if (!$scope.newAttachment.Description || !$scope.newAttachment.Link) {
                    $scope.showError('Please supply a valid Description and File.');
                } else {
                    $scope.upladoAttachment();
                }
            }

            $scope.showError = function (str) {
                $scope.invalid = true;
                $scope.statusString = str;
            }

            $scope.upladoAttachment = function () {

            }
        }
    }
}]);