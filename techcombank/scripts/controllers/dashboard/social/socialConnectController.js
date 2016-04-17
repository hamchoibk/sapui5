'use strict';

tcbmwApp.controller('SocialConnectController',['$scope','$state','$filter','SocialFactory','friendFactory','$rootScope',function($scope,$state,$filter,SocialFactory,friendFactory,$rootScope){
    var particulars=SocialFactory.getParticulars();

    console.log(particulars);
    //getting user details
    $scope.loading = true;
    mc.getUserDetails(getUserDetailBack2);
    if ( $state.current.name == 'dashboard.socialconnect'){
            var baseStatus = {
                isBack: true,
                onBack: function() {
                    SocialFactory.resetParticulars();
                    $state.go(particulars.prevState);

                    var newIndex = statuses.indexOf($scope.status) - 1;
                    if (newIndex > -1) {
                        $scope.status = statuses[newIndex];
                        $scope.status.move = 'ltr';
                        $scope.navigationBarStatus = $scope.status;
                    }
                }
            };

            var statuses = [
                angular.extend({title: 'NAVBAR_SOCIAL_CONNECT'}, baseStatus)
            ];

            $scope.status = statuses[0];
    }

        var ca = getCurrentAccount();
        if (ca != null) {
            $scope.account = ca;
            if(ca.balance.length<10){
                $('.amount').removeClass('small')
            }else{
                $('.amount').addClass('small')
            }
        }

        $scope.swapAccountValue = function(){
            var ca = getNextAccount();
            if (ca != null) {
                if(ca.balance.length<10){
                    $('.amount').removeClass('small')
                }else{
                    $('.amount').addClass('small')
                }

                $scope.account = ca;
                $rootScope.safetyApply(function(){});
            }
        };

    var profileImage = angular.element("#profileImage");
    profileImage.css("background-image", "images/profile-placeholder.png");

    $scope.profile = session.user.profile;
    $scope.fbSwitch=false;
    $scope.gpSwitch=false;
    updateSwitches();
    function updateSwitches() {
        $scope.fbSwitch=false;
        $scope.gpSwitch=false;
        if (session.user != null) {
            //change default state
            if (session.user.socials != null) {
                for(var idx in session.user.socials.social) {
                    var social = session.user.socials.social[idx];
                    switch (social["$"]) {
                        case "fb": 
                            if (social.invalid != true)
                                $scope.fbSwitch = true;
                            break;
                        case "google":
                            if (social.invalid != true)
                                $scope.gpSwitch = true;
                            break;
                        default:
                           break; 
                    }
                }
            }
        }
    }
        $scope.saveSocial=function(){
            if(particulars.prevState=='dashboard.socialindex'){
                SocialFactory.resetParticulars();
                $state.go('dashboard.socialindex');
            }
			else if(particulars.prevState=='dashboard.home'){
                SocialFactory.resetParticulars();
                $state.go('dashboard.home');
            }
            else{
                if(particulars.checkParameter=='fb'){
                    if($scope.fbSwitch){
                        friendFactory.setChoosenSocial(particulars.checkParameter);
                        SocialFactory.resetParticulars();
                        $state.go(particulars.trueLoad);
                    }
                    else{
                        SocialFactory.resetParticulars();
                        $state.go(particulars.prevState);
                    }
                }
                else if(particulars.checkParameter=='google'){
                    if($scope.gpSwitch){
                        friendFactory.setChoosenSocial(particulars.checkParameter);
                        SocialFactory.resetParticulars();
                        $state.go(particulars.trueLoad);
                    }
                    else{
                        SocialFactory.resetParticulars();
                        $state.go(particulars.prevState);
                    }
                }
            }
        }
        function clearSuccess() {
            
        }
        function clearError() {
            
        }
        function clearCookie() {
            
            if (isAndroid && window.cookies.clearExcept) {
                console.log("clear except");
                window.cookies.clearExcept(clearSuccess, clearError, mc.url);
            } else {
                if (window.cookies && !isAndroid) {
                    console.log("clear all");
                    window.cookies.clear(clearSuccess);
                }
            }
        }
        $scope.clickFacebook = function() {
            console.log($scope.fbSwitch);
            $scope.loading = true;
            $rootScope.safetyApply(function(){});
            addRemoveSocial("fb", $scope.fbSwitch);
        }
        $scope.clickGoogle = function() {
            console.log($scope.gpSwitch);
            $scope.loading = true;
            $rootScope.safetyApply(function(){});
            addRemoveSocial("google", $scope.gpSwitch);
        }
        var successUrl = "http://www.techcombank.com.vn";
        var errorUrl = "http://tcb832402904.vn/error.html";
        function addRemoveSocial(social, command) {
            if (command) {
                //Add a social
                $scope.addingSocial = social;
                mc.getSocialUrl(socialUrlBack, social, successUrl, errorUrl);
            } else {
                //Remove a social
                $scope.loading = true;
                $rootScope.safetyApply(function(){});
                mc.removeSocial(removeSocialBack, social);
            }
        }
        
        function socialUrlBack(r) {
            
            if (r.Status.code == "0") {
                var data = JSON.parse(r.jsonString);
                console.log(data);
                if (isAndroid || isiOsDevice) {
                    clearCookie();
                    if (data.url.indexOf("facebook")>=0) {
                        data.url = data.url.replace("www.facebook.com","m.facebook.com");
                    }
                    var ref = window.open(data.url, '_blank', 'location=yes');
                    $scope.closeByUser = true;
                        ref.addEventListener('exit', function(event) { 
                            
                            if ($scope.closeByUser) {
                                console.log("Close by user");
                                mc.getUserDetails(getUserDetailBack);
                                mc.getFavoriteFriends(getFavoriteFriendBack);
                            }
                        });
                        ref.addEventListener('loadstart', function(event) {

                            console.log("event = ", event);
                            if (event.url.indexOf( successUrl) == 0) {
                                    $scope.closeByUser = false;
                                    ref.close();
                                    
                                    //update user details
                                    MessageBox($filter('translate')("SOCIAL_CONNECT_ACCOUNT_ASSOCIATED_SUCCESSFULLY"));
                                    mc.getUserDetails(getUserDetailBack);
                                    mc.getFavoriteFriends(getFavoriteFriendBack);
                                } else {
                                    //Fail
                                    if (event.url.indexOf(errorUrl)==0) {
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
                            $scope.profile.photo = session.user.profile.photo;
                        }
                        else {
                            session.user.profile.photo = "images/profile-placeholder.png";
                            $scope.profile.photo = session.user.profile.photo;
                        }
                    }
                    updateSwitches();
                    $rootScope.safetyApply(function(){});
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
            if (data.friend != null && data.friend.length ===undefined)
                data.friend = [data.friend];
            session.friends = data.friend;
            for(var i in session.friends) {
                var underscorePos = session.friends[i].id.indexOf("_");
                var type = session.friends[i].id.substr(0,underscorePos);
                if (type == "google")
                    type = "gplus";
                session.friends[i].type = type;
            }
        }
    }
        function removeSocialBack(r) {
            $scope.loading = false;
            $rootScope.safetyApply(function(){});
            if (r.Status.code == "0") {
                MessageBox($filter('translate')('SOCIAL_CONNECT_SOCIAL_ACCOUNT_UNLINKED_UPDATING_FRIEND_LIST'));
                mc.getUserDetails(getUserDetailBack);
                mc.getFavoriteFriends(getFavoriteFriendBack);
            } else {
                ErrorBox(r.Status);
            }
        }
    function getUserDetailBack2(r) {
        $scope.loading = false;
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
                        $scope.profile.photo = session.user.profile.photo;
                    }
                    else {
                        session.user.profile.photo = "images/profile-placeholder.png";
                        $scope.profile.photo = session.user.profile.photo;
                    }
                }
                if (session.user.socials != null) {
                    //already registed with a social network
                    //get friend
                    updateSwitches();
                    mc.getFriends(getFriendBack);
                }

            }
            
        } else {
            ErrorBox(r.Status);
        }
        $rootScope.safetyApply(function(){});
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

