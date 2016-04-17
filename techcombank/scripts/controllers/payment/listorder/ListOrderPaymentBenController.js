tcbmwApp.controller('ListOrderPaymentBenController',['$scope','$state','$filter','ListOrderPaymentFactory','$rootScope',function($scope,$state,$filter,ListOrderPaymentFactory,$rootScope){
    if ( $state.current.name == 'listorderpaymentben'){
        var baseStatus = {
            isBack: true,
            onBack: function() {
                ListOrderPaymentFactory.listOrderInfo.selectedFromList = false;
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

    var paymentName = ListOrderPaymentFactory.listOrderInfo.paymentName.split("~");
    var tempLableInfo = paymentName[2].split("|");
    $scope.lableInfo = ($rootScope.languageCode == false) ? "5 "+tempLableInfo[0]+" gần đây nhất"  : "Last 5 "+tempLableInfo[1]+"s";
    $scope.loading = true;
    mc.getCustomerOrders(getCustomerOrdersBack, ListOrderPaymentFactory.listOrderInfo.id, session.customer.id);

    function getCustomerOrdersBack(r) {
        $scope.loading = false;
        if (r.Status.code == "0") {
            $scope.listOrders = r.orders;
            $rootScope.safetyApply(function(){});
        } else {
            ErrorBox(r.Status);
        }
    };

    $scope.payeeSelected = function(data){
        $rootScope.suppressDialog = false;
        var selectedData = angular.extend({}, ListOrderPaymentFactory.listOrderInfo);
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
            selectedData.successMessage = data.paymentType.spareFields.spareString2;
        }

        ListOrderPaymentFactory.listOrderInfo = selectedData;
        ListOrderPaymentFactory.listOrderInfo.contractCode = data.order;
        ListOrderPaymentFactory.listOrderInfo.selectedFromList = true;
        $state.go($rootScope.previousState.name);

    }

}]);

