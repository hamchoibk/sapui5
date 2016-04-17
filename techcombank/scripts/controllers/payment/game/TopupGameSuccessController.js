'use strict';

tcbmwApp.controller('TopupGameSuccessController',['$scope','$rootScope','$state','AccountSelectorFactory','GameFactory','BillPaymentFactory',function($scope,$rootScope,$state,AccountSelectorFactory,GameFactory,BillPaymentFactory){
    $scope.forOwner = session.forOwner;
    if ( $state.current.name == 'topupgamesuccess'){
        var baseStatus = {
            isClose:true,
            onAction: function() {

                AccountSelectorFactory.resetAccount();

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
    console.log("(GameFactory.topupGame ==", GameFactory.topupGame);
    var message = GameFactory.topupGame.spareFields.spareString2;;
    message = message.replace(/\{1\}/g,GameFactory.topupGame.name);
    message = message.replace(/\{2\}/g,GameFactory.topupGame.accountNumber);
    var temp = message.split("|");
    $scope.successMessage = ($rootScope.languageCode == false) ? temp[0]  : temp[1];

    $scope.sourceAccount = GameFactory.topupGame.sourceAccount;
    $scope.accountNumber = GameFactory.topupGame.accountNumber;
    $scope.parsedAmount = parseInt(GameFactory.topupGame.paymentAmount).formatMoney(0);

    $scope.ftId = GameFactory.topupGame.ftId;
    $scope.fee = GameFactory.topupGame.fee;

    if(GameFactory.topupGame.txnNote != undefined) {
        //get message following language used
        var tmp = GameFactory.topupGame.txnNote.split("|");
        var vnNote = tmp[0] + ' (mã ' + GameFactory.topupGame.merchantErrorCode + ')';
        var enNote = tmp[1] + ' (code ' + GameFactory.topupGame.merchantErrorCode + ')';
        $scope.txnNote = ($rootScope.languageCode == false) ? vnNote  : enNote;
    }

    $scope.done=function(){
        AccountSelectorFactory.resetAccount();
        GameFactory.reset();
        $state.go('dashboard.home');
    }

    $scope.transactMore=function(){
        GameFactory.reset();
        AccountSelectorFactory.resetAccount();
        $state.go("paymentindex");
    }

    updateBalance();

}]);