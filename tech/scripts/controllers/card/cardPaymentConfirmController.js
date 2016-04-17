'use strict';
tcbmwApp.controller('CardPaymentConfirmController',['$scope','$state','$rootScope','AccountSelectorFactory','CardFactory',function($scope,$state,$rootScope,AccountSelectorFactory,CardFactory){
    if ( $state.current.name == 'cardpaymentconfirm'){
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
            angular.extend({title: "NAVBAR_CARD_PAYMENT_TITLE"}, baseStatus)
        ];

        $scope.status = statuses[0];
    }

    $scope.sourceAccount = CardFactory.sourceAccount;
    $scope.cardInfo = CardFactory.cardInfo;
    $scope.parsedAmount = CardFactory.cardInfo.parsedAmount;
    $scope.currencyCode = "VND";

    $scope.isPaymentForOther = CardFactory.isPaymentForOther;

    if ($scope.cardInfo.paymentFor == 1) {
        $scope.Owner = true;
    } else {
        $scope.Owner = false;
    }

    $scope.confirm = function(){
        $scope.loading = true;
        mc.preAuthorisationContinue(callback,CardFactory.cardInfo.systemId);
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
                CardFactory.cardInfo.ftId = ft.ft_code;
            }
            $state.go('cardpaymentsuccess');
        } else if (r.Status.code == "2521") {
            //OTP page
            $state.go('cardpaymentotp');
        } else {
            ErrorBox(r.Status);
            appstate = trans.TRAN_IDLE;
        }
    }


}]);