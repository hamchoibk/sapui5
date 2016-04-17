'use strict';

tcbmwApp.controller('CashoutMobileController',['$scope','$state','$rootScope','AccountFactory','AccountSelectorFactory','AccountCashoutMobileParticularsFactory',function($scope,$state,$rootScope,AccountFactory,AccountSelectorFactory,AccountCashoutMobileParticularsFactory){
    
    $scope.forOwner = session.forOwner;
    if ( $state.current.name == 'cashoutmobile'){
         var baseStatus = {
              isBack: true,
              onBack: function() {
                  var prevState = AccountCashoutMobileParticularsFactory.getSource();
                  console.log("prevState", prevState);
                  session.forOwner = false;
                  AccountSelectorFactory.resetAccount();
                  AccountCashoutMobileParticularsFactory.resetParticulars();
                  AccountCashoutMobileParticularsFactory.resetSource();
                  $state.go(prevState);

                  var newIndex = statuses.indexOf($scope.status) - 1;
                  if (newIndex > -1) {
                      $scope.status = statuses[newIndex];
                      $scope.status.move = 'ltr';
                      $scope.navigationBarStatus = $scope.status;
                  }
              },
              isClose:true,
              onAction: function() {
                   session.forOwner = false;
                   AccountSelectorFactory.resetAccount();
                   AccountCashoutMobileParticularsFactory.resetParticulars();
                   AccountCashoutMobileParticularsFactory.resetSource();
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
              angular.extend({title: $scope.forOwner?'NAVBAR_CASHOUT_ATM':'NAVBAR_CASHOUT_MOBILE'}, baseStatus)
         ];

         $scope.status = statuses[0];
    }
    
    var account= AccountSelectorFactory.getAccount();
    console.log(account);
     if(!account || account.accountName==''){
        account= getAccountDetails()[currentAccountIdx];
         /***** Only accept send money from Locally currency *****/

         while(account.currency != "VND") {
             currentAccountIdx++;
             if (currentAccountIdx >= session.accounts.length) {
                 currentAccountIdx = 0;
             }
             account=getAccountDetails()[currentAccountIdx];
         }

         /***** Only accept send money from Locally currency end *****/
        AccountSelectorFactory.setAccount(account);
    }
    
    $scope.selectedAccountNumber=account.accountNumber;
    $scope.selectedAccountName=account.accountName;
    $scope.selectedAvailableBalance=account.availableBalance;
    $scope.selectVisible=getAccountDetails().length>1;
    $scope.currencyCode = 'VND';

    var transParticulars=AccountCashoutMobileParticularsFactory.getParticulars();
    
    var curStr='VND';
    if(transParticulars.currency!=''){
        curStr=transParticulars.currency;
    }
    if ($scope.forOwner) {
        transParticulars.mobileNumber = formatLocal("vn",session.msisdn).replace(/ /g,"");
    } else
    if ($rootScope.previousState.name == 'tcbbeneficiarylist') {
        //
        transParticulars.mobileNumber = session.selectedBen;
        session.selectedBen = null;
    }
    $scope.cashout={
            amount:transParticulars.amount,
            parsedAmount:transParticulars.parsedAmount,
            currency:curStr,
            mobile: transParticulars.mobileNumber
        };

    if($scope.cashout.amount==null||$scope.cashout.amount==''||$scope.cashout.amount<=0)
       $scope.validAmount=false;
    else
       $scope.validAmount=true;

    $scope.confirm=function(){

        var cashout=$scope.cashout;

        var particulars ={
                accountNumber:account.accountNumber,
                accountName:account.accountName,
                accountBalance:account.availableBalance,
                mobileNumber:cashout.mobile,
                currency:cashout.currency,
                amount:cashout.amount,
                parsedAmount:cashout.parsedAmount,
                paymentInstrumentId:account.paymentInstrumentId
        };

        AccountCashoutMobileParticularsFactory.setParticulars(particulars);

        CashOutToCardless();
    }

    $("#beneficiaryListIcon").on('touchstart mousedown',function(){
        $rootScope.suppressDialog = true; //Dont show a pop up if beneficiaryListIcon is clicked
    });

    $('input#amount').focus(function() {
           $(this).prop('type', 'number').val($scope.cashout.amount);
     }).blur(function() {
         var self = $(this),value = self.val();
         $scope.cashout.amount=value;
         $scope.cashout.parsedAmount='';

         if(value) {
             $scope.cashout.parsedAmount=parseInt(value).formatMoney(0);
             $('#scrollArea').scrollTop($("#scrollArea")[0].scrollHeight);
         }

         self.data('number', value).prop('type', 'text').val($scope.cashout.parsedAmount);
     });

     $scope.change=function(){
          if($scope.cashout.parsedAmount&&parseInt($scope.cashout.parsedAmount)>0)
             $scope.validAmount=true;
          else
             $scope.validAmount=false;
     };

    $scope.selectAccount=function(){

        var cashout=$scope.cashout;

        var particulars ={
                accountNumber:account.accountNumber,
                accountName:account.accountName,
                accountBalance:account.availableBalance,
                mobileNumber:cashout.mobile,
                currency:cashout.currency,
                amount:cashout.amount,
                parsedAmount:cashout.parsedAmount,
                paymentInstrumentId:account.paymentInstrumentId
        };

        AccountCashoutMobileParticularsFactory.setParticulars(particulars);

        $state.go('cashoutaccountselector');
    }
    function CashOutToCardless() {
        var cashout=$scope.cashout;
        var loadinfo = [];
        loadinfo["loadamount"] = cashout.amount;
        loadinfo["loadtext"] = "ATM Cardless to:" + cashout.mobile;
        loadinfo["fromacct"] = account.accountName;
        loadinfo["toacct"] = "ATM Cardless with mobile number: " + cashout.mobile;
        loadinfo["fee"] = 0;
        loadinfo["sysid"] = '';
        loadinfo["referno"] = '';
        session.transit_value = loadinfo;
        session.transit_value.transfer_type = "cashout";
        var payer = {};
        payer.identifier = {};
        payer.identifier.type = "1";
        payer.identifier.value = session.customer.id;
        payer.paymentInstrumentId = account.paymentInstrumentId;

        var payee = {};
        payee.identifier = {};
        payee.identifier.type = "5";
        payee.identifier.value = "Techcombank";
        payee.paymentInstrumentType = 301;
        var attribute = [];
        attribute[0] = {};
        attribute[0].key = "401";
        attribute[0].value = cashout.mobile;

        var txn = new TxnData(1004, session.transit_value.loadamount,
            'order111', session.transit_value.loadtext);

        function cashoutBack(r) {
            $scope.loading = false;
            $rootScope.safetyApply(function(){});
            if (preAuthoriseBack(r)) {
                var particulars = AccountCashoutMobileParticularsFactory.getParticulars();
                if (r.MoneyFee !== undefined && r.MoneyFee != null && r.MoneyFee.length>0) {
                    var fee = r.MoneyFee[0];
                    //$scope.transferDetails.transferFee = (fee.value + fee.vat);
                    
                    particulars.fee = (fee.value + fee.vat);
                    
                } else {
                    particulars.fee = 0;
                }
                particulars.formatedAmount = parseInt(particulars.amount).formatMoney(0);
                particulars.formatedFee = parseInt(particulars.fee).formatMoney(0);
                AccountCashoutMobileParticularsFactory.setParticulars(particulars);
                $state.go('cashoutmobileconfirm');
            } else {
                appstate = trans.TRAN_IDLE;
            }
        }
        
        appstate = trans.TRAN_UNLOADSVA;
        
        $scope.loading = true;

        mc.cashout(cashoutBack, payer, payee, attribute, txn, true);

    }
    var successCallback = function(success){

        $scope.cashout.mobile = formatLocal("vn",success.phoneNumber).replace(/[^0-9]/g,"");
        $rootScope.safetyApply(function(){});
        
    };

    var error = function(error){
        MessageBox('Error \r\n'+error.statusMsg);
    };

    $scope.openBenificiaryList = function() {
        TCBNativeBridge.getAddressBook(successCallback,error,'SMS');
        //$state.go('tcbbeneficiarylist');
    }
}]);