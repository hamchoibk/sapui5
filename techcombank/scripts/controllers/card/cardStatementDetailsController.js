'use strict';
tcbmwApp.controller('CardStatementDetailsController',['$scope','$state','CardFactory', '$rootScope',function($scope,$state,CardFactory,$rootScope){
    if ( $state.current.name == 'cardstatementdetails'){
        var baseStatus = {
            isBack: true,
            onBack: function() {
                $state.go('cardstatementindex');
                var newIndex = statuses.indexOf($scope.status) - 1;
                if (newIndex > -1) {
                    $scope.status = statuses[newIndex];
                    $scope.status.move = 'ltr';
                    $scope.navigationBarStatus = $scope.status;
                }
            },
            isClose : true,
            onAction : function() {
                $state.go('dashboard.home');
            }
        };
    }
    var title;

    $scope.txnQuery = CardFactory.txnQuery;
    $scope.currencyCode = 'VND';
    $scope.loading = true;
    $scope.cardInfo = CardFactory.cardInfo;
    $scope.cardInfo.endBalance = '';
    if($scope.txnQuery.byDate == true) {
        $scope.cardInfo.isCycle = false;
        mc.getCardStatementByDate(getStatementByDateBack, $scope.txnQuery.cardAccountNumber,
            $scope.txnQuery.fromDate, $scope.txnQuery.toDate);
    } else {
        $scope.cardInfo.isCycle = true;
        $scope.txnQuery.cycleDate = new Date(CardFactory.txnQuery.cycleDate).format('dd-mm-yyyy');
        mc.getCardStatementByCycle(getStatementByCycleBack,$scope.txnQuery.cardAccountNumber, $scope.txnQuery.cycleId);
    }

    if ($scope.cardInfo.isCycle == true) {
        title = "NAVBAR_CARD_STATEMENT";
    } else {
        title = "NAVBAR_CARD_STATEMENT_BY_DATE";
    }

    var statuses = [
        angular.extend({title: title}, baseStatus)
    ];

    $scope.status = statuses[0];

    function getStatementByCycleBack(r) {
        if (r.Status.code == "0") {
            if(r.transactions.length == 0) {
                $scope.cardInfo.haveNoTransaction = true;
            } else {
                $scope.cardInfo.haveNoTransaction = false;
                $scope.cardInfo.endBalance = r.endBalance;
                $scope.transactions = r.transactions;
                formatDate($scope.transactions);
            }
            $scope.loading = false;
            $rootScope.safetyApply(function(){});
        } else {
            $scope.loading = false;
            ErrorBox(r.Status);
        }
    }

    function getStatementByDateBack(r) {
        if (r.Status.code == "0") {
            if (r.transactions.length == 0) {
                $scope.cardInfo.haveNoTransaction = true;
            } else {
                $scope.cardInfo.haveNoTransaction = false;
                $scope.transactions = r.transactions;
                formatDate($scope.transactions);
            }
            $scope.loading = false;
            $rootScope.safetyApply(function(){});
        } else {
            $scope.loading = false;
            ErrorBox(r.Status);
        }
    }

    function formatDate(transactions) {
        for(var i=0;i<transactions.length;i++){
            var txn = transactions[i];
            if(txn.paymentDate != null) {
                txn.prettyDate = new Date(txn.paymentDate).format('dd-mm-yyyy');
            }
        }
    }
}]);