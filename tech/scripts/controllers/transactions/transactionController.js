'use strict';

tcbmwApp.controller('TransactionController',['$scope','TransactionsFactory','$state','$rootScope','$stateParams',function ($scope,TransactionsFactory,$state,$rootScope,$stateParams) {
        if ( $state.current.name == 'transaction'){
            var baseStatus = {
                isClose:true,
                onAction: function() {
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
                angular.extend({title: 'NAVBAR_TRANSACTIONS_TRANSACTION'}, baseStatus)
            ];

            $scope.status = statuses[0];
        }

        $scope.transaction=TransactionsFactory.findById($stateParams.transactionId);
}]);