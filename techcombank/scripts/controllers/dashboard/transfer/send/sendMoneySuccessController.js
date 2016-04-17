'use strict';
tcbmwApp.controller('sendMoneySuccessController',['$scope','$state','$filter','friendFactory','sendMoneyTransferFactory','dialogService','$rootScope',function($scope,$state,$filter,friendFactory,sendMoneyTransferFactory,dialogService,$rootScope){
    var baseStatus = {
        isHome:true,
        onHome: function() {
            friendFactory.resetFriendUser();
            sendMoneyTransferFactory.resetAudioMetaData();
            sendMoneyTransferFactory.resetImageMetaData();
            sendMoneyTransferFactory.resetVideoMetaData();
            sendMoneyTransferFactory.resetAccountDetail();
            sendMoneyTransferFactory.resetSendMoneyUserInputs();

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
        angular.extend({title: 'NAVBAR_TRANSFER_SEND_SUCCESS'}, baseStatus)
    ];
    mc.getFavoriteFriends(getFavoriteFriendBack);
    session.cachedSocialTrasactions = false;
    $scope.status = statuses[0];
    $scope.currencyCode = 'VND';
    var friend = friendFactory.getFriendUser();
    console.log("friend", friend);

     $scope.showImage=true;

     if (friend.socialType == "SMS") {
        $scope.showImage=false;
     }

    $scope.userInputs = sendMoneyTransferFactory.getSendMoneyUserInputs();
    var userInputsObject = sendMoneyTransferFactory.getSendMoneyUserInputs();

    console.log("$scope.userInputs", $scope.userInputs);
    console.log("userInputsObject", userInputsObject);

    $scope.amount = parseInt(userInputsObject.amount).formatMoney(0);
    $scope.transferFee = parseInt(session.transit_value.transferFee).formatMoney(0);
    $scope.totalAmount = (parseInt(session.transit_value.transferFee)+parseInt(userInputsObject.amount)).formatMoney(0);

    $scope.txnRef = session.transit_value.sysid;

    console.log("session.transit_value.sysid", session.transit_value.sysid);
    
    $scope.fastalink = "https://m.techcombank.com.vn/fastalink/" + session.transit_value.fastalink;
    $scope.date = (new Date()).format("dd/mm/yyyy");
    $scope.friend = friend;

//    $scope.fastalink = session.fastalink;
//    console.log("Fastalink = ", session.fastalink)
    if (session.metadata) {
        //
        console.log(session.metadata);
        var tmpMetadata = {};

        if (session.metadata.images) {
            //has image
            tmpMetadata.photo = session.metadata.images.image.preview[0]["$"];
        }
        if (session.metadata.videos) {
            //has video
            mc.getDownloadUrl(getVideoUrlBack, session.metadata.videos.video.id);
            tmpMetadata.video = {preview:session.metadata.videos.video.preview[0]["$"]};
        }
        if (session.metadata.audios) {
            //has audio
            tmpMetadata.audio = session.metadata.audios.audio.preview;
            mc.getDownloadUrl(getAudioUrlBack, session.metadata.audios.audio.id);
        }
        $scope.metadata = tmpMetadata;
    }
    session.metadata = null;
    // TODO ::working audio
    // TODO ::HUY to add audio link from get meta data details.
    $scope.audioInPlay = false;
    $scope.audioPlaylist = [
        {src:"",type:"audio/mpeg"}
    ];

    $scope.togglePlayState = function () {
        if($scope.audioInPlay){
            $scope.audioPlayer.pause();
            $scope.audioInPlay = false;
            return;
        }
        //Play the selected audio
        if(!$scope.audioInPlay){
            $scope.audioInPlay = true;
            $scope.audioPlayer.play();
        }
    };

    $scope.seek = function(event){
        event.stopPropagation();
        if ( $scope.audioInPlay){
            var seekBar = $(event.target);
            seekBar = seekBar.hasClass("progress") ? seekBar : seekBar.parents(".progress");
            $timeout(function(){
                $scope.audioPlayer.currentTime = ((event.clientX -  seekBar.offset().left) * $scope.audioPlayer.duration) / seekBar.width();
                $scope.audioPlayer.seek($scope.audioPlayer.currentTime);
            }, 0);
        }

    };

    var success = function(data){
        console.log(data);
    };

    var failure = function(data){
        console.log(data);
    };

    $scope.clickVideo = function(data){
        TCBNativeBridge.getVideoURL(success,failure,data);
    };

    var audioSuccess = function(data){

    };

    var audioFailure = function(data){

    };

    $scope.clickAudio = function(data){
        TCBNativeBridge.getAudioURL(audioSuccess,audioFailure,"local",data);
    };

    $scope.transactMore = function(){
        friendFactory.resetFriendUser();
        sendMoneyTransferFactory.resetAudioMetaData();
        sendMoneyTransferFactory.resetImageMetaData();
        sendMoneyTransferFactory.resetVideoMetaData();
        sendMoneyTransferFactory.resetAccountDetail();
        sendMoneyTransferFactory.resetSendMoneyUserInputs();

        $state.go('sendMoney');
    };

    $scope.clickDone = function(){
        friendFactory.resetFriendUser();
        sendMoneyTransferFactory.resetAudioMetaData();
        sendMoneyTransferFactory.resetImageMetaData();
        sendMoneyTransferFactory.resetVideoMetaData();
        sendMoneyTransferFactory.resetAccountDetail();
        sendMoneyTransferFactory.resetSendMoneyUserInputs();

        $state.go('dashboard.home');
    };

    $scope.clickCopyLink = function(){
        TCBNativeBridge.copyToClipboard(successCallback,error,$scope.fastalink);
    };

    var successCallback = function(){
        dialogService.showModal("SOCIAL_DETAIL_TRANSACTION_COPY_SUCCESS");
    };

    var error = function(error){
        dialogService.showModal("SOCIAL_DETAIL_TRANSACTION_COPY_ERROR");
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
                        $state.go('spreadluv');
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
            //console.log(data);
        }
    }

    function getVideoUrlBack(r) {
        //console.log(JSON.parse(r.jsonString));
        if (r.Status.code == "0") {
            var data = JSON.parse(r.jsonString);
            $scope.metadata.video.url = data.url;
            $rootScope.safetyApply(function(){});
        }
    }
    function getAudioUrlBack(r) {
        console.log(JSON.parse(r.jsonString));
        if (r.Status.code == "0") {
            var data = JSON.parse(r.jsonString);
            $scope.metadata.audio.url = data.url;
            $rootScope.safetyApply(function(){});
        }
        
    }
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
    }
    console.log("sendMoneySuccessController -- currentAccountIdx == ", currentAccountIdx);
    updateBalance();
}]);