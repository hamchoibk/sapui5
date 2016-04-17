tcbmwApp.controller('SelectRecentOrderController',['$scope','$state','$filter','GameFactory','BillPaymentFactory','$rootScope',function($scope,$state,$filter,GameFactory,BillPaymentFactory,$rootScope){
    if ( $state.current.name == 'selectrecentorder'){
        var baseStatus = {
            isBack: true,
            onBack: function() {
                BillPaymentFactory.billInfo.selectedFromList = false;
                $rootScope.suppressDialog = false;
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
            angular.extend({title: 'NAVBAR_TOPUP_GAME_BENIFICIARYLIST'}, baseStatus)
        ];

        $scope.status = statuses[0];
    }

    if (GameFactory.topupGame.paymentName) {
        var paymentName = GameFactory.topupGame.paymentName.split("~");
        var tempLableInfo = paymentName[2].split("|");
        $scope.lableInfo = ($rootScope.languageCode == false) ? "5 "+tempLableInfo[0]+" gần đây nhất"  : "Last 5 "+tempLableInfo[1]+"s";
        $scope.loading = true;
        mc.getCustomerOrders(getCustomerOrdersBack, GameFactory.topupGame.id, session.customer.id);
    } else if (BillPaymentFactory.billInfo.paymentName) {
        var paymentName = BillPaymentFactory.billInfo.paymentName.split("~");
        var tempLableInfo = paymentName[2].split("|");
        $scope.lableInfo = ($rootScope.languageCode == false) ? "5 "+tempLableInfo[0]+" gần đây nhất"  : "Last 5 "+tempLableInfo[1]+"s";
        $scope.loading = true;
        mc.getCustomerOrders(getCustomerOrdersBack, BillPaymentFactory.billInfo.id, session.customer.id);
    } else {
        $scope.lableInfo = 'BILL_PAYMENT_INFO';
    }

    function getCustomerOrdersBack(r) {
        if (r.Status.code == "0") {
            $scope.orders = r.orders;
            $scope.loading = false;
            $rootScope.safetyApply(function(){});
        } else {
            ErrorBox(r.Status);
        }
    };

    $scope.payeeSelected = function(data){
        $rootScope.suppressDialog = false;
        var selectedData = {};
        if ($rootScope.previousState.name == "billpaymentmain") {
            selectedData = angular.extend({}, BillPaymentFactory.billInfo);
        } else if ($rootScope.previousState.name == "topupgamescreen" || $rootScope.previousState.name == "topupgameenteramount") {
            selectedData = angular.extend({}, GameFactory.topupInfo);
        }
        selectedData.flowType = data.paymentType.flowType;
        selectedData.code = data.paymentType.code;
        selectedData.havingAmountList = data.paymentType.havingAmountList;
        selectedData.iconUrl = data.paymentType.iconUrl;
        selectedData.id = data.paymentType.id;
        var paymentName = data.paymentType.name.split("|");
        selectedData.name = ($rootScope.languageCode == false) ? paymentName[0]  : paymentName[1];
        selectedData.piType = data.paymentType.piType;
        selectedData.usecase = data.paymentType.usecase;
        selectedData.paymentName = data.paymentType.paymentName;
        selectedData.groupL1 = data.paymentType.groupL1;
        if (data.paymentType.spareFields.spareString2 != null) {
            selectedData.spareFields.spareString2 = data.paymentType.spareFields.spareString2;
        }
        if ($rootScope.previousState.name == "topupgamescreen" || $rootScope.previousState.name == "topupgameenteramountscreen") {
            GameFactory.topupGame = selectedData;
            GameFactory.topupGame.accountNumber = data.order;
            $state.go($rootScope.previousState.name);
        } else {
            BillPaymentFactory.billInfo = selectedData;
            BillPaymentFactory.billInfo.contractCode = data.order;
            BillPaymentFactory.billInfo.selectedFromList = true;
            $state.go($rootScope.previousState.name);
        }

    }

}]);

