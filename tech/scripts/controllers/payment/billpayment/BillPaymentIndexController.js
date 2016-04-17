'use strict';
tcbmwApp.controller('BillPaymentIndexController',['$scope','$rootScope','$state','AccountSelectorFactory', 'ListOrderPaymentFactory','BillPaymentFactory' ,'GameFactory',function ($scope,$rootScope,$state,AccountSelectorFactory,ListOrderPaymentFactory,BillPaymentFactory,GameFactory) {
    if ( $state.current.name == 'billpaymentindex'){
        var baseStatus = {
            isBack: true,
            onBack: function() {
                $state.go('paymentindex');
                var newIndex = statuses.indexOf($scope.status) - 1;
                if (newIndex > -1) {
                    $scope.status = statuses[newIndex];
                    $scope.status.move = 'ltr';
                    $scope.navigationBarStatus = $scope.status;
                }
            },
            isClose:true,
            onAction: function() {

                AccountSelectorFactory.resetAccount();
                BillPaymentFactory.reset();
                GameFactory.reset();
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
            angular.extend({title: 'NAVBAR_BILL_PAYMENT_INDEX'}, baseStatus)
        ];

        $scope.status = statuses[0];
    }

    if ($rootScope.previousState.name == "billpaymentmain"
        || $rootScope.previousState.name == "billpaymentsuccess"
        || $rootScope.previousState.name == "topupgamescreen"
        || $rootScope.previousState.name == "topupgameenteramountscreen"
        || $rootScope.previousState.name == "topupgamesuccess") {
        $scope.billPaymentList = session.billPaymentList;
    } else {
        $scope.loading = true;
        mc.getPaymentsByGroup(getPaymentByGroupBack, ["Bill"]);
    }



    function getPaymentByGroupBack (r) {
        if (r.Status.code == "0") {
            $scope.billPaymentList = r.paymentTypes;
            session.billPaymentList = r.paymentTypes;
            $scope.loading = false;
            $rootScope.safetyApply(function(){});
        } else {
            ErrorBox(r.Status);
        }
    };

    $scope.selectBill = function(bill) {
        var billInfo = {};
        billInfo.flowType = bill.flowType;
        billInfo.code = bill.code;
        billInfo.havingAmountList = bill.havingAmountList;
        billInfo.iconUrl = bill.iconUrl;
        billInfo.id = bill.id;
        billInfo.name = bill.name;
        billInfo.piType = bill.piType;
        billInfo.usecase = bill.usecase;
        billInfo.paymentName = bill.paymentName;
        billInfo.groupL1 = bill.groupL1;
        if (bill.spareFields.spareString2 != null) {
            billInfo.successMessage = bill.spareFields.spareString2;
        }
        BillPaymentFactory.billInfo = billInfo;
        GameFactory.topupGame = billInfo;
        ListOrderPaymentFactory.listOrderInfo = billInfo;

        if (billInfo.flowType == 1) {
            $state.go('billpaymentmain');
        } else if (billInfo.flowType == 2) {
            $state.go('topupgamescreen');
        } else if (billInfo.flowType == 4) {
            session.listBills = undefined;
            $state.go('listorderpaymentmain');
        } else {
            $state.go('topupgameenteramountscreen');
        }
    };

}]);