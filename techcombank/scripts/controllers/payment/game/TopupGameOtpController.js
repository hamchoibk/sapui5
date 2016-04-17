'use strict';
tcbmwApp.controller('TopUpGameOtpController',['$scope','$state','$stateParams','$rootScope','AccountSelectorFactory','GameFactory',function($scope,$state,$stateParams,$rootScope,AccountSelectorFactory,GameFactory){
    if ( $state.current.name == 'topupgameotp'){
        var baseStatus = {
            isClose:true,
            onAction: function() {

                AccountSelectorFactory.resetAccount();
                GameFactory.reset();

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
        mc.authenticationContinue(callback,GameFactory.topupGame.systemId,$scope.smsCode,$scope.pinCode);
    }

    function callback(r) {

        $scope.loading = false;
        $rootScope.safetyApply(function(){});

        if (r.Status.code == "0") {
            if (r.UnstructuredData && r.UnstructuredData.length != 0) {
                if (getUnstructuredDataValue(r.UnstructuredData, "FtId") != null) {
                    GameFactory.topupGame.ftId = r.Transaction.systemId + " " + getUnstructuredDataValue(r.UnstructuredData, "FtId");
                } else {
                    GameFactory.topupGame.ftId = r.Transaction.systemId;
                }

                GameFactory.topupGame.paymentAmount = getUnstructuredDataValue(r.UnstructuredData, "PaymentAmount");

                GameFactory.topupGame.txnNote = getUnstructuredDataValue(r.UnstructuredData,"PaymentResultMessage");
                GameFactory.topupGame.merchantErrorCode = getUnstructuredDataValue(r.UnstructuredData,"PaymenResultCode");

            } else {
                GameFactory.topupGame.ftId = r.Transaction.systemId;
            }
            $state.go("topupgamesuccess");
        } else {
            appstate = trans.TRAN_IDLE;
            ErrorBox(r.Status);
        }
    }

}]);