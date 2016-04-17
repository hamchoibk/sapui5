tcbmwApp.controller('CardPaymentListController',['$scope','$state','$filter','CardFactory','$rootScope',function($scope,$state,$filter,CardFactory,$rootScope){
    if($rootScope.suppressDialog === true){
        $rootScope.suppressDialog = false;
    }

    if ( $state.current.name == 'cardpaymentlist'){
        var baseStatus = {
            isBack: true,
            onBack: function() {
                $state.go($rootScope.previousState.name);
                var newIndex = statuses.indexOf($scope.status) - 1;
                if (newIndex > -1) {
                    $scope.status = statuses[newIndex];
                    $scope.status.move = 'ltr';
                    $scope.navigationBarStatus = $scope.status;
                }
            }
        };

        var statuses = [
            angular.extend({title: 'NAVBAR_TCB_BENIFICIARYLIST'}, baseStatus)
        ];

        $scope.status = statuses[0];
    }

    $scope.beneficiaryListSameAccountIsOpen = false;
    $scope.beneficiaryListDifferentAccountIsOpen = false;
    $scope.currencyCode = 'VND';

    $scope.isPaymentForOther = CardFactory.isPaymentForOther;
    $scope.cardInfo = CardFactory.cardInfo;

    $scope.benOwner = true;
    var sameHolder = [];
    var differentHolder = [];

    if ($scope.cardInfo.paymentFor == 1) {
        $scope.beneficiaryListSameAccountIsOpen = true;
        $scope.benOwner = true;
        sameHolder = session.cards;
        $scope.cardListSameHolder = sameHolder;
        $scope.cardListDifferentHolder = differentHolder;
        $rootScope.safetyApply(function(){});
    } else {
        $scope.beneficiaryListDifferentAccountIsOpen = true;
        $scope.benOwner = false;
        sameHolder = [];
        $scope.cardListSameHolder = sameHolder;
        if (session.otherCards == undefined) {
            $scope.loading = true;
            mc.getBeneficiaries(getBeneficiariesBack, TYPE_BEN_CREDIT_CARD_ACCOUNT);
        } else {
            $scope.loading = false;
            differentHolder = session.otherCards;
            $scope.cardListDifferentHolder = differentHolder;
            $rootScope.safetyApply(function(){});
        }

    }

    function getBeneficiariesBack(r) {
        $scope.loading = false;
        if(r.Status.code = "0") {
            differentHolder = r.benList;
            session.otherCards = r.benList;
            $scope.cardListDifferentHolder = differentHolder;
            $rootScope.safetyApply(function(){});
        } else {
            ErrorBox(r.Status);
        }
    }

    var closeAllLists = function(){
        $scope.beneficiaryListSameAccountIsOpen = false;
        $scope.beneficiaryListDifferentAccountIsOpen = false;
    }

    $scope.filterByCardNumber = function(data){
        closeAllLists();
        var beneficiaryListSameAccountFilterResult = $filter('filter')($scope.cardListSameHolder,data);
        var beneficiaryListDifferentAccountFilterResult = $filter('filter')($scope.cardListDifferentHolder,data);

        if(beneficiaryListSameAccountFilterResult.length>0){
            $scope.beneficiaryListSameAccountIsOpen = true;
        }

        if(beneficiaryListDifferentAccountFilterResult.length>0){
            $scope.beneficiaryListDifferentAccountIsOpen = true;
        }
        $rootScope.safetyApply(function(){});
    };
    $scope.cardSelected = function(data) {
        var cardInfo = CardFactory.cardInfo;
        cardInfo.name = data.name;
        cardInfo.cardAccountNumber = data.cardAccountNumber;
        cardInfo.cardNumber = data.cardNumber;
        cardInfo.outstandingBalance = data.outstandingBalance;
        cardInfo.availableBalance = data.availableBalance;
        cardInfo.creditLimit = data.creditLimit;
        cardInfo.amount = '';
        cardInfo.parsedAmount = '';
        cardInfo.paymentMethod = 0;
        cardInfo.payeeId = undefined;
        CardFactory.cardInfo = cardInfo;
        $state.go("cardpaymentmain");
    };
    $scope.otherCardSelected = function(data) {
        var cardInfo = CardFactory.cardInfo;
        cardInfo.name = data.benName;
        cardInfo.cardAccountNumber = data.accountNumber;
        cardInfo.amount = '';
        cardInfo.parsedAmount = '';
        cardInfo.payeeId = undefined;
        CardFactory.cardInfo = cardInfo;
        $state.go("cardpaymentmain");
    };
}]);

