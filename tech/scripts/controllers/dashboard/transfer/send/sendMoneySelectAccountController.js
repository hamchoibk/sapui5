'use strict';
tcbmwApp.controller('SendMoneySelectAccountController', ['$scope', '$state', 'sendMoneyTransferFactory', '$rootScope', function ($scope, $state, sendMoneyTransferFactory, $rootScope) {
    if ($state.current.name == 'sendmoneyselectaccount') {
        var baseStatus = {
            isBack: true,
            onBack: function () {
                $rootScope.suppressDialog = false;
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
            angular.extend({title: 'NAVBAR_TRANSFER_SEND_SELECTACCOUNT'}, baseStatus)
        ];

        $scope.status = statuses[0];
    }

    $scope.accountDetails = getAccountDetails().filter(filterSalaryAccount).filter(filterForeignAccount);
    $scope.accountDetail = sendMoneyTransferFactory.getAccountDetail();

    $scope.currencyCode = 'VND';

    $scope.selectAccount = function (account) {
        $rootScope.suppressDialog = false;
        $scope.accountDetail.accountName = account.accountName;
        $scope.accountDetail.accountType = account.accountType;
        $scope.accountDetail.accountNumber = account.accountNumber;
        $scope.accountDetail.availableBalance = account.availableBalance;
        $scope.accountDetail.transactionLimit = account.transactionLimit;
        $scope.accountDetail.paymentInstrumentId = account.paymentInstrumentId;
        $scope.accountDetail.id = account.id;
        currentAccountIdx = account.id;
        sendMoneyTransferFactory.setAccountDetail($scope.accountDetail);
        $state.go($rootScope.previousState.name, $rootScope.previousState.params);

    };
}]);