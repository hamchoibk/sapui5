'use strict';
//To fetch user details and balance from backend
tcbmwApp.factory('AccountCashoutMobileParticularsFactory', function(){

    var particulars ={
        accountNumber:'',
        accountName:'',
        accountBalance:'',
        mobileNumber:'',
        currency:'',
        amount:'',
        parsedAmount:'',
        fee:''
    };

    var transactionReference='';

    var source='';

    return {
        setParticulars:function(data){
            particulars = data;
        },
        getParticulars:function(){
            return particulars;
        },
        setTransactionReference:function(data){
            transactionReference = data;
        },
        getTransactionReference:function(){
            return transactionReference;
        },
        resetParticulars:function(){
            particulars ={
              accountNumber:'',
              accountName:'',
              accountBalance:'',
              mobileNumber:'',
              currency:'',
              amount:'',
              parsedAmount:'',
              fee:''
            };
        },
        resetTransactionReference: function(){
            transactionReference='';
        },
        getSource:function(){
            return source;
        },
        setSource:function(data){
            source=data;
        },
        resetSource:function(){
            source='';
        }
    };
});