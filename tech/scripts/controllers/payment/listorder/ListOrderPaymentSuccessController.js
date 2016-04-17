'use strict';
tcbmwApp.controller('ListOrderPaymentSuccessController',['$scope','$rootScope','$state','AccountSelectorFactory', 'ListOrderPaymentFactory',function($scope,$rootScope,$state,AccountSelectorFactory,ListOrderPaymentFactory){
    $scope.forOwner = session.forOwner;
    if ( $state.current.name == 'listorderpaymentsuccess'){
        var baseStatus = {
            isClose:true,
            onAction: function() {
                AccountSelectorFactory.resetAccount();
                ListOrderPaymentFactory.reset();
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

    var message = ListOrderPaymentFactory.listOrderInfo.spareFields.spareString2;;
    message = message.replace(/\{1\}/g,ListOrderPaymentFactory.listOrderInfo.contractCode);
    message = message.replace(/\{2\}/g,ListOrderPaymentFactory.listOrderInfo.customerName);
    var temp = message.split("|");
    $scope.successMessage = ($rootScope.languageCode == false) ? temp[0]  : temp[1];

    $scope.sourceAccount = ListOrderPaymentFactory.listOrderInfo.sourceAccount;
    $scope.contractCode = ListOrderPaymentFactory.listOrderInfo.contractCode;
    $scope.parsedAmount = ListOrderPaymentFactory.listOrderInfo.parsedAmount;

    $scope.ftId = ListOrderPaymentFactory.listOrderInfo.ftId;
    $scope.fee = ListOrderPaymentFactory.listOrderInfo.fee;

    if(ListOrderPaymentFactory.listOrderInfo.txnNote != undefined) {
        //get message following language used
        var tmp = ListOrderPaymentFactory.listOrderInfo.txnNote.split("|");
        var vnNote = tmp[0] + ' (mã ' + ListOrderPaymentFactory.listOrderInfo.merchantErrorCode + ')';
        var enNote = tmp[1] + ' (code ' + ListOrderPaymentFactory.listOrderInfo.merchantErrorCode + ')';
        $scope.txnNote = ($rootScope.languageCode == false) ? vnNote  : enNote;
    }

    $scope.done=function(){
        AccountSelectorFactory.resetAccount();
        ListOrderPaymentFactory.reset();
        $state.go('dashboard.home');
    }

    $scope.transactMore=function(){
        ListOrderPaymentFactory.listOrderInfo.contractCode = "";
        ListOrderPaymentFactory.listOrderInfo.customerName = "";
        ListOrderPaymentFactory.listOrderInfo.customerAddress = "";
        ListOrderPaymentFactory.listOrderInfo.amount = "";
        ListOrderPaymentFactory.listOrderInfo.parsedAmount = "";
        ListOrderPaymentFactory.listOrderInfo.showContractDetail = false;
        ListOrderPaymentFactory.listOrderInfo.showClearContractCode = false;
        ListOrderPaymentFactory.listOrderInfo.haveNoOrderInfo = false;
        session.listBills = undefined;
        $state.go("listorderpaymentmain");
    }

    updateBalance();

}]);