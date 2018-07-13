var textInputCtrl = function ($scope, $modalInstance, comments, disabled, limit) {

    $scope.original = comments;
    $scope.comments = comments;
    $scope.disabled = disabled;
    $scope.limit = limit;
    $scope.inputfocus = true;

    $scope.update = function (newVal) {
        $modalInstance.close(newVal);
    };

    $scope.close = function () {
        $modalInstance.dismiss('cancel');
    };
};