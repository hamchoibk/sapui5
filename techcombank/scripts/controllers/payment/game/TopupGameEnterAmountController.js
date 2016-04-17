'use strict';
tcbmwApp.controller('TopupGameEnterAmountController',['$scope','$state','$rootScope','AccountSelectorFactory','GameFactory','BillPaymentFactory','dialogService',function($scope,$state,$rootScope,AccountSelectorFactory,GameFactory,BillPaymentFactory,dialogService){

    if ( $state.current.name == 'topupgameenteramountscreen'){
        var baseStatus = {
            isBack: true,
            onBack: function() {
                $scope.loading = true;
                $rootScope.safetyApply(function(){});
                GameFactory.reset();
                GameFactory.parsedAmount = '';
                AccountSelectorFactory.resetAccount();
                if ($rootScope.previousState.name != "selectrecentorder"
                    && $rootScope.previousState.name != "sendmoneyselectaccount"
                    && $rootScope.previousState.name != "topupgameconfirm") {
                    $state.go($rootScope.previousState.name);
                } else {
                    $state.go(session.paymentPreviousState);
                }
            },
            isClose:true,
            onAction: function() {
                GameFactory.reset();
                AccountSelectorFactory.resetAccount();
                $state.go('dashboard.home');
            }
        };

        var title;
        if (GameFactory.topupGame.paymentName) {
            var paymentName = GameFactory.topupGame.paymentName.split("~");
            var tempTitle = paymentName[0].split("|");
            var tempLable1 = paymentName[1].split("|");
            var tempLable2 = paymentName[2].split("|");
            title = ($rootScope.languageCode == false) ? tempTitle[0]  : tempTitle[1];
            $scope.lable1 = ($rootScope.languageCode == false) ? tempLable1[0]  : tempLable1[1];
            $scope.lable2 = ($rootScope.languageCode == false) ? tempLable2[0]  : tempLable2[1];
        } else {
            title = 'NAVBAR_GAME_TOPUP';
            $scope.lable1 = 'TOPUP_GAME';
            $scope.lable2 = 'TOPUP_GAME_FOR';
        }

        var statuses = [
            angular.extend({title: title}, baseStatus)
        ];

        $scope.status = statuses[0];

    }

    var ca= getCurrentAccount();
    /***** Only accept transfer money from Locally currency *****/

    while(ca.currency != "VND") {
        ca = getNextAccount();
    }

    /***** Only accept transfer money from Locally currency end *****/
    $scope.sourceAccount = ca;
    $scope.currencyCode = 'VND';

    $scope.addToAccountListFlag =  true;
    $scope.topupGame = GameFactory.topupGame;
    $scope.accountNumber = GameFactory.topupGame.accountNumber;
    $scope.topupAmount = GameFactory.topupAmount;
    $scope.parsedAmount = GameFactory.parsedAmount;

    $scope.selectAccount = function() {
        $rootScope.suppressDialog = true;
        GameFactory.topupGame = $scope.topupGame;
        GameFactory.topupGame.accountNumber = $scope.topupGame.accountNumber;
        GameFactory.topupAmount = $scope.topupAmount;
        GameFactory.parsedAmount = $scope.parsedAmount;
        $state.go('sendmoneyselectaccount');
    }

    $scope.selectAccountGame = function() {
        $rootScope.suppressDialog = true;
        GameFactory.topupGame = $scope.topupGame;
        GameFactory.topupAmount = $scope.topupAmount;
        GameFactory.parsedAmount = $scope.parsedAmount;
        GameFactory.topupGame.sourceAccount = $scope.sourceAccount;
        $state.go('selectrecentorder');
    }


    $scope.topup = function() {
        console.log("GameFactory.topupGame == ", GameFactory.topupGame);
        GameFactory.topupGame = $scope.topupGame;
        GameFactory.topupGame.accountNumber = $scope.topupGame.accountNumber;
        GameFactory.topupAmount = $scope.topupAmount;
        GameFactory.parsedAmount = $scope.parsedAmount;
        GameFactory.topupGame.sourceAccount = $scope.sourceAccount;


        var txn = {
            usecase : GameFactory.topupGame.usecase,
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
                paymentInstrumentType : GameFactory.topupGame.piType
            },
            attribute : [
                {key: 501, value: GameFactory.topupGame.id},
                {key: 502, value: GameFactory.topupGame.code},
                {key: 503, value: $scope.topupGame.accountNumber}
            ],
            amount : $scope.topupAmount
        };

        $scope.loading = true;
        mc.preAuthorize(topupBack,txn,true);

    }

    function topupBack(r) {

        $scope.loading = false;
        $rootScope.safetyApply(function(){});
        if (preAuthoriseBack(r)) {
            if (r.MoneyFee !== undefined && r.MoneyFee != null && r.MoneyFee.length>0) {
                var fee = r.MoneyFee[0];

                GameFactory.topupGame.fee = (fee.value + fee.vat);

            } else {
                GameFactory.topupGame.fee = 0;
            }
            GameFactory.topupGame.systemId = r.Transaction.systemId;
            $state.go("topupgameconfirm");
        } else {
            appstate = trans.TRAN_IDLE;
        }
    }

    if ($rootScope.previousState.name == "selectrecentorder") {
        $('#scrollArea').scrollTop($("#scrollArea")[0].scrollHeight);
    }

    $('input#accountNumber').focus(function() {

    }).blur(function() {
        var self = $(this),value = self.val();
        if(value) {
            $('#scrollArea').scrollTop($("#scrollArea")[0].scrollHeight);
        }
    });

    $('input#topupAmount').focus(function() {
        $(this).prop('type', 'number').val($scope.topupAmount);
    }).blur(function() {
        $('#scrollArea').scrollTop($("#scrollArea")[0].scrollHeight);
        var self = $(this),value = self.val();
        $scope.topupAmount=value;
        $scope.parsedAmount='';

        if(value) {
            $scope.parsedAmount=parseInt(value).formatMoney(0);
        }
        self.data('number', value).prop('type', 'text').val($scope.parsedAmount);
    });
}]);

