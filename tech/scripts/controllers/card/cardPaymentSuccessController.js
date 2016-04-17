'use strict';

tcbmwApp.controller('CardPaymentSuccessController',['$scope','$rootScope','$state','AccountSelectorFactory','CardFactory',function($scope,$rootScope,$state,AccountSelectorFactory,CardFactory){
    $scope.forOwner = session.forOwner;
    if ( $state.current.name == 'cardpaymentsuccess'){
        var baseStatus = {
            isClose:true,
            onAction: function() {

                AccountSelectorFactory.resetAccount();
                CardFactory.reset();
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

    $scope.cardInfo = CardFactory.cardInfo;
    $scope.sourceAccount = CardFactory.sourceAccount;
    $scope.currencyCode = "VND";
    $scope.paymentDate = new Date().format("dd/mm/yyyy");
    $scope.ftId = CardFactory.cardInfo.ftId;
    $scope.fee = CardFactory.cardInfo.fee;
    $scope.paymentAmount = parseInt(CardFactory.cardInfo.paymentAmount);
    if (CardFactory.cardInfo.paymentFor == 2) {
        $scope.cardNumber = '';
    } else {
        $scope.cardNumber = CardFactory.cardInfo.cardNumber;
    }

    $rootScope.safetyApply(function(){});

    if(CardFactory.cardInfo.txnNote != undefined) {
        //get message following language used
        var tmp = CardFactory.cardInfo.txnNote.split("|");
        var vnNote = tmp[0] + ' (mã ' + CardFactory.cardInfo.merchantErrorCode + ')';
        var enNote = tmp[1] + ' (code ' + CardFactory.cardInfo.merchantErrorCode + ')';
        $scope.txnNote = ($rootScope.languageCode == false) ? vnNote  : enNote;
    }

    $scope.done=function(){
        session.otherCards = undefined;
        AccountSelectorFactory.resetAccount();
        CardFactory.reset();
        $state.go('dashboard.home');
    }

    $scope.transactMore=function(){
        CardFactory.cardInfo.amount = '';
        CardFactory.cardInfo.parsedAmount = '';
        CardFactory.cardInfo.payeeId = undefined;
        CardFactory.cardInfo.paymentMethod = 0;
        CardFactory.cardInfo.fee = '';
        CardFactory.cardInfo.ftId = '';
        session.otherCards = undefined;
        if (CardFactory.cardInfo.paymentFor == 2) {
            CardFactory.cardInfo.cardAccountNumber = '';
            CardFactory.cardInfo.name = '';
        }

        $state.go("cardpaymentmain");

    }

    updateBalance();

}]);