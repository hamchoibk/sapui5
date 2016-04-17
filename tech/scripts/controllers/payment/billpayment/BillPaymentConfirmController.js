'use strict';
tcbmwApp.controller('BillPaymentConfirmController',['$scope','$state','$rootScope','AccountSelectorFactory','BillPaymentFactory','GameFactory',function($scope,$state,$rootScope,AccountSelectorFactory,BillPaymentFactory,GameFactory){
    if ( $state.current.name == 'billpaymentconfirm'){
        var baseStatus = {
            isBack:true,
            onBack: function() {
                $state.go('billpaymentmain');

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
                BillPaymentFactory.reset();
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
        var paymentName = BillPaymentFactory.billInfo.paymentName.split("~");
        var tempTitle = paymentName[0].split("|");
        var tempLable1 = paymentName[1].split("|");
        var tempLable2 = paymentName[2].split("|");
        var tempLable3 = paymentName[3].split("|");
        var tempLable4 = paymentName[4].split("|");
        var tempLable5 = paymentName[5].split("|");
        title = ($rootScope.languageCode == false) ? tempTitle[0]  : tempTitle[1];
        $scope.lable1 = ($rootScope.languageCode == false) ? tempLable1[0]  : tempLable1[1];
        $scope.lable2 = ($rootScope.languageCode == false) ? tempLable2[0]  : tempLable2[1];
        $scope.lable3 = ($rootScope.languageCode == false) ? tempLable3[0]  : tempLable3[1];
        $scope.lable4 = ($rootScope.languageCode == false) ? tempLable4[0]  : tempLable4[1];
        $scope.lable5 = ($rootScope.languageCode == false) ? tempLable5[0]  : tempLable5[1];


        var statuses = [
            angular.extend({title: title}, baseStatus)
        ];

        $scope.status = statuses[0];
    }

    $scope.sourceAccount = BillPaymentFactory.billInfo.sourceAccount;
    $scope.iconUrl = BillPaymentFactory.billInfo.iconUrl;
    $scope.billPaymentName = BillPaymentFactory.billInfo.name;
    $scope.parsedAmount = BillPaymentFactory.billInfo.parsedAmount;
    $scope.contractCode = BillPaymentFactory.billInfo.contractCode;
    $scope.customerName = BillPaymentFactory.billInfo.customerName;
    $scope.customerAddress = BillPaymentFactory.billInfo.customerAddress;
    $scope.billPaymentDate = BillPaymentFactory.billInfo.paymentDate;
    $scope.showCustomerName = BillPaymentFactory.billInfo.showCustomerName;
    $scope.showCustomerAddress = BillPaymentFactory.billInfo.showCustomerAddress;
    $scope.showPaymentDate = BillPaymentFactory.billInfo.showPaymentDate;

    $scope.currencyCode = "VND";



    $scope.confirm = function(){
        $scope.loading = true;
        mc.preAuthorisationContinue(callback,BillPaymentFactory.billInfo.systemId);
    };

    function callback(r) {
        $scope.loading = false;
        $rootScope.safetyApply(function(){});
        if (r.Status.code == "0") {
            //Done, no OTP, move to last step
            var ft = {};
            if (r.UnstructuredData !== undefined) {
                //check if a FT exist
                ft.ft_key = r.UnstructuredData[0].Key;
                ft.ft_code = r.UnstructuredData[0].Value;
                BillPaymentFactory.billInfo.ftId = ft.ft_code;
            }
            $state.go('billpaymentsuccess');
        } else if (r.Status.code == "2521") {
            //OTP page
            $state.go('billpaymentotp');
        } else {
            ErrorBox(r.Status);
            appstate = trans.TRAN_IDLE;
        }
    }

}]);