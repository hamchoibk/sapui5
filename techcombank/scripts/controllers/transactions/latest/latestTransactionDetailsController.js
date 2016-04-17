'use strict';

tcbmwApp.controller('LatestTransactionDetailsController',['$scope','$state','$rootScope',function($scope,$state,$rootScope){
       if ( $state.current.name == 'latestttransactiondetails'){
            var baseStatus = {
                isClose:true,
                onAction: function() {
                    $state.go('latesttransactionssummary');

                    var newIndex = statuses.indexOf($scope.status) - 1;
                    if (newIndex > -1) {
                        $scope.status = statuses[newIndex];
                        $scope.status.move = 'ltr';
                        $scope.navigationBarStatus = $scope.status;
                    }
                }
            };

           var statuses = [
                           angular.extend({title: 'NAVBAR_TRANSACTIONS_LATEST_TRANSDETAILS'}, baseStatus)
                       ];

            $scope.status = statuses[0];
        }

        $scope.transaction={"id":1,"accountNumber":1234567777777,"accountType":"Savings", "destinationAccount":1234569999999,"type":"Transfer","socialorbank":"bank","cashOutType":"","name":"Moang Bao Tran Le","amount":"+200,000","date":"30/05/2014","link":"https://fsta.co/123456cool","channel":"googleplus","status":"Accepted","ref":545343434,"time":"09:25:40","debit":"5000","fee":3000,"Currency":"VND","benificiaryBank":"ABC","Remark":"___","mobile":98765432};
}]);