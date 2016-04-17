'use strict';
tcbmwApp.factory('askMoneyFactory', ['_',function(_){
    var accountDetail={
        "id":'',
        "accountName":'',
        "accountNumber":'',
        "accountType":'',
        "availableBalance":'',
        "dayLimit":'',
        "transactionLimit":''
    }

    var askMoneyInitialUserInputs ={
        amount:'',
        message:''
    }

    var askMoneyUserInputs;

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
            return askMoneyUserInputs;
        },
        setSendMoneyUserInputs: function(data){
            askMoneyUserInputs = data;
        },
        resetSendMoneyUserInputs:function(){
            askMoneyUserInputs = angular.copy(askMoneyUserInputs);
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