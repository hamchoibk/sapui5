

tcbmwApp.factory('TransactionsFactory', ['_',function(_){
   var transactions=[];
   var bankTransactions=[];
   var socialTransactions = [];
   var userAccountDetails = [];


    var selectedBankTransaction = bankTransactions[0];
    var selectedSocialTransaction = transactions[2];
    var selectedStatusFilter = 'Accepted';

    var socialTransactionsListIsOpen= false;

    var transaction={
        id:'',
        accountNumber:'',
        name:'',
        amount:'',
        date:'',
        link:'',
        channel:'',
        status:''
    };

    return {
       findAll:function(){
           return transactions;
       },
       findByStatus:function(status){
           var list = _.where(socialTransactions,{status:status});
           for(var i=list.length-1;i>=0;i--) {
               console.log(list[i].fastalink,list[i].additionalInfos);
               if (list[i].fastalink && !list[i].additionalInfos) {
                   list.splice(i,1);
               }
           }
           return list;
       },
       findBankTransactionsByStatus: function(status){
           return _.where(bankTransactions,{status:status});
       },
       findById:function(id){
           return _.find(transactions,function(element){ return element.id == id; });
       },
       findByAccountNumber:function(accountNumber){
           return _.filter(transactions,function(element){ return element.accountNumber == accountNumber; })
       },
       setTransactions:function(data) {
          transactions = data;
       },
       getTransaction:function(){
           return transaction;
       },
       getSocialTransactions:function() {
           return socialTransactions;
       },
       setSocialTransactions: function(data) {
           socialTransactions = data;
       },
       setTransaction:function(data){
           transaction=data;
       },
       resetTransaction:function(){
           transaction={
              id:'',
              accountNumber:'',
              name:'',
              amount:'',
              date:'',
              link:'',
              channel:'',
              status:''
           };
       },
       setSelectedBankTransaction: function(data){
            selectedBankTransaction = data;
       },
       getSelectedBankTransaction: function(){
            return selectedBankTransaction;
       },
       getBankTransactions: function(){
            return bankTransactions;
       },
      setSelectedSocialTransaction: function(data){
           selectedSocialTransaction = data;
      },
      getSelectedSocialTransaction: function(){
           return selectedSocialTransaction;
      },
      getUserAccountDetails: function(){
        return userAccountDetails;
      },
      getSelectedStatusFilter: function(){
        return selectedStatusFilter;
      },
      setSelectedStatusFilter:function(data){
        selectedStatusFilter = data;
      },
       getSocialTransactionsListIsOpen: function(){
          console.log("In getSocialTransactionsListIsOpen "+socialTransactionsListIsOpen);
          return socialTransactionsListIsOpen;
       },
       setSocialTransactionsListIsOpen:function(data){
          console.log("In setSocialTransactionsListIsOpen "+data);
          socialTransactionsListIsOpen = data;
       },
      resetSocialTransactionsListIsOpen:function(){
        socialTransactionsListIsOpen = false;
      },
      resetSocialTransactionsList:function(){
         while(socialTransactions.length){
            socialTransactions.pop();
         }
      }
    }
}]);