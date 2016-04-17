'use strict';

tcbmwApp.controller('signupSuccessController',['$scope','$location','signupUserDetailsFactory','$rootScope',function ($scope,$location,signupUserDetailsFactory,$rootScope) {

    //stores sms code entered by user
    $scope.smsCode="";

    var baseStatus = {
       isClose:true,
        onAction: function() {
            $scope.clickLogin();

            var newIndex = statuses.indexOf($scope.status) - 1;
            if (newIndex > -1) {
                $scope.status = statuses[newIndex];
                $scope.status.move = 'ltr';
                $scope.navigationBarStatus = $scope.status;
            }
        }
    };
    var hasArcIB = signupUserDetailsFactory.hasArcIB;

    console.log("signupUserDetailsFactory.hasArcIB == ", signupUserDetailsFactory.hasArcIB);
    var status = 'NAVBAR_SIGNUP_SUCCESS';
    if (hasArcIB)
        status = 'NAVBAR_ACTIVATE_SUCCESS';
    var statuses = [
        angular.extend({title: status}, baseStatus)
    ];
    

    $scope.status = statuses[0];
    $scope.hasArcIB = hasArcIB;

    $scope.resendButtonClicked = function(){
        //logic to get new sms
    };

    $scope.clickLogin = function(){
        signupUserDetailsFactory.clear();
        $location.path('/login');
    }

}]);