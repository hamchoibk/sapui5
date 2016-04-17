'use strict';
tcbmwApp.directive('resetTextField', ['$compile', '$timeout', function($compile, $timeout) {
    return {
        require: 'ngModel',
        scope: {},
        link: function(scope, el, attrs, ctrl) {
            //setup mode has ben button besind or not
            var mode = attrs.resetTextField;
            console.log("reset button mode == ", mode);

            // limit to input element of specific types
            var inputTypes = /text|search|tel|url|email|password/i;
            if (el[0].nodeName !== "INPUT") {
                throw new Error("resetTextField is limited to input elements");
            }
            if (!inputTypes.test(attrs.type)) {
                throw new Error("Invalid input type for resetTextField: " + attrs.type);
            }

            // compiled reset icon template
            var template;
            if (mode == "default") {
                template = $compile('<i class="resetTextFieldDefault inputIcon glyphicon pull-right" ng-show="enabled" ng-click="reset()"></i>')(scope);
            } else if (mode == "hasBenButton") {
                template = $compile('<i class="resetTextFieldHasBenButton inputIcon glyphicon pull-right" ng-show="enabled" ng-click="reset()"></i>')(scope);
            } else {
                template = $compile('<i class="resetTextFieldDefault inputIcon glyphicon pull-right" ng-show="enabled" ng-click="reset()"></i>')(scope);
            }

            el.after(template);

            scope.reset = function() {
                ctrl.$setViewValue(null);
                ctrl.$render();
                $timeout(function() {
                    el[0].focus();
                }, 0, false);
            };

            el.bind('input', function() {
                scope.enabled = !ctrl.$isEmpty(el.val());
            })
                .bind('focus', function() {
                    scope.enabled = !ctrl.$isEmpty(el.val());
                    scope.$apply();
                })
                .bind('blur', function() {
                    scope.enabled = !ctrl.$isEmpty(el.val());
                    scope.$apply();
                });
        }
    };
}]);