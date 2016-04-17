'use strict';


tcbmwApp.controller('askwalletAcceptConfirmController',['$scope','$state','TransactionsFactory','sendMoneyTransferFactory','$rootScope',function ($scope,$state,TransactionsFactory,sendMoneyTransferFactory,$rootScope) {
    if ( $state.current.name == 'askwalletAcceptConfirm'){
        var baseStatus = {

            isClose:true,
            onAction: function() {

                $state.go('transactionsstatusresult');

                var newIndex = statuses.indexOf($scope.status) - 1;
                if (newIndex > -1) {
                    $scope.status = statuses[newIndex];
                    $scope.status.move = 'ltr';
                    $scope.navigationBarStatus = $scope.status;
                }
            }
        };

        var statuses = [
            angular.extend({title: 'NAVBAR_TRANSACTIONS_ASKWALLETACCEPTCONFIRM'}, baseStatus)
        ];

        $scope.status = statuses[0];
    }
    $scope.toEwallet = false;

    $scope.transaction = TransactionsFactory.getSelectedSocialTransaction();

    if ($scope.transaction.socialTxnType == "ask-wallet") {
        $scope.toEwallet = true;
    }

    var accountDetail = sendMoneyTransferFactory.getAccountDetail();

    if(accountDetail.id==''){
        accountDetail=sendMoneyTransferFactory.getAccountDetails()[0];
    }

    $scope.transAmount = $scope.transaction.txnAmount * (-1);

    console.log("$scope.transaction", $scope.transaction);
    console.log("accountDetail", accountDetail);

    $scope.accountName = accountDetail.accountName;
    $scope.accountNumber = accountDetail.accountNumber;
    $scope.accountBalance = accountDetail.availableBalance;
 //   console.log("Previous state = "+);
    $scope.fee = session.transactionFee;

    if($scope.transaction.additionalInfos != null) {
        $scope.transactionIcon = $scope.transaction.additionalInfos.otherData.data.value;
    }


    $scope.clickConfirm = function() {
        //Accept ask money request
        $scope.loading = true;
        $rootScope.safetyApply(function(){});
        mc.continuePayBill(payBillContinueBack, session.transit_value.sysid,"123456");
    };
    function payBillContinueBack(r) {
        $scope.loading = false;
        $rootScope.safetyApply(function(){});
        if (r.Status.code == "0") {
            //
            $state.go("askwalletAcceptConfirmDone");
        } 
        if (r.Status.code == "2521") {
            session.nextOtpScreen = "askwalletAcceptConfirmDone";
            $state.go("tcbotpscreen");
        }
        else {
            ErrorBox(r.Status);
        }
    }

}]);