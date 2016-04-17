'use strict';
tcbmwApp.controller('sendMoneyPreConfirmController',['$scope','$state','$rootScope','friendFactory','sendMoneyTransferFactory',function($scope,$state,$rootScope,friendFactory,sendMoneyTransferFactory){

    $scope.isMetaDataAdded = false;
    //$scope.friend={};
    var baseStatus = {
        isBack: true,
        onBack: function() {
            $state.go('sendMoney');
            var newIndex = statuses.indexOf($scope.status) - 1;
            if (newIndex > -1) {
                $scope.status = statuses[newIndex];
                $scope.status.move = 'ltr';
                $scope.navigationBarStatus = $scope.status;
            }
        }
    };

    var statuses = [
        angular.extend({title: 'NAVBAR_TRANSFER_SEND_PRECONFIRM'}, baseStatus)
    ];

    $scope.status = statuses[0];
    $scope.friend = friendFactory.getFriendUser();
    $scope.account= sendMoneyTransferFactory.getAccountDetail();
    $scope.transferFee = parseInt(session.transit_value.transferFee).formatMoney(0);
    console.log('Friend is '+$scope.friend.socialType);

    $scope.showMobile=false;

    var smsFromFavourite = false;
    if(!$scope.friend.friendDetail.profile.fromContact && $scope.friend.socialType== "SMS") {
        smsFromFavourite = true;
    }

    if ( $scope.friend.socialType == 'SMS' && !smsFromFavourite){
        console.log("Tao chon sms tu favourite roi day nhe");
        $scope.channelType = 'sms';
        $scope.showMobile=true;
    }else if ($scope.friend.socialType == 'google' ){
        $scope.channelType = 'gplus';
    }
    else if ( $scope.friend.socialType == 'fb'){
        $scope.channelType = 'fb';
    }

    $scope.userInputs = sendMoneyTransferFactory.getSendMoneyUserInputs();
    $scope.friendName = $scope.friend.name;
    $scope.accountDetail = sendMoneyTransferFactory.getAccountDetail();

    $scope.currencyCode = 'VND';
    $scope.senderAmount = parseInt($scope.userInputs.amount).formatMoney(0);

    // Get the meta data from the factory.
    var imageData = sendMoneyTransferFactory.getImageMetaData();
    $scope.imageCapture = imageData.photoCapture;
    var image = angular.element("#photoImage");
    if ( imageData.photoCapture){
        image.attr('src','data:image/jpeg;base64,' + imageData.data);
    }
    var videoData = sendMoneyTransferFactory.getVideoMetaData();
    $scope.videoCapture = videoData.videoCapture;
    var video = angular.element("#videoImage");
    if ( videoData.videoCapture){
        video.attr("src", "data:image/jpeg;base64," + videoData.data);
    }

    var audioData = sendMoneyTransferFactory.getAudioMetaData();
    $scope.audioCapture = audioData.audioCapture;
    var audio = angular.element("#audioImage");
    if ( audioData.audioCapture == 'true'){
        audio.attr("src","images/audio_icon.png");
    }
    var uploadingProgress = 0;
    var uploadItems = [];
    $scope.clickConfirm = function() {
        $scope.loadingText = "";
        metadataList = [];
        uploadItems = [];
        if ( imageData.photoCapture ){
            //uploadingProgress++;
            //$scope.loadingText = "Uploading...";
            //mc.getUploadUrl(getPictureCallback,"image","http://test.com");
            uploadItems.push("image");
        }

        if (videoData.videoCapture){
            /*uploadingProgress++;
            $scope.loadingText = "Uploading...";
            mc.getUploadUrl(getVideoCallback,"video","http://test.com");*/
            uploadItems.push("video");
        }

        if ( audioData.audioCapture ){
            /*uploadingProgress++;
            $scope.loadingText = "Uploading...";
            mc.getUploadUrl(getAudioCallback,"audio","http://test.com");*/
            uploadItems.push("audio");
        }
        if ($scope.userInputs.message != null && $scope.userInputs.message != "") {
            uploadItems.push("text");
        }
        $scope.loading = true;
        $rootScope.safetyApply(function(){});
        if (uploadItems.length == 0)
            mc.preAuthorisationContinue(appLoadConfirmBack,session.transit_value.sysid);
        else {
            uploadDataItem();
        }
    };
    function uploadDataItem() {
        if (uploadItems.length>0) {
            
            var item = uploadItems.shift();
            console.log(uploadItems,item);
            switch (item) {
                case "image":
                    mc.getUploadUrl(getPictureCallback,item,"http://www.google.com");
                    break;
                case "video":
                    mc.getUploadUrl(getVideoCallback,item,"http://www.google.com");
                    break;
                case "audio":
                    mc.getUploadUrl(getAudioCallback,item,"http://www.google.com");
                    break;
                case "text":
                    //mc.getUploadUrl(getTextCallback,item,"http://test.com");
                    completeUpload("text",$scope.userInputs.message);
                    break;
            }
        }
    };
    var successCallback = function(responseDict){
        console.log('ResponseData :'+ responseDict);
        var resp = {
            isUpload : responseDict.isUpload,
            uploadType: responseDict.type,
            publicId:responseDict.public_id
        };
        //
        console.log(resp.isUpload);
        //
        console.log(resp.publicId);
        //
        console.log(resp.uploadType);
        if ( resp.isUpload ){
            completeUpload(resp.uploadType,resp.publicId);
        }
    };
    
   
    var error = function(error){
        MessageBox(error);
    };
    /*function getTextCallback(r) {
        if (r.Status.code == "0") {
            var data = JSON.parse(r.jsonString);
            //TCBNativeBridge.uploadData(successCallback,error,'Photo',data);
            var url = data.url;
            jQuery.post(url,{text:$scope.userInputs.message}).done(successTextCallback);
        } else {
            ErrorBox(r.Status);
        }
    }*/
    function uploadError() {
        if (uploadItems.length == 0) {
            //done upload/attach metadata
            mc.preAuthorisationContinue(appLoadConfirmBack,session.transit_value.sysid);
        } else {
            uploadDataItem();
        }
        
    }
    function getPictureCallback(r) {
        if (r.Status.code == "0") {
            var data = JSON.parse(r.jsonString);
            TCBNativeBridge.uploadData(successCallback,uploadError,'Photo',data);
        } else {
            ErrorBox(r.Status);
        }
    }

    function getVideoCallback(r) {
        if (r.Status.code == "0") {
            var data = JSON.parse(r.jsonString);
            TCBNativeBridge.uploadData(successCallback,uploadError,'Video',data);
        } else {
            ErrorBox(r.Status);
        }
    }

    function getAudioCallback(r) {
        if (r.Status.code == "0") {
            var data = JSON.parse(r.jsonString);
            TCBNativeBridge.uploadData(successCallback,uploadError,'Audio',data);
        } else {
            ErrorBox(r.Status);
        }
    }

    var metadataList = [];
    function completeUpload(type, public_id) {
        console.log(type, public_id);
        mc.completeUpload(completeUploadCallback, type, public_id);
        function completeUploadCallback(r) {
            if (r.Status.code == "0") {
                var data = JSON.parse(r.jsonString);
                //
                var metadataId = data.meta_id;
                //
                //console.log(data);
                
                mc.attachMetadata(attachMetadataBack, type, metadataId, session.transit_value.fastalink);
            }
        }
        
    }
    
    function attachMetadataBack(r) {
        if (r.Status.code == "0") {
            
            
            if (uploadItems.length == 0) {
                //done upload/attach metadata
                var m = JSON.parse(r.jsonString);
                session.metadata = m;
                console.log(session.metadata);
                mc.preAuthorisationContinue(appLoadConfirmBack,session.transit_value.sysid);
            } else {
                uploadDataItem();
            }
        }
    }

    var otpSuccessCallBack = function(success){
        if ( success === 'MSG_SEND'){
            $state.go('sendMoneySuccess');
            return;
        }
    };

    var otpErrorBack = function(error){
        if ( error === 'MSG_CANCEL'){
          MessageBox('Cancelled by user');
          $state.go('sendMoneySuccess');
        }
    };

    var gplusSuccess = function(success){
        if ( success === 'GPLUS_MESSAGE_SEND_SUCCESS'){
            $state.go('sendMoneySuccess');
        }
    };

    var gplusError = function(error){
        if ( error === 'GPLUS_MESSAGE_SEND_CANCELLED'){
            MessageBox('Cancelled by user');
            $state.go('sendMoneySuccess');
        }
    }

    function appLoadConfirmBack(r) {
        
        if (r.Status.code == "0") {
            //Done, no OTP, move to last step
                var friendObject = $scope.friend.friendDetail;
                var linkDetail = session.transit_value.fastalink;
                //console.log($scope.friend.socialType);
                switch ($scope.friend.socialType ) {
                    case "SMS":
                        var resultType = {
                                'SMS':'SMS_SEND',
                                'friend':$scope.friend,

                                'message':''+ session.customer.displayName + ' has sent you VND '+$scope.userInputs.amount+ ' using Techcombank Wallet. Click on the fastalink to view the details. https://m.techcombank.com.vn/fastalink/' + linkDetail
                            };
                        /*try {
                            TCBNativeBridge.sendSMSToFriend(otpSuccessCallBack,otpErrorBack,resultType);
                        } catch (ex) {*/
                        $state.go('sendMoneySuccess');
                        //}
                        break;
                    case "fb":
                        var resultType ={
                            'message': 'Hi '+ $scope.friend.name + ' - I have sent you VND '+$scope.userInputs.amount+ ' using Techcombank Wallet. Click on the fastalink to view the details. https://m.techcombank.com.vn/fastalink/' + linkDetail
                        };
                        $state.go('sendMoneySuccess');
                        break;
                    case "google":
                        var resultType = {
                            'GPLUS':'GPLUS_SEND_MESSAGE',
                            'friend':$scope.friend,
                            'message': $scope.friend.name + ' gui toi ban VND '+$scope.userInputs.amount+ ' qua dich vu F@st Mobile Techcombank. Click link de xem chi tiet giao dich https://m.techcombank.com.vn/fastalink/' + linkDetail
                        };
                        try {
                            TCBNativeBridge.sendMessageToGooglePlusFriend(gplusSuccess,gplusError,resultType);
                        } catch (ex) {
                            $state.go('sendMoneySuccess');
                        }
                        break;
                }
        } else if (r.Status.code == "2521") {
            //OTP page
            $state.go('sendMoneyOTP');
        } else {
            //hideProgress();
			$scope.loading = false;
			$rootScope.safetyApply(function(){});
            ErrorBox(r.Status);
            appstate = trans.TRAN_IDLE;
        }
    }
}]);