tcbmwApp.controller('TCBBeneficiaryListController',['$scope','$state','$filter','tcbTransferFactory','$rootScope',function($scope,$state,$filter,tcbTransferFactory,$rootScope){
  if($rootScope.suppressDialog === true){
    $rootScope.suppressDialog = false;
  }

  if ( $state.current.name == 'tcbbeneficiarylist'){
    var baseStatus = {
      isBack: true,
      onBack: function() {
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

  function getWalletBeneficiariesBack(r) {

    if (r.Status.code == "0") {
      tcbTransferFactory.setPreloaded(true);
      session.walletBeneficiaryList = r.benList;
      //then get tcb bank account beneficiary
      mc.getBeneficiaries(getTcbBeneficiariesBack,1);
    } else {
      ErrorBox(r.Status);
    }
  }

  function getTcbBeneficiariesBack(r) {
    $scope.loading = false;
    $rootScope.safetyApply(function(){});
    if (r.Status.code == "0") {
      tcbTransferFactory.setPreloaded(true);
      session.bankBeneficiaryList = r.benList;

      $scope.beneficiaryListBankAccount = tcbTransferFactory.getBeneficiaryListBankAccount();
      $scope.beneficiaryListWalletAccount = tcbTransferFactory.getBeneficiaryListWalletAccount();
      $rootScope.safetyApply(function(){});
    } else {
      ErrorBox(r.Status);
    }
  }
  //start getting ben list
  mc.getBeneficiaries(getWalletBeneficiariesBack,0); //get wallet ben first (type = 0)
  //get dummy values
  $scope.beneficiaryListSameAccount = tcbTransferFactory.getBeneficiaryListSameAccount();

  console.log("$scope.beneficiaryListSameAccount", $scope.beneficiaryListSameAccount);

  var beneficiaryListSameAccountInitialCount =  $scope.beneficiaryListSameAccount.length;
  $scope.beneficiaryListSameAccountIsOpen = false;
  if ($rootScope.previousState.name == "tcbindex") {

    $scope.beneficiaryListBankAccount = tcbTransferFactory.getBeneficiaryListBankAccount();
    var beneficiaryListBankAccountInitialCount =  $scope.beneficiaryListBankAccount.length;

    $scope.beneficiaryListBankAccountIsOpen = false;
  } else {
    $scope.hideAccountNumber = true;
    $scope.beneficiaryListBankAccount = [];
    var beneficiaryListBankAccountInitialCount =  0;
    $scope.beneficiaryListBankAccountIsOpen = false;
  }
  $scope.beneficiaryListWalletAccount = tcbTransferFactory.getBeneficiaryListWalletAccount();
  var beneficiaryListWalletAccountInitialCount =  $scope.beneficiaryListWalletAccount.length;
  $scope.beneficiaryListWalletAccountIsOpen = false;
  $scope.loading = true;

  var closeAllLists = function(){
    $scope.beneficiaryListSameAccountIsOpen = false;
    $scope.beneficiaryListBankAccountIsOpen = false;
    $scope.beneficiaryListWalletAccountIsOpen = false;
  }

  $scope.filterByMobile = function(data){
    closeAllLists();
    var beneficiaryListSameAccountFilterResult = $filter('filter')( $scope.beneficiaryListSameAccount,data );
    var beneficiaryListBankAccountFilterResult = $filter('filter')( $scope.beneficiaryListBankAccount,data );
    var beneficiaryListWalletAccountFilterResult =  $filter('filter')( $scope.beneficiaryListWalletAccount,data );


    if(beneficiaryListSameAccountFilterResult.length>0 && beneficiaryListSameAccountFilterResult.length!=beneficiaryListSameAccountInitialCount){
      $scope.beneficiaryListSameAccountIsOpen = true;
    }

    if(beneficiaryListBankAccountFilterResult.length>0 && beneficiaryListBankAccountFilterResult.length!=beneficiaryListBankAccountInitialCount){
      $scope.beneficiaryListBankAccountIsOpen = true;
    }

    if(beneficiaryListWalletAccountFilterResult.length>0 && beneficiaryListWalletAccountFilterResult.length!=beneficiaryListWalletAccountInitialCount){
      $scope.beneficiaryListWalletAccountIsOpen = true;
    }
  };

  $scope.payeeSelected = function(data){
    if ($rootScope.previousState.name != "tcbindex")
      if (data.type != "COMMON_SVA_SAME_HOLDER" && data.type != "COMMON_SVA_ACCOUNT")
        return;
    if ($rootScope.previousState.name != "tcbindex")  {
      session.selectedBen = data.accountNumber;
    } else {
      $scope.transferDetails = tcbTransferFactory.getTransferDetails();
      var destinationAccountDetails = {};
      destinationAccountDetails.payeeName = data.name;
      destinationAccountDetails.payeeAccountType = data.type;
      destinationAccountDetails.payeeAccountNumber = data.accountNumber;
      destinationAccountDetails.payeeImage = data.image;
      destinationAccountDetails.paymentInstrumentId = data.paymentInstrumentId;
      if (data.type == "COMMON_BANK_ACCOUNT_SAME_HOLDER" || data.type == "COMMON_SVA_SAME_HOLDER")
        destinationAccountDetails.paymentInstrumentId = data.paymentInstrumentId;
      else if (data.type == "COMMON_BANK_ACCOUNT"){
        //update later
        destinationAccountDetails.paymentInstrumentId = 0;
      }
      $scope.transferDetails.destinationAccountDetails = destinationAccountDetails;
      tcbTransferFactory.setTransferDetails($scope.transferDetails);

      console.log(tcbTransferFactory.getTransferDetails());
    }
    $state.go($rootScope.previousState.name);
  }
}]);

