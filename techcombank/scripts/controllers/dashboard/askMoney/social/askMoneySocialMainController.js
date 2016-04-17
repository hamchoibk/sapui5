'use strict';
tcbmwApp.controller('askMoneySocialMainController',['$scope','$state','friendFactory','askMoneyFactory',function($scope,$state,friendFactory,askMoneyFactory){
    $scope.isMetaDataAdded = false;
    $scope.friend={};

    $scope.isPhototaken = false;
    $scope.isVideotaken = false;
    $scope.isAudiotaken = false;
    friendFactory.setRequestMoneyType('askMoney');
    if ( $state.current.name == 'askMoneySocialMain'){
        var baseStatus = {
            isBack: true,
            onBack: function() {
                session.askMoneyUserInputs = null;
                friendFactory.resetFriendUser();
                askMoneyFactory.resetAccountDetail();
                askMoneyFactory.resetSendMoneyUserInputs();

                askMoneyFactory.resetVideoMetaData();
                askMoneyFactory.resetAudioMetaData();
                askMoneyFactory.resetImageMetaData();
                $state.go('dashboard.askMoney');

                var newIndex = statuses.indexOf($scope.status) - 1;
                if (newIndex > -1) {
                    $scope.status = statuses[newIndex];
                    $scope.status.move = 'ltr';
                    $scope.navigationBarStatus = $scope.status;
                }
            },
            isClose:true,
            onAction: function() {
                session.askMoneyUserInputs = null;
                friendFactory.resetFriendUser();
                $state.go('dashboard.home');
                askMoneyFactory.resetAccountDetail();
                askMoneyFactory.resetSendMoneyUserInputs();
                askMoneyFactory.resetVideoMetaData();
                askMoneyFactory.resetAudioMetaData();
                askMoneyFactory.resetImageMetaData();
                var newIndex = statuses.indexOf($scope.status) - 1;
                if (newIndex > -1) {
                    $scope.status = statuses[newIndex];
                    $scope.status.move = 'ltr';
                    $scope.navigationBarStatus = $scope.status;
                }
            }
        };

        var statuses = [
            angular.extend({title: 'NAVBAR_ASKMONEY_SOCIAL_MAIN'}, baseStatus)
        ];

        $scope.status = statuses[0];
    }
    $scope.askMoneyUserInputs = session.askMoneyUserInputs;

    if(!$scope.askMoneyUserInputs||$scope.askMoneyUserInputs.amount==null||$scope.askMoneyUserInputs.amount==''||$scope.askMoneyUserInputs.amount<=0)
        $scope.validAmount=false;
    else
        $scope.validAmount=true;

    // init data
    var image = document.getElementById('photoImage');
    if ( !$scope.isPhototaken ){
        var image = angular.element("#photoImage");
        image.attr("src","images/32-camera.png");
        $('li p.photoShow').show();
    }
    var video = document.getElementById('videoImage');
    if ( !$scope.isVideotaken ){
        var video = angular.element("#videoImage");
        video.attr('src','images/32-video.png');
        $('li p.videoShow').show();
    }
    var audio = document.getElementById('audioImage');
    if ( !$scope.isAudiotaken){
        var audio = angular.element("#audioImage");
        audio.attr('src','images/32-audio.png');
        $('li p.audioShow').show();
    }

    var fname = friendFactory.getFriendUser();
    console.log('Selected fname.mobileNumber :'+ fname.mobileNumber);
    if ( fname.name == '')
    {
        $scope.friend = getMessage('SEND_MONEY_SELECT_FRIEND');
        $scope.friendSelected = false;
        $('button.askToWhom').addClass('show');

        $('div.askToWhom').removeClass('show');
        $('div.askToWhom').addClass('hide');
    }
    else
    {
        $('button.askToWhom').removeClass('show');
        $('button.askToWhom').addClass('hide');
        $('div.askToWhom').addClass('show');
        $scope.friend = ""+fname.name;
        $scope.friendPhoto = friendFactory.getFriendPhoto();
        if ( fname.friendDetail.fromContact){
            $scope.friendNumber = fname.mobileNumber;
        }else{
            $scope.friendNumber = '';
        }
        $scope.friendSelected = true;
    }
    $scope.channelType = friendFactory.getChoosenSocial();

    var imgData=askMoneyFactory.getImageMetaData();
    if(imgData==''){
        $scope.isPhototaken = false;
        var image = angular.element("#photoImage");
        image.attr("src","images/32-camera.png");
        $('li p.photoShow').show();
    }
    else{
        $scope.isPhototaken = true;
        var image = angular.element("#photoImage");
        image.attr("src","data:image/jpeg;base64," + imgData.data);
        $('li p.photoShow').hide();
    }

    var videoData=askMoneyFactory.getVideoMetaData();
    if(videoData==''){
        $scope.isVideotaken = false;
        var video = angular.element("#videoImage");
        video.attr('src','images/32-video.png');
        $('li p.videoShow').show();
    }
    else{
        $scope.isVideotaken = true;
        var video = angular.element("#videoImage");
        video.attr('src','data:image/jpeg;base64,' + videoData.data);
        $('li p.videoShow').hide();
    }

    var audioData=askMoneyFactory.getAudioMetaData();
    if(audioData==''){
        $scope.isAudiotaken = false;
        var audio = angular.element("#audioImage");
        audio.attr('src','images/32-audio.png');
        $('li p.audioShow').show();
    }
    else{
        $scope.isAudiotaken = true;
        var audio = angular.element("#audioImage");
        audio.attr('src','images/audio_icon.png');
        $('li p.audioShow').hide();
    }

    $scope.channelType = friendFactory.getChoosenSocial();
    var successCallback = function(responseDict){
        var response = {
            data : responseDict.imageData,
            photoCapture:responseDict.isPhotoCaptured
        };
        var image = angular.element("#photoImage");
        if ( response.photoCapture == 'true'){
            $scope.isPhototaken = true;
            image.attr("src","data:image/jpeg;base64," + response.data);
            $('li p.photoShow').hide();
            askMoneyFactory.setImageMetaData(response);
        }else{
            $scope.isPhototaken = false;
            image.attr("src","images/32-camera.png");
            $('li p.photoShow').show();
            askMoneyFactory.setImageMetaData('');

        }
    };

    var error = function(error){
        if ( error === 'ERROR_CAMERA_DEVICE'){
            MessageBox('ERROR_CAMERA_DEVICE');
        }
    };

    $scope.clickPhoto = function(){
        if ( $scope.isPhototaken){
            TCBNativeBridge.getPicture(successCallback,error,'removePhoto');
        }else{
            TCBNativeBridge.getPicture(successCallback,error,'Photo');
        }
    };

    // video success & error callback
    var videoSuccessCallback = function(responseDict){
        var responseVideo = {
            data : responseDict.videoData,
            videoCapture:responseDict.isVideoCaptured
        };
        var video = angular.element("#videoImage");
        if (responseVideo.videoCapture == 'true') {
            $scope.isVideotaken = true;
            video.attr('src',"data:image/jpeg;base64," + responseVideo.data);
            $('li p.videoShow').hide();
            askMoneyFactory.setVideoMetaData(responseVideo);


        }else{
            $scope.isVideotaken = false;
            video.attr('src','images/32-video.png');
            $('li p.videoShow').show();
            askMoneyFactory.setVideoMetaData('');

        }
    };

    var videoError = function(videoError){
        if ( videoError === 'ERROR_CAMERA_DEVICE'){
            MessageBox('ERROR_CAMERA_DEVICE');
        }
    };

    $scope.clickVideo = function(){
        if ( $scope.isVideotaken ){
            TCBNativeBridge.getVideo(videoSuccessCallback,videoError,'removeVideo');
        }else{
            TCBNativeBridge.getVideo(videoSuccessCallback,videoError,'Video');
        }

    };

    var audioSuccessCallback = function(responseDict){
        var responseAudio = {
            audioCapture :responseDict.isAudioCapture
        };
        var audio = angular.element('#audioImage');

        if ( responseAudio.audioCapture == 'true'){
            $scope.isAudiotaken = true;
            audio.attr('src','images/audio_icon.png');
            $('li p.audioShow').hide();
            askMoneyFactory.setAudioMetaData(responseAudio);

        }else{
            $scope.isAudiotaken = false;
            audio.attr('src','images/32-audio.png');
            $('li p.audioShow').show();
            askMoneyFactory.setAudioMetaData('');

        }
    };

    var audioError = function(error){
        if ( error === 'ERROR_MICROPHONE_DEVICE'){
            MessageBox('ERROR_MICROPHONE_DEVICE');
        }
    };

    $scope.clickAudio = function(){
        if ( $scope.isAudiotaken ){
            TCBNativeBridge.getAudio(audioSuccessCallback,audioError,'removeAudio');
        }else{
            TCBNativeBridge.getAudio(audioSuccessCallback,audioError,'Audio');
        }
    };

    $('input#amount').focus(function() {
         $(this).prop('type', 'number').val($scope.askMoneyUserInputs.amount);
    }).blur(function() {
         var self = $(this);
         var value = self.val();
         $scope.askMoneyUserInputs.amount=value;

         $scope.askMoneyUserInputs.parsedAmount='';

        if(value) {
            var intValue = parseInt(value);
            if (intValue <50000)
                MessageBox("ASK_MONEY_VIA_EWALLET_VALIDATE_AMOUNT");

            $scope.askMoneyUserInputs.parsedAmount = parseInt(value).formatMoney(0);
        }

         self.data('number', value).prop('type', 'text').val($scope.askMoneyUserInputs.parsedAmount);
    });

    $scope.change=function(){
        $scope.askMoneyUserInputs.amount = parseInt($scope.askMoneyUserInputs.parsedAmount);
        if($scope.askMoneyUserInputs.parsedAmount&&parseInt($scope.askMoneyUserInputs.parsedAmount)>0)
            $scope.validAmount=true;
        else
            $scope.validAmount=false;

    };

    //$scope.isMetaDataAdded = false;

    $scope.clickSend = function(){
        session.askMoneyUserInputs = $scope.askMoneyUserInputs;
        session.friendName = $scope.friend;
        $state.go('askMoneySocialConfirm');
    };
    $scope.clickSendToWhom = function(){
        session.askMoneyUserInputs = $scope.askMoneyUserInputs;
        $('div.askToWhom').removeClass('show');
        friendFactory.setRequestMoneyType('askMoney');
        $state.go('askMoneySocialList');
    };


}]);