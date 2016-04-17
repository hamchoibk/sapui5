'use strict';
tcbmwApp.controller('TopUpGameScreenController',['$scope','$state','$rootScope','AccountSelectorFactory','GameFactory','BillPaymentFactory','dialogService',function($scope,$state,$rootScope,AccountSelectorFactory,GameFactory,BillPaymentFactory,dialogService){

    if ( $state.current.name == 'topupgamescreen'){
        var baseStatus = {
            isBack: true,
            onBack: function() {
                $scope.loading = true;
                $rootScope.safetyApply(function(){});
                GameFactory.reset();
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

    if ($rootScope.previousState.name == "selectrecentorder" || $rootScope.previousState.name == "sendmoneyselectaccount" || $rootScope.previousState.name == "topupgameconfirm") {
        $scope.topupAmounts = GameFactory.amountList;
        $scope.topupAmount = GameFactory.topupAmount;

    } else {
        $scope.loading = true;
        mc.getAmountList(getAmountListBack, GameFactory.topupGame.id);
    }

    function getAmountListBack(r) {
        if(r.Status.code == "0") {
            $scope.topupAmounts = r.amountList;
            GameFactory.amountList = r.amountList;
            $scope.topupAmount = r.amountList[0];
            $scope.loading = false;
            $rootScope.safetyApply(function(){});
        } else {
            ErrorBox(r.Status);
        }
    };

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

    $scope.selectAccount = function() {
        $rootScope.suppressDialog = true;
        GameFactory.topupGame = $scope.topupGame;
        GameFactory.topupGame.accountNumber = $scope.topupGame.accountNumber;
        GameFactory.topupAmount = $scope.topupAmount;
        $state.go('sendmoneyselectaccount');
    }

    $scope.selectAccountGame = function() {
        $rootScope.suppressDialog = true;
        GameFactory.topupGame = $scope.topupGame;
        GameFactory.topupAmount = $scope.topupAmount;
        GameFactory.topupGame.sourceAccount = $scope.sourceAccount;
        $state.go('selectrecentorder');
    }


    $scope.topup = function() {
        GameFactory.topupGame = $scope.topupGame;
        GameFactory.topupGame.accountNumber = $scope.topupGame.accountNumber;
        GameFactory.topupAmount = $scope.topupAmount;
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

    $('input#accountNumber').focus(function() {

    }).blur(function() {
        var self = $(this),value = self.val();
        if(value) {
            $('#scrollArea').scrollTop($("#scrollArea")[0].scrollHeight);
        }
    });

}]);

