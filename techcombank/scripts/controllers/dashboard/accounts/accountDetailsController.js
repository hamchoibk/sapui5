'use strict';

tcbmwApp.controller('AccountDetailsController',['$scope','$rootScope','AccountFactory','$state','$stateParams','$filter',function ($scope,$rootScope,AccountFactory,$state,$stateParams,$filter) {

    $scope.account= getAccountDetailsByIndex(currentAccountIdx);
    if ( $state.current.name == 'accountDetails'){
        var baseStatus = {
            isBack: true,
            onBack: function() {
                $state.go('accounts');
                var newIndex = statuses.indexOf($scope.status) - 1;
                if (newIndex > -1) {
                    $scope.status = statuses[newIndex];
                    $scope.status.move = 'ltr';
                    $scope.navigationBarStatus = $scope.status;
                }
            },
            isClose:true,
            onAction: function() {
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
            angular.extend({title: $scope.account.accountName}, baseStatus)
        ];

        $scope.status = statuses[0];
    }



    $scope.clickUnBank = function(){

    };

    $scope.clickSendMoney = function(){
        $state.go('sendMoney');
    };

    $scope.clickBankTransfer = function(){
        $state.go('dashboard/transfer');
    };

    $scope.clickTransactions = function(){
        $state.go('accountlatesttransactions');
    };


}]);