'use strict';
tcbmwApp.controller('askMoneyEWalletBeneficiaryListController',['$scope','$state','$filter','tcbTransferFactory','$rootScope',function($scope,$state,$filter,tcbTransferFactory,$rootScope){
    if ( $state.current.name == 'askMoneyEWalletBeneficiary'){
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
            isAdd:true,
            onAdd: function() {
                //MessageBox('clicked');

                var newIndex = statuses.indexOf($scope.status) - 1;
                if (newIndex > -1) {
                    $scope.status = statuses[newIndex];
                    $scope.status.move = 'ltr';
                    $scope.navigationBarStatus = $scope.status;
                }
            }
        };

        var statuses = [
            angular.extend({title: 'NAVBAR_ASKMONEY_EWALLET_BENEFICIARY'}, baseStatus)
        ];

        $scope.status = statuses[0];
    }

    $scope.beneficiaryListWalletAccount = tcbTransferFactory.getBeneficiaryListWalletAccount();
    var beneficiaryListWalletAccountInitialCount =  $scope.beneficiaryListWalletAccount.length;

    $scope.payeeSelected = function(data){
        $scope.transferDetails = tcbTransferFactory.getTransferDetails();
        var destinationAccountDetails = [];
        destinationAccountDetails.payeeName = data.name;
        destinationAccountDetails.payeeAccountType = data.type;
        destinationAccountDetails.payeeAccountNumber = data.accountNumber;
        destinationAccountDetails.payeeImage = data.image;

        tcbTransferFactory.setTransferDetails($scope.transferDetails);

        console.log(tcbTransferFactory.getTransferDetails());
        $state.go('askMoneyEwalletMain');
    }
}]);