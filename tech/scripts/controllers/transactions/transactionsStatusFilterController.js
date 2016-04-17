'use strict';

tcbmwApp.controller('TransactionsStatusFilterController',['$scope','TransactionsFactory','$state','$rootScope',function ($scope,TransactionsFactory,$state,$rootScope) {

       if ( $state.current.name == 'transactionsstatusfilter'){
            var baseStatus = {
                isBack: true,
                onBack: function() {
                    $state.go('transactionsindex');
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
                angular.extend({title: 'NAVBAR_TRANSACTIONS_TRANSACTIONSSTATUSFILTER'}, baseStatus)
            ];

            $scope.status = statuses[0];

            $scope.accordion={
                open:true
            };
        }

        $scope.transactions=TransactionsFactory.findAll();
}]);