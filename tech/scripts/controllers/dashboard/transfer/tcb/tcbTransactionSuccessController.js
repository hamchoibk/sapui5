tcbmwApp.controller('TCBTranscationSuccessController', ['$scope', '$state', 'tcbTransferFactory','$rootScope', function ($scope, $state, tcbTransferFactory,$rootScope) {
    if ($state.current.name == 'tcbtransactionsuccess') {
        var baseStatus = {
            isBack: false,
            onBack: function () {
                tcbTransferFactory.resetTransferDetails();
                $state.go('dashboard.transferhome');
                var newIndex = statuses.indexOf($scope.status) - 1;
                if (newIndex > -1) {
                    $scope.status = statuses[newIndex];
                    $scope.status.move = 'ltr';
                    $scope.navigationBarStatus = $scope.status;
                }
            },
            isClose: false,
            onAction: function () {
                tcbTransferFactory.resetTransferDetails();
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

    $scope.transferDetails = tcbTransferFactory.getTransferDetails();
    var profileImage = angular.element("#profileImage");
    profileImage.css("background-image", "images/profile-placeholder.png");
    $scope.currencyCode = 'VND';
    $scope.transferDetails.amount = parseInt($scope.transferDetails.amount);
    $scope.totalamount = $scope.transferDetails.amount + parseInt($scope.transferDetails.transferFee);

//        console.log("$scope.transferDetails", $scope.transferDetails);
    $scope.transactionReference = tcbTransferFactory.getTransactionReference();
    $scope.clickTransactMore = function () {
        tcbTransferFactory.resetTransferDetails();
        $state.go('tcbindex');
    }

    $scope.clickHome = function () {
        tcbTransferFactory.resetTransferDetails();
        $state.go('dashboard.home');
    }

    console.log("TCBTranscationSuccessController -- currentAccountIdx == ", currentAccountIdx);
    updateBalance();
}]);