'use strict';

tcbmwApp.controller('CashoutIDSuccessController',['$scope','$state','AccountSelectorFactory','AccountCashoutIDParticularsFactory', '$rootScope',function($scope,$state,AccountSelectorFactory,AccountCashoutIDParticularsFactory,$rootScope){
    $scope.forOwner = session.forOwner;
        if ( $state.current.name == 'cashoutidsuccess'){
             var baseStatus = {
                  isClose:true,
                  onAction: function() {
                       session.forOwner = false;
                       AccountSelectorFactory.resetAccount();
                       AccountCashoutIDParticularsFactory.resetParticulars();
                       AccountCashoutIDParticularsFactory.resetTransactionReference();
                       AccountCashoutIDParticularsFactory.resetSource();

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
                  angular.extend({title: 'NAVBAR_CASHOUT_IDSUCCESS'}, baseStatus)
             ];

             $scope.status = statuses[0];
        }
        session.cachedSocialTrasactions = false;
        $scope.done=function(){
             session.forOwner = false;
             AccountSelectorFactory.resetAccount();
             AccountCashoutIDParticularsFactory.resetParticulars();
             AccountCashoutIDParticularsFactory.resetTransactionReference();
             AccountCashoutIDParticularsFactory.resetSource();

             $state.go('dashboard.home');
        }

        $scope.transactMore=function(){
             var prevState=AccountCashoutIDParticularsFactory.getSource();
             //session.forOwner = false;
             AccountSelectorFactory.resetAccount();
             AccountCashoutIDParticularsFactory.resetParticulars();
             AccountCashoutIDParticularsFactory.resetTransactionReference();
             AccountCashoutIDParticularsFactory.resetSource();

//             $state.go(prevState);
            $state.go("cashoutid");
        }

        $scope.particulars=AccountCashoutIDParticularsFactory.getParticulars();

        console.log("$scope.particulars",$scope.particulars);

        $scope.transactionRef=AccountCashoutIDParticularsFactory.getTransactionReference();

        mc.getWallets(walletBack, session.customer.id, 0); 
        function walletBack(data) {
            if (data.Status.code == "0") {
                if (data.walletEntries.length) {
                    session.accounts = data.walletEntries;
                    for(var idx in session.accounts) {
                        if (session.accounts[idx].sva) {
                            session.accounts[idx].msisdn = session.msisdn;
                        }
                    }
                }
            }
        }
}]);