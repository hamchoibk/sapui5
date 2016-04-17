tcbmwApp.controller('instantTransferConfirmController',['$scope','$state', '$rootScope','instantTransferFactory',function($scope,$state,$rootScope,instantTransferFactory){
    console.log("instantTransferFactory.viaCardNumber == ", instantTransferFactory.viaCardNumber);
    if (instantTransferFactory.viaCardNumber && instantTransferFactory.viaCardNumber == true) {
        console.log("true");
        $scope.viaCardNumber = true;
    } else {
        console.log("false");
        $scope.viaCardNumber = false;
    }

    console.log("instantTransferFactory.txnInfo confirm == ", instantTransferFactory.txnInfo);

    $scope.txnInfo = instantTransferFactory.txnInfo;

    $scope.confirm = function(){
        $scope.loading = true;
        mc.preAuthorisationContinue(preAuthorisationContinueBack,instantTransferFactory.txnInfo.systemId);
    };

    function preAuthorisationContinueBack(r) {
        $scope.loading = false;
        $rootScope.safetyApply(function(){});
        if (r.Status.code == "0") {
            //Done, no OTP, move to last step
            var ft = {};
            if (r.UnstructuredData !== undefined) {
                //check if a FT exist
                ft.ft_key = r.UnstructuredData[0].Key;
                ft.ft_code = r.UnstructuredData[0].Value;
                instantTransferFactory.txnInfo.ftId =  ft.ft_code;
            }

            $state.go('instanttransfersuccess');
        } else if (r.Status.code == "2521") {
            //OTP page
            $state.go('instanttransferotp');
        } else {
            ErrorBox(r.Status);
            appstate = trans.TRAN_IDLE;
        }
    }

    if ( $state.current.name == 'instanttransferconfirm'){
        var baseStatus = {
            isBack: true,
            onBack: function() {
                if ($scope.viaCardNumber == true) {
                    $state.go('instanttransfertocardmain');
                } else {
                    $state.go('instanttransfertoaccountmain');
                }
                var newIndex = statuses.indexOf($scope.status) - 1;
                if (newIndex > -1) {
                    $scope.status = statuses[newIndex];
                    $scope.status.move = 'ltr';
                    $scope.navigationBarStatus = $scope.status;
                }
            },
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

        var title;
        if ($scope.viaCardNumber == true) {
            title = "NAVBAR_INSTANT_TRANSFER_TO_CARD_MAIN";
        } else {
            title = "NAVBAR_INSTANT_TRANSFER_TO_ACCOUNT_MAIN"
        }
        var statuses = [
            angular.extend({title: title}, baseStatus)
        ];

        $scope.status = statuses[0];
    }

}]);