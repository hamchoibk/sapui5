'use strict';

tcbmwApp.controller('CashOutDetailsController',['$scope','$state','$filter','TransactionsFactory','sendMoneyTransferFactory','$rootScope',function ($scope,$state,$filter,TransactionsFactory,sendMoneyTransferFactory,$rootScope) {
    if ($rootScope.previousState.name != "sendmoneyselectaccount")
        session.cashoutDetailsPreviousPage = $rootScope.previousState.name;

    if ( $state.current.name == 'cashoutdetail'){
        var baseStatus = {

            isClose:true,
            onAction: function() {
//                $state.go('dashboard.home');
                $state.go(session.cashoutDetailsPreviousPage);

                var newIndex = statuses.indexOf($scope.status) - 1;
                if (newIndex > -1) {
                    $scope.status = statuses[newIndex];
                    $scope.status.move = 'ltr';
                    $scope.navigationBarStatus = $scope.status;
                }
            }
        };

    $scope.loading = true;
    mc.getCustomerProfile(getCustomerProfileBack);    
        
    var accountDetail = sendMoneyTransferFactory.getAccountDetail();

    if(accountDetail.id==''){
        accountDetail=sendMoneyTransferFactory.getAccountDetails()[0];
    }
    
    
//    console.log("Cashout Detail Check", accountDetail);
    
    
    $scope.account = {
        id:accountDetail.id,
        accountName:accountDetail.accountName,
        accountType:accountDetail.accountType,
        accountNumber:accountDetail.accountNumber,
        availableBalance:accountDetail.availableBalance,
        dayLimit:accountDetail.dayLimit,
        transactionLimit:accountDetail.transactionLimit,
        paymentInstrumentId:accountDetail.paymentInstrumentId
    }
    $scope.selectVisible=sendMoneyTransferFactory.getAccountDetails().length>1;
    
    $scope.transaction = TransactionsFactory.getSelectedSocialTransaction();
//
//    console.log("Transaction Detail Check", TransactionsFactory.getSelectedSocialTransaction());
//    console.log("Payee account name", $scope.transaction.payee.accountName);
//
    
}
        
    if ($scope.transaction.status == "Pending") {
        if ($scope.transaction.socialTxnType == "cashout") {
            $scope.canReject = false;
            $scope.canAccept = false;
            $scope.canCancel = true;
        } else //request money
        {
            if ($scope.transaction.payer.customerId == session.customer.id) {
                //got a request
                $scope.canReject = true;
                $scope.canAccept = true;
                $scope.canCancel = false;
            } else {
                //request owner
                $scope.canReject = false;
                $scope.canAccept = false;
                $scope.canCancel = true;
            }
        } 
    }
        else {
        //no action attached
        $scope.canReject = false;
        $scope.canAccept = false;
        $scope.canCancel = false;
    }
    
 //   console.log("Previous state = "+);
    $scope.clickSelectAccount = function() {
        //
        //sendMoneyTransferFactory.setSendMoneyUserInputs($scope.sendMoneyUserInputs);
        $state.go('sendmoneyselectaccount');
    }
    $scope.clickAccept = function() {
        Confirm(getMessage("TRANSACTION_ACCEPT_TRANSACTION_CONFIRMATION"),confirmedAccept);
        
    }
    function confirmedAccept() {
        //Accept ask money request
        $scope.loading = true;
        $rootScope.safetyApply(function(){});
        mc.payBill(payBillBack, $scope.transaction.mobInvoiceId, $scope.account.paymentInstrumentId);
    }
    $scope.clickReject = function() {
        Confirm(getMessage("TRANSACTION_REJECT_TRANSACTION_CONFIRMATION"),confirmedReject);
    }
    function confirmedReject() {
        //Reject ask money request
        $scope.loading = true;
        $rootScope.safetyApply(function(){});
        mc.rejectBill(rejectBillBack, $scope.transaction.mobInvoiceId);
    }
    function rejectBillBack(r) {
        $scope.loading = false;
       
        if (r.Status.code == "0") {
            //
            //session.transit_value = {sysid:parseTransactionSystemId(r)};
            //$state.go("askwalletAcceptConfirm");
            $scope.transaction.status = "Rejected";
            session.cachedSocialTrasactions = false;
            $scope.canAccept = false;
            $scope.canReject = false;
            $scope.canCancel = false;
        } else {
            ErrorBox(r.Status);
        }
        $rootScope.safetyApply(function(){});
    }
    function cancelCashout() {
        var amount = {
                    currency: $scope.transaction.creditCurrency,
                    vat:0,
                    value:Math.abs($scope.transaction.txnAmount)
        };
        var cardlessCode = "123456";
        if ($scope.transaction.mobSubUseCase == "301") {
            var maGDidx = $scope.transaction.txnDesc.indexOf("Ma GD:");
            cardlessCode = $scope.transaction.txnDesc.substr(maGDidx+6);
        }
        var refTrans = {
            systemId: $scope.transaction.mobiliserTxnId,
            type:0,
            value:cardlessCode
        };
        function captureCancelBack(r) {
            $scope.loading = false;
            
            if (r.Status.code == "0") {
                MessageBox($filter('translate')("CASHOUT_TRANSACTION_IS_CANCELLED"));
                $scope.transaction.status = "Cancelled";
                session.cachedSocialTrasactions = false;
                $scope.canAccept = false;
                $scope.canReject = false;
                $scope.canCancel = false;
                mc.getWallets(walletBack, session.customer.id, 0);
            } else {
                ErrorBox(r.Status);
            }
            $rootScope.safetyApply(function(){});
        }
        mc.captureCancel(captureCancelBack,refTrans,amount);
    }
    $scope.clickCancel = function() {
        Confirm(getMessage("TRANSACTION_CANCEL_TRANSACTION_CONFIRMATION"),confirmedCancel);
        
    }
    function confirmedCancel() {
        //cancel ask money request
        $scope.loading = true;
        $rootScope.safetyApply(function(){});
        if ($scope.transaction.socialTxnType == "cashout") {
            cancelCashout();
        } else
        mc.cancelBill(cancelBillBack, $scope.transaction.mobInvoiceId);
    }
    function rejectBillBack(r) {
        $scope.loading = false;
       
        if (r.Status.code == "0") {
            //
            //session.transit_value = {sysid:parseTransactionSystemId(r)};
            //$state.go("askwalletAcceptConfirm");
            $scope.transaction.status = "Rejected";
            MessageBox("CASHOUT_TRANSACTION_IS_REJECTED");
            session.cachedSocialTrasactions = false;
            $scope.canAccept = false;
            $scope.canReject = false;
            $scope.canCancel = false;
        } else {
            ErrorBox(r.Status);
        }
        $rootScope.safetyApply(function(){});
    }
    function getMessage(key) {
        return $filter('translate')(key);
    }
    function cancelBillBack(r) {
        $scope.loading = false;
       
        if (r.Status.code == "0") {
            //
            //session.transit_value = {sysid:parseTransactionSystemId(r)};
            //$state.go("askwalletAcceptConfirm");
            $scope.transaction.status = "Cancelled";
            MessageBox($filter('translate')("CASHOUT_TRANSACTION_IS_CANCELLED"));
            session.cachedSocialTrasactions = false;
            $scope.canAccept = false;
            $scope.canReject = false;
            $scope.canCancel = false;
        } else {
            ErrorBox(r.Status);
        }
        $rootScope.safetyApply(function(){});
    }
    function payBillBack(r) {
        $scope.loading = false;
        $rootScope.safetyApply(function(){});
        if (r.Status.code == "0") {
            //
            //$scope.transaction.status = "Accepted";
            //MessageBox($filter('translate')("CASHOUT_TRANSACTION_IS_ACCEPTED"));
            var fee = 0;
            if (r.MoneyFee !== undefined && r.MoneyFee != null && r.MoneyFee.length>0) {

                 fee = r.MoneyFee[0].value +  r.MoneyFee[0].vat;
                console.log(fee);
//                $scope.transferDetails.transferFee = (fee.value + fee.vat);
            }
            session.transactionFee = fee;
            session.transit_value = {sysid:parseTransactionSystemId(r)};
            $state.go("askwalletAcceptConfirm");
        } else {
            ErrorBox(r.Status);
        }
    }
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
    function getCustomerProfileBack(r) {
        $scope.loading = false;
        var statuses = "";
        if (r.Status.code == "0") {
        
            var title = 'NAVBAR_TRANSACTIONS_CASHOUTDETAILS';
            $scope.sourceAccountLable="";
//            var acceptButton ='';

//            console.log("getCustomerProfileBack", r);
            if ($scope.transaction.mobSubUseCase == "302") {
                if ($scope.transaction.name.search(r.profile.identity.identity) != -1) {
                    title = "NAVBAR_TRANSACTIONS_CASHOUTDETAILS";
                    $scope.acceptButton = "CASHOUT_DETAIL_ACCEPT_CASHOUT";
                    $scope.sourceAccountLable = "CASHOUT_DETAIL_SOURCE_ACCOUNT";
                } else {
                    title = "NAVBAR_TRANSACTIONS_CASHOUTDETAILS_TO_ID";
                    $scope.acceptButton = "CASHOUT_DETAIL_ACCEPT_ASK";
                    $scope.sourceAccountLable = "CASHOUT_DETAIL_SOURCE_ACCOUNT";
                }
                
            } else  {
                if ($scope.transaction.payee.accountName != accountDetail.accountNumber) {
                    if ($scope.transaction.socialTxnType == "ask-wallet") {
                        title = "NAVBAR_TRANSACTION_ASK_MONEY_VIA_EWALLET";
                        $scope.sourceAccountLable = "CASHOUT_DETAIL_SOURCE_ACCOUNT";

                    } else {
                        title = "NAVBAR_TRANSACTIONS_CASHOUTDETAILS_SEND_VIA_MOBILE";
                    }
                    if ($scope.transaction.txnAmount < 0) {
                        $scope.acceptButton = "CASHOUT_DETAIL_ACCEPT_ASK";
                        $scope.sourceAccountLable = "CASHOUT_DETAIL_SOURCE_ACCOUNT";

                    } else {
                        $scope.acceptButton = "CASHOUT_DETAIL_ACCEPT_SEND";
                        $scope.sourceAccountLable = "CASHOUT_DETAIL_SOURCE_ACCOUNT";
//                        title = "NAVBAR_TRANSACTIONS_CASHOUTDETAILS_SEND_VIA_MOBILE";
                    }

                } else {
                    $scope.acceptButton ="CASHOUT_DETAIL_ACCEPT_CASHOUT";
                    title = "NAVBAR_TRANSACTIONS_CASHOUTDETAILS_CASHOUT_VIA_MOBILE";
                    $scope.sourceAccountLable = "CASHOUT_DETAIL_SOURCE_ACCOUNT";
                }
            }
            
            statuses = [
                angular.extend({title: title}, baseStatus)
            ];

            $scope.status = statuses[0];
                        
        } else {
            statuses = "NAVBAR_TRANSACTIONS_CASHOUTDETAILS";
            ErrorBox(r.Status);
        }
        $rootScope.safetyApply(function(){});
    }
}]);