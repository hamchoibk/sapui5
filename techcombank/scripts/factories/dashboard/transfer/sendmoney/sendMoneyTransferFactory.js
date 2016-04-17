'use strict';
//To fetch user details and balance from backend
tcbmwApp.factory('sendMoneyTransferFactory',['_',function(_){
        var accountDetails = [
                               {"id":1,"accountNumber":"1234567777777","accountType":"Current Account VND", "currency":"VND" ,"availableBalance":"VND 2,000,000 ","dayLimit":"VND 30,000,000 ","transactionLimit":"VND 30,000,000"},
                               {"id":2,"accountNumber":"1234568888888","accountType":"Current Account USD", "currency":"USD" ,"availableBalance":"USD 2,000 ","dayLimit":"VND 30,000,000","transactionLimit":"VND 30,000,000"},
                               {"id":3,"accountNumber":"1234569999999","accountType":"Card Account", "currency":"VND" ,"availableBalance":"VND 2,000,000 ","dayLimit":"VND 40,000,000","transactionLimit":"VND 30,000,000"},
                               {"id":4,"accountNumber":"1234560000000","accountType":"Lend Account", "currency":"VND" ,"availableBalance":"VND 22,000 ","dayLimit":"VND 70,000,000","transactionLimit":"VND 30,000,000"}
        ];


        var accountDetail={
            "id":'',
            "accountName":'',
            "accountNumber":'',
            "accountType":'',
            "currency":'',
            "availableBalance":'',
            "dayLimit":'',
            "transactionLimit":''
        }

        var sendMoneyInitialUserInputs ={
            amount:'',
            linkPinCode:'',
            message:''
        }

        var sendMoneyUserInputs;

        var imageMetaData ='';
        var videoMetaData ='';
        var audioMetaData ='';

        return {
                setImageMetaData:function(data){
                  imageMetaData = data;
                },
                getImageMetaData:function(){
                  return imageMetaData;
                },
                setVideoMetaData:function(data){
                    videoMetaData = data;
                },
                getVideoMetaData:function(){
                    return videoMetaData;
                },
                setAudioMetaData:function(data){
                    audioMetaData = data;
                },
                getAudioMetaData:function(){
                    return audioMetaData;
                },

                getAccountDetail:function(){
                    return accountDetail;
                },
                setAccountDetail:function(data){
                    accountDetail=data;
                },
                resetAccountDetail:function(data){
                    accountDetail={
                       id:'',
                       accountNumber:'',
                       accountType:'',
                       currency:'',
                       availableBalance:'',
                       dayLimit:'',
                       transactionLimit:''
                    }
                },
                findAccountDetailById:function(id){
                    return _.find(accountDetails,function(account){ return account.id == id; });
                },
                getAccountDetails:function(){
                    accountDetails = getAccountDetails();
                    return accountDetails;
                },
                getSendMoneyUserInputs: function(){
                    return sendMoneyUserInputs;
                },
                setSendMoneyUserInputs: function(data){
                    sendMoneyUserInputs = data;
                },
                resetSendMoneyUserInputs:function(){
                    sendMoneyUserInputs = angular.copy(sendMoneyInitialUserInputs);
                },
                resetImageMetaData:function(){
                    imageMetaData = '';
                },
                resetAudioMetaData:function(){
                    audioMetaData = '';
                },
                resetVideoMetaData:function(){
                    videoMetaData = '';
                }

        };
}]);