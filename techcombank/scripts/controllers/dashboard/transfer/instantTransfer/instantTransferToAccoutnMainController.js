'use strict';
tcbmwApp.controller('instantTransferToAccountMainController',['$scope','$state','$rootScope','AccountSelectorFactory','instantTransferFactory','dialogService',function($scope,$state,$rootScope,AccountSelectorFactory,instantTransferFactory,dialogService){

    if ( $state.current.name == 'instanttransfertoaccountmain'){
        var baseStatus = {
            isBack: true,
            onBack: function() {
                instantTransferFactory.resetTxnInfo();
                AccountSelectorFactory.resetAccount();
                $state.go('dashboard.instanttransferindex');
            },
            isClose:true,
            onAction: function() {
                instantTransferFactory.resetTxnInfo();
                AccountSelectorFactory.resetAccount();
                $state.go('dashboard.home');
            }
        };

        var statuses = [
            angular.extend({title: "NAVBAR_INSTANT_TRANSFER_TO_ACCOUNT_MAIN"}, baseStatus)
        ];

        $scope.status = statuses[0];

    }

    console.log("instantTransferToAccountMainController txnInfo == ", instantTransferFactory.txnInfo);

    var ca= getCurrentAccount();

    /***** Only accept transfer money from Locally currency *****/

    while(ca.currency != "VND") {
        ca = getNextAccount();
    }

    /***** Only accept transfer money from Locally currency end *****/

    $scope.sourceAccount = ca;
    $scope.currencyCode = 'VND';

    var txnInfo = {accountNumber: "", payeeName: "", payeeBankName: "", payeeBankId: "", txnAmount: "", txnParsedAmount: "" , currency: "VND"};
    $scope.willCreateBen = true;
    instantTransferFactory.viaCardNumber = false;

    if ($rootScope.previousState.name == "instanttransferconfirm" ||
        $rootScope.previousState.name == "sendmoneyselectaccount" ||
        $rootScope.previousState.name == "instanttransferbenlist" ||
        $rootScope.previousState.name == "instanttransferbanklist") {

        $scope.txnInfo = instantTransferFactory.txnInfo;
        if ($rootScope.previousState.name == "instanttransferbenlist" && instantTransferFactory.ben != undefined) {
            $scope.txnInfo.accountNumber = instantTransferFactory.ben.accountNumber;
            $scope.txnInfo.payeeBankId = instantTransferFactory.ben.bankCode;
            $scope.txnInfo.payeeBankName = instantTransferFactory.ben.branchLocation;
            $scope.txnInfo.payeeName = "";
            $scope.showPayeeDetail = false;
            $rootScope.safetyApply(function(){});
            $scope.loading = true;
            mc.acctInquiry247(acctInquiry247Back, $scope.txnInfo.accountNumber, $scope.txnInfo.payeeBankId);
        } else {
            $scope.showPayeeDetail = instantTransferFactory.showPayeeDetail;
        }
    } else {
        $scope.txnInfo = txnInfo;
        $scope.showPayeeDetail = false;
    }

    if ($scope.txnInfo.payeeBankName != undefined && $scope.txnInfo.payeeBankName != "") {
        if ($rootScope.previousState.name == "instanttransferbenlist") {
            $scope.txnInfo = instantTransferFactory.txnInfo;
            $scope.showPayeeDetail = instantTransferFactory.showPayeeDetail;
        } else if ($rootScope.previousState.name != "instanttransferconfirm") {
            console.log("payeeBankName yes");
            if ($scope.txnInfo.accountNumber != undefined && $scope.txnInfo.accountNumber != "") {
                console.log("payeeBankName and accountNumber yes");
                $scope.txnInfo.payeeName = "";
                $scope.showPayeeDetail = false;
                $rootScope.safetyApply(function(){});
                $scope.loading = true;
                mc.acctInquiry247(acctInquiry247Back, $scope.txnInfo.accountNumber, $scope.txnInfo.payeeBankId);
            } else {
                console.log("payeeBankName yes and accountNumber no");
                $scope.showPayeeDetail = false;
            }
            $scope.txnInfo.payeeBankName = instantTransferFactory.txnInfo.payeeBankName;
            $scope.txnInfo.payeeBankId = instantTransferFactory.txnInfo.payeeBankId;
        } else {
            console.log("back from confirmation screen");
            $scope.showPayeeDetail = true;
        }
    } else {
        console.log("payeeBankName no");
        $scope.showPayeeDetail = false;
    }

    $rootScope.safetyApply(function(){});

    $scope.selectAccount = function() {
        saveCurrentState();
        $state.go('sendmoneyselectaccount');
    };

    $scope.selectAccountFromBen = function() {
        saveCurrentState();
        instantTransferFactory.ben = undefined;
        $state.go('instanttransferbenlist');
    };

    $scope.selectBank = function() {
        saveCurrentState();
        $state.go('instanttransferbanklist');
    };

    $scope.instantTransfer = function() {
        saveCurrentState();

        instantTransferFactory.txnInfo = $scope.txnInfo;
        if (instantTransferFactory.didSelectBen) {
            instantTransferFactory.willCreateBen = false;
        } else {
            instantTransferFactory.willCreateBen = $scope.willCreateBen;
        }
        var txn = {
            usecase: 1019,
            payer: {
                identifier: {
                    type: 1,
                    value: session.customer.id
                },
                paymentInstrumentId: $scope.txnInfo.sourceAccount.paymentInstrumentId
            },
            payee: {
                identifier: {
                    type: 5,
                    value: "Techcombank"
                },
                paymentInstrumentType: 317
            },
            attribute: [
                {key:515,value:$scope.txnInfo.accountNumber},
                {key:516,value:$scope.txnInfo.payeeBankId}
            ],
            amount: $scope.txnInfo.txnAmount,
            message: $scope.txnInfo.messageContent
        };

        $scope.loading = true;
        mc.preAuthorize(preAuthorizeBack,txn,true);
    };

    function preAuthorizeBack(r) {
        $scope.loading = false;
        $rootScope.safetyApply(function(){});
        if (preAuthoriseBack(r)) {
            var txnInfo = $scope.txnInfo;

            if (r.MoneyFee !== undefined && r.MoneyFee != null && r.MoneyFee.length>0) {
                var fee = r.MoneyFee[0];

                txnInfo.fee = (fee.value + fee.vat);

            } else {
                txnInfo.fee = 0;
            }
            txnInfo.formatedFee = parseInt(txnInfo.fee).formatMoney(0);
            instantTransferFactory.txnInfo = txnInfo;
            instantTransferFactory.txnInfo.systemId = r.Transaction.systemId;
            $state.go('instanttransferconfirm');
        } else {
            appstate = trans.TRAN_IDLE;
        }
    }

    $('input#accountNumber').focus(function () {
        $(this).dequeue();
    }).blur(function () {
        $(this).delay(200).queue(function () {
            if ($scope.txnInfo.accountNumber != undefined && $scope.txnInfo.accountNumber != "") {
                if ($scope.txnInfo.payeeBankName != undefined && $scope.txnInfo.payeeBankName != "") {
                    $scope.loading = true;
                    $rootScope.safetyApply(function(){});
                    mc.acctInquiry247(acctInquiry247Back, $scope.txnInfo.accountNumber, $scope.txnInfo.payeeBankId);
                } else {
                    $scope.showPayeeDetail = false;
                }
            }
        })
    });

    function acctInquiry247Back(r) {
        if (r.Status.code == "0") {
            $scope.txnInfo.payeeName = r.AccountName;
            $scope.showPayeeDetail = true;
            $scope.loading = false;
            $rootScope.safetyApply(function(){});
            $('#scrollArea').scrollTop($("#scrollArea")[0].scrollHeight);
        } else {
            $scope.txnInfo.payeeName = "";
            $scope.loading = false;
            $scope.showPayeeDetail = false;
            ErrorBox(r.Status);
        }
    }

    $('input#txnAmount').focus(function () {
        $(this).prop('type', 'number').val($scope.txnInfo.txnAmount);
    }).blur(function () {
        var self = $(this), value = self.val();
        $scope.txnInfo.txnAmount = value;

        $scope.txnInfo.txnParsedAmount = '';

        if (value)
            $scope.txnInfo.txnParsedAmount = parseInt(value).formatMoney(0);

        self.data('number', value).prop('type', 'text').val($scope.txnInfo.txnParsedAmount);
    });

    $scope.changeAccountNumber = function() {
        $scope.showPayeeDetail = false;
        $scope.txnInfo.payeeName = "";
        $scope.txnInfo.txnAmount = "";
        $scope.txnInfo.txnParsedAmount = "";
        $scope.txnInfo.messageContent = "";
        $rootScope.safetyApply(function(){});
    }

    function clearPayeeDetail() {
        $scope.txnInfo.payeeName = "";
        $scope.txnInfo.payeeBankName = "";
        $scope.txnInfo.payeeBankId = "";
        $scope.txnInfo.txnAmount = "";
        $scope.txnInfo.txnParsedAmount = "";
        $scope.txnInfo.messageContent = "";
    }

    function saveCurrentState() {
        instantTransferFactory.txnInfo = $scope.txnInfo;
        instantTransferFactory.showPayeeDetail = $scope.showPayeeDetail;
        instantTransferFactory.txnInfo.sourceAccount = $scope.sourceAccount;
    }

}]);

