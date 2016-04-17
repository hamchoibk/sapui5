'use strict';

tcbmwApp.factory('AccountFactory',['_',function(_){
    var accountIndex ={
        index:0
    };
    var transactionId ={
        id:0
    };

     return {
         setAccountIndex:function(data){
             accountIndex.index = data;
         },
         getAccountIndex:function(){
             return accountIndex.index;
         },
         setTransactionId:function(data){
             transactionId.id = data;
         },
         getTransactionId:function(){
             return transactionId.id;
         }
     }
}]);