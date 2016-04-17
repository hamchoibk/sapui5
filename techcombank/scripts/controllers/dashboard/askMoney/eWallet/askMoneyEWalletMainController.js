'use strict';
tcbmwApp.controller('askMoneyEWalletMainController',['$rootScope','$scope','$state','tcbTransferFactory',function($rootScope,$scope,$state,tcbTransferFactory){
    if ( $state.current.name == 'askMoneyEwalletMain'){
        var baseStatus = {
            isBack: true,
            onBack: function() {
                session.requestMoneyInfo = null;
                $state.go('dashboard.askMoney');
                var newIndex = statuses.indexOf($scope.status) - 1;
                if (newIndex > -1) {
                    $scope.status = statuses[newIndex];
                    $scope.status.move = 'ltr';
                    $scope.navigationBarStatus = $scope.status;
                }
            },
            isClose:true,
            onAction: function() {
                session.requestMoneyInfo = null;
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
            angular.extend({title: 'NAVBAR_ASKMONEY_EWALLET_MAIN'}, baseStatus)
        ];

        $scope.status = statuses[0];
    }

    $('input#amount').focus(function() {
        $(this).prop('type', 'text').val($scope.transferDetails.amount);
    }).blur(function() {
        var self = $(this);
        var value = self.val();
        $scope.transferDetails.amount=value;

        $scope.transferDetails.parsedAmount='';

        if(value) {
            var intValue = parseInt(value);
            if (intValue <50000)
                MessageBox("ASK_MONEY_VIA_EWALLET_VALIDATE_AMOUNT");

            $scope.transferDetails.parsedAmount = parseInt(value).formatMoney(0);
        }

        self.data('number', value).prop('type', 'text').val($scope.transferDetails.parsedAmount);
    });

    $scope.transferDetails = session.requestMoneyInfo;

    if ( $scope.transferDetails){
        if ( $scope.transferDetails.payerName){
            $scope.isFormFilled = true;
        }else{
            $scope.isFormFilled = false;
        }
    }

    if ($rootScope.previousState.name == 'tcbbeneficiarylist') {
        //
        if(session.selectedBen){
            if ($scope.transferDetails)
                $scope.transferDetails.payerMobileNumber = session.selectedBen;
            else
                $scope.transferDetails = {payerMobileNumber:session.selectedBen};
            var acc = lookupBenAccount($scope.transferDetails.payerMobileNumber);
            if (acc && acc.type == "COMMON_SVA_ACCOUNT")
                $scope.transferDetails.payerName = acc.name;
            session.selectedBen = null;
        }
    }
    //console.log($scope.transferDetails);

    $scope.clickBenficiaryList = function(){
        session.requestMoneyInfo = $scope.transferDetails;
        $state.go('askMoneyEWalletBeneficiary');
    };

    $scope.clickSend = function(){
        session.requestMoneyInfo = $scope.transferDetails;
        $state.go('askMoneyEWalletConfirm');
    }
    $scope.getWalletUser = function() {
        var acc = lookupBenAccount( formatE164("vn", $scope.transferDetails.payerMobileNumber));
        if (acc != null) {
            if (acc.type != "COMMON_SVA_ACCOUNT") {
                $scope.transferDetails.payerName = "";
                $rootScope.safetyApply(function(){});
                return;
            }
            $scope.transferDetails.payerName = acc.name;
            $rootScope.safetyApply(function(){});
            return;
        }
        if (isValidNumber($scope.transferDetails.payerMobileNumber,"vn")) {
            mc.getPaymentInstrument(paymentInstrumentBack,formatE164("vn", $scope.transferDetails.payerMobileNumber),1);
        } else {
            $scope.transferDetails.payerName = "";
        }
    }
    function paymentInstrumentBack(r) {
        //console.log(r);
        if (r.Status.code == "0") {
            if (r.PaymentInstrument != null) {
                var pi = r.PaymentInstrument;
                if (pi.customerId == session.customer.id) {
                    MessageBox("","ASK_MONEY_EWALLET_ERROR_YOURSELF");
                } else {
                    if (pi.type == 0) {
                        $scope.transferDetails.paymentInstrumentId = pi.id;
                        if (pi.spareFields.spareString2 != null)
                            $scope.transferDetails.payerName = pi.spareFields.spareString2;
                        else
                            $scope.transferDetails.payerName = pi.spareFields.spareString1;
                        $scope.transferDetails.customerId = pi.customerId;
                        //console.log(pi);
                        $rootScope.safetyApply(function(){});
                    }
                }

            }
        }
    }
    $scope.openBenificiaryList = function() {
        session.requestMoneyInfo = $scope.transferDetails;
        $state.go('tcbbeneficiarylist');
    }

    if(!$scope.transferDetails||$scope.transferDetails.amount==null||$scope.transferDetails.amount==''||$scope.transferDetails.amount<=0)
        $scope.validAmount=false;
    else
        $scope.validAmount=true;




    $scope.change=function(){
        $scope.transferDetails.amount = parseInt($scope.transferDetails.parsedAmount);
        if($scope.transferDetails.parsedAmount&&parseInt($scope.transferDetails.parsedAmount)>0)
            $scope.validAmount=true;
        else
            $scope.validAmount=false;
    };

}]);