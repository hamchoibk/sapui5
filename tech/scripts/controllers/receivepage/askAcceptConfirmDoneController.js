'use strict';

tcbmwApp.controller('askAcceptConfirmDoneController',['$scope','$state','TransactionsFactory','$rootScope','tcbTransferFactory',function ($scope,$state,TransactionsFactory,$rootScope,tcbTransferFactory) {
    if ( $state.current.name == 'askAcceptConfirmDone'){
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
            angular.extend({title: 'NAVBAR_TRANSACTIONS_ASK_WALLET_ACCEPT_CONFIRM_DONE'}, baseStatus)
        ];

        $scope.status = statuses[0];
    }

    var transaction = session.newLinkDetails;
    transaction.status = "Accepted";

    if (transaction.otherData) {
        $scope.transactionIcon = transaction.otherData[0].data.value;
    }

    var hasLink = false;
    var hasRef = false;
    if(transaction.additionalInfos != null) {
        hasLink = true;
        $scope.hasLink = hasLink;
        $scope.askLink = transaction.fullLink;
        $scope.transactionIcon = transaction.additionalInfos.otherData.data.value;
    }

    if (tcbTransferFactory.getTransactionReference()) {
        $scope.hasRef = true;
        $scope.txnRef = tcbTransferFactory.getTransactionReference();
    }

    $scope.transaction = transaction;
    console.log("transaction", transaction);
    $scope.fee = session.transactionFee;

    var txDate=new Date($scope.transaction.expire.sent_time);
    $scope.transaction.formatedDate = txDate.format("dd/mm/yyyy");
     if($scope.transaction.sender.profile.photo)
        $scope.showImage=true;
     else
        $scope.showImage=false;

    $scope.clickDone=function(){
        $state.go('dashboard.home');
    }

    session.cachedSocialTrasactions = false;
 //   console.log("Previous state = "+);
    mc.getWallets(walletBack, session.customer.id, 0);
    function walletBack(data) {
        if (data.Status.code == "0") {
            if (data.walletEntries.length) {
                session.accounts = data.walletEntries;
                for(var idx in session.accounts) {
                    if (session.accounts[idx].sva) {
                        session.accounts[idx].msisdn = session.msisdn;
                    }
                }
            }
        }
    }
}]);