'use strict';
tcbmwApp.controller('ListOrderPaymentOtpController',['$scope','$state','$stateParams','$rootScope','AccountSelectorFactory', 'ListOrderPaymentFactory',function($scope,$state,$stateParams,$rootScope,AccountSelectorFactory,ListOrderPaymentFactory){
    if ( $state.current.name == 'listorderpaymentotp'){
        var baseStatus = {
            isClose:true,
            onAction: function() {

                AccountSelectorFactory.resetAccount();
                ListOrderPaymentFactory.reset();

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
            angular.extend({title: 'NAVBAR_TCB_OTP'}, baseStatus)
        ];

        $scope.status = statuses[0];
    }

    $scope.confirm = function(){
        $scope.loading = true;
        mc.authenticationContinue(authenticationContinueBack,ListOrderPaymentFactory.listOrderInfo.systemId,$scope.smsCode,$scope.pinCode);

    }



    function authenticationContinueBack(r) {

        $scope.loading = false;
        $rootScope.safetyApply(function(){});

        if (r.Status.code == "0") {
            if (r.UnstructuredData && r.UnstructuredData.length != 0) {
                if (getUnstructuredDataValue(r.UnstructuredData, "FtId") != null) {
                    ListOrderPaymentFactory.listOrderInfo.ftId = r.Transaction.systemId + " " + getUnstructuredDataValue(r.UnstructuredData, "FtId");
                } else {
                    ListOrderPaymentFactory.listOrderInfo.ftId = r.Transaction.systemId;
                }

                ListOrderPaymentFactory.listOrderInfo.txnNote = getUnstructuredDataValue(r.UnstructuredData,"PaymentResultMessage");
                ListOrderPaymentFactory.listOrderInfo.merchantErrorCode = getUnstructuredDataValue(r.UnstructuredData,"PaymenResultCode");

            } else {
                ListOrderPaymentFactory.listOrderInfo.ftId = r.Transaction.systemId;
            }
            $state.go("listorderpaymentsuccess");
        } else {
            appstate = trans.TRAN_IDLE;
            ErrorBox(r.Status);
        }
    }

}]);