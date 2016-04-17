'use strict';
//To fetch user details and balance from backend
tcbmwApp.factory('AccountSelectorFactory', function(){
    var account ={
        accountNumber:'',
        accountName:'',
        currency:'',
        accountBalance:'',
        transactionLimit:''
    };

    return {
        setAccount:function(data){
            account = data;
        },
        getAccount:function(){
            return account;
        },
        resetAccount: function(){
            account ={
                accountNumber:'',
                accountName:'',
                currency:'',
                accountBalance:'',
                transactionLimit:''
            };
        }

    };

});