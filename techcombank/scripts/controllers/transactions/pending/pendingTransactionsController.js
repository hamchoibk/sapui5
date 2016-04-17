'use strict';
tcbmwApp.controller('PendingTransactionsController',['$scope','$state','TransactionsFactory','$rootScope',function ($scope,$state,TransactionsFactory,$rootScope) {
            if ( $state.current.name == 'pendingtransactions'){
                var baseStatus = {
                    isClose:true,
                    onAction: function() {
                        TransactionsFactory.resetTransaction();
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
                    angular.extend({title: 'NAVBAR_TRANSACTIONS_PENDING_TRANS'}, baseStatus)
                ];

                $scope.status = statuses[0];
            }

            $scope.transactions=TransactionsFactory.findByStatus('Pending');

            $scope.clickTransaction=function(transactionId){
                var transaction=TransactionsFactory.findById(transactionId);
                TransactionsFactory.setTransaction(transaction);
                $state.go('pendingtransactiondetails');
            }
}]);