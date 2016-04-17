'use strict';
tcbmwApp.controller('ForgotPasswordOTPController',['$scope','$state','$rootScope',function ($scope,$state,$rootScope) {
    if ( $state.current.name == 'forgotpasswordotp'){
            var baseStatus = {
                isClose:true,
                onAction: function() {
                  $state.go('login');

                  var newIndex = statuses.indexOf($scope.status) - 1;
                  if (newIndex > -1) {
                        $scope.status = statuses[newIndex];
                        $scope.status.move = 'ltr';
                        $scope.navigationBarStatus = $scope.status;
                  }
                }
            };

            var statuses = [
                angular.extend({title: 'NAVBAR_FORGETPW_OTP'}, baseStatus)
            ];

            $scope.status = statuses[0];
        }

    $scope.submit=function(){
        MessageBox('Password changed successfully!');
        $state.go('login');
    }
}])
.directive('pwCheck', [function () {
    return {
        require: 'ngModel',
        link: function (scope, elem, attrs, ctrl) {
            var firstPassword = '#' + attrs.pwCheck;
            elem.add(firstPassword).on('keyup', function () {
                scope.$apply(function () {
                    ctrl.$setValidity('pwmatch', (elem.val()!='')&&(elem.val() === $(firstPassword).val()));
                });
            });
        }
    }
}]);