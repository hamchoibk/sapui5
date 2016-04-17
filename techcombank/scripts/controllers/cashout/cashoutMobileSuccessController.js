'use strict';

tcbmwApp.controller('CashoutMobileSuccessController', ['$scope', '$state', 'AccountSelectorFactory', 'AccountCashoutMobileParticularsFactory', '$rootScope', function ($scope, $state, AccountSelectorFactory, AccountCashoutMobileParticularsFactory,$rootScope) {
    $scope.forOwner = session.forOwner;
    if ($state.current.name == 'cashoutmobilesuccess') {
        var baseStatus = {
            isClose: true,
            onAction: function () {
                session.forOwner = false;
                AccountSelectorFactory.resetAccount();
                AccountCashoutMobileParticularsFactory.resetParticulars();
                AccountCashoutMobileParticularsFactory.resetTransactionReference();
                AccountCashoutMobileParticularsFactory.resetSource();

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
            angular.extend({title: 'NAVBAR_CASHOUT_MOBILESUCCESS'}, baseStatus)
        ];

        $scope.status = statuses[0];
    }
    session.cachedSocialTrasactions = false;
    $scope.done = function () {
        session.forOwner = false;
        AccountSelectorFactory.resetAccount();
        AccountCashoutMobileParticularsFactory.resetParticulars();
        AccountCashoutMobileParticularsFactory.resetTransactionReference();
        AccountCashoutMobileParticularsFactory.resetSource();

        $state.go('dashboard.home');
    }

    $scope.transactMore = function () {
        //session.forOwner = false;

        var prevState = AccountCashoutMobileParticularsFactory.getSource();

        AccountSelectorFactory.resetAccount();
        AccountCashoutMobileParticularsFactory.resetParticulars();
        AccountCashoutMobileParticularsFactory.resetTransactionReference();
        AccountCashoutMobileParticularsFactory.resetSource();

        $state.go(prevState);
        $state.go("cashoutmobile");
    }

    $scope.particulars = AccountCashoutMobileParticularsFactory.getParticulars();

    console.log("$scope.particulars", $scope.particulars);

    $scope.transactionRef = AccountCashoutMobileParticularsFactory.getTransactionReference();
    console.log("sendmoneymain -- currentAccountIdx == ", currentAccountIdx);
    updateBalance();
}]);