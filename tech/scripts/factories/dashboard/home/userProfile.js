'use strict';
//To fetch user details and balance from backend

tcbmwApp.factory('userProfileFactory', function(){
    var name = "QUVNH LE";
    var balance = "2,000,000";
    var imgSrc = "";

    return{
        getName: function(){
            return name;
        },
        setName: function(value){
            name = value;
        },
        getBalance: function(){
            return balance;
        },
        setBalance: function(value){
            balance = value;
        },
        getImgSrc: function(){
            return imgSrc;
        },
        setImgSrc: function(value){
            imgSrc = value;
        }
   }
});