tcbmwApp.controller('instantTransferOtpController',['$scope','$state','instantTransferFactory','$rootScope',function($scope,$state,instantTransferFactory,$rootScope){

    if ( $state.current.name == 'instanttransferotp'){
        var baseStatus = {
            isClose:true,
            onAction: function() {
                instantTransferFactory.resetTxnInfo();
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

    $scope.confirmButtonClicked = function(){
        $scope.loading = true;
        mc.authenticationContinue(authContinueBack, instantTransferFactory.txnInfo.systemId, $scope.smsCode, $scope.pinCode);
    }

    function authContinueBack(r) {
        $scope.loading = false;
        $rootScope.safetyApply(function(){});

        if (r.Status.code == "0") {
            if (r.UnstructuredData && r.UnstructuredData.length != 0) {
                if (getUnstructuredDataValue(r.UnstructuredData, "FtId") != null) {
                    instantTransferFactory.txnInfo.ftId = r.Transaction.systemId + " " + getUnstructuredDataValue(r.UnstructuredData, "FtId");
                } else {
                    instantTransferFactory.txnInfo.ftId = r.Transaction.systemId;
                }
                instantTransferFactory.txnInfo.transferAmount = getUnstructuredDataValue(r.UnstructuredData, "PaymentAmount");
            } else {
                instantTransferFactory.txnInfo.ftId = r.Transaction.systemId;
            }
            $state.go("instanttransfersuccess");
        } else {
            appstate = trans.TRAN_IDLE;
            ErrorBox(r.Status);
        }
    }

}]);
