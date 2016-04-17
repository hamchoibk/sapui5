'use strict';

tcbmwApp.controller('TCBSelectAccountController', ['$scope', '$state', 'tcbTransferFactory','$rootScope', function ($scope, $state, tcbTransferFactory,$rootScope) {
    if ($state.current.name == 'tcbselectaccount') {
        var baseStatus = {
            isBack: true,
            onBack: function () {
                $state.go('tcbindex');
                var newIndex = statuses.indexOf($scope.status) - 1;
                if (newIndex > -1) {
                    $scope.status = statuses[newIndex];
                    $scope.status.move = 'ltr';
                    $scope.navigationBarStatus = $scope.status;
                }
            }
        };

        var statuses = [
            angular.extend({title: 'NAVBAR_TCB_SELECTACCOUNT'}, baseStatus)
        ];

        $scope.status = statuses[0];
    }

    $scope.accountDetails = tcbTransferFactory.getAccountDetails().filter(filterForeignAccount);

    if (tcbTransferFactory.transferType != "local") {
        $scope.accountDetails = $scope.accountDetails.filter(filterSalaryAccount);
    }

    $scope.transferDetails = tcbTransferFactory.getTransferDetails();

    $scope.selectedAccountDetail = function (acc) {

        console.log(acc);
        $scope.transferDetails.sourceAccountType = acc.accountType;
        $scope.transferDetails.sourceAccountNo = acc.accountNumber;
        $scope.transferDetails.sourceAccountBalance = acc.availableBalance;
        $scope.transferDetails.transactionLimit = acc.transactionLimit;
        $scope.transferDetails.paymentInstrumentId = acc.paymentInstrumentId;
        currentAccountIdx = acc.id;
        tcbTransferFactory.setTransferDetails($scope.transferDetails);
        $state.go('tcbindex');
    };

}]);