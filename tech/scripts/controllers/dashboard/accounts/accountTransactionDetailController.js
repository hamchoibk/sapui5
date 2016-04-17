'use strict';

tcbmwApp.controller('AccountTransactionDetailController',['$scope','TransactionsFactory','AccountFactory','$state','$rootScope','$stateParams',function ($scope,TransactionsFactory,AccountFactory,$state,$rootScope,$stateParams) {
    console.log('Previous Route : '+$rootScope.previousState.name);

    if ( $state.current.name == 'accounttransactiondetail'){
                var baseStatus = {
                    isBack: true,
                    onBack: function() {
                        $state.go('accountlatesttransactions');
                        var newIndex = statuses.indexOf($scope.status) - 1;
                        if (newIndex > -1) {
                            $scope.status = statuses[newIndex];
                            $scope.status.move = 'ltr';
                            $scope.navigationBarStatus = $scope.status;
                        }
                    },
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
                   angular.extend({title: 'NAVBAR_ACCOUNT_TRANSACTIONDETAILS'}, baseStatus)
               ];
               
                $scope.status = statuses[0];
        }

        $scope.transaction=TransactionsFactory.findById(AccountFactory.getTransactionId());

}]);
