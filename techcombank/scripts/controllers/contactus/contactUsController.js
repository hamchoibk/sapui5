'use strict';
tcbmwApp.controller('ContactUsController',['$scope','$state','$rootScope','$window',function ($scope,$state,$rootScope,$window) {
    console.log("", $state);
    if ( $state.current.name == 'contactus'){

            var baseStatus = {
                    isBack:true,
                    onBack: function() {
                        $state.go($rootScope.previousState.name);
                        var newIndex = statuses.indexOf($scope.status) - 1;
                        if (newIndex > -1) {
                            $scope.status = statuses[newIndex];
                            $scope.status.move = 'ltr';
                            $scope.navigationBarStatus = $scope.status;
                        }
                    }
            };

            var statuses = [
                angular.extend({title: 'MAIN_CONTACT_US'}, baseStatus)
            ];

            $scope.status = statuses[0];
    }

    $scope.openMailClient = function(){
        $window.location ="mailto:call_center@techcombank.com.vn?subject=Support";
    };
}]);