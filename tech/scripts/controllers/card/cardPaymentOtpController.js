'use strict';
tcbmwApp.controller('CardPaymentOtpController',['$scope','$state','$stateParams','$rootScope','AccountSelectorFactory','CardFactory',function($scope,$state,$stateParams,$rootScope,AccountSelectorFactory,CardFactory){
    if ( $state.current.name == 'cardpaymentotp'){
        var baseStatus = {
            isClose:true,
            onAction: function() {

                AccountSelectorFactory.resetAccount();
                CardFactory.reset();

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
        mc.authenticationContinue(callback,CardFactory.cardInfo.systemId,$scope.smsCode,$scope.pinCode);
    }

    function callback(r) {

        $scope.loading = false;
        $rootScope.safetyApply(function(){});

        if (r.Status.code == "0") {
            if (r.UnstructuredData && r.UnstructuredData.length != 0) {
                CardFactory.cardInfo.ftId = r.Transaction.systemId + " " + getUnstructuredDataValue(r.UnstructuredData, "FtId");
                CardFactory.cardInfo.paymentAmount = getUnstructuredDataValue(r.UnstructuredData, "PaymentAmount");

                CardFactory.cardInfo.txnNote = getUnstructuredDataValue(r.UnstructuredData,"PaymentResultMessage");
                CardFactory.cardInfo.merchantErrorCode = getUnstructuredDataValue(r.UnstructuredData,"PaymenResultCode");

            } else {
                CardFactory.cardInfo.ftId = r.Transaction.systemId;
            }
            $state.go("cardpaymentsuccess");
        } else {
            appstate = trans.TRAN_IDLE;
            ErrorBox(r.Status);
        }
    }


}]);