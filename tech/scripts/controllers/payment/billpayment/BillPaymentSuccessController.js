'use strict';

tcbmwApp.controller('BillPaymentSuccessController',['$scope','$rootScope','$state','AccountSelectorFactory','BillPaymentFactory','GameFactory',function($scope,$rootScope,$state,AccountSelectorFactory,BillPaymentFactory,GameFactory){
    $scope.forOwner = session.forOwner;
    if ( $state.current.name == 'billpaymentsuccess'){
        var baseStatus = {
            isClose:true,
            onAction: function() {

                AccountSelectorFactory.resetAccount();
                BillPaymentFactory.reset();
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
            angular.extend({title: 'NAVBAR_TCB_SUCCESS'}, baseStatus)
        ];

        $scope.status = statuses[0];
    }

    console.log("BillPaymentFactory.billInfo == ", BillPaymentFactory.billInfo);
    var message = BillPaymentFactory.billInfo.spareFields.spareString2;
    message = message.replace(/\{1\}/g,BillPaymentFactory.billInfo.name);
    message = message.replace(/\{2\}/g,BillPaymentFactory.billInfo.contractCode);
    var temp = message.split("|");
    $scope.successMessage = ($rootScope.languageCode == false) ? temp[0]  : temp[1];

    $scope.sourceAccount = BillPaymentFactory.billInfo.sourceAccount;
    $scope.contractCode = BillPaymentFactory.billInfo.contractCode;
    $scope.parsedAmount = parseInt(BillPaymentFactory.billInfo.paymentAmount).formatMoney(0);

    $scope.ftId = BillPaymentFactory.billInfo.ftId;
    $scope.fee = BillPaymentFactory.billInfo.fee;

    if(BillPaymentFactory.billInfo.txnNote != undefined) {
        //get message following language used
        var tmp = BillPaymentFactory.billInfo.txnNote.split("|");
        var vnNote = tmp[0] + ' (mã ' + BillPaymentFactory.billInfo.merchantErrorCode + ')';
        var enNote = tmp[1] + ' (code ' + BillPaymentFactory.billInfo.merchantErrorCode + ')';
        $scope.txnNote = ($rootScope.languageCode == false) ? vnNote  : enNote;
    }

    $scope.done=function(){
        AccountSelectorFactory.resetAccount();
        BillPaymentFactory.reset();
        $state.go('dashboard.home');
    }

    $scope.transactMore=function(){
        BillPaymentFactory.reset();
        AccountSelectorFactory.resetAccount();
        $state.go("paymentindex");
    }

    updateBalance();

}]);