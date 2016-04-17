'use strict';

tcbmwApp.controller('CashoutOTPController',['$scope','$state','$stateParams','$rootScope','cashoutInfo','AccountCashoutIDParticularsFactory','AccountCashoutMobileParticularsFactory','AccountSelectorFactory',function($scope,$state,$stateParams,$rootScope,cashoutInfo,AccountCashoutIDParticularsFactory,AccountCashoutMobileParticularsFactory,AccountSelectorFactory){
    if ( $state.current.name == 'cashoutotp'){
        var baseStatus = {
//            isBack:true,
//            onBack: function() {
//                AccountSelectorFactory.resetAccount();
//
//                if($rootScope.previousState.name == 'cashoutidconfirm'){
//                    AccountCashoutIDParticularsFactory.resetParticulars();
//                    AccountCashoutIDParticularsFactory.resetSource();
//                    $state.go('cashoutid');
//                }
//                else if($rootScope.previousState.name == 'cashoutmobileconfirm'){
//                    AccountCashoutMobileParticularsFactory.resetParticulars();
//                    AccountCashoutMobileParticularsFactory.resetSource();
//                    $state.go('cashoutmobile');
//                }
//
//                var newIndex = statuses.indexOf($scope.status) - 1;
//                if (newIndex > -1) {
//                   $scope.status = statuses[newIndex];
//                   $scope.status.move = 'ltr';
//                   $scope.navigationBarStatus = $scope.status;
//                }
//            },
            isClose:true,
            onAction: function() {
                session.forOwner = false;
                AccountSelectorFactory.resetAccount();
                if($rootScope.previousState.name == 'cashoutidconfirm'){
                    AccountCashoutIDParticularsFactory.resetParticulars();
                    AccountCashoutIDParticularsFactory.resetSource();
                }
                else if($rootScope.previousState.name == 'cashoutmobileconfirm'){
                    AccountCashoutMobileParticularsFactory.resetParticulars();
                    AccountCashoutMobileParticularsFactory.resetSource();
                }

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
        angular.extend({title: 'NAVBAR_CASHOUT_OTP'}, baseStatus)
        ];

        $scope.status = statuses[0];
    }

    function otpBack(r) {

        $scope.loading = false;
        $rootScope.safetyApply(function(){});

        if (r.Status.code == "0") {
            var ft = {
                ft_key:'',
                ft_code:''
            };

            if (r.UnstructuredData) {
                //check if a FT exist
                if (r.UnstructuredData.length == 1) {
                    ft.ft_key = r.UnstructuredData[0].Key;
                    ft.ft_code = r.UnstructuredData[0].Value;
                }
            }

            var previousState=$rootScope.previousState.name;

            if(previousState=='cashoutmobileconfirm'){
                AccountCashoutMobileParticularsFactory.setTransactionReference(ft.ft_code);
                $state.go('cashoutmobilesuccess');
            }
            else{
                AccountCashoutIDParticularsFactory.setTransactionReference(ft.ft_code);
                $state.go('cashoutidsuccess');
            }
        } else {
            appstate = trans.TRAN_IDLE;
            ErrorBox(r.Status);
        }
    }

    $scope.confirm=function(){
        $scope.loading = true;
        mc.authenticationContinue(otpBack,session.transit_value.sysid,$scope.smsCode,$scope.pinCode);
        /*var previousState=$rootScope.previousState.name;

        if(previousState=='cashoutmobileconfirm'){
            AccountCashoutMobileParticularsFactory.setTransactionReference('FT374924924723');
            $state.go('cashoutmobilesuccess');
        }
        else{
            AccountCashoutIDParticularsFactory.setTransactionReference('FT374924924723');
            $state.go('cashoutidsuccess');
        }*/
    }
}]);