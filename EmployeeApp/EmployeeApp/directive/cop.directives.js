angular.module('cop.directives', [])

    .directive('textareaPopup', function ($modal) {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                ngModel: '=',
                textareaDisabled: '=',
                textareaChange: '=',
                textareaRequired: '=',
                textareaLimit: '=',
                rows: '='
            },
            template:
                '<div>' +
                    '<textarea ng-click="showTextInput()" ' +
                        'ng-change="textareaChange" ' +
                        'ng-readonly="textareaDisabled" ' +
                        'rows="{{rows}}" ' +
                        'ng-required="textareaRequired" ' +
                        'style="resize: none;overflow:hidden;cursor: pointer;" ' +
                        'class="form-control input-sm pointer" ' +
                        'ng-model="ngModel">' +
                    '</textarea>' +
                '</div>',
            link: function (scope, element, attrs, ngModel) {
                scope.showTextInput = function () {
                    element[0].blur();

                    var modalInstance = $modal.open({
                        templateUrl: 'partial/dialog/textinput/textInput.html',
                        controller: 'textInputCtrl',
                        size: 'sm',
                        resolve: {
                            comments: function () { return scope.ngModel; },
                            limit: function () { return scope.textareaLimit; },
                            disabled: function () { return scope.textareaDisabled; }
                        }
                    });

                    modalInstance.result.then(function (result) {
                        scope.ngModel = result;
                    });
                }
            }
        };
    })
    .directive('ngFocus', function ($parse, $timeout) {
        return function (scope, element, attrs) {
            var ngFocusGet = $parse(attrs.ngFocus);
            var ngFocusSet = ngFocusGet.assign;
            if (!ngFocusSet) {
                throw Error("Non assignable expression");
            }

            var digesting = false;

            var abortFocusing = false;
            var unwatch = scope.$watch(attrs.ngFocus, function (newVal) {
                if (newVal) {
                    $timeout(function () {
                        element[0].focus();
                    }, 0)
                }
                else {
                    $timeout(function () {
                        element[0].blur();
                    }, 0);
                }
            });


            element.bind("blur", function () {

                if (abortFocusing) return;

                $timeout(function () {
                    ngFocusSet(scope, false);
                }, 0);

            });


            var timerStarted = false;
            var focusCount = 0;

            function startTimer() {
                $timeout(function () {
                    timerStarted = false;
                    if (focusCount > 3) {
                        unwatch();
                        abortFocusing = true;
                        throw new Error("Aborting : ngFocus cannot be assigned to the same variable with multiple elements");
                    }
                }, 200);
            }

            element.bind("focus", function () {

                this.selectionStart = this.selectionEnd = this.value.length;

                if (abortFocusing) return;

                if (!timerStarted) {
                    timerStarted = true;
                    focusCount = 0;
                    startTimer();
                }
                focusCount++;

                $timeout(function () {
                    ngFocusSet(scope, true);
                }, 0);

            });
        };
    })

    .directive('fileStyle', function ($parse, $timeout) {
        return function (scope, element, attrs) {
            var options = scope.$eval(attrs.fileStyle);
            element.filestyle(options);
        };
    })
    .directive('modalDialog', function () {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            templateUrl: 'partial/dialog/form.html'
        };
    })
    .directive('numeric', function () {
        return {
            require: 'ngModel',
            link: function (scope, element, attr, ngModelCtrl) {
                function fromUser(text) {
                    var transformedInput = text.replace(/[^0-9]/g, '');
                    if (transformedInput !== text) {
                        ngModelCtrl.$setViewValue(transformedInput);
                        ngModelCtrl.$render();
                    }
                    return transformedInput;
                }
                ngModelCtrl.$parsers.push(fromUser);
            }
        };
    })
   .directive('validNumber', function () {
       return {
           require: '?ngModel',
           link: function (scope, element, attrs, ngModelCtrl) {
               if (!ngModelCtrl) {
                   return;
               }

               ngModelCtrl.$parsers.push(function (val) {
                   if (angular.isUndefined(val)) {
                       var val = '';
                   }
                   var clean = val.replace(/[^0-9\.]/g, '');
                   var decimalCheck = clean.split('.');

                   if (!angular.isUndefined(decimalCheck[1])) {
                       decimalCheck[1] = decimalCheck[1].slice(0, 2);
                       clean = decimalCheck[0] + '.' + decimalCheck[1];
                   }

                   if (val !== clean) {
                       ngModelCtrl.$setViewValue(clean);
                       ngModelCtrl.$render();
                   }
                   return clean;
               });

               element.bind('keypress', function (event) {
                   if (event.keyCode === 32) {
                       event.preventDefault();
                   }
               });
           }
       };
   })
   .directive('ngUnique', function (HeadcountService, $timeout) {
       var promise;
       return {
           restrict: 'A',
           require: 'ngModel',
           link: function (scope, elem, attrs, ctrl) {

               scope.$watch(attrs.ngModel, function (newValue, oldValue) {
                   if (typeof oldValue === 'undefined') return;
                   var model = scope;
                   var data = {};

                   $timeout.cancel(promise);
                   promise = $timeout(function () {
                       if (newValue && newValue !== oldValue) {

                           data.headcountId = model.dto.Headcount.Id;
                           data.Personnel_No = newValue;
                           HeadcountService.CheckSapPersonnelNoExists(data).then(function (response) {
                               if (response.data === 'true') {
                                   ctrl.$setValidity('unique', false);
                               }
                               else {
                                   ctrl.$setValidity('unique', true);
                               }
                           });
                       } else {
                           ctrl.$setValidity('unique', true);
                       }

                   }, 500);

               })
           }
       }
   })
   .directive('sappositionidchk', function (HeadcountService, $timeout) {
       var something = '';
       var promise;
       return {
           restrict: 'A',
           require: 'ngModel',
           link: function (scope, elem, attrs, ctrl) {

               scope.$watch(attrs.ngModel, function (newValue, oldValue) {
                   if (typeof oldValue === 'undefined') return;
                   var model = scope;
                   var data = {};

                   $timeout.cancel(promise);
                   promise = $timeout(function () {
                       if (newValue && newValue !== oldValue) {

                           data.headcountId = model.dto.Headcount.Id;
                           data.SAP_PositionID = newValue;
                           HeadcountService.CheckSapPositionIDExists(data).then(function (response) {
                               if (response.data === 'true') {
                                   ctrl.$setValidity('unique', false);
                               }
                               else {
                                   ctrl.$setValidity('unique', true);
                               }
                           });
                       } else {
                           ctrl.$setValidity('unique', true);
                       }

                   }, 500);

               })
           }
       }
   })
   .directive('myRefresh', function ($location, $route) {
        return function (scope, element, attrs) {
            element.bind('click', function () {
                if (element[0] && element[0].href && element[0].href === $location.absUrl()) {
                    $route.reload();
                }
            });
        }
    })
;

