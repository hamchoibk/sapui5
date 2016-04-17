'use strict';
tcbmwApp.controller('ChangePasswordController',['$scope','$state','$rootScope','ProfileFactory',function ($scope,$state,$rootScope,ProfileFactory) {
    if ( $state.current.name == 'changepassword'){
            var baseStatus = {
                isBack:true,
                onBack: function() {
                  $state.go($rootScope.previousState.name,$rootScope.previousState.params);

                  var newIndex = statuses.indexOf($scope.status) - 1;
                  if (newIndex > -1) {
                        $scope.status = statuses[newIndex];
                        $scope.status.move = 'ltr';
                        $scope.navigationBarStatus = $scope.status;
                  }
                },
                isClose:true,
                onAction: function() {
                    $state.go('dashboard.home');

                    var newIndex = statuses.indexOf($scope.status) - 1;
                    if (newIndex > -1) {
                        $scope.status = statuses[newIndex];
                        $scope.status.move = 'ltr';
                        $scope.navigationBarStatus = $scope.status;
                    }
                }
            };

            var statuses = [
                angular.extend({title: 'PROFILE_CHANGE_PASSWORD'}, baseStatus)
            ];

            $scope.status = statuses[0];
        }

    $scope.submit=function(){
         //ProfileFactory.setPassword($scope.newpassword);
        $scope.loading = true;
        $rootScope.safetyApply(function(){});
        mc.changeCredential(changeCredentialBack,$scope.oldpassword,$scope.newpassword,0);
        
    }
    function changeCredentialBack(r) {
        $scope.loading = false;
        $rootScope.safetyApply(function(){});
        if (r.Status.code == "0") {
            MessageBox("COMMON_PASSWORD_CHANGED");
            $state.go($rootScope.previousState.name,$rootScope.previousState.params);
        } else {
            ErrorBox(r.Status);
        }
    }
    $scope.cancel=function(){
        $state.go($rootScope.previousState.name,$rootScope.previousState.params);
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