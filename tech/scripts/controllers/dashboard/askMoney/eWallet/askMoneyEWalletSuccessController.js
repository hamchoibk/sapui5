'use strict';
tcbmwApp.controller('askMoneyEWalletSuccessController',['$scope','$state', '$rootScope',function ($scope,$state,$rootScope) {
    if ( $state.current.name == 'askMoneyEWalletSuccess'){
        var baseStatus = {
            isHome:true,
            onHome: function() {
                session.requestMoneyInfo = null;
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
            angular.extend({title: 'NAVBAR_ASKMONEY_EWALLET_SUCCESS'}, baseStatus)
        ];

        $scope.status = statuses[0];
    }
    session.cachedSocialTrasactions = false;
    $scope.requestMoneyInfo = session.requestMoneyInfo;
    console.log("requestMoneyInfo", $scope.requestMoneyInfo);
    session.requestMoneyInfo = null;
    $scope.clickDone = function(){
        session.requestMoneyInfo = null;
        $state.go('dashboard.home');
    };

    $scope.clickTransactMore = function(){
        session.requestMoneyInfo = null;
        $state.go('dashboard.askMoney');
    }

}]);