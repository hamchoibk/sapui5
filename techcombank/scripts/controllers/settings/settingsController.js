'use strict'
tcbmwApp.controller('settingsController',['$scope','$state','$rootScope', '$translate',function ($scope,$state,$rootScope,$translate) {
    console.log('State is'+$rootScope.previousState.name);
    if ( $state.current.name == 'settings'){
        var baseStatus = {
            isBack:true,
            onBack: function() {
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
            angular.extend({title: 'NAVBAR_SETTINGS'}, baseStatus)
        ];

        $scope.status = statuses[0];
    }
}]);