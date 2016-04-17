'use strict';
tcbmwApp.controller('CardPaymentMainController',['$scope','$state','$rootScope','AccountSelectorFactory','CardFactory','dialogService',function($scope,$state,$rootScope,AccountSelectorFactory,CardFactory,dialogService){

    if ( $state.current.name == 'cardpaymentmain'){
        var baseStatus = {
            isBack: true,
            onBack: function() {
                CardFactory.reset();
                AccountSelectorFactory.resetAccount();
                if($rootScope.previousState.name != "cardpaymentconfirm"
                    && $rootScope.previousState.name != "sendmoneyselectaccount"
                    && $rootScope.previousState.name != "cardpaymentlist"
                    && $rootScope.previousState.name != "cardpaymentsuccess") {
                    $state.go($rootScope.previousState.name);
                } else {
                    $state.go("cardpaymentindex");
                }
            },
            isClose:true,
            onAction: function() {
                CardFactory.reset();
                AccountSelectorFactory.resetAccount();
                $state.go('dashboard.home');
            }
        };

        var statuses = [
            angular.extend({title: "NAVBAR_CARD_PAYMENT_TITLE"}, baseStatus)
        ];

        $scope.status = statuses[0];

    }

    var ca= getCurrentAccount();
    $scope.sourceAccount = ca;
    $scope.currencyCode = 'VND';
    $scope.isPaymentForOther = CardFactory.isPaymentForOther;
    $scope.disableForOwner = CardFactory.disableForOwner;

    $scope.cardInfo = angular.extend({}, CardFactory.cardInfo);
    if (CardFactory.cardInfo.cardAccountNumber != '' && CardFactory.cardInfo.payeeId == undefined) {
        $scope.loading = true;
        mc.getPaymentInstrument(getPaymentInstrumentBack, CardFactory.cardInfo.cardAccountNumber);
    }

    $scope.cardInfo.addToAccountListFlag = true;

    if($rootScope.previousState.name == "cardpaymentindex") {
        if ($scope.isPaymentForOther == true) {
            $scope.cardInfo.paymentFor = 2;
            $scope.cardInfo.paymentMethod = 3;
            $scope.cardInfo.enterAmount = false;
        } else {
            $scope.cardInfo.paymentFor = CardFactory.cardInfo.paymentFor;
            $scope.cardInfo.paymentMethod = 0;
            $scope.cardInfo.enterAmount = true;
        }
    }

    $rootScope.safetyApply(function(){});

    $scope.selectAccount = function() {
        saveCurrentState();
        $state.go('sendmoneyselectaccount');
    }

    $scope.selectCardFromListOwner = function() {
        saveCurrentState();
        session.creditCardBalance = undefined;
        $state.go('cardpaymentlist');
    }

    $scope.selectCardFromListOther = function() {
        saveCurrentState();
        $state.go('cardpaymentlist');
    }

    function saveCurrentState() {
        CardFactory.cardInfo = $scope.cardInfo;
        CardFactory.sourceAccount = $scope.sourceAccount;
        CardFactory.isPaymentForOther = $scope.isPaymentForOther;
    }

    $scope.paymentMethod = function() {
        if(session.creditCardBalance == undefined) {
            $scope.loading = true;
            mc.getCreditCardBalance(getCreditCardBalanceBack, $scope.cardInfo.cardAccountNumber);
        } else {
            bindingAmount();
        }
    }

    function getCreditCardBalanceBack(r) {
        $scope.loading = false;
        if (r.Status.code == "0") {
            session.creditCardBalance = r;
            bindingAmount();
        } else {
            ErrorBox(r.Status);
        }
    }

    function bindingAmount() {
        if ($scope.cardInfo.paymentMethod == 1) {
            $scope.cardInfo.enterAmount = true;
            $scope.cardInfo.amount = session.creditCardBalance.minimumPayment;
            $scope.cardInfo.parsedAmount = session.creditCardBalance.minimumPayment.formatMoney(0);
        } else if ($scope.cardInfo.paymentMethod == 2) {
            $scope.cardInfo.enterAmount = true;
            var temp = Math.abs(session.creditCardBalance.endBalance);
            $scope.cardInfo.amount = temp;
            $scope.cardInfo.parsedAmount = temp.formatMoney(0);
        } else if ($scope.cardInfo.paymentMethod == 3) {
            $scope.cardInfo.enterAmount = false;
            $scope.cardInfo.amount = '';
            $scope.cardInfo.parsedAmount = '';
            $scope.cardInfo.messageContent = '';
            $('#paymentAmount').focus();
        } else {
            $scope.cardInfo.enterAmount = true;
            $scope.cardInfo.amount = '';
            $scope.cardInfo.parsedAmount = '';
            $scope.cardInfo.messageContent = '';
        }
        $('#scrollArea').scrollTop($("#scrollArea")[0].scrollHeight);
        $rootScope.safetyApply(function(){});
    }

    $scope.paymentFor = function() {
        if ($scope.cardInfo.paymentFor == 1) {
            $scope.isPaymentForOther = false;
            $scope.cardInfo.enterAmount = true;
            $scope.cardInfo.paymentMethod = 0;
            $scope.cardInfo.cardAccountNumber = CardFactory.cardInfo.cardAccountNumber;
            $scope.cardInfo.amount = "";
            $scope.cardInfo.parsedAmount = "";
            $('.cardHolderNameBefore').removeClass("cardHolderNameAfter")
            $rootScope.safetyApply(function(){});
        } else {
            $scope.isPaymentForOther = true;
            $scope.cardInfo.enterAmount = false;
            session.creditCardBalance = undefined;
            $scope.cardInfo.cardAccountNumber = "";
            $scope.cardInfo.amount = "";
            $scope.cardInfo.parsedAmount = "";
            $scope.cardInfo.name = "";
            $scope.cardInfo.paymentMethod = 3;
            $rootScope.safetyApply(function(){});
        }
    }


    $scope.payment = function() {
        saveCurrentState();
        if ($scope.cardInfo.amount == 0) {
            MessageBox("", "CARD_PAYMENT_LIST_BALANCE_VALIDATION");
            return;
        }

        //save to beneficiary list
        if ($scope.cardInfo.addToAccountListFlag && $scope.cardInfo.paymentFor == 2 && $scope.benName != undefined) {
            var type = 4;
            var ben = {
                type:type,
                benName: $scope.benName,
                accountNumber: $scope.benAccountNumber,
                active:true,
            }
            mc.createBeneficiary(createBeneficiaryBack, ben);
        }

        //prepare data to preAuthorize
        var usecase;
        if ($scope.cardInfo.paymentFor == 1) {
            usecase = 1013;
        } else {
            usecase = 1002;
        }

        var txn = {
            usecase : usecase,
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
                paymentInstrumentId: CardFactory.cardInfo.payeeId
            },
            attribute : [
                {key: 506, value:$scope.cardInfo.cardNumber},
                {key: 507, value:$scope.cardInfo.paymentMethod}
            ],
            amount : $scope.cardInfo.amount
        };

        $scope.loading = true;
        mc.preAuthorize(preAuthorizeBack,txn,true);

    }

    function preAuthorizeBack(r) {

        $scope.loading = false;
        $rootScope.safetyApply(function(){});
        if (preAuthoriseBack(r)) {
            if (r.MoneyFee !== undefined && r.MoneyFee != null && r.MoneyFee.length>0) {
                var fee = r.MoneyFee[0];

                CardFactory.cardInfo.fee = (fee.value + fee.vat);

            } else {
                CardFactory.cardInfo.fee = 0;
            }
            CardFactory.cardInfo.systemId = r.Transaction.systemId;
            $state.go("cardpaymentconfirm");
        } else {
            appstate = trans.TRAN_IDLE;
        }
    }

    $('input#paymentAmount').focus(function() {
        $(this).prop('type', 'number').val($scope.cardInfo.amount);
    }).blur(function() {
        $('#scrollArea').scrollTop($("#scrollArea")[0].scrollHeight);
        var self = $(this),value = self.val();
        $scope.cardInfo.amount=value;
        $scope.cardInfo.parsedAmount='';

        if(value) {
            $scope.cardInfo.parsedAmount=parseInt(value).formatMoney(0);
        }
        self.data('number', value).prop('type', 'text').val($scope.cardInfo.parsedAmount);
        $rootScope.safetyApply(function(){});
    });

    $scope.changeCardAccountNumber = function() {
        if ($scope.cardInfo.cardAccountNumber == undefined) {
            $scope.cardInfo.cardAccountNumber = '';
        }
        $scope.cardInfo.name = '';
        $('.cardHolderNameBefore').removeClass("cardHolderNameAfter")
        $rootScope.safetyApply(function(){});
    }

    $('input#cardAccountNumber').blur(function() {
        if($scope.cardInfo.cardAccountNumber.length == 0) {
            return;
        } else if($scope.cardInfo.cardAccountNumber.length == 14) {
            $scope.loading = true;
            mc.getPaymentInstrument(getPaymentInstrumentBack, $scope.cardInfo.cardAccountNumber);
        } else {
            $scope.cardInfo.name = "";
            $scope.cardInfo.payeeId = undefined;
            CardFactory.cardInfo.payeeId = undefined;
            $scope.benName = undefined;
            $scope.benAccountNumber = undefined;
            MessageBox("","CARD_PAYMENT_MAIN_ACCOUNT_NUMBER_VALIDATION");
        }
        $rootScope.safetyApply(function(){});
    });

    function getPaymentInstrumentBack(r) {
        $scope.loading = false;
        if (r.Status.code = "0") {
            if (r.PaymentInstrument && r.PaymentInstrument.type == TYPE_CREDIT_CARD_ACCOUNT) {
                $scope.cardInfo.payeeId = r.PaymentInstrument.id;
                $scope.benName = r.PaymentInstrument.accountHolderName;
                $scope.benAccountNumber = r.PaymentInstrument.accountNumber;
                $scope.cardInfo.name = r.PaymentInstrument.accountHolderName;
                CardFactory.cardInfo.payeeId = r.PaymentInstrument.id;
                if ($scope.cardInfo.paymentFor == 2) {
                    $('.cardHolderNameBefore').addClass("cardHolderNameAfter")
                } else {
                    $('.cardHolderNameBefore').removeClass("cardHolderNameAfter")
                }
            } else {
                $('.cardHolderNameBefore').removeClass("cardHolderNameAfter")
                $scope.cardInfo.payeeId = undefined;
                CardFactory.cardInfo.payeeId = undefined;
                $scope.benName = undefined;
                $scope.benAccountNumber = undefined;
                $scope.cardInfo.name = "";
                MessageBox("","CARD_PAYMENT_MAIN_ACCOUNT_NUMBER_VALIDATION");
            }
            $rootScope.safetyApply(function(){});
        } else {
            ErrorBox(r.Status);
        }
    }

    function createBeneficiaryBack(r) {
        if(r.Status.code = "0") {
            console.log("Created ben");
        } else {
            ErrorBox(r.Status);
        }
    }

    $scope.clearCardAccountNumber = function() {
        $scope.cardInfo.cardAccountNumber = '';
        $scope.cardInfo.name = '';
        $('.cardHolderNameBefore').removeClass("cardHolderNameAfter")
        $('input#cardAccountNumber').focus();
        $rootScope.safetyApply(function(){});
    }


}]);

