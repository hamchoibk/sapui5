'use strict';
//To fetch user details and balance from backend
tcbmwApp.factory('tcbTransferFactory', function(){

    var accountDetails = getAccountDetails();

    var beneficiaryListSameAccount= getSameHolderBeneficiaryList();

    var beneficiaryListBankAccount = getBeneficiaryList();
    var beneficiaryListWalletAccount = getWalletBeneficiaryList();
    var hasPreloadedBeneficiary = false;

    var initialTransferDetails ={
        sourceAccountType:accountDetails[0].accountType,
        sourceAccountName:accountDetails[0].accountName,
        sourceAccountNo:accountDetails[0].accountNumber,
        sourceAccountBalance:accountDetails[0].availableBalance,
        transactionLimit:accountDetails[0].transactionLimit,
        dayLimit:accountDetails[0].dayLimit,
        sample:true,
        messageContent:'',
        amount:'',
        parsedAmount:'',
        transferCurrency:'VND',
        formatedAmount:'',
        addToAccountListFlag:false,
        transferFee:'0',
        destinationAccountDetails: {
            payeeName:'',
            payeeAccountType:'',
            payeeAccountNumber:'',
            payeeImage:"https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg?sz=50"
        }
    };

    var accountDetail={
        "id":'',
        "accountNumber":'',
        "accountType":'',
        "availableBalance":'',
        "dayLimit":'',
        "transactionLimit":''
    }

    var hasMoreThanOneSourceAccounts = (accountDetails.length>1)?true:false;

    var transferDetails;

    var transactionReference;

    return {
        getAccountDetails: function(){
            accountDetails = getAccountDetails();
            return accountDetails;
        },
        getBeneficiaryListSameAccount: function(){
            return getSameHolderBeneficiaryList();
        },
        getBeneficiaryListBankAccount: function(){
            return getBeneficiaryList();
        },
        getBeneficiaryListWalletAccount: function(){
            return getWalletBeneficiaryList();
        },
      /**** Phase 1.2 : inter bank transfer ********/
        getBeneficiaryListExternalAccount : function() {
            return getExternalBeneficiaryList();
        },
      /*********************************************/
        getTransferDetails:function(){
            if (transferDetails === undefined) {
                transferDetails = angular.copy(initialTransferDetails);
                console.log(transferDetails);
            }
            return transferDetails;
        },
        setTransferDetails:function(data){
             transferDetails = data;
        },
        resetTransferDetails:function(){
            transferDetails = angular.copy(initialTransferDetails);
        },

        setTransactionReference:function(data){
            transactionReference = data;
        },
        getTransactionReference:function(){
            return transactionReference;
        },
        getPreloaded:function() {
            return hasPreloadedBeneficiary;
        },
        setPreloaded:function(data) {
            hasPreloadedBeneficiary = data;
        },
        hasMoreThanOneSourceAccounts:(accountDetails.length>1)?true:false
    };

});


