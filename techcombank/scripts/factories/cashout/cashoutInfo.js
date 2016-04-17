'use strict';
//To toggle flag once TermS & Conditions button is clicked

tcbmwApp.factory('cashoutInfo', function(){
    var cashoutType;
    var cashoutAmount;
    var cashoutDetails;

   return{
    setType: function(value){
        cashoutType = value;
    },
    getType: function(){
        return cashoutType;
    },
    setAmount: function(value){
        cashoutAmount = value;
    },
    getAmount: function(){
        return cashoutAmount;
    },
    setDetails: function(value){
        cashoutDetails = value;
    },
    getDetails: function(){
        return cashoutDetails;
    },

   }
});