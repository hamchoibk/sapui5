'use strict';
tcbmwApp.controller('PendingTransactionDetailsController',['$scope','$state','$rootScope','TransactionsFactory',function ($scope,$state,$rootScope,TransactionsFactory) {
              if ( $state.current.name == 'pendingtransactiondetails'){
                  var baseStatus = {
                      isClose:true,
                      onAction: function() {
                          TransactionsFactory.resetTransaction();
                          $state.go('pendingtransactions');

                          var newIndex = statuses.indexOf($scope.status) - 1;
                          if (newIndex > -1) {
                              $scope.status = statuses[newIndex];
                              $scope.status.move = 'ltr';
                              $scope.navigationBarStatus = $scope.status;
                          }
                      }
                  };

                  var statuses = [
                      angular.extend({title: 'NAVBAR_TRANSACTIONS_PENDING_TRANSDETAILS'}, baseStatus)
                  ];

                  $scope.status = statuses[0];
              }

              $scope.transaction=TransactionsFactory.getTransaction();

}]);