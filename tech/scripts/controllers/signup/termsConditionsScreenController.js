'use strict';

    tcbmwApp.controller('TermsConditionsScreenController',['$scope','$rootScope','$location','signupTermsConditions',function ($scope,$rootScope,$location,signupTermsConditions) {
        
        var baseStatus = {
            isClose:true,
            onAction: function() {
                signupTermsConditions.setTermsFlag(true);
                if ($rootScope.previousState.name == "signupconfirm") {
                    $location.path('/signupconfirm');
                }else {
                    $location.path('/signupuserdetails');
                }

                var newIndex = statuses.indexOf($scope.status) - 1;
                if (newIndex > -1) {
                    $scope.status = statuses[newIndex];
                    $scope.status.move = 'ltr';
                    $scope.navigationBarStatus = $scope.status;
                }
            }
        };

        var statuses = [
            angular.extend({title: 'NAVBAR_SIGNUP_TERMSCONDITIONS'}, baseStatus)
        ];
        $scope.status = statuses[0];

        $scope.loading = true;
        $rootScope.safetyApply(function(){});
        mc.getTermAndConditions(termAndCondBack, 2);
        $scope.agreeButtonClicked = function(){
            signupTermsConditions.setTermsFlag(true);
            if ($rootScope.previousState.name == "signupconfirm") {
                $location.path('/signupconfirm');
            }else {
                $location.path('/signupuserdetails');
            }
        }

        function termAndCondBack(r) {

            if (r.Status.code == "0") {
                //console.log(r.termAndCondition[0].tncText);
                var tacId = 1;
                if ($rootScope.languageCode == false)
                    var tacId = 2;
                for(var idx in r.termAndCondition) {
                    if (tacId = r.termAndCondition[idx].tacId) {
                        $scope.termAndCond = r.termAndCondition[idx].content;
                        break;
                    }
                }
                $scope.loading = false;
                $rootScope.safetyApply(function(){});
            } else {
                $scope.loading = false;
                ErrorBox(r.Status);
            }
        }
     }]);