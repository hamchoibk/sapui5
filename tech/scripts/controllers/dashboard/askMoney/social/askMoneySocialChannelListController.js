'use strict';
tcbmwApp.controller('askMoneySocialChannelListController',['$scope','$state','$filter','friendFactory','FavouritesFactory','SocialFactory',function($scope,$state,$filter,friendFactory,FavouritesFactory,SocialFactory){
    $scope.friend = {};
    $scope.favourites=FavouritesFactory.findAll();
    var showFavourites=false;
    
    if(FavouritesFactory.findAll().length>0){
            showFavourites=true;
    };
    $scope.showFavourites= showFavourites;
    $scope.selectFavourite=function(favourite){
        var friendObj;
        if (favourite.socials.social.length === undefined)
            friendObj={
                name:favourite.profile.name,
                mobileNumber:(favourite.socials.social["$"] != "mobile")?favourite.id:favourite.socials.social["@id"],
                socialType:favourite.recentChannel == "mobile"?"SMS":favourite.recentChannel,
                friendDetail: favourite
            };
        else 
        {
            for(var idx in favourite.socials.social) {
                if (favourite.socials.social[idx]["$"] == favourite.recentChannel) {
                    friendObj={
                        name:favourite.profile.name,
                        mobileNumber:(favourite.socials.social[idx]["$"] == "mobile")?favourite.socials.social[0]["@id"]:favourite.id,
                        socialType:favourite.recentChannel == "mobile"?"SMS":favourite.recentChannel,
                        friendDetail: favourite
                    };
                    break;
                }
            }
        }
        friendFactory.setFriendUser(friendObj);

        if(favourite.profile.photo != undefined)
            friendFactory.setFriendPhoto(favourite.profile.photo);
        else
            friendFactory.setFriendPhoto('');

        friendFactory.setChoosenSocial(favourite.recentChannel);

        $state.go('askMoneySocialMain');
    }
    var baseStatus = {
        isBack: true,
        onBack: function() {
            $state.go('askMoneySocialMain');
            var newIndex = statuses.indexOf($scope.status) - 1;
            if (newIndex > -1) {
                $scope.status = statuses[newIndex];
                $scope.status.move = 'ltr';
                $scope.navigationBarStatus = $scope.status;
            }
        },
        isClose:true,
        onAction: function() {
            $state.go('dashboard.home');

            var newIndex = statuses.indexOf($scope.status) - 1;
            if (newIndex > -1) {
                $scope.status = statuses[newIndex];
                $scope.status.move = 'ltr';
                $scope.navigationBarStatus = $scope.status;
            }
        }
    };

    var statuses = [
        angular.extend({title: 'NAVBAR_ASKMONEY_SOCIAL_CHANNELLIST'}, baseStatus)
    ];
    $scope.status = statuses[0];

    var successCallback = function(success){

        var friendObject = {
            name:success.name,
            mobileNumber:formatLocal("vn",success.phoneNumber).replace(/[^0-9]/g,""),
            socialType: "SMS",
            friendDetail:{photo:'images/icon-sms.png',fromContact:true}
        };

        if (friendObject.mobileNumber == session.msisdn) {
            MessageBox("","ASK_MONEY_EWALLET_ERROR_YOURSELF");
            friendFactory.resetFriendUser();
        } else {
            friendFactory.setChoosenSocial('sms');
            friendFactory.setFriendUser(friendObject);
            friendFactory.setFriendPhoto('images/icon-sms.png');
        }
        $state.go('askMoneySocialMain');

    };

    var error = function(error){
        MessageBox('Error \r\n'+error.statusMsg);
    };

    $scope.clickSMS=function(){
        TCBNativeBridge.getAddressBook(successCallback,error,'SMS');
    }

    var successUrl = "http://www.techcombank.com.vn";
    var errorUrl = "http://tcb832402904.vn/error.html";
    function clearSuccess() {
            
    }
    function clearError() {

    }
    function clearCookie() {

        if (isAndroid && window.cookies.clearExcept) {
            window.cookies.clearExcept(clearSuccess, clearError, mc.url);
        } else {
            if (window.cookies && !isAndroid) {
                window.cookies.clear(clearSuccess);
            }
        }
    }
    $scope.clickFacebook = function() {
        session.selectFriendFrom = "askMoneySocialMain";

        if (isLinkedWith("fb")) {
            friendFactory.setChoosenSocial("fb");
            $state.go("selectFromFriendList");
        }else{
            $scope.addingSocial = "fb";

            $scope.loading = true;
            $rootScope.safetyApply(function(){});
            mc.getSocialUrl(socialUrlBack, "fb", successUrl, errorUrl);
        }
    };
    $scope.clickGoogle = function() {
        session.selectFriendFrom = "askMoneySocialMain";

        if (isLinkedWith("google")) {
            friendFactory.setChoosenSocial("google");
            $state.go("selectFromFriendList");
        }else{
            $scope.addingSocial = "google";

            $scope.loading = true;
            $rootScope.safetyApply(function(){});
            mc.getSocialUrl(socialUrlBack, "google", successUrl, errorUrl);
        }
    };

    function socialUrlBack(r) {

        if (r.Status.code == "0") {
            var data = JSON.parse(r.jsonString);
            console.log(data);
            if (isAndroid || isiOsDevice) {
                clearCookie();
                var ref = window.open(data.url, '_blank', 'location=yes');
                $scope.closeByUser = true;
                ref.addEventListener('exit', function(event) { 
                    if ($scope.closeByUser) {
                        mc.getUserDetails(getUserDetailBack);
                        mc.getFavoriteFriends(getFavoriteFriendBack);
                    }
                });
                ref.addEventListener('loadstart', function (event) {
                    console.log(event.url);
                    if (event.url.indexOf(successUrl) == 0) {
                        $scope.closeByUser = false;
                        ref.close();

                        //update user details
                        mc.getUserDetails(getUserDetailBack);
                        mc.getFavoriteFriends(getFavoriteFriendBack);
                    } /*else if (isAndroid) {
                        var url;
                        if (event.url.indexOf("fastacash.com") > 0) {
                            //it's staging url, the server was blocked, so we have to post this manually
                            $scope.loading = true;
                            $rootScope.safetyApply(function(){});
                            $scope.closeByUser = false;
                            ref.close();

                            jQuery.ajax({
                                    url: event.url,
                                    cache: false,
                                    beforeSend: function (jqXHR, settings) {
                                        jqXHR.url = settings.url;
                                    }
                                })
                                .error(function (jqXHR) {
                                    //failed
                                    //console.log(this,jqXHR.url);
                                    if(jqXHR.url.indexOf("error=access_denied")!=-1){
                                    }else{
                                        MessageBox($filter('translate')("SOCIAL_CONNECT_THIS_SOCIAL_IS_ALREADY_REGISTERED_TO_ANOTHER_ACCOUNT"));
                                    }
                                    if ($scope.addingSocial == "fb")
                                        $scope.fbSwitch = false;
                                    else
                                        $scope.gpSwitch = false;
                                    $scope.loading = false;
                                    $rootScope.safetyApply(function(){});
                                }).done(function (text) {
                                    //
                                    //console.log(text);
                                    mc.getUserDetails(getUserDetailBack);

                                });


                        }
                    } */else {
                        //Fail
                        if (event.url.indexOf(errorUrl) == 0) {
                            $scope.closeByUser = false;
                            ref.close();

                            if(event.url.indexOf("error_code=0x0103")!=-1){
                                MessageBox($filter('translate')("SOCIAL_CONNECT_USER_DENIED_PERMISSIONS"));
                            }else{
                                MessageBox($filter('translate')("SOCIAL_CONNECT_THIS_SOCIAL_IS_ALREADY_REGISTERED_TO_ANOTHER_ACCOUNT"));
                            }
                            if ($scope.addingSocial == "fb")
                                $scope.fbSwitch = false;
                            else
                                $scope.gpSwitch = false;
                            $scope.loading = false;
                            $rootScope.safetyApply(function(){});
                        }
                    }

                });
            } else {
                $scope.loading = false;
                $rootScope.safetyApply(function(){});
                window.open(data.url);
            }
        } else {
            $scope.loading = false;
            $rootScope.safetyApply(function(){});
            ErrorBox(r.Status);
        }
    }

    function getUserDetailBack(r) {
        session.cachedSocialTrasactions = false;
        if (r.Status.code == "0") {
            var userSocials = JSON.parse(r.jsonString);
            if (userSocials.user !== undefined && userSocials.user != null) {
                var previousProfile = angular.extend({},session.user.profile);
                var socialProfile = userSocials.user.profile;
                session.user = angular.extend({}, userSocials.user);
                session.user.profile = previousProfile;

                if (!localStorage.getItem(Sha256.hash("" +session.customer.id) + "profilePicture") && socialProfile && socialProfile.photo ) {
                    if (socialProfile.photo) {
                        session.user.profile.photo = socialProfile.photo + "?type=normal";
//                        $scope.profile.photo = session.user.profile.photo;
                    }
                    else {
                        session.user.profile.photo = "images/profile-placeholder.png";
                        $scope.profile.photo = session.user.profile.photo;
                    }
                }
                mc.getFriends(getFriendBack);
            }
        } else {
            ErrorBox(r.Status);
            $scope.loading = false;
            $rootScope.safetyApply(function(){});
        }
    }

    function getFriendBack(r) {
        $scope.loading = false;
        $rootScope.safetyApply(function(){});
        if (r.Status.code == "0") {
            var data = JSON.parse(r.jsonString);
            if (data.friend != null && data.friend.length === undefined)
                data.friend = [data.friend];
            session.friends = data.friend;
            for (var i in session.friends) {
                var underscorePos = session.friends[i].id.indexOf("_");
                var type = session.friends[i].id.substr(0, underscorePos);
                if (type == "google")
                    type = "gplus";
                session.friends[i].type = type;
            }

            friendFactory.setChoosenSocial($scope.addingSocial);

             if(!$scope.closeByUser)
                  $state.go('selectFromFriendList');
        }
    }

    function getFavoriteFriendBack(r) {

        if (r.Status.code == "0") {
            var data = JSON.parse(r.jsonString);
            if (data.friend != null && data.friend.length === undefined)
                data.friend = [data.friend];

            for(var ii = data.friend.length-1; ii >=0 ; ii--) {
                //console.log(ii);
                if (data.friend[ii] === undefined) {
                    data.friend.splice(ii,1);
                    continue;
                }
                var underscorePos = data.friend[ii].id.indexOf("_");
                var type = data.friend[ii].id.substr(0,underscorePos);
                if (type == "google")
                    type = "gplus";
                data.friend[ii].type = type;
                if(data.friend[ii].profile == null && type != "mobile") {
                    data.friend.splice(ii,1);
                    continue;
                }

            }
            session.favoriteFriends = data.friend;
            for(var idx in session.favoriteFriends) {
                if (session.favoriteFriends[idx].socials!= null) {
                    if (session.favoriteFriends[idx].type == "mobile" && !session.favoriteFriends[idx].profile) {
                        session.favoriteFriends[idx].profile = {name:session.favoriteFriends[idx].socials.social["@id"],photo:"images/profile-placeholder.png"};
                    }
                }
            }
            //console.log(data);
        }
    }
}]);