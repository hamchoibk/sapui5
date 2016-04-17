'use strict';
tcbmwApp.controller('promotionController',['$scope','$state','$rootScope','$window','$filter',function ($scope,$state,$rootScope,$window,$filter) {
    console.log('State is'+$rootScope.previousState.name);
    if ( $state.current.name == 'promotion'){
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
            angular.extend({title: 'MAIN_PROMOTIONS'}, baseStatus)
        ];

        $scope.status = statuses[0];
    }
    //$scope.promotion = $filter('translate')('PROMOTIONS');

    //var promotions =[];
    //for ( var i = 1; i <= 3; i++) {
    //    promotions.push({
    //        content:$filter('translate')('PROMOTION_' + i),
    //        image:"./images/promotion"+i+".png"
    //    });
    //}
    //
    //console.log("promotions == ", promotions);
    //
    //$scope.promotions = promotions;
    //$rootScope.safetyApply(function(){});



}]);