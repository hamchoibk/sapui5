'use strict';
tcbmwApp.controller('errorPageController',['$scope','$state','$rootScope',function ($scope,$state,$rootScope) {
    if ( $state.current.name == 'errorpage'){
        var baseStatus = {};

        var statuses = [
            angular.extend({title: 'ERROR_PAGE'}, baseStatus)
        ];

        $scope.status = statuses[0];
    }
    $scope.clickExit = function() {
        stopSessionTimer();
        mc.logout(function(){});
        session = new LoginSession();
        $state.go('main');
    }
}]);