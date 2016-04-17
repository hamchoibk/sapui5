'use strict';
tcbmwApp.controller('instantTransferToCardMainController',['$scope','$state','$rootScope','AccountSelectorFactory','instantTransferFactory',function($scope,$state,$rootScope,AccountSelectorFactory,instantTransferFactory){
    if ( $state.current.name == 'instanttransfertocardmain'){
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
            angular.extend({title: 'NAVBAR_INSTANT_TRANSFER_TO_CARD_MAIN'}, baseStatus)
        ];

        $scope.status = statuses[0];

    }

    console.log("instantTransferFactory.txnInfo == ", instantTransferFactory.txnInfo);

    var ca= getCurrentAccount();

    /***** Only accept transfer money from Locally currency *****/

    while(ca.currency != "VND") {
        ca = getNextAccount();
    }

    /***** Only accept transfer money from Locally currency end *****/

    $scope.sourceAccount = ca;
    $scope.currencyCode = 'VND';

    var txnInfo = {cardNumber: "", payeeName: "", payeeBankName: "", txnAmount: "", txnParsedAmount: "" , currency: "VND"};
    $scope.willCreateBen = true;
    instantTransferFactory.viaCardNumber = true;
    $scope.showPayeeDetail = false;

    if ($rootScope.previousState.name == "instanttransferconfirm" || $rootScope.previousState.name == "sendmoneyselectaccount" || $rootScope.previousState.name == "instanttransferbenlist") {
        $scope.txnInfo = instantTransferFactory.txnInfo;
        if ($rootScope.previousState.name == "instanttransferbenlist" && instantTransferFactory.ben != undefined) {
            $scope.txnInfo.cardNumber = instantTransferFactory.ben.accountNumber;
            $scope.loading = true;
            mc.cardInquiry247(cardInquiry247Back, $scope.txnInfo.cardNumber);
        } else {
            $scope.showPayeeDetail = instantTransferFactory.showPayeeDetail;
        }
    } else {
        $scope.txnInfo = txnInfo;
    }

    $rootScope.safetyApply(function(){});

    $scope.selectAccount = function() {
        saveCurrentState();
        console.log("selectAccount -- instantTransferFactory == ", instantTransferFactory);
        $state.go('sendmoneyselectaccount');
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
            usecase: 1018,
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
                paymentInstrumentType: 316
            },
            attribute: [
                {key:514,value:$scope.txnInfo.cardNumber}
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

    $scope.selectAccountFromBen = function() {
        saveCurrentState();
        instantTransferFactory.ben = undefined;
        $state.go('instanttransferbenlist');
    }

    $('input#cardNumber').focus(function() {
        $(this).dequeue();
    }).blur(function(){$(this).delay(200).queue(function() {
        if ($scope.txnInfo.cardNumber != "" && $scope.txnInfo.cardNumber != undefined) {
            if ($scope.txnInfo.cardNumber.length < 13 || $scope.txnInfo.cardNumber.length > 19) {
                return;
            } else {
                $scope.loading = true;
                $rootScope.safetyApply(function(){});
                mc.cardInquiry247(cardInquiry247Back, $scope.txnInfo.cardNumber);
            }
        }
        })
    });


    function cardInquiry247Back(r) {
        if (r.Status.code == "0") {
            txnInfo.cardNumber = $scope.txnInfo.cardNumber;
            txnInfo.payeeName = r.CardHolder;
            txnInfo.payeeBankName = r.BankIssue;
            $scope.txnInfo = txnInfo;
            $scope.showPayeeDetail = true;
            $scope.loading = false;
            $rootScope.safetyApply(function(){});
        } else {
            clearPayeeDetail();
            $scope.loading = false;
            ErrorBox(r.Status);
        }
        $('#scrollArea').scrollTop($("#scrollArea")[0].scrollHeight);
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

    $scope.changeCardNumber = function() {
        $scope.showPayeeDetail = false;
        clearPayeeDetail();
        $rootScope.safetyApply(function(){});
    }

    function clearPayeeDetail() {
        $scope.txnInfo.payeeName = "";
        $scope.txnInfo.payeeBankName = "";
        $scope.txnInfo.txnAmount = "";
        $scope.txnInfo.txnParsedAmount = "";
        $scope.txnInfo.messageContent = "";
    }

    function saveCurrentState() {
        instantTransferFactory.txnInfo = $scope.txnInfo;
        instantTransferFactory.showPayeeDetail = $scope.showPayeeDetail;
        instantTransferFactory.txnInfo.sourceAccount = $scope.sourceAccount;
        instantTransferFactory.willCreateBen = $scope.willCreateBen;
    }

    $scope.clearCardNumber = function() {
        $scope.txnInfo.cardNumber = "";
        $('input#cardNumber').focus();
    }

}]);

