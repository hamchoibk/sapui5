'use strict';

tcbmwApp.controller('BankTransactionSummaryController',['$scope','$state','TransactionsFactory','$rootScope',function($scope,$state,TransactionsFactory,$rootScope){


       if ( $state.current.name == 'banktransactionsummary'){
            var baseStatus = {
                isBack: true,
                onBack: function() {
                    $state.go('transactionsindex');
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
                           angular.extend({title: 'NAVBAR_TRANSACTIONS_BANKTRANSSUMMARY'}, baseStatus)
                       ];

            $scope.status = statuses[0];
        }

		if ($rootScope.previousState.name != "transactionDetails") 
		{
		
			//$scope.transactions= TransactionsFactory.getBankTransactions();
			var filter = session.transactionSearch;
			var paymentInstrumentId = filter.data.paymentInstrumentId;
			switch (filter.type) {
				case 1:
					//Last 10 transactions
					$scope.loading = true;
					$rootScope.safetyApply(function(){});
					mc.findTcbTransactions(transactionBack, paymentInstrumentId, 10);
					break;
				case 2:
					//1 month transactions
					$scope.loading = true;
					$rootScope.safetyApply(function(){});
					var toDate = addDate(new Date(),1);
					var fromDate = addDate(new Date(),-30);
					
					mc.findTcbTransactions(transactionBack, paymentInstrumentId, 100, fromDate.format("yyyymmdd"),toDate.format("yyyymmdd"));
					break;
				default:
					//search
					var toDate = addDate(new Date(),1);
					var fromDate = addDate(new Date(),-30);
					if (isiOsDevice || isAndroid) {
						if (filter.filter["toDt"]) {
							toDate = new Date(filter.filter["toDt"]);
						}
						if (filter.filter["frmDt"]) {
							fromDate = new Date(filter.filter["frmDt"]);
						}
					} else {
						var fDate = new Date(filter.fromDate);
						var tDate = new Date(filter.toDate);
						if (fDate != "Invalid Date") {
                            fromDate = fDate;
                        }
						if (tDate != "Invalid Date") {
                            toDate = tDate;
                        }
					}
					$scope.loading = true;
					$rootScope.safetyApply(function(){});
					mc.findTcbTransactions(transactionBack, paymentInstrumentId, 100, fromDate.format("yyyymmdd"),toDate.format("yyyymmdd"));
					break;
			}
		}
		else
		{
			$scope.transactions = TransactionsFactory.findAll();
            $rootScope.safetyApply(function(){});
		}
		
		
        function transactionBack(r) {
            $scope.loading = false;
            
            if (r.Status.code == "0") {
                //
                var transactions = r.transactions;
                if (transactions.length == 0) {
                    $scope.noTransaction = true;
                    console.log("transactions.length = ", transactions.length);
                } else {
                    $scope.noTransaction = false;
                    console.log("transactions.length1 = ", transactions.length);
                }
                for(var idx in transactions) {
                    transactions[idx].amount = "VND " + transactions[idx].txnAmount.formatMoney(0);
//                    transactions[idx].date = (new Date(transactions[idx].txnDate)).format("HH:MM dd/mm/yyyy");
                    transactions[idx].date = (new Date(transactions[idx].txnDate)).format("dd/mm/yyyy");
                }
                
                $scope.transactions = transactions;
                TransactionsFactory.setTransactions(transactions);
                
            } else {
                ErrorBox(r.Status);
            }
            $rootScope.safetyApply(function(){});
        }
        $scope.showTransactionDetails = function(transaction){
            TransactionsFactory.setSelectedBankTransaction(transaction);
             $state.go('transactionDetails');
        }

}]);