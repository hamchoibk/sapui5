'use strict';

    tcbmwApp.controller('SmsValidationScreenController',['$scope','$location','$filter','$state','signupUserDetailsFactory','$rootScope',function ($scope,$location,$filter,$state,signupUserDetailsFactory,$rootScope) {
        //stores sms code entered by user
        $scope.smsCode="";

        var baseStatus = {
            isClose:true,
            onAction: function() {
                $state.go('main');

                var newIndex = statuses.indexOf($scope.status) - 1;
                if (newIndex > -1) {
                    $scope.status = statuses[newIndex];
                    $scope.status.move = 'ltr';
                    $scope.navigationBarStatus = $scope.status;
                }
            }
        };
        var hasArcIB = signupUserDetailsFactory.getArcIB();

        var status = 'NAVBAR_SIGNUP_SMSVALIDATION';
        if (hasArcIB)
            status = 'NAVBAR_ACTIVATE_SMSVALIDATION';
        var statuses = [
            angular.extend({title: status}, baseStatus)
        ];
        $scope.hasArcIB = hasArcIB;

        $scope.status = statuses[0];

        var message = getMessage("SIGNUP_SMSVALIDATION_TEXT");
        message = message.replace("{0}",signupUserDetailsFactory.getMobileNumber());
        $scope.validationMessage = message;
        $scope.resendButtonClicked = function(){
            //logic to get new sms
        };
        function createTcbKycCustomerBack(r) {

            if (r.Status.code == "0") {
                //Done redirect
                var recentSingup = signupUserDetailsFactory.getMobileNumber();
                signupUserDetailsFactory.hasArcIB = signupUserDetailsFactory.getArcIB();
                signupUserDetailsFactory.clear();
                $location.path('/signupSuccess');
                window.localStorage.setItem("lastLoginName",recentSingup);
                $scope.loading = false;
                $rootScope.safetyApply(function(){});
            } else {
                $scope.loading = false;
                $rootScope.safetyApply(function(){});
                ErrorBox(r.Status);
            }
        }

        function createTcbCustomerBack(r) {

            if (r.Status.code == "0") {
                //Done redirect
                var recentSingup = signupUserDetailsFactory.getMobileNumber();
                signupUserDetailsFactory.clear();
                $location.path('/signupSuccess');
                window.localStorage.setItem("lastLoginName",recentSingup);
                $scope.loading = false;
                $rootScope.safetyApply(function(){});
            } else {
                $scope.loading = false;
                $rootScope.safetyApply(function(){});
                ErrorBox(r.Status);
            }
        }
        $scope.confirmButtonClicked = function(){
            $scope.loading = true;
            $rootScope.safetyApply(function(){});
            signupUserDetailsFactory.setSmsToken($scope.smsCode);
            if (hasArcIB) {
                mc.createTcbKycCustomer(createTcbKycCustomerBack, signupUserDetailsFactory);
            } else {
                mc.createTcbCustomer(createTcbCustomerBack, signupUserDetailsFactory);
            }
        }

    }]);