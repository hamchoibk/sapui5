'use strict';
tcbmwApp.controller('BillPaymentOtpController',['$scope','$state','$stateParams','$rootScope','AccountSelectorFactory','BillPaymentFactory',function($scope,$state,$stateParams,$rootScope,AccountSelectorFactory,BillPaymentFactory){
    if ( $state.current.name == 'billpaymentotp'){
        var baseStatus = {
            isClose:true,
            onAction: function() {

                AccountSelectorFactory.resetAccount();
                BillPaymentFactory.reset();

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
        mc.authenticationContinue(callback,BillPaymentFactory.billInfo.systemId,$scope.smsCode,$scope.pinCode);

    }

    function callback(r) {

        $scope.loading = false;
        $rootScope.safetyApply(function(){});

        if (r.Status.code == "0") {
            if (r.UnstructuredData && r.UnstructuredData.length != 0) {
                if (getUnstructuredDataValue(r.UnstructuredData, "FtId") != null) {
                    BillPaymentFactory.billInfo.ftId = r.Transaction.systemId + " " + getUnstructuredDataValue(r.UnstructuredData, "FtId");
                } else {
                    BillPaymentFactory.billInfo.ftId = r.Transaction.systemId;
                }

                BillPaymentFactory.billInfo.paymentAmount = getUnstructuredDataValue(r.UnstructuredData, "PaymentAmount");

                BillPaymentFactory.billInfo.txnNote = getUnstructuredDataValue(r.UnstructuredData,"PaymentResultMessage");
                BillPaymentFactory.billInfo.merchantErrorCode = getUnstructuredDataValue(r.UnstructuredData,"PaymenResultCode");

            } else {
                BillPaymentFactory.billInfo.ftId = r.Transaction.systemId;
            }
            $state.go("billpaymentsuccess");
        } else {
            appstate = trans.TRAN_IDLE;
            ErrorBox(r.Status);
        }
    }

}]);