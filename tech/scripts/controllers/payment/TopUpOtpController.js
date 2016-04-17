'use strict';

tcbmwApp.controller('TopUpOtpController', ['$scope', '$state', '$stateParams', '$rootScope', 'AccountSelectorFactory', 'TopUpFactory', function ($scope, $state, $stateParams, $rootScope, AccountSelectorFactory, TopUpFactory) {
    if ($state.current.name == 'topupotp') {
        var baseStatus = {
            isClose: true,
            onAction: function () {

                AccountSelectorFactory.resetAccount();
                TopUpFactory.reset();

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

    $scope.confirm = function () {
        $scope.loading = true;
        mc.authenticationContinue(callback, TopUpFactory.topupInfo.systemId, $scope.smsCode, $scope.pinCode);
    }

    function callback(r) {

        $scope.loading = false;
        $rootScope.safetyApply(function(){});

        if (r.Status.code == "0") {
            if (r.UnstructuredData && r.UnstructuredData.length != 0) {
                console.log("r========", r);

                if (getUnstructuredDataValue(r.UnstructuredData, "FtId") != null) {
                    TopUpFactory.topupInfo.ftId = r.Transaction.systemId + " " + getUnstructuredDataValue(r.UnstructuredData, "FtId");
                } else {
                    TopUpFactory.topupInfo.ftId = r.Transaction.systemId;
                }

                TopUpFactory.topupInfo.paymentAmount = getUnstructuredDataValue(r.UnstructuredData, "PaymentAmount");

                if (TopUpFactory.isPrePaid) {
                    TopUpFactory.topupInfo.txnNote = getUnstructuredDataValue(r.UnstructuredData, "PaymentTopupMessage");
                    TopUpFactory.topupInfo.merchantErrorCode = getUnstructuredDataValue(r.UnstructuredData, "PaymentTopupCode");
                } else {
                    TopUpFactory.topupInfo.txnNote = getUnstructuredDataValue(r.UnstructuredData, "PaymentMobileBillMessage");
                    TopUpFactory.topupInfo.merchantErrorCode = getUnstructuredDataValue(r.UnstructuredData, "PaymentMobileBillCode");
                }
            } else {
                TopUpFactory.topupInfo.ftId = r.Transaction.systemId;
            }
            $state.go('topupsuccess');
        } else {
            appstate = trans.TRAN_IDLE;
            ErrorBox(r.Status);
        }
    }
}]);