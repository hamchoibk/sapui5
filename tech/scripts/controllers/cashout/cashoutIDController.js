'use strict';

tcbmwApp.controller('CashoutIDController',['$scope','$state','$rootScope','AccountFactory','AccountSelectorFactory','AccountCashoutIDParticularsFactory',function($scope,$state,$rootScope,AccountFactory,AccountSelectorFactory,AccountCashoutIDParticularsFactory){
    $scope.forOwner = session.forOwner;
    
    if ( $state.current.name == 'cashoutid'){
             var baseStatus = {
                  isBack: true,
                  onBack: function() {
                       session.forOwner = false;
                       var prevState=AccountCashoutIDParticularsFactory.getSource();

                       AccountSelectorFactory.resetAccount();
                       AccountCashoutIDParticularsFactory.resetParticulars();
                       AccountCashoutIDParticularsFactory.resetSource();

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
                       AccountCashoutIDParticularsFactory.resetParticulars();
                       AccountCashoutIDParticularsFactory.resetSource();

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
                  angular.extend({title:($scope.forOwner)?'NAVBAR_CASHOUT_OVER_COUNTER' :'NAVBAR_CASHOUT_ID'}, baseStatus)
             ];

             $scope.status = statuses[0];
        }
        
            var account= AccountSelectorFactory.getAccount();

            if(!account || account.accountName==''){
                account=getAccountDetails()[currentAccountIdx];

                AccountSelectorFactory.setAccount(account);
            }

            $scope.selectedAccountNumber=account.accountNumber;
            $scope.selectedAccountName=account.accountName;
            $scope.selectedAvailableBalance=account.availableBalance;
            $scope.selectVisible=getAccountDetails().length>1;
            $scope.currencyCode = 'VND';

            var transParticulars=AccountCashoutIDParticularsFactory.getParticulars();

            $scope.pickedDate=AccountCashoutIDParticularsFactory.getPickedDate();

            var curStr='VND';
            if(transParticulars.currency!=''){
                 curStr=transParticulars.currency;
            }

            $scope.cashout={
                 amount:transParticulars.amount,
                 parsedAmount:transParticulars.parsedAmount,
                 currency:curStr,
                 id: transParticulars.idnumber,
                 name: transParticulars.name,
                 date:transParticulars.date
            };
            if ($scope.forOwner) {
                $scope.cashout.name = session.customer.displayName;
                $scope.loading = true;
                mc.getCustomerProfile(getCustomerProfileBack);
            }

            if($scope.cashout.amount==null||$scope.cashout.amount==''||$scope.cashout.amount<=0)
               $scope.validAmount=false;
            else
               $scope.validAmount=true;


            $scope.selectAccount=function(){

                var cashout=$scope.cashout;
                var particulars ={
                      accountNumber:account.accountNumber,
                      accountName:account.accountName,
                      availableBalance:account.availableBalance,
                      idnumber:cashout.id,
                      name:cashout.name,
                      currency:cashout.currency,
                      amount:cashout.amount,
                      parsedAmount:cashout.parsedAmount,
                      date:cashout.date,
                      fee:'VND 0',
                      paymentInstrumentId:account.paymentInstrumentId
                };

               AccountCashoutIDParticularsFactory.setParticulars(particulars);
               $state.go('cashoutaccountselector');
            }

            $scope.isiOsDevice = isiOsDevice;
            $scope.isMobile = isAndroid || isiOsDevice;

            $scope.focusDate = function($event) {

                if (isAndroid) {
                   var d = new Date();
                   if ($scope.pickedDate!='')
                       d = new Date($scope.pickedDate);

                   var options = {
                      date: d,
                      mode: 'date'
                   };

                   datePicker.show(options, function(date){
                          var tmpDate = date;
                          try {
                            var parseDate = new Date(tmpDate);
                            if (parseDate != "Invalid Date") {
                               $scope.pickedDate=parseDate;
                               AccountCashoutIDParticularsFactory.setPickedDate(parseDate);
                               $scope.cashout.date = parseDate.format("dd/mm/yyyy");
                               $event.target.blur();
                               $rootScope.safetyApply(function(){});
                            }
                          } catch (e) {
                               console.log(e.message);
                          }
                   });
                }
                $event.target.blur();

            }

            $('input#amount').focus(function() {
                            $(this).prop('type', 'number').val($scope.cashout.amount);
                }).blur(function() {
                    var self = $(this),value = self.val();
                    $scope.cashout.amount=value;

                    $scope.cashout.parsedAmount='';

                    if(value) {
                        $scope.cashout.parsedAmount=parseInt(value).formatMoney(0);
                    }

                    self.data('number', value).prop('type', 'text').val($scope.cashout.parsedAmount);
                });

            $('input#idnumber').focus(function() {
            }).blur(function() {
                $('#scrollArea').scrollTop($("#scrollArea")[0].scrollHeight);
            });

             $scope.change=function(){
                if($scope.cashout.parsedAmount&&parseInt($scope.cashout.parsedAmount)>0)
                   $scope.validAmount=true;
                else
                   $scope.validAmount=false;
             };

            $scope.confirm=function(){
                CashOutToCounter();
                 //$state.go('cashoutidconfirm');
             }
            function CashOutToCounter() {
                var cashout=$scope.cashout;
                var loadinfo = [];
                loadinfo["loadamount"] = cashout.amount;
                loadinfo["loadtext"] = "To Counter: " + cashout.name;
                loadinfo["fromacct"] = account.accountName;
                loadinfo["toacct"] = cashout.name;
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
                payee.paymentInstrumentType = 302;
                var attribute = [];
                attribute[0] = {};
                attribute[0].key = "402";
                attribute[0].value = cashout.name;
                attribute[1] = {};
                attribute[1].key = "403";
                attribute[1].value = cashout.id;
                attribute[2] = {};
                attribute[2].key = "404";
                if (isiOsDevice && !$scope.forOwner) {
                    attribute[2].value = new Date(cashout.date).format("dd/mm/yyyy");
                }
                else
                attribute[2].value = cashout.date;

                var txn = new TxnData(1004, session.transit_value.loadamount,
                    'order111', session.transit_value.loadtext);

                function cashoutBack(r) {
                    $scope.loading = false;
                    $rootScope.safetyApply(function(){});
                    if (preAuthoriseBack(r)) {
                        var cashout=$scope.cashout;
                        
                        var particulars ={
                              accountNumber:account.accountNumber,
                              accountName:account.accountName,
                              availableBalance:account.availableBalance,
                              idnumber:cashout.id,
                              name:cashout.name,
                              currency:cashout.currency,
                              amount:cashout.amount,
                              parsedAmount:cashout.parsedAmount,
                              formatedAmount:parseInt(cashout.amount).formatMoney(0),
                              date:cashout.date,
                              paymentInstrumentId:account.paymentInstrumentId
                        };
                        if (r.MoneyFee !== undefined && r.MoneyFee != null && r.MoneyFee.length>0) {
                            var fee = r.MoneyFee[0];
                            //$scope.transferDetails.transferFee = (fee.value + fee.vat);

                            particulars.fee = (fee.value + fee.vat);

                        } else {
                            particulars.fee = 0;
                        }
                        particulars.formatedFee = parseInt( particulars.fee).formatMoney(0);
                        AccountCashoutIDParticularsFactory.setParticulars(particulars);
                        $state.go('cashoutidconfirm');
                    } else {
                        appstate = trans.TRAN_IDLE;
                    }
                }

                appstate = trans.TRAN_UNLOADSVA;

                $scope.loading = true;

                mc.cashout(cashoutBack, payer, payee, attribute, txn, true);

    }
    function getCustomerProfileBack(r) {
        $scope.loading = false;
        
        if (r.Status.code == "0") {
            if (r.profile && r.profile.identity) {
                $scope.cashout.date = new Date(r.profile.identity.dateIssued).format("dd/mm/yyyy");   
                $scope.cashout.id = r.profile.identity.identity;
            }
        } else {
            ErrorBox(r.Status);
        }
        $rootScope.safetyApply(function(){});
    }
}]);