tcbmwApp.controller('instantTransferBenListController', ['$scope', '$state', '$filter', 'instantTransferFactory', '$rootScope', function ($scope, $state, $filter, instantTransferFactory, $rootScope) {
    if ($rootScope.suppressDialog === true) {
        $rootScope.suppressDialog = false;
    }

    if ($state.current.name == 'instanttransferbenlist') {
        var baseStatus = {
            isBack: true,
            onBack: function () {
                instantTransferFactory.ben = undefined;
                $state.go($rootScope.previousState.name);
                var newIndex = statuses.indexOf($scope.status) - 1;
                if (newIndex > -1) {
                    $scope.status = statuses[newIndex];
                    $scope.status.move = 'ltr';
                    $scope.navigationBarStatus = $scope.status;
                }
            }
        };

        var statuses = [
            angular.extend({title: 'NAVBAR_TCB_BENIFICIARYLIST'}, baseStatus)
        ];

        $scope.status = statuses[0];
    }
    $scope.loading = true;
    if (instantTransferFactory.viaCardNumber && instantTransferFactory.viaCardNumber == true) {
        $scope.viaCardNumber = true;
    } else {
        $scope.viaCardNumber = false;
    }

    var bens = [];
    $scope.loading = true;

    if ($scope.viaCardNumber == true) {
        mc.getBeneficiaries(getBeneficiariesBack, TYPE_BEN_CARD_247);
    } else {
        mc.getBeneficiaries(getBeneficiariesBack, TYPE_BEN_ACCOUNT_247);
    }

    function getBeneficiariesBack(r) {
        if (r.Status.code == "0") {
            if (r.benList && r.benList.length != 0) {
                bens = angular.extend([], r.benList);
            }
            $scope.bens = bens;
            $scope.loading = false;
            $rootScope.safetyApply(function(){});
        } else {
            $rootScope.safetyApply(function(){});
            $scope.loading = false;
            ErrorBox(r.Status);
        }
    };

    $scope.selectBeneficiary = function (ben) {
        console.log("selected ben == ", ben);
        instantTransferFactory.ben = angular.extend({}, ben);
        $state.go($rootScope.previousState.name);
    }

    $scope.changeAccountNumber = function() {
        //console.log("search text == ", $scope.search);
    }
}]);

