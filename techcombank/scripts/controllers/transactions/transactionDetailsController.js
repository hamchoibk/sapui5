'use strict';

tcbmwApp.controller('transactionDetailsController',['$scope','TransactionsFactory','$state','$rootScope',function ($scope,TransactionsFactory,$state,$rootScope) {
    if ( $state.current.name == 'transactionDetails'){
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
            angular.extend({title: 'NAVBAR_TRANSACTIONS_TRANSACTIONDETAILS'}, baseStatus)
        ];

        $scope.status = statuses[0];
    }
    console.log(TransactionsFactory.getSelectedBankTransaction());
    $scope.transaction = TransactionsFactory.getSelectedBankTransaction();

}]);