'use strict';

tcbmwApp.controller('AccountTransactionSummaryController',['$scope','$state','$stateParams', '$rootScope',function ($scope,$state,$stateParams,$rootScope) {

    if ( $state.current.name == 'accounttransactionsummary'){
            var baseStatus = {
                isBack: true,
                onBack: function() {
                    $state.go('dashboard.accounts');
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
                angular.extend({title: 'NAVBAR_ACCOUNT_TRANSACTIONSUMMARY'}, baseStatus)
            ];

            $scope.status = statuses[0];
        }


        $scope.transactions=[];


}]);