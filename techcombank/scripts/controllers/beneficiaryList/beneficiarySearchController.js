

tcbmwApp.controller('BeneficiarySearchController',['$scope','$state','$filter','tcbTransferFactory','dialogService','interBankFactory', '$rootScope',
  function($scope,$state,$filter,tcbTransferFactory,dialogService,interBankFactory,$rootScope){
    $scope.isList = false;

    if ( $state.current.name == 'beneficiarysearch'){
        var baseStatus = {
            isBack: true,
            onBack: function() {
                $state.go('dashboard.transferhome');
                var newIndex = statuses.indexOf($scope.status) - 1;
                if (newIndex > -1) {
                    $scope.status = statuses[newIndex];
                    $scope.status.move = 'ltr';
                    $scope.navigationBarStatus = $scope.status;
                }
            },
            isAdd:true,
            onAdd: function() {
                session.selectedBeneficiary = null;
                $state.go('addBeneficiary');
                var newIndex = statuses.indexOf($scope.status) - 1;
                if (newIndex > -1) {
                    $scope.status = statuses[newIndex];
                    $scope.status.move = 'ltr';
                    $scope.navigationBarStatus = $scope.status;
                }
            }
        };

        var statuses = [
            angular.extend({title: 'NAVBAR_BENEFICIARY_LIST_TITLE'}, baseStatus)
        ];

        $scope.status = statuses[0];
    }

    $scope.showMoreMenu=function(account, e){
        var target = e.target;
        var newY = target.getBoundingClientRect().top + 30 + $(document).scrollTop();
        var newX = target.getBoundingClientRect().left - 260;

        $scope.selectedAccount = account;
        $('.moreMenu').css('top', newY);
        $('.moreMenu').css('left', newX);
        $('.moreMenu').addClass('show');
        $('.overlay').addClass('show');

        if(newY+140 > $(window).height()){

            $('html, body').animate({
                scrollTop: $(target).offset().top
            }, 2000);
        }
    };

    $scope.dismissPopUp =function(){
        $('.moreMenu').removeClass('show');
        $('.overlay').removeClass('show');
    };

    $scope.dismissTransferPopUp =function(){
        $('.smallPopup').removeClass('show');
        $('.overlayPopup').removeClass('show');
    };

    $scope.showMoreMenuWithTransfer=function(account, e){
        var target = e.target;
        var newY = target.getBoundingClientRect().top + 30 + $(document).scrollTop();
        var newX = target.getBoundingClientRect().left - 270;

        $scope.selectedAccount = account;
        $('.smallPopup').css('top', newY);
        $('.smallPopup').css('left', newX);
        $('.smallPopup').addClass('show');
        $('.overlayPopup').addClass('show');

        if(newY+140 > $(window).height()){

            $('html, body').animate({
                scrollTop: $(target).offset().top
            }, 2000);
        }
    };


    function filterByType(ben) {
            
                return ben.type == this;
            
        }
     function getBeneficiariesBack(r) {
        $scope.loading = false;
        $rootScope.safetyApply(function(){});
        if (r.Status.code == "0") {
            tcbTransferFactory.setPreloaded(true);
            $scope.isList = true;
            session.beneficiaryList = r.benList;
            session.walletBeneficiaryList = session.beneficiaryList.filter(filterByType,TYPE_BEN_WALLET);
            session.bankBeneficiaryList = session.beneficiaryList.filter(filterByType,TYPE_BEN_IN_TCB);
            session.externalBeneficiaryList = session.beneficiaryList.filter(filterByType,TYPE_BEN_EXTERNAL);

            $scope.beneficiaryListBankAccount = tcbTransferFactory.getBeneficiaryListBankAccount();
            $scope.beneficiaryListWalletAccount = tcbTransferFactory.getBeneficiaryListWalletAccount();
          $scope.beneficiaryListExternalAccount = tcbTransferFactory.getBeneficiaryListExternalAccount();
            $rootScope.safetyApply(function(){});
        } else {
            ErrorBox(r.Status);
        }
     }
    $scope.loading = true;
    $rootScope.safetyApply(function(){});
    mc.getBeneficiaries(getBeneficiariesBack,3);
    //get dummy values
    $scope.beneficiaryListSameAccount = tcbTransferFactory.getBeneficiaryListSameAccount();
    var beneficiaryListSameAccountInitialCount =  $scope.beneficiaryListSameAccount.length;
    $scope.beneficiaryListSameAccountIsOpen = false;
    $scope.beneficiaryListBankAccount = tcbTransferFactory.getBeneficiaryListBankAccount();
    var beneficiaryListBankAccountInitialCount =  $scope.beneficiaryListBankAccount.length;
    $scope.beneficiaryListBankAccountIsOpen = false;
    $scope.beneficiaryListWalletAccount = tcbTransferFactory.getBeneficiaryListWalletAccount();
    var beneficiaryListWalletAccountInitialCount =  $scope.beneficiaryListWalletAccount.length;
    $scope.beneficiaryListWalletAccountIsOpen = false;

  $scope.beneficiaryListExternalAccount = tcbTransferFactory.getBeneficiaryListExternalAccount();
  var beneficiaryListExternalAccountInitialCount =  $scope.beneficiaryListExternalAccount.length;
  $scope.beneficiaryListExternalAccountIsOpen = false;

    var closeAllLists = function(){
        $scope.beneficiaryListSameAccountIsOpen = false;
        $scope.beneficiaryListBankAccountIsOpen = false;
        $scope.beneficiaryListWalletAccountIsOpen = false;
        $scope.beneficiaryListExternalAccountIsOpen = false;

    };


    $scope.filterByMobile = function(data){
        closeAllLists();
        var beneficiaryListSameAccountFilterResult = $filter('filter')( $scope.beneficiaryListSameAccount,data );
        var beneficiaryListBankAccountFilterResult = $filter('filter')( $scope.beneficiaryListBankAccount,data );
        var beneficiaryListWalletAccountFilterResult =  $filter('filter')( $scope.beneficiaryListWalletAccount,data );
      var beneficiaryListExternalAccountFilterResult =  $filter('filter')( $scope.beneficiaryListExternalAccount,data );


        if(beneficiaryListSameAccountFilterResult.length>0 && beneficiaryListSameAccountFilterResult.length!=beneficiaryListSameAccountInitialCount){
            $scope.beneficiaryListSameAccountIsOpen = true;
        }

        if(beneficiaryListBankAccountFilterResult.length>0 && beneficiaryListBankAccountFilterResult.length!=beneficiaryListBankAccountInitialCount){
            $scope.beneficiaryListBankAccountIsOpen = true;
        }

        if(beneficiaryListWalletAccountFilterResult.length>0 && beneficiaryListWalletAccountFilterResult.length!=beneficiaryListWalletAccountInitialCount){
            $scope.beneficiaryListWalletAccountIsOpen = true;
        }

      if(beneficiaryListExternalAccountFilterResult.length>0 && beneficiaryListExternalAccountFilterResult.length!=beneficiaryListExternalAccountInitialCount){
        $scope.beneficiaryListExternalAccountIsOpen = true;
      }
    };
    $scope.clickBankTransfer = function() {
      var data = $scope.selectedAccount;
      if (data.type == "COMMON_EXTERNAL_ACCOUNT") {
        //interbank transfer
        interBankFactory.txnInfo.benName = data.name;
        interBankFactory.txnInfo.benAccountNumber = data.accountNumber;
        interBankFactory.txnInfo.destBank = {
          id: data.bankCode,
          name: data.bankName
        }
        interBankFactory.txnInfo.destBranch = {
          branchCode: data.branchCode,
          name: data.branchName
        }
        interBankFactory.txnInfo.destProvince = {
          id:data.branchLocation
        }
        interBankFactory.didSelectBen = true;
        $state.go('interbankindex');
      } else {
        //in techcombank transfer
        $scope.transferDetails = tcbTransferFactory.getTransferDetails();
        var destinationAccountDetails = {};
        destinationAccountDetails.payeeName = data.name;
        destinationAccountDetails.payeeAccountType = data.type;
        destinationAccountDetails.payeeAccountNumber = data.accountNumber;
        destinationAccountDetails.payeeImage = data.image;
        destinationAccountDetails.paymentInstrumentId = data.paymentInstrumentId;
        if (data.type == "COMMON_BANK_ACCOUNT_SAME_HOLDER" || data.type == "COMMON_SVA_ACCOUNT_SAME_HOLDER")
          destinationAccountDetails.paymentInstrumentId = data.paymentInstrumentId;
        else if (data.type == "COMMON_BANK_ACCOUNT") {
          //update later
          destinationAccountDetails.paymentInstrumentId = 0;
          //mc.getPaymentInstrument(getPaymentInstrumentBack, data.accountNumber ,2);
        }


        $scope.transferDetails.destinationAccountDetails = destinationAccountDetails;
        tcbTransferFactory.setTransferDetails($scope.transferDetails);

        console.log(tcbTransferFactory.getTransferDetails());
        $state.go('tcbindex');

      }
    }
    $scope.clickEdit = function() {
        if ($scope.selectedAccount.type != "COMMON_SVA_SAME_HOLDER" && $scope.selectedAccount.type != "COMMON_BANK_ACCOUNT_SAME_HOLDER") {
            //
            session.selectedBeneficiary = $scope.selectedAccount;
            $state.go("addBeneficiary");
        }
    }
    $scope.clickDelete = function() {
        if ($scope.selectedAccount.type != "COMMON_SVA_SAME_HOLDER" && $scope.selectedAccount.type != "COMMON_BANK_ACCOUNT_SAME_HOLDER") {

            var modalOptions = {
                closeButtonText: 'TRANSFER_DELETE_BENIFICIARY_CANCEL',
                actionButtonText: 'TRANSFER_DELETE_BENIFICIARY_OK',
                headerText: '',
                bodyText: 'TRANSFER_DELETE_BENIFICIARY_BODY'
            };
            dialogService.showModalWithParams(modalOptions).then(function(){
                $scope.loading = true;
                $rootScope.safetyApply(function(){});
                mc.deleteBeneficiary(deleteBeneficiaryBack, $scope.selectedAccount.benId);
            });
        }
    }
    function deleteBeneficiaryBack(r) {

        if (r.Status.code == "0") {
//            MessageBox("Beneficiary is deleted.");
            //mc.getBeneficiaries(getBeneficiariesBack);
            console.log($scope.selectedAccount);
            if($scope.selectedAccount.type == "COMMON_EXTERNAL_ACCOUNT") {
              session.externalBeneficiaryList.splice(parseInt($scope.selectedAccount.id),1);
            } else if ($scope.selectedAccount.type == "COMMON_SVA_ACCOUNT") {
                session.walletBeneficiaryList.splice(parseInt($scope.selectedAccount.id),1);
            } else {
                session.bankBeneficiaryList.splice(parseInt($scope.selectedAccount.id),1);
            }
            $scope.selectedAccount = null;
            $scope.beneficiaryListBankAccount = tcbTransferFactory.getBeneficiaryListBankAccount();
            $scope.beneficiaryListWalletAccount = tcbTransferFactory.getBeneficiaryListWalletAccount();
            $scope.beneficiaryListExternalAccount = tcbTransferFactory.getBeneficiaryListExternalAccount();
            $scope.loading = false;
            $scope.dismissPopUp();
            $rootScope.safetyApply(function(){});

        } else {
            $scope.loading = false;
            $rootScope.safetyApply(function(){});
            ErrorBox(r.Status);
        }
    }
}]);