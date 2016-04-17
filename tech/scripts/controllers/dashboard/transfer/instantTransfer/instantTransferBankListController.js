tcbmwApp.controller('instantTransferBankListController',['$scope','$state','$filter','instantTransferFactory','$rootScope',function($scope,$state,$filter,instantTransferFactory,$rootScope){
    if($rootScope.suppressDialog === true){
        $rootScope.suppressDialog = false;
    }

    if ( $state.current.name == 'instanttransferbanklist'){
        var baseStatus = {
            isBack: true,
            onBack: function() {
                $state.go('instanttransfertoaccountmain');
                var newIndex = statuses.indexOf($scope.status) - 1;
                if (newIndex > -1) {
                    $scope.status = statuses[newIndex];
                    $scope.status.move = 'ltr';
                    $scope.navigationBarStatus = $scope.status;
                }
            }
        };

        var statuses = [
            angular.extend({title: 'NAVBAR_TCB_BANK_LIST'}, baseStatus)
        ];
        $scope.status = statuses[0];
    }

    $scope.loading = true;
    mc.getBankList247(getBankList247Bank);

    function getBankList247Bank(r) {
        if (r.Status.code == "0") {
            var banks = [];
            banks = angular.extend([], r.BankList);
            $scope.banks = banks;
            $scope.loading = false;
            $rootScope.safetyApply(function(){});
        } else {
            $scope.loading = false;
            $rootScope.safetyApply(function(){});
            ErrorBox(r.Status);
        }
    }

    $scope.selectBank = function(bank) {
        instantTransferFactory.txnInfo.payeeBankName = bank.BankName;
        instantTransferFactory.txnInfo.payeeBankId = bank.BankID;
        instantTransferFactory.txnInfo.payeeBankCode = bank.Code;
        $state.go('instanttransfertoaccountmain')
    }

}]);

