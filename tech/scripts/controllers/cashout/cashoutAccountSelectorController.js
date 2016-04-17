'use strict';
tcbmwApp.controller('CashoutAccountSelectorController', ['$scope', '$state', '$rootScope', 'AccountFactory', 'AccountSelectorFactory', '_', function ($scope, $state, $rootScope, AccountFactory, AccountSelectorFactory, _) {
    if ($state.current.name == 'cashoutaccountselector') {
        var baseStatus = {
            isBack: true,
            onBack: function () {
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
            angular.extend({title: 'NAVBAR_CASHOUT_ACCOUNT_SELECTOR'}, baseStatus)
        ];

        $scope.status = statuses[0];
    }


    var accounts = getAccountDetails().filter(filterSalaryAccount).filter(filterForeignAccount);
    var groupedAccounts = _.groupBy(accounts, function (account) {
        return account.accountType
    });
    var accountTypes = _.uniq(_.pluck(accounts, 'accountType'));

    var finalAccounts = [];

    for (var i = 0; i < accountTypes.length; i++) {
        var account = {
            accountType: '',
            accounts: []
        };

        account.accountType = accountTypes[i];
        account.accounts = groupedAccounts[accountTypes[i]];

        finalAccounts.push(account);
    }

    $scope.groupedAccounts = finalAccounts;

    $scope.selectAccount = function (account) {
        AccountSelectorFactory.setAccount(account);
        $state.go($rootScope.previousState.name, $rootScope.previousState.params);
    }

}]);