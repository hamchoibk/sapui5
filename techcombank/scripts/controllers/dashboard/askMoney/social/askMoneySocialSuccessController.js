'use strict';
tcbmwApp.controller('askMoneySocialSuccessController',['$scope','$state','$filter','friendFactory','dialogService','askMoneyFactory',function ($scope,$state,$filter,friendFactory,dialogService,askMoneyFactory) {
    if ( $state.current.name == 'askMoneySocialSuccess'){
        var baseStatus = {
            isHome:true,
            onHome: function() {
                session.askMoneyUserInputs = null;
                askMoneyFactory.resetAccountDetail();
                askMoneyFactory.resetSendMoneyUserInputs();
                friendFactory.resetFriendUser();

                askMoneyFactory.resetImageMetaData();
                askMoneyFactory.resetVideoMetaData();
                askMoneyFactory.resetAudioMetaData();
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
            angular.extend({title: 'NAVBAR_ASKMONEY_SOCIAL_SUCCESS'}, baseStatus)
        ];

        $scope.status = statuses[0];
    }
    mc.getFavoriteFriends(getFavoriteFriendBack);
    session.cachedSocialTrasactions = false;
    $scope.userInputs = session.askMoneyUserInputs;
    $scope.currencyCode = 'VND';
    $scope.askAmount = parseInt(session.askMoneyUserInputs.amount).formatMoney(0);
    var friend = friendFactory.getFriendUser();

    $scope.showImage=true;

    if (friend.socialType == "SMS") {
        friend.friendDetail.profile.photo = "images/profile-placeholder.png";
        $scope.showImage=false;
        var profile={
            photo:'images/profile-placeholder.png'
        };

        var friendDetail={
            profile:profile
        };

        friend.friendDetail=friendDetail;
    }

    $scope.expiredate = (new Date()).format("dd/mm/yyyy");
    $scope.friend = friend;
    $scope.fastalink = session.fastalink;
    mc.getLinkDetails(getLinkDetailsBack, session.fastalink);
   
//    $scope.audioInPlay = false;
//    $scope.audioPlaylist = [
//        {src:"",type:"audio/mpeg"}
//    ];

//    $scope.togglePlayState = function () {
//        if($scope.audioInPlay){
//            $scope.audioPlayer.pause();
//            $scope.audioInPlay = false;
//            return;
//        }
//        //Play the selected audio
//        if(!$scope.audioInPlay){
//            $scope.audioInPlay = true;
//            $scope.audioPlayer.play();
//        }
//    };
//
//    $scope.seek = function(event){
//        event.stopPropagation();
//        if ( $scope.audioInPlay){
//            var seekBar = $(event.target);
//            seekBar = seekBar.hasClass("progress") ? seekBar : seekBar.parents(".progress");
//            $timeout(function(){
//                $scope.audioPlayer.currentTime = ((event.clientX -  seekBar.offset().left) * $scope.audioPlayer.duration) / seekBar.width();
//                $scope.audioPlayer.seek($scope.audioPlayer.currentTime);
//            }, 0);
//        }
//
//    };



    $scope.clickTransactMore = function(){
        session.askMoneyUserInputs = null;
        askMoneyFactory.resetAccountDetail();
        askMoneyFactory.resetSendMoneyUserInputs();
        friendFactory.resetFriendUser();

        askMoneyFactory.resetImageMetaData();
        askMoneyFactory.resetVideoMetaData();
        askMoneyFactory.resetAudioMetaData();
        $state.go('dashboard.askMoney');
    };

    $scope.clickDone = function(){
        session.askMoneyUserInputs = null;
        askMoneyFactory.resetAccountDetail();
        askMoneyFactory.resetSendMoneyUserInputs();
        friendFactory.resetFriendUser();

        askMoneyFactory.resetImageMetaData();
        askMoneyFactory.resetVideoMetaData();
        askMoneyFactory.resetAudioMetaData();
        $state.go('dashboard.home');
    };

    $scope.clickSpreadLove = function(){
        if (isLinkedWith("fb")==false) {
            $scope.addingSocial = "fb";

            $scope.loading = true;
            $rootScope.safetyApply(function(){});
            mc.getSocialUrl(socialUrlBack, "fb", successUrl, errorUrl);
        } else {
            $state.go('spreadluv');
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
                        mc.getFavoriteFriends(getFavoriteFriendToShareBack);
                        console.log("tat me cua so di roi con dau");

                    }
                });
                ref.addEventListener('loadstart', function (event) {
                    console.log(event.url);
                    if (event.url.indexOf(successUrl) == 0) {
                        $scope.closeByUser = false;
                        ref.close();
                        //update user details
                        mc.getUserDetails(getUserDetailBack);
                        mc.getFavoriteFriends(getFavoriteFriendToShareBack);
                        $state.go('spreadluv');
                    } else {
                        //Fail
                        if (event.url.indexOf(errorUrl) == 0) {
                            $scope.closeByUser = false;
                            ref.close();
                            if(event.url.indexOf("error_code=0x0103")!=-1){
                                MessageBox($filter('translate')("SOCIAL_CONNECT_USER_DENIED_PERMISSIONS"));
                            }else{
                                MessageBox($filter('translate')("SOCIAL_CONNECT_THIS_SOCIAL_IS_ALREADY_REGISTERED_TO_ANOTHER_ACCOUNT"));
                            }
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
                    }
                    else {
                        session.user.profile.photo = "images/profile-placeholder.png";
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

        }
    }

    function getFavoriteFriendToShareBack(r) {

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

            $state.go('spreadluv');
            //console.log(data);
        }
    }

    $scope.clickCopyLink = function(){
        TCBNativeBridge.copyToClipboard(successCallback,error,"https://m.techcombank.com.vn/fastalink/"+$scope.fastalink);
    };

    var successCallback = function(){
        dialogService.showModal("SOCIAL_DETAIL_TRANSACTION_COPY_SUCCESS");
    };

    var error = function(error){
        dialogService.showModal("SOCIAL_DETAIL_TRANSACTION_COPY_ERROR");
    };

    var videoSuccess = function(data){
        console.log(data);
    };

    var videoFailure = function(data){
        console.log(data);
    };

    $scope.clickVideo = function(data){
        TCBNativeBridge.getVideoURL(videoSuccess,videoFailure,data);
    };

    var audioSuccess = function(data){

    };

    var audioFailure = function(data){

    };

    $scope.clickAudio = function(data){
        TCBNativeBridge.getAudioURL(audioSuccess,audioFailure,"local",data);
    };
    function getLinkDetailsBack(r) {
        if (r.Status.code == "0") {
            //
            var linkDetails = JSON.parse(r.jsonString);
            var metadata = linkDetails.link.metadata;
            if (metadata) {
                var tmpMetadata = {};

                if (metadata.images) {
                    //has image
                    tmpMetadata.photo = metadata.images[0].image.preview[0]["$"];
                }
                if (metadata.videos) {
                    //has video
                    mc.getDownloadUrl(getVideoUrlBack, metadata.videos[0].video.id);
                    tmpMetadata.video = {preview:metadata.videos[0].video.preview[0]["$"]};
                }
                if (metadata.audios) {
                    //has audio
                    tmpMetadata.audio = metadata.audios[0].audio.preview;
                    mc.getDownloadUrl(getAudioUrlBack, metadata.audios[0].audio.id)
                }
                $scope.metadata = tmpMetadata;
                $rootScope.safetyApply(function(){});
            }
        }   
    };
    function getVideoUrlBack(r) {
        //console.log(JSON.parse(r.jsonString));
        if (r.Status.code == "0") {
            var data = JSON.parse(r.jsonString);
            $scope.metadata.video.url = data.url;
            $rootScope.safetyApply(function(){});
        }
    };
    function getAudioUrlBack(r) {
        //console.log(JSON.parse(r.jsonString));
        if (r.Status.code == "0") {
            var data = JSON.parse(r.jsonString);
            $scope.metadata.audio.url = data.url;
            $rootScope.safetyApply(function(){});
        }
        
    };
    var success = function(data){
        console.log(data);
    };

    var failure = function(data){
        console.log(data);
    };
    function getFavoriteFriendBack(r) {
        
        if (r.Status.code == "0") {
            var data = JSON.parse(r.jsonString);
            if (data.friend != null && data.friend.length === undefined)
                data.friend = [data.friend];
            //session.favoriteFriends = data.friend;
            
            
            //remove unwanted friends
            //console.log(session.favoriteFriends.length);
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
                        session.favoriteFriends[idx].profile = {name:session.favoriteFriends[idx].socials.social["@id"],photo:"images/icon-sms.png"};
                    }
                }
            }
            //console.log(data);
        }
    };
}]);