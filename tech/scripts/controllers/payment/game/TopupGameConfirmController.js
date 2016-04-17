'use strict';
tcbmwApp.controller('TopUpGameConfirmController',['$scope','$state','$rootScope','AccountSelectorFactory','GameFactory','BillPaymentFactory',function($scope,$state,$rootScope,AccountSelectorFactory,GameFactory,BillPaymentFactory){
    if ( $state.current.name == 'topupgameconfirm'){
        var baseStatus = {
            isBack:true,
            onBack: function() {
                $state.go($rootScope.previousState.name);

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
                GameFactory.reset();
                $state.go('dashboard.home');

                var newIndex = statuses.indexOf($scope.status) - 1;
                if (newIndex > -1) {
                    $scope.status = statuses[newIndex];
                    $scope.status.move = 'ltr';
                    $scope.navigationBarStatus = $scope.status;
                }
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
        } else if (BillPaymentFactory.billInfo.paymentName) {
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

    $scope.sourceAccount = GameFactory.topupGame.sourceAccount;
    $scope.parsedAmount = parseInt(GameFactory.topupAmount).formatMoney(0);
    $scope.accountNumber = GameFactory.topupGame.accountNumber;
    $scope.gameType = GameFactory.topupGame.name;
    $scope.iconUrl = GameFactory.topupGame.iconUrl;
    $scope.currencyCode = "VND";

    $scope.confirm = function(){
        GameFactory.topupGame.parsedAmount = $scope.parsedAmount;
        $scope.loading = true;
        mc.preAuthorisationContinue(callback,GameFactory.topupGame.systemId);
    };

    function callback(r) {
        $scope.loading = false;
        $rootScope.safetyApply(function(){});
        if (r.Status.code == "0") {
            //Done, no OTP, move to last step
            var ft = {};
            if (r.UnstructuredData !== undefined) {
                //check if a FT exist
                ft.ft_key = r.UnstructuredData[0].Key;
                ft.ft_code = r.UnstructuredData[0].Value;
                GameFactory.topupGame.ftId = ft.ft_code;
            }
            $state.go('topupsuccess');
        } else if (r.Status.code == "2521") {
            //OTP page
            $state.go('topupgameotp');
        } else {
            ErrorBox(r.Status);
            appstate = trans.TRAN_IDLE;
        }
    }

}]);