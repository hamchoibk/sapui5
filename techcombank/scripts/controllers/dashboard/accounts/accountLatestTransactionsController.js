'use strict';

tcbmwApp.controller('AccountLatestTransactionsController',['$scope','TransactionsFactory','AccountFactory','$state','$rootScope','$stateParams',function ($scope,TransactionsFactory,AccountFactory,$state,$rootScope,$stateParams) {

        //var accountParticulars=AccountFactory.findAccountById($stateParams.accountId);
        console.log('Previous Route : '+$rootScope.previousState.name);
        if ( $state.current.name == 'accountlatesttransactions'){
                var baseStatus = {
                    isBack: true,
                    onBack: function() {
                        $state.go('accounts');
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
                   angular.extend({title: 'NAVBAR_ACCOUNT_LATEST_TRANSACTIONS'}, baseStatus)
               ];

                $scope.status = statuses[0];
        }

        $scope.account= getAccountDetailsByIndex(currentAccountIdx);
		
        $scope.transactions = [];
        //TransactionsFactory.findByAccountNumber(accountParticulars.accountNumber);
        
		if ($rootScope.previousState.name != "accounttransactiondetail") 
		//only reload from server if not comeback from detail page 
		{
			$scope.loading = true;
			$rootScope.safetyApply(function(){});
			mc.findTcbTransactions(transactionsBack, $scope.account.paymentInstrumentId, 10);
		}
		else 
		{
			$scope.transactions = TransactionsFactory.findAll();
            $rootScope.safetyApply(function(){});
		}				
		
        function transactionsBack(r) {
            $scope.loading = false;
            $rootScope.safetyApply(function(){});
            if (r.Status.code == "0") {
                var transactions = r.transactions;
                for(var idx=0; idx<transactions.length;idx++) {
                    transactions[idx].id = idx;
                    transactions[idx].amountFormated = transactions[idx].txnAmount.formatMoney(0);
                    transactions[idx].balanceAfterTxnFormated = transactions[idx].balanceAfterTxn.formatMoney(0);
                    if (transactions[idx].txnRef == null)
                        transactions[idx].txnRef = transactions[idx].coreBankTxnId;
                    try {
                        transactions[idx].date = (new Date(transactions[idx].txnDate)).format("dd/mm/yyyy");
                    } catch (ex) {
                        //quick fix
                        var t25date = transactions[idx].txnDate;
                        //transactions[idx].date = (new Date(transactions[idx].txnDate)).format("H:M dd/mm/yyyy");
                        var yyyy = t25date.substr(0,4);
                        var mm = t25date.substr(4,2);
                        var dd = t25date.substr(6,2);
                        transactions[idx].date = (new Date(yyyy +"-" + mm + "-" + dd)).format("dd/mm/yyyy");
                    }
                    if (transactions[idx].txnAmount>0)
                        transactions[idx].name = transactions[idx].payer.accountName;
                    else
                        transactions[idx].name = transactions[idx].payee.accountName;
                }
                $scope.transactions = transactions;
                TransactionsFactory.setTransactions(transactions);
                $rootScope.safetyApply(function(){});
            } else {
                ErrorBox(r.Status);
            }
        }
        $scope.showTransactionDetails = function(transaction) {
            AccountFactory.setTransactionId(transaction.id);
            $state.go('accounttransactiondetail');
        };
}]);