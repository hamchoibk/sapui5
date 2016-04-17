'use strict';
tcbmwApp.controller('CardPaymentIndexController',['$scope','$state','CardFactory', '$rootScope',function($scope,$state,CardFactory,$rootScope){
    if ( $state.current.name == 'cardpaymentindex'){
        var baseStatus = {
            isBack: true,
            onBack: function() {
                CardFactory.currentCreditCard = currentCreditCard;
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
            angular.extend({title: 'NAVBAR_CARD_PAYMENT_INDEX'}, baseStatus)
        ];

        $scope.status = statuses[0];
    }

    var currentCreditCard = 0;

    $scope.isPaymentForOther = false;
    if ($rootScope.previousState.name == "dashboard.home" || $rootScope.previousState.name == "dashboard.askmoney") {
        $scope.cardInfo = {};
        $scope.cards = {};
        $scope.cardInfo.paymentFor = 0;
    } else {
        $scope.cardInfo = CardFactory.cardInfo;
        currentCreditCard = CardFactory.currentCreditCard;
    }

    if (session.cards == undefined) {
        $scope.loading = true;
        mc.getTcbCreditCards(getTcbCreditCardsBack, session.customer.id);
    } else {
        $scope.loading = false;
        $scope.cards = session.cards;
        currentCreditCard = CardFactory.currentCreditCard;
        $scope.cardInfo = session.cards[currentCreditCard];
        $scope.selectedCardNumber = session.cards[currentCreditCard].cardNumber;
        $rootScope.safetyApply(function(){});
    }

    function getTcbCreditCardsBack(r) {
        if (r.Status.code == "0") {
            if (r.creditCards.length == 0) {
                $scope.isPaymentForOther = true;
                $scope.disableForOwner = true;
                $scope.cardInfo = {};
                $scope.cards = {};
                session.cards = [];
            } else {
                $scope.disableForOwner = false;
                $scope.cardInfo = r.creditCards[0];
                $scope.selectedCardNumber = r.creditCards[0].cardNumber;
                $scope.cards = r.creditCards;
                session.cards = r.creditCards;
            }

            $scope.loading = false;
            $rootScope.safetyApply(function(){});
        } else {
            $scope.isPaymentForOther = true;
            $scope.disableForOwner = true;
            $scope.cardInfo = {};
            $scope.cards = {};
            session.cards = [];
            $scope.loading = false;
            $state.go("dashboard.home");
            ErrorBox(r.Status);

        }
    }

    $scope.changeCardNumber = function() {
        var currentCardIndex = 0;
        for (currentCardIndex = 0 ; currentCardIndex < $scope.cards.length ; currentCardIndex++) {
            if ($scope.cards[currentCardIndex].cardNumber == $scope.selectedCardNumber) {
                break;
            }
        }
        $scope.cardInfo = $scope.cards[currentCardIndex];
        currentCreditCard = currentCardIndex;
        $rootScope.safetyApply(function(){});

    }

    $scope.currencyCode = 'VND';

    $scope.clickCardPayment = function() {
        session.creditCardBalance = undefined;
        CardFactory.isPaymentForOther =  $scope.isPaymentForOther;
        CardFactory.currentCreditCard = currentCreditCard;
        CardFactory.disableForOwner = $scope.disableForOwner;
        if ($scope.isPaymentForOther==true) {
            $scope.cardInfo.paymentFor = 2;
            $scope.cardInfo.cardAccountNumber = '';
        } else {
            $scope.cardInfo.paymentFor = 1;
        }
        CardFactory.cardInfo = angular.extend({},$scope.cardInfo);

        $state.go("cardpaymentmain");
    }

    $scope.clickStatement = function() {
        CardFactory.cardInfo = angular.extend({},$scope.cardInfo);
        CardFactory.currentCreditCard = currentCreditCard;
        $state.go('cardstatementindex');
    }

}]);