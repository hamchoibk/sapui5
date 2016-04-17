'use strict';

tcbmwApp.controller('interBankIndexController',['$scope','$state','interBankFactory','tcbTransferFactory','$rootScope',function($scope,$state,interBankFactory,tcbTransferFactory,$rootScope){
  if ( $state.current.name == 'interbankindex'){
    var baseStatus = {
      isBack: true,
      onBack: function() {
        interBankFactory.resetTxnInfo();
        $state.go('dashboard.transferhome');
        var newIndex = statuses.indexOf($scope.status) - 1;
        if (newIndex > -1) {
          $scope.status = statuses[newIndex];
          $scope.status.move = 'ltr';
          $scope.navigationBarStatus = $scope.status;
        }
      },
      isClose:true,
      onAction: function() {
        interBankFactory.resetTxnInfo();
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
      angular.extend({title: 'NAVBAR_INTER_BANK'}, baseStatus)
    ];
    $scope.status = statuses[0];
  }

  $scope.willCreateBen = true;
  $scope.txnInfo = interBankFactory.txnInfo;
  $scope.hasMoreThanOneSourceAccounts = tcbTransferFactory.hasMoreThanOneSourceAccounts;

  var ca = getCurrentAccount();

  $scope.txnInfo.sourceAccount = ca;

  $scope.showBranchName = $scope.txnInfo.destBranch != undefined
                       && $scope.txnInfo.destBranch.name != undefined
                       && $scope.txnInfo.destBranch.name != '';

  $scope.clickSelectAccount = function() {
      if($scope.hasMoreThanOneSourceAccounts == true){
          tcbTransferFactory.setTransferDetails($scope.transferDetails);
        tcbTransferFactory.transferType = "interbank";
          $state.go('sendmoneyselectaccount');
      }
  };

  //don't display phone number validation popup when selecting beneficiary
  $('#beneficiaryListIcon').on('touchstart mousedown',function(){
    $rootScope.suppressDialog = true;
  });

  $scope.openBenificiaryList = function() {
    $state.go('interbankbeneficiarylist');
  }

  $scope.selectBank = function() {
    $state.go('banklist');
  }

    $('input#amount').focus(function() {
        $(this).prop('type', 'number').val($scope.txnInfo.amount);
    }).blur(function() {
        var self = $(this),value = self.val();
        $scope.txnInfo.amount=value;

        $scope.txnInfo.parsedAmount='';

        if(value) {
            $scope.txnInfo.parsedAmount = parseInt(value).formatMoney(0);
            $('#scrollArea').scrollTop($("#scrollArea")[0].scrollHeight);
        }
        self.data('number', value).prop('type', 'text').val($scope.txnInfo.parsedAmount);
    });

  /* starts transaction */
  $scope.clickSend = function() {
    interBankFactory.txnInfo = $scope.txnInfo;
    if(interBankFactory.didSelectBen) {
      interBankFactory.willCreateBen = false;
    } else {
      interBankFactory.willCreateBen = $scope.willCreateBen;
    }
    var txn = {
      usecase : 1008, //usecase for interbank transfer
      payer : {
        identifier : {
          type : 1,
          value : session.customer.id
        },
        paymentInstrumentId : $scope.txnInfo.sourceAccount.paymentInstrumentId
      },
      payee : {
        identifier: {
          type : 5,
          value : "Techcombank"
        },
        paymentInstrumentType : 307
      },
      attribute : [
        {key:419,value:$scope.txnInfo.destBranch.branchCode},
        {key:420,value:$scope.txnInfo.benName},
        {key:421,value:$scope.txnInfo.benAccountNumber}
      ],
      amount : $scope.txnInfo.amount,
      message : $scope.txnInfo.messageContent
    };

    $scope.loading = true;
    mc.preAuthorize(callBack,txn,true);
  }

  function callBack(r) {

    $scope.loading = false;
    $rootScope.safetyApply(function(){});
    if (preAuthoriseBack(r)) {
      var txnInfo = $scope.txnInfo;

      if (r.MoneyFee !== undefined && r.MoneyFee != null && r.MoneyFee.length>0) {
        var fee = r.MoneyFee[0];

        txnInfo.fee = (fee.value + fee.vat);

      } else {
        txnInfo.fee = 0;
      }
      txnInfo.formatedFee = parseInt(txnInfo.fee).formatMoney(0);
      interBankFactory.txnInfo = txnInfo;
      //systemId = Mobiliser transaction id, keep to use later in PreAuthorisationContinue
      interBankFactory.txnInfo.systemId = r.Transaction.systemId;
      $state.go('interbankconfirmation');
    } else {
      appstate = trans.TRAN_IDLE;
    }
  }
}]);