'use strict';
tcbmwApp.controller('ListOrderPaymentMainController',['$scope','$state','$rootScope','AccountSelectorFactory','ListOrderPaymentFactory','dialogService',function($scope,$state,$rootScope,AccountSelectorFactory,ListOrderPaymentFactory,dialogService){

    if ( $state.current.name == 'listorderpaymentmain'){
        var baseStatus = {
            isBack: true,
            onBack: function() {
                $scope.loading = true;
                $rootScope.safetyApply(function(){});
                AccountSelectorFactory.resetAccount();
                ListOrderPaymentFactory.reset();
                if ($rootScope.previousState.name != "listorderpaymentlists"
                    && $rootScope.previousState.name != "sendmoneyselectaccount"
                    && $rootScope.previousState.name != "listorderpaymentconfirm"
                    && $rootScope.previousState.name != "listorderpaymentben") {
                    $state.go($rootScope.previousState.name);
                } else {
                    $state.go(session.paymentPreviousState);
                }
            },
            isClose:true,
            onAction: function() {
                ListOrderPaymentFactory.reset();
                AccountSelectorFactory.resetAccount();
                $state.go('dashboard.home');
            }
        };

        var title;
        console.log("ListOrderPaymentFactory.listOrderInfo == ", ListOrderPaymentFactory.listOrderInfo);
        var paymentName = ListOrderPaymentFactory.listOrderInfo.paymentName.split("~");
        var tempTitle = paymentName[0].split("|");
        var tempLable1 = paymentName[1].split("|");
        var tempLable2 = paymentName[2].split("|");
        title = ($rootScope.languageCode == false) ? tempTitle[0]  : tempTitle[1];
        $scope.lable1 = ($rootScope.languageCode == false) ? tempLable1[0]  : tempLable1[1];
        $scope.lable2 = ($rootScope.languageCode == false) ? tempLable2[0]  : tempLable2[1];

        var statuses = [
            angular.extend({title: title}, baseStatus)
        ];

        $scope.status = statuses[0];

    }

    var ca= getCurrentAccount();
    $scope.sourceAccount = ca;
    $scope.currencyCode = 'VND';

    $scope.showContractDetail = false;
    $scope.showClearContractCode = false;
    $scope.listOrderInfo = ListOrderPaymentFactory.listOrderInfo;

    //TODO: binding default period startDate and endDate in case does not load from server response
    if (session.listBills != undefined && session.listBills[0].period != undefined) {
        $scope.fromDate = new Date(session.listBills[0].period.startDate).format("dd-mm-yyyy");
        $scope.toDate = new Date(session.listBills[0].period.endDate).format("dd-mm-yyyy");
    }

    if ($rootScope.previousState.name == "listorderpaymentconfirm") {
        $scope.showContractDetail = true;
        $scope.showClearContractCode = true;
    } else {
        $scope.showClearContractCode = ListOrderPaymentFactory.listOrderInfo.showClearContractCode;
        if ($rootScope.previousState.name == "listorderpaymentben" && ListOrderPaymentFactory.listOrderInfo.selectedFromList == true) {
            console.log("Back from select ben");
            $scope.loading = true;
            mc.getTcbBill(getTcbBillBack, ListOrderPaymentFactory.listOrderInfo.id, ListOrderPaymentFactory.listOrderInfo.contractCode);
        } else{
            $scope.showContractDetail = ListOrderPaymentFactory.listOrderInfo.showContractDetail;
        }
    }

    if ($rootScope.previousState.name == "paymentindex" || $rootScope.previousState.name == "paymentindexl2") {
        $scope.haveNoOrderInfo = false;
    } else {
        $scope.haveNoOrderInfo = ListOrderPaymentFactory.listOrderInfo.haveNoOrderInfo;
    }

    $rootScope.safetyApply(function(){});

    $scope.selectAccount = function() {
        saveCurrentState();
        $state.go('sendmoneyselectaccount');
    }

    $scope.selectOrder = function() {
        saveCurrentState();
        $state.go('listorderpaymentlists')
    }

    $scope.selectFromBen = function() {
        saveCurrentState();
        $state.go('listorderpaymentben');
    }

    $scope.listOrderPayment = function() {
        saveCurrentState();
        $rootScope.suppressDialog = false;

        var attribute = [];

        if (session.listBills != undefined && session.listBills[0].billId != null) {
            attribute = [
                {key: 501, value: ListOrderPaymentFactory.listOrderInfo.id},
                {key: 502, value: ListOrderPaymentFactory.listOrderInfo.code},
                {key: 503, value: $scope.listOrderInfo.contractCode},
                {key: 508, value: session.listBills[0].billId},
                {key: 509, value: $scope.listOrderInfo.customerName},
                {key: 510, value: $scope.listOrderInfo.customerAddress}
            ]
        } else {
            attribute = [
                {key: 501, value: ListOrderPaymentFactory.listOrderInfo.id},
                {key: 502, value: ListOrderPaymentFactory.listOrderInfo.code},
                {key: 503, value: $scope.listOrderInfo.contractCode},
                {key: 509, value: $scope.listOrderInfo.customerName},
                {key: 510, value: $scope.listOrderInfo.customerAddress}
            ]
        }

        var txn = {
            usecase : ListOrderPaymentFactory.listOrderInfo.usecase,
            payer : {
                identifier : {
                    type : 1,
                    value : session.customer.id
                },
                paymentInstrumentId : $scope.sourceAccount.paymentInstrumentId
            },
            payee : {
                identifier: {
                    type : 5,
                    value : "Techcombank"
                },
                paymentInstrumentType : ListOrderPaymentFactory.listOrderInfo.piType
            },
            attribute : attribute,
            amount : $scope.listOrderInfo.amount
        };

        $scope.loading = true;
        mc.preAuthorize(listOrderPaymentBack,txn,true);


    }

    function listOrderPaymentBack(r) {

        $scope.loading = false;
        $rootScope.safetyApply(function(){});
        if (preAuthoriseBack(r)) {
            if (r.MoneyFee !== undefined && r.MoneyFee != null && r.MoneyFee.length>0) {
                var fee = r.MoneyFee[0];
                ListOrderPaymentFactory.listOrderInfo.fee = (fee.value + fee.vat);
            } else {
                ListOrderPaymentFactory.listOrderInfo.fee = 0;
            }
            ListOrderPaymentFactory.listOrderInfo.systemId = r.Transaction.systemId;
            $state.go("listorderpaymentconfirm");
        } else {
            appstate = trans.TRAN_IDLE;
            ErrorBox(r.Status);
        }
    }

    $('input#contractCode').focus(function() {
        if($scope.listOrderInfo.contractCode != undefined && $scope.listOrderInfo.contractCode.length>0) {
            $scope.showClearContractCode = true;
            $rootScope.safetyApply(function(){});
        }
    }).blur(function(){
        if ($scope.listOrderInfo.contractCode == "" || $scope.listOrderInfo.contractCode == undefined) {
            return;
        }
        //else if ($scope.listOrderInfo.contractCode.length != 13) {
//            MessageBox("ORDER_VALIDATION");
//            return;
        //}
        else {
            $scope.loading = true;
            $scope.showContractDetail = false;
            clearCustomerInfo();
            $rootScope.safetyApply(function(){});
            mc.getTcbBill(getTcbBillBack, ListOrderPaymentFactory.listOrderInfo.id, $scope.listOrderInfo.contractCode);
        }

    });

    $scope.clearContractCode = function() {
        $scope.showClearContractCode = false;
        $scope.showContractDetail = false;
        $scope.listOrderInfo.contractCode = "";
        clearCustomerInfo();
        $rootScope.safetyApply(function(){});
        $('input#contractCode').focus();
    };

    function saveCurrentState() {
//        $rootScope.suppressDialog = true;
        ListOrderPaymentFactory.listOrderInfo = $scope.listOrderInfo;
        ListOrderPaymentFactory.listOrderInfo.sourceAccount = $scope.sourceAccount;
        ListOrderPaymentFactory.listOrderInfo.showContractDetail = $scope.showContractDetail;
        ListOrderPaymentFactory.listOrderInfo.showClearContractCode = $scope.showClearContractCode;
        ListOrderPaymentFactory.listOrderInfo.haveNoOrderInfo = $scope.haveNoOrderInfo;
        $rootScope.safetyApply(function(){});
    }

    $scope.changeNo = function() {
        $scope.showContractDetail = false;
        clearCustomerInfo();
        if ($scope.listOrderInfo.contractCode == "") {
            clearCustomerInfo();
            $scope.showClearContractCode = false;
        }
        if($scope.listOrderInfo.contractCode !=undefined && $scope.listOrderInfo.contractCode.length > 0) {
            $scope.showClearContractCode = true;
        } else  {
            $scope.showClearContractCode = false;
        }
        $rootScope.safetyApply(function(){});
    };

    function clearCustomerInfo() {
        $scope.listOrderInfo.customerName = "";
        $scope.listOrderInfo.customerAddress = "";
        $scope.listOrderInfo.amount = "";
        $scope.listOrderInfo.parsedAmount = "";
    }

    function getTcbBillBack(r) {
        console.log("getTcbBillBack");
        if (r.Status.code == "0"){
            $scope.showContractDetail = true;
            session.listBills = r.bills;
            if (session.listBills[0].period != undefined) {
                $scope.haveNoOrderInfo = true;
                $scope.listOrderInfo.fromDate = new Date(session.listBills[0].period.startDate).format("dd-mm-yyyy");
                $scope.listOrderInfo.toDate = new Date(session.listBills[0].period.endDate).format("dd-mm-yyyy");
            } else {
                $scope.haveNoOrderInfo = false;
            }

            $scope.listOrderInfo.customerName = session.listBills[0].customerName;
            $scope.listOrderInfo.customerAddress = session.listBills[0].customerAddress;
            $scope.listOrderInfo.amount = session.listBills[0].amount;
            $scope.listOrderInfo.parsedAmount = session.listBills[0].amount.formatMoney(0);
            $scope.loading = false;
            $rootScope.safetyApply(function(){});
        } else {
            $scope.showContractDetail = false;
            $scope.fromDate= "";
            $scope.toDate = "";
            clearCustomerInfo();
            $scope.loading = false;
            $rootScope.safetyApply(function(){});
            ErrorBox(r.Status);
        }
        $('#scrollArea').scrollTop($("#scrollArea")[0].scrollHeight);
        $scope.showClearContractCode = true;
    };
}]);

