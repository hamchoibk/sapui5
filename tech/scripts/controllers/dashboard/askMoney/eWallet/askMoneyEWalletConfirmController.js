'use strict';
tcbmwApp.controller('askMoneyEWalletConfirmController',['$scope','$state', '$rootScope',function ($scope,$state,$rootScope) {
    if ( $state.current.name == 'askMoneyEWalletConfirm'){
        var baseStatus = {
            isBack: true,
            onBack: function() {
                $state.go('askMoneyEwalletMain');
                var newIndex = statuses.indexOf($scope.status) - 1;
                if (newIndex > -1) {
                    $scope.status = statuses[newIndex];
                    $scope.status.move = 'ltr';
                    $scope.navigationBarStatus = $scope.status;
                }
            },
            isClose:true,
            onAction: function() {
                session.requestMoneyInfo = null;
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
            angular.extend({title: 'NAVBAR_ASKMONEY_EWALLET_CONFIRM'}, baseStatus)
        ];

        $scope.status = statuses[0];
    }
    

    $scope.askMoneyPayerDetails = session.requestMoneyInfo;

    console.log($scope.askMoneyPayerDetails);
    
    $scope.askMoneyAmount = parseInt($scope.askMoneyPayerDetails.amount).formatMoney(0);
    $scope.currency = 'VND';
    $scope.clickSendConfirm = function(){
        $scope.loading = true;
        $rootScope.safetyApply(function(){});
        mc.demandForPayment(demandForPaymentBack, $scope.askMoneyPayerDetails.payerMobileNumber, session.customer.id, $scope.askMoneyPayerDetails.amount, $scope.askMoneyPayerDetails.message);
        //$state.go('askMoneyEWalletSuccess');
    };
    function demandForPaymentBack(r) {
        $scope.loading = false;
        $rootScope.safetyApply(function(){});
        if (r.Status.code == "0") {
            $state.go('askMoneyEWalletSuccess');
        } else {
            ErrorBox(r.Status);
        }
    }

}]);