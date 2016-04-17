'use strict';
//To fetch user details and balance from backend
tcbmwApp.factory('friendFactory', function(){
    var friendUser ={
        name:'',
        mobileNumber:'',
        friendType:'',
        photo:'',
        socialType:''
    };
    var choosenSocial = '';
    var friendPhoto = '';
    var requestMoneyType = '';
    return {
        getFriendList:function(social) {
            console.log(social);
            var friendList =[];
            for(var idx in session.friends) {
                var friend = session.friends[idx];
                if (friend.socials.social.length === undefined) {
                    if (friend.socials.social["$"] == social) {
                        friendList.push(friend);
                    }
                } else {
                    //more than one account
                    for(var idx in friend.socials.social) {
                        if (friend.socials.social[idx]["$"] == social) {
                            friend.id = friend.socials.social[idx]["$"] + "_" + friend.socials.social[idx]["@id"];
                            friendList.push(friend);
                        }
                    }
                }
            }
            return friendList;
        },
        setFriendPhoto:function(data){
          friendPhoto = data;
        },
        getFriendPhoto : function(){
            return friendPhoto;
        },
        setChoosenSocial: function(data) {
          choosenSocial = data;  
        },
        getChoosenSocial: function() {
          return choosenSocial;  
        },
        setFriendUser:function(data){
            friendUser = data;
        },
        getFriendUser:function(){
            return friendUser;
        },
        setRequestMoneyType:function(data){
            requestMoneyType = data;
        },
        getRequestMoneyType:function(){
            return requestMoneyType;
        },
        resetFriendUser:function(){
            friendUser ={
               name:'',
               mobileNumber:'',
               friendType:'',
               photo:''
            };

            requestMoneyType ='';

            friendPhoto ='';
        }
    };

});