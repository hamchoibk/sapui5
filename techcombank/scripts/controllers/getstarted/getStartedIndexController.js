'use strict';
tcbmwApp.controller('getStartedIndexController', ['$scope','$location','$rootScope','$translate','dialogService','$state',function ($scope,$location,$rootScope,$translate,dialogService,$state) {
    $scope.clickActive = function() {
        $state.go("active");
    }

    $scope.clickNew = function() {
        $state.go("new");
    }
}]);