'use strict';

tcbmwApp.controller('LatestTransactionsSummaryController',['$scope','$state','TransactionsFactory','$rootScope',function($scope,$state,TransactionsFactory,$rootScope){


       if ( $state.current.name == 'latesttransactionssummary'){
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
                           angular.extend({title: 'NAVBAR_TRANSACTIONS_LATEST_TRANSSUMMARY'}, baseStatus)
                       ];

            $scope.status = statuses[0];
        }

        $scope.transactions= TransactionsFactory.getBankTransactions();


        $scope.showTransactionDetails = function(transaction){
            TransactionsFactory.setSelectedBankTransaction(transaction);
             $state.go('transactionDetails');
        }

        $scope.clickTransaction=function(transaction){
            $state.go('latestttransactiondetails');
        }

}]);