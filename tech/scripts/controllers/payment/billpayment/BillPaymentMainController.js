'use strict';
tcbmwApp.controller('BillPaymentMainController',['$scope','$state','$rootScope','AccountSelectorFactory','BillPaymentFactory','dialogService',function($scope,$state,$rootScope,AccountSelectorFactory,BillPaymentFactory,dialogService){

    if ( $state.current.name == 'billpaymentmain'){
        var baseStatus = {
            isBack: true,
            onBack: function() {
                BillPaymentFactory.reset();
                AccountSelectorFactory.resetAccount();
                $scope.loading = true;
                $rootScope.safetyApply(function(){});
                if ($rootScope.previousState.name != "selectrecentorder"
                    && $rootScope.previousState.name != "sendmoneyselectaccount"
                    && $rootScope.previousState.name != "billpaymentconfirm") {
                    $state.go($rootScope.previousState.name);
                } else {
                    $state.go(session.paymentPreviousState);
                }
            },
            isClose:true,
            onAction: function() {
                BillPaymentFactory.reset();
                AccountSelectorFactory.resetAccount();
                $state.go('dashboard.home');
            }
        };

        var title;
        var paymentName = BillPaymentFactory.billInfo.paymentName.split("~");
        preparingData();

        var statuses = [
            angular.extend({title: title}, baseStatus)
        ];

        $scope.status = statuses[0];

    }
    console.log("BillPaymentFactory.billInfo  == ", BillPaymentFactory.billInfo);
    console.log("session.paymentPreviousState == ", session.paymentPreviousState);
    $scope.showSelectAccount = true;
    $scope.showPaymentDate = true;
    $scope.showCustomerName = true;
    $scope.showCustomerAddress = true;

    if(BillPaymentFactory.billInfo.id &&  BillPaymentFactory.billInfo.id == 1012) {
        $scope.showSelectAccount = false;
        $('#clearContractCode').removeClass('clearContractCode');
        $('#clearContractCode').addClass('clearContractCode-default');
    } else {
        $scope.showSelectAccount = true;
        $('#clearContractCode').addClass('clearContractCode');
        $('#clearContractCode').removeClass('clearContractCode-default');
    }
    $rootScope.safetyApply(function(){});

    function preparingData() {
        var tempTitle = paymentName[0].split("|");
        var tempLable1 = paymentName[1].split("|");
        var tempLable2 = paymentName[2].split("|");
        var tempLable3 = paymentName[3].split("|");
        var tempLable4 = paymentName[4].split("|");
        var tempLable5 = paymentName[5].split("|");
        title = ($rootScope.languageCode == false) ? tempTitle[0]  : tempTitle[1];
        $scope.lable1 = ($rootScope.languageCode == false) ? tempLable1[0]  : tempLable1[1];
        $scope.lable2 = ($rootScope.languageCode == false) ? tempLable2[0]  : tempLable2[1];
        $scope.lable3 = ($rootScope.languageCode == false) ? tempLable3[0]  : tempLable3[1];
        $scope.lable4 = ($rootScope.languageCode == false) ? tempLable4[0]  : tempLable4[1];
        $scope.lable5 = ($rootScope.languageCode == false) ? tempLable5[0]  : tempLable5[1];
    }

    var ca= getCurrentAccount();
    /***** Only accept transfer money from Locally currency *****/

    while(ca.currency != "VND") {
        ca = getNextAccount();
    }

    /***** Only accept transfer money from Locally currency end *****/
    $scope.sourceAccount = ca;
    $scope.currencyCode = 'VND';

    $scope.showContractDetail = false;
    $scope.showClearContractCode = false;

    if ($rootScope.previousState.name == "billpaymentconfirm") {
        $scope.showContractDetail = true;
        $scope.showClearContractCode = true;
    } else if ($rootScope.previousState.name == "sendmoneyselectaccount" || $rootScope.previousState.name == "selectrecentorder") {
        $scope.showContractDetail = BillPaymentFactory.billInfo.showContractDetail;
        $scope.showClearContractCode = BillPaymentFactory.billInfo.showClearContractCode;
    }

    $scope.billInfo = BillPaymentFactory.billInfo;

    if (BillPaymentFactory.billInfo.showPaymentDate != undefined) {
        $scope.showPaymentDate = BillPaymentFactory.billInfo.showPaymentDate;
    }
    if (BillPaymentFactory.billInfo.showCustomerName != undefined) {
        $scope.showCustomerName = BillPaymentFactory.billInfo.showCustomerName;
    }
    if (BillPaymentFactory.billInfo.showCustomerAddress != undefined) {
        $scope.showCustomerAddress = BillPaymentFactory.billInfo.showCustomerAddress;
    }

    $scope.selectAccount = function() {
        saveCurrentState();
        $state.go('sendmoneyselectaccount');
    }

    $scope.selectFromList = function() {
        saveCurrentState();
        console.log("BillPaymentFactory.billInfo select from ben == ", BillPaymentFactory.billInfo);
        $state.go('selectrecentorder')
    }

    function saveCurrentState() {
        $rootScope.suppressDialog = true;
        BillPaymentFactory.billInfo = $scope.billInfo;
        BillPaymentFactory.billInfo.sourceAccount = $scope.sourceAccount;
        BillPaymentFactory.billInfo.showContractDetail = $scope.showContractDetail;
        BillPaymentFactory.billInfo.showClearContractCode = $scope.showClearContractCode;
        BillPaymentFactory.billInfo.showPaymentDate = $scope.showPaymentDate;
        BillPaymentFactory.billInfo.showCustomerName = $scope.showCustomerName;
        BillPaymentFactory.billInfo.showCustomerAddress = $scope.showCustomerAddress;
        $rootScope.safetyApply(function(){});
    }

    $scope.billPayment = function() {
        saveCurrentState();
        $rootScope.suppressDialog = false;
        var txn = {
            usecase : BillPaymentFactory.billInfo.usecase,
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
                paymentInstrumentType : BillPaymentFactory.billInfo.piType
            },
            attribute : [
                {key: 501, value: BillPaymentFactory.billInfo.id},
                {key: 502, value: BillPaymentFactory.billInfo.code},
                {key: 503, value: $scope.billInfo.contractCode}
            ],
            amount : $scope.billInfo.amount
        };

        $scope.loading = true;
        mc.preAuthorize(billPaymentBack,txn,true);
    }

    function billPaymentBack(r) {

        $scope.loading = false;
        $rootScope.safetyApply(function(){});
        if (preAuthoriseBack(r)) {
            if (r.MoneyFee !== undefined && r.MoneyFee != null && r.MoneyFee.length>0) {
                var fee = r.MoneyFee[0];

                BillPaymentFactory.billInfo.fee = (fee.value + fee.vat);

            } else {
                BillPaymentFactory.billInfo.fee = 0;
            }
            BillPaymentFactory.billInfo.systemId = r.Transaction.systemId;
            $state.go("billpaymentconfirm");
        } else {
            appstate = trans.TRAN_IDLE;
        }
    }


    $('input#contractCode').focus(function() {
        $scope.showClearContractCode = false;
        $rootScope.safetyApply(function(){});
    }).blur(function(){
        if($scope.billInfo.contractCode !=undefined && $scope.billInfo.contractCode.length > 0) {
            $scope.showClearContractCode = true;
        } else  {
            $scope.showClearContractCode = false;
        }
        if($rootScope.suppressDialog) {
            $scope.showClearContractCode = true;
            return;
        } else {
            if ($scope.billInfo.contractCode == "" || $scope.billInfo.contractCode == undefined) {
                return;
            } else {
                $scope.showContractDetail = false;
                clearCustomerInfo();
                $scope.loading = true;
                mc.getTcbBill(getTcbBillBack, BillPaymentFactory.billInfo.id, $scope.billInfo.contractCode);
            }
        }
    });

    function clearCustomerInfo() {
        $scope.billInfo.customerName = "";
        $scope.billInfo.amount = "";
        $scope.billInfo.parsedAmount = "";
        $rootScope.safetyApply(function(){});
    }

    $scope.clearContractCode = function() {
        $scope.showClearContractCode = false;
        $scope.showContractDetail = false;
        $scope.billInfo.contractCode = "";
        clearCustomerInfo();
        $rootScope.safetyApply(function(){});
        $('input#contractCode').focus();
    };

    $scope.changeNo = function() {
        $scope.showContractDetail = false;
        clearCustomerInfo();
        if ($scope.billInfo.contractCode == "") {
            clearCustomerInfo();
        }
    };

    if ($rootScope.previousState.name == "selectrecentorder" && BillPaymentFactory.billInfo.selectedFromList == true) {
        $scope.loading = true;
        clearCustomerInfo();
        $rootScope.safetyApply(function(){});
        mc.getTcbBill(getTcbBillBack, BillPaymentFactory.billInfo.id, BillPaymentFactory.billInfo.contractCode);
    }

    function getTcbBillBack(r) {
        if (r.Status.code == "0"){
            if (r.bills[0].customerName == null || r.bills[0].customerName.trim() == "") {
                $scope.showCustomerName = false;
            } else {
                $scope.showCustomerName = true;
                $scope.billInfo.customerName = r.bills[0].customerName;
            }
            if (r.bills[0].customerAddress == null || r.bills[0].customerAddress.trim() == "") {
                $scope.showCustomerAddress = false;
            } else {
                $scope.showCustomerAddress = true;
                $scope.billInfo.customerAddress = r.bills[0].customerAddress;
            }
            $scope.billInfo.amount = r.bills[0].amount;
            $scope.billInfo.parsedAmount = r.bills[0].amount.formatMoney(0);
            if (r.bills[0].period != null) {
                $scope.showPaymentDate = true;
                $scope.billInfo.paymentDate = new Date(r.bills[0].period.startDate).format('dd-mm-yyyy');
            } else {
                $scope.showPaymentDate = false;
            }
            $scope.loading = false;
            $scope.showContractDetail = true;
            $rootScope.safetyApply(function(){});
        } else {
            $scope.showContractDetail = false;
            $scope.loading = false;
            clearCustomerInfo();
            $rootScope.safetyApply(function(){});
            ErrorBox(r.Status);
        }
        $('#scrollArea').scrollTop($("#scrollArea")[0].scrollHeight);
        $scope.showClearContractCode = true;
    };


}]);

