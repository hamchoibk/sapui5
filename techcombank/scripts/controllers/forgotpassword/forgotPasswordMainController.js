'use strict';
tcbmwApp.controller('ForgotPasswordMainController',['$scope','$state','$rootScope',function ($scope,$state,$rootScope) {
    if ( $state.current.name == 'forgotpasswordmain'){
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
                angular.extend({title: 'NAVBAR_FORGETPW_MAIN'}, baseStatus)
            ];

            $scope.status = statuses[0];
        }

    $scope.send=function(){
        $state.go('forgotpasswordotp');
    }
}])