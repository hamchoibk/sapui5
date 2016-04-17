'use strict';

tcbmwApp.controller('CashoutMobileConfirmController',['$scope','$state','AccountSelectorFactory','AccountCashoutMobileParticularsFactory', '$rootScope',function($scope,$state,AccountSelectorFactory,AccountCashoutMobileParticularsFactory,$rootScope){
     $scope.forOwner = session.forOwner;
	 if ( $state.current.name == 'cashoutmobileconfirm'){
             var baseStatus = {
                  isBack: true,
                  onBack: function() {
                       $state.go('cashoutmobile');
                       var newIndex = statuses.indexOf($scope.status) - 1;
                       if (newIndex > -1) {
                            $scope.status = statuses[newIndex];
                            $scope.status.move = 'ltr';
                            $scope.navigationBarStatus = $scope.status;
                       }
                  },
                  isClose:true,
                  onAction: function() {
                       session.forOwner = false;
                       var prevState=AccountCashoutMobileParticularsFactory.getSource();

                       AccountSelectorFactory.resetAccount();
                       AccountCashoutMobileParticularsFactory.resetParticulars();
                       AccountCashoutMobileParticularsFactory.resetSource();

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
                  angular.extend({title: session.forOwner?'NAVBAR_CASHOUT_ATM':'NAVBAR_CASHOUT_MOBILECONFIRM'}, baseStatus)
             ];

             $scope.status = statuses[0];
        }

     $scope.particulars=AccountCashoutMobileParticularsFactory.getParticulars();

     $scope.cashoutAmount = parseInt($scope.particulars.amount).formatMoney(0);
     $scope.cashoutFee = parseInt($scope.particulars.fee).formatMoney(0);
     $scope.confirm=function(){
         $scope.loading = true;
         mc.preAuthorisationContinue(appLoadConfirmBack,session.transit_value.sysid);
         //$state.go('cashoutotp');
     }
     function appLoadConfirmBack(r) {
        $scope.loading = false;
         $rootScope.safetyApply(function(){});
            if (r.Status.code == "0") {
                //Done, no OTP, move to last step
                var ft = {};
                if (r.UnstructuredData !== undefined) {
                    //check if a FT exist
                    ft.ft_key = r.UnstructuredData[0].Key;
                    ft.ft_code = r.UnstructuredData[0].Value;
                    AccountCashoutMobileParticularsFactory.setTransactionReference(ft.ft_code);
                }

                $state.go('cashoutidsuccess');
            } else if (r.Status.code == "2521")
            {
                //OTP page
                $state.go('cashoutotp');
            } else {
                ErrorBox(r.Status);
                appstate = trans.TRAN_IDLE;
            }
        }
}]);