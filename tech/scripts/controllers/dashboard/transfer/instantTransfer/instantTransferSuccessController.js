tcbmwApp.controller('instantTransferSuccessController', ['$scope', '$state', 'instantTransferFactory', '$rootScope', function ($scope, $state, instantTransferFactory,$rootScope) {
    if ($state.current.name == 'instanttransfersuccess') {
        var baseStatus = {
            isClose: false,
            onAction: function () {
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
            angular.extend({title: 'NAVBAR_TCB_SUCCESS'}, baseStatus)
        ];

        $scope.status = statuses[0];
    }

    console.log("instantTransferFactory.txnInfo == ", instantTransferFactory.txnInfo);

    $scope.txnInfo = instantTransferFactory.txnInfo;
    $scope.transferAmount = parseInt(instantTransferFactory.txnInfo.transferAmount).formatMoney(0);

    if (instantTransferFactory.viaCardNumber && instantTransferFactory.viaCardNumber == true) {
        $scope.viaCardNumber = true;
    } else {
        $scope.viaCardNumber = false;
    }

    console.log("$scope.txnInfo == ", $scope.txnInfo);

    var profileImage = angular.element("#profileImage");
    profileImage.attr("src", "images/profile-placeholder.png");


    $scope.clickTransactMore = function () {
        instantTransferFactory.resetTxnInfo();
        $state.go('dashboard.instanttransferindex');

    };

    $scope.clickHome = function () {
        instantTransferFactory.resetTxnInfo();
        $state.go('dashboard.home');
    };

    if(instantTransferFactory.willCreateBen) {
        var ben = {};
        if ($scope.viaCardNumber) {
            ben = {
                type:TYPE_BEN_CARD_247,
                benName:$scope.txnInfo.payeeName,
                accountNumber:$scope.txnInfo.cardNumber,
                branchLocation: $scope.txnInfo.payeeBankName,
                active:true
            };
        } else {
            ben = {
                type:TYPE_BEN_ACCOUNT_247,
                benName:$scope.txnInfo.payeeName,
                accountNumber:$scope.txnInfo.accountNumber,
                bankCode:$scope.txnInfo.payeeBankId,
                branchCode: $scope.txnInfo.payeeBankCode,
                branchLocation: $scope.txnInfo.payeeBankName,
                active:true
            };
        }

        mc.createBeneficiary(createBenBack,ben);
    }

    function createBenBack(r) {
        if(r.Status.code == "0") {
            console.log('successfully created ben');
        } else {
            console.log("create ben failed, error: " + r.Status.code);
        }
    }

    updateBalance();

}]);