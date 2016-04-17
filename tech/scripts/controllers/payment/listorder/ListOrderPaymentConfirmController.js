'use strict';
tcbmwApp.controller('ListOrderPaymentConfirmController',['$scope','$state','$rootScope','AccountSelectorFactory', 'ListOrderPaymentFactory',function($scope,$state,$rootScope,AccountSelectorFactory,ListOrderPaymentFactory){
    if ( $state.current.name == 'listorderpaymentconfirm'){
        var baseStatus = {
            isBack:true,
            onBack: function() {
                $state.go('listorderpaymentmain');
                var newIndex = statuses.indexOf($scope.status) - 1;
                if (newIndex > -1) {
                    $scope.status = statuses[newIndex];
                    $scope.status.move = 'ltr';
                    $scope.navigationBarStatus = $scope.status;
                }
            },
            isClose:true,
            onAction: function() {
                AccountSelectorFactory.resetAccount();
                ListOrderPaymentFactory.reset();
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
        var paymentName = ListOrderPaymentFactory.listOrderInfo.paymentName.split("~");
        var tempTitle = paymentName[0].split("|");
        var tempLable1 = paymentName[1].split("|");
        var tempLable2 = paymentName[2].split("|");
        title = ($rootScope.languageCode == false) ? tempTitle[0]  : tempTitle[1];
        $scope.lable1 = ($rootScope.languageCode == false) ? tempLable1[0]  : tempLable1[1];
        $scope.lable2 = ($rootScope.languageCode == false) ? tempLable2[0]  : tempLable2[1];

        var statuses = [
            angular.extend({title: title}, baseStatus)
        ];

        $scope.status = statuses[0];
    }

    $scope.sourceAccount = ListOrderPaymentFactory.listOrderInfo.sourceAccount;
    $scope.iconUrl = ListOrderPaymentFactory.listOrderInfo.iconUrl;
    $scope.billPaymentName = ListOrderPaymentFactory.listOrderInfo.name;
    $scope.parsedAmount = ListOrderPaymentFactory.listOrderInfo.parsedAmount;
    $scope.contractCode = ListOrderPaymentFactory.listOrderInfo.contractCode;
    $scope.fromDate = ListOrderPaymentFactory.listOrderInfo.fromDate;
    $scope.toDate = ListOrderPaymentFactory.listOrderInfo.toDate;
    $scope.haveNoOrderInfo = ListOrderPaymentFactory.listOrderInfo.haveNoOrderInfo;
    $scope.customerName = ListOrderPaymentFactory.listOrderInfo.customerName;

    $scope.currencyCode = "VND";



    $scope.confirm = function(){
        $scope.loading = true;
        mc.preAuthorisationContinue(preAuthorisationContinueBack,ListOrderPaymentFactory.listOrderInfo.systemId);
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
                ListOrderPaymentFactory.listOrderInfo.ftId = ft.ft_code;
            }
            $state.go('listorderpaymentsuccess');
        } else if (r.Status.code == "2521") {
            //OTP page
            $state.go('listorderpaymentotp');
        } else {
            appstate = trans.TRAN_IDLE;
            ErrorBox(r.Status);
        }
    }

}]);