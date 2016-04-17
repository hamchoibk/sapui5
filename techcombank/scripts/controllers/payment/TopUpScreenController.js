'use strict';

tcbmwApp.controller('TopUpScreenController',['$scope','$state','$rootScope','TopUpFactory','dialogService',function($scope,$state,$rootScope,TopUpFactory,dialogService){

    if ( $state.current.name == 'topupscreen'){
        var baseStatus = {
            isBack: true,
            onBack: function() {
                TopUpFactory.reset();
                $state.go('paymentindex');
            },
            isClose:true,
            onAction: function() {
                TopUpFactory.reset();
                $state.go('dashboard.home');
            }
        };

        var statuses = [
            angular.extend({title: TopUpFactory.isPrePaid ? 'NAVBAR_PREPAID_TOPUP' : 'NAVBAR_POSTPAID_TOPUP'}, baseStatus)
        ];

        $scope.status = statuses[0];
    }
    console.log("TopUpFactory.topupInfo = ", TopUpFactory.topupInfo);

    var ca= getCurrentAccount();

    /***** Only accept transfer money from Locally currency *****/

    while(ca.currency != "VND") {
        ca = getNextAccount();
    }

    /***** Only accept transfer money from Locally currency end *****/

    $scope.sourceAccount = ca;


    $scope.currencyCode = 'VND';

    $scope.isPrePaid = TopUpFactory.isPrePaid;

    if(TopUpFactory.topupInfo.topupNumber != undefined) {
        $scope.topupNumber = TopUpFactory.topupInfo.topupNumber;
    } else if($scope.isPrePaid) {
        $scope.topupNumber = session.msisdn;
    }
    if(TopUpFactory.topupInfo.topupAmount != undefined) {
        $scope.topupAmount = TopUpFactory.topupInfo.topupAmount;
    } else {
        $scope.topupAmount = $scope.isPrePaid ? 50000 : "";
    }
    if(TopUpFactory.topupInfo.contactName != undefined) {
        $scope.contactName = TopUpFactory.topupInfo.contactName;
    }
    $scope.topupDate = new Date().format('dd/mm/yyyy');

    var successCallback = function(success){
        if(success.phoneNumber != "Cancel") {
            $scope.topupNumber = formatLocal("vn",success.phoneNumber).replace(/[^0-9]/g,"");
            $scope.contactName = success.name;
            $rootScope.safetyApply(function(){});
            if(!$scope.isPrePaid) {
                $scope.loading = true;
                $rootScope.safetyApply(function(){});
                mc.queryMobileBill(queryMobileBillBack,$scope.topupNumber);
            }
        }
    };

    var error = function(error){
        MessageBox('Error \r\n'+error.statusMsg);
    };

    //don't display phone number validation popup when click select contact
    $('#selectContact').on('touchstart mousedown',function(){
        $rootScope.suppressDialog = true;
    });

    $('#phone-input').blur(function(){
        if($rootScope.suppressDialog) {
            return;
        }
        if(!$scope.isPrePaid && isValidNumber($scope.topupNumber,"vn")) {
            $scope.loading = true;
            $rootScope.safetyApply(function(){});
            mc.queryMobileBill(queryMobileBillBack,$scope.topupNumber);
        }
    });

    function queryMobileBillBack(r) {
        $scope.loading = false;
        $rootScope.safetyApply(function(){});
        if (r.Status.code == "0") {
            $scope.topupAmount = r.billList[0].Amount;
            $rootScope.safetyApply(function(){});
        } else {
            ErrorBox(r.Status);
        }
    }

    $scope.selectContact = function() {
        $rootScope.suppressDialog = false;
        TCBNativeBridge.getAddressBook(successCallback,error,'SMS');
    }

    $scope.selectAccount = function() {
        $rootScope.suppressDialog = false;
        TopUpFactory.topupInfo.topupAmount = $scope.topupAmount;
        TopUpFactory.topupInfo.parsedAmount = parseInt(TopUpFactory.topupInfo.topupAmount).formatMoney(0);
        TopUpFactory.topupInfo.topupNumber = $scope.topupNumber;
        TopUpFactory.topupInfo.topupDate = $scope.topupDate;
        TopUpFactory.topupInfo.contactName = $scope.contactName;
        TopUpFactory.topupInfo.topupDate = $scope.topupDate;
        console.log("TopUpFactory.topupInfo select account = ", TopUpFactory.topupInfo);
        $state.go('sendmoneyselectaccount');

    }

    $scope.topup = function() {
        if(!isValidNumber($scope.topupNumber,"vn")) {
            dialogService.showModal("ERROR_CODE_30003"); //show popup invalid mobile number
            return ;
        }
        $scope.loading = true;
        $rootScope.safetyApply(function(){});

        TopUpFactory.topupInfo.sourceAccount = $scope.sourceAccount;
        TopUpFactory.topupInfo.topupAmount = $scope.topupAmount;
        TopUpFactory.topupInfo.parsedAmount = parseInt(TopUpFactory.topupInfo.topupAmount).formatMoney(0);
        TopUpFactory.topupInfo.topupNumber = $scope.topupNumber;
        TopUpFactory.topupInfo.topupDate = $scope.topupDate;
        TopUpFactory.topupInfo.contactName = $scope.contactName;
        TopUpFactory.topupInfo.topupDate = $scope.topupDate;

        var txn = {
            usecase : $scope.isPrePaid ?  1009 : 1010, //usecase for top up prepaid
            payer : {
                identifier : {
                    type : 1,
                    value : session.customer.id
                },
                paymentInstrumentId : $scope.sourceAccount.paymentInstrumentId
            },
            payee : {
                identifier: {
                    type : 5,
                    value : "Techcombank"
                },
                paymentInstrumentType : $scope.isPrePaid ? 308 : 309
            },
            attribute : [
                {key: $scope.isPrePaid ? 422 : 423, value:$scope.topupNumber}
            ],
            amount : $scope.topupAmount
        };

        $scope.loading = true;
        mc.preAuthorize(topupBack,txn,true);
    }

    $scope.changePhoneNumber = function() {
        TopUpFactory.topupNumber = $scope.topupNumber;
        $scope.contactName = '';
        if(!$scope.isPrePaid) {
            $scope.topupAmount = '';
        }
        $rootScope.safetyApply(function(){});
    }

    function topupBack(r) {

        $scope.loading = false;
        $rootScope.safetyApply(function(){});
        if (preAuthoriseBack(r)) {
            if (r.MoneyFee.length == 0) {
                TopUpFactory.topupInfo.fee = 0;
            } else if (r.MoneyFee.length != 0) {
                TopUpFactory.topupInfo.fee = r.MoneyFee[0];
            }
            TopUpFactory.topupInfo.systemId = r.Transaction.systemId;
            $state.go('topupconfirm');
        } else {
            appstate = trans.TRAN_IDLE;
        }
    }
}]);