'use strict';
//To fetch user details and balance from backend
tcbmwApp.factory('AccountCashoutIDParticularsFactory', function(){

    var particulars ={
        accountNumber:'',
        accountName:'',
        accountBalance:'',
        name:'',
        idnumber:'',
        currency:'',
        date:'',
        amount:'',
        parsedAmount:'',
        fee:''
    };

    var pickedDate='';

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
        resetParticulars: function(){
           particulars ={
              accountNumber:'',
              accountName:'',
              accountBalance:'',
              name:'',
              idnumber:'',
              currency:'',
              date:'',
              amount:'',
              parsedAmount:'',
              fee:''
           };

           pickedDate='';
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
        },
        getPickedDate:function(){
            return pickedDate;
        },
        setPickedDate:function(data){
            pickedDate=data;
        }
    };
});