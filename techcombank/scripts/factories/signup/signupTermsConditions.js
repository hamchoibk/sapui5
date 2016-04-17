'use strict';
//To toggle flag once TermS & Conditions button is clicked

tcbmwApp.factory('signupTermsConditions', function(){
    var termsFlag = false;

   return{
    setTermsFlag: function(value){
        termsFlag = value;
    },
    getTermsFlag: function(){
        return termsFlag;
    }
   }
});