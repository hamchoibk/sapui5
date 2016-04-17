'use strict';
tcbmwApp.controller('askMoneySocialConfirmController',['$scope','$state','friendFactory','askMoneyFactory','$rootScope',function ($scope,$state,friendFactory,askMoneyFactory,$rootScope) {
    if ( $state.current.name == 'askMoneySocialConfirm'){
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
            angular.extend({title: 'NAVBAR_ASKMONEY_SOCIAL_CONFIRM'}, baseStatus)
        ];

        $scope.status = statuses[0];
    }
    // Get the meta data from the factory.
    var imageData = askMoneyFactory.getImageMetaData();
    $scope.imageCapture = imageData.photoCapture;
    var image = angular.element("#photoImage");
    if ( imageData.photoCapture){
        image.attr("src", "data:image/jpeg;base64," + imageData.data);
    }else{
        image.remove();
    }

    var videoData = askMoneyFactory.getVideoMetaData();
    $scope.videoCapture = videoData.videoCapture;
    var video = angular.element("#videoImage");
    if ( videoData.videoCapture){
        video.attr("src", "data:image/jpeg;base64," + videoData.data);
    }else{
         video.remove();
    }

    var audioData = askMoneyFactory.getAudioMetaData();
    $scope.audioCapture = audioData.audioCapture;
    var audio = angular.element("#audioImage");
    if ( audioData.audioCapture == 'true'){
        audio.attr("src","images/audio_icon.png");
    }else{
       audio.remove();
    }
    $scope.userInputs = session.askMoneyUserInputs;

    var friend = friendFactory.getFriendUser();
    if (friend.socialType == "SMS" && friend.friendDetail !== undefined) {
       friend.friendDetail = {profile:{photo:"images/photo.png"}};
    }
    $scope.friend = friend;
    //console.log($scope.userInputs);
    $scope.currencyCode = 'VND';
    $scope.askAmount = parseInt(session.askMoneyUserInputs.amount).formatMoney(0);

    if ( $scope.friend.socialType == 'SMS'){
        $scope.channelType = 'sms';
        $scope.showMobile=false;
    }else if ($scope.friend.socialType == 'google' ){
        $scope.channelType = 'gplus';
    }
    else if ( $scope.friend.socialType == 'fb'){
        $scope.channelType = 'fb';
    }


    var uploadItems = [];
    $scope.clickConfirm = function(){
        //$state.go('askMoneySocialSuccess');
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
        if (uploadItems.length == 0) {
            askMoney();
        }
            //mc.preAuthorisationContinue(appLoadConfirmBack,session.transit_value.sysid);
        else {
            uploadDataItem();
        }
    }
    function uploadDataItem() {
        if (uploadItems.length>0) {
            
            var item = uploadItems.shift();
            //console.log(uploadItems,item);
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
                    completeUpload(item,$scope.userInputs.message);
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
                console.log(data);
                var metadata = {type:type, data:data};
                metadataList.push(metadata);
                //mc.attachMetadata(attachMetadataBack, type, metadataId, session.transit_value.fastalink);
                if (uploadItems.length ==0) {
                    askMoney();
                } else {
                    uploadDataItem();
                }
            }
        }
        
    }
   
    var error = function(error){
        MessageBox(error);
    };
    function uploadError() {
        if (uploadItems.length ==0) {
            askMoney();
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
    function askMoney() {
        var UnstructureData = [];
        UnstructureData[0] = {};
        UnstructureData[0].Key = "FCRecipient";
        var channel = "mobile";
        if ($scope.friend.socialType!= "SMS")  {
            UnstructureData[0].Value = $scope.friend.mobileNumber;
            channel = $scope.friend.socialType;
        } else {
            
            UnstructureData[0].Value = "mobile_" + formatLocal("vn",$scope.friend.mobileNumber).replace(/[^0-9]/g,"");
        }
        UnstructureData[1] = {
            Key:"FCSentChannel",
            Value:channel
        };
        for(var idx in metadataList) {
            UnstructureData[ parseInt(idx) + 2] = {};
            UnstructureData[parseInt(idx) + 2].Key = metadataList[idx].type;
            UnstructureData[parseInt(idx) + 2].Value = metadataList[idx].data.meta_id;
        }
       
        if ($scope.friend.socialType == "SMS" && $scope.friend.friendDetail.fromContact) {
            UnstructureData[UnstructureData.length] = {Key:"FCDestProfileName",
                                                   Value:$scope.friend.name + " " + formatLocal("vn",$scope.friend.mobileNumber).replace(/[^0-9]/g,"")};
        }
        else {
            UnstructureData[UnstructureData.length] = {Key:"FCDestProfileName",
                                                   Value:$scope.friend.name};
        }
        UnstructureData[UnstructureData.length] = {Key:"FCDestProfilePhoto",
                                                   Value:$scope.friend.friendDetail.profile.photo};

        
        mc.demandForPaymentSocial(demandForPaymentSocialBack, UnstructureData, session.customer.id,$scope.userInputs.amount, ($scope.userInputs.message === undefined)?"":$scope.userInputs.message);
        session.friendName = null;
    }

    var otpSuccessCallBack = function(success){
        if ( success === 'MSG_SEND'){
            $state.go("askMoneySocialSuccess");
            return;
        }
    };

    var otpErrorBack = function(error){
        if ( error === 'MSG_CANCEL'){
            $state.go('askMoneySocialSuccess');
        }
    };

    var gplusSuccess = function(success){
        if ( success === 'GPLUS_MESSAGE_SEND_SUCCESS'){
            $state.go("askMoneySocialSuccess");
        }
    };

    var gplusError = function(error){
        if ( error === 'GPLUS_MESSAGE_SEND_CANCELLED'){
            //MessageBox('Cancelled by user');
            $state.go('askMoneySocialSuccess');
        }
    }

    function demandForPaymentSocialBack(r) {
        $scope.loading = false;
        $rootScope.safetyApply(function(){});
        if (r.Status.code == "0") {
            session.fastalink = r.UnstructuredData[0].Value;
            var friendObject = $scope.friend.friendDetail;
            var linkDetail = session.fastalink;
            switch ($scope.friend.socialType ) {
                case "SMS":
                    var resultType = {
                        'SMS':'SMS_SEND',
                        'friend':$scope.friend,
                        'message':''+ session.customer.displayName + ' has requested you to send them VND '+$scope.userInputs.amount+ ' , using Techcombank Wallet. Click on the fastalink to view details and accept the request. https://m.techcombank.com.vn/fastalink/' + linkDetail
                    };
                    //TCBNativeBridge.sendSMSToFriend(otpSuccessCallBack,otpErrorBack,resultType);
                    $state.go('askMoneySocialSuccess');
                    break;
                case "fb":
                    var resultType ={
                        'message':'Hi' + $scope.friend.name + ', ' + session.customer.displayName + ' yeu cau ban chuyen VND '+$scope.userInputs.amount+ ' qua dich vu F@st Mobile Techcombank. Click link de xem chi tiet giao dich https://m.techcombank.com.vn/fastalink/' + linkDetail
                        //'message': 'Hi '+ $scope.friend.name +' - Can you please send me VND '+$scope.userInputs.amount+
                        //    ', using Techcombank Wallet? Click on the fastalink to view details and accept the request. https://m.techcombank.com.vn/fastalink/' + linkDetail + ' '+
                        //    ' With Techcombank Wallet, you can share money with friends! Use it when you have to split a bill, pay your friend for drinks, chip in for a birthday gift or any other situation where you have to give someone money!'
                    };
                    $state.go('askMoneySocialSuccess');
                    break;
                case "google":
                    var resultType = {
                        'GPLUS':'GPLUS_SEND_MESSAGE',
                        'friend':$scope.friend,
                        'message':'Hi' + $scope.friend.name + ', ' + session.customer.displayName + ' yeu cau ban chuyen VND '+$scope.userInputs.amount+ ' qua dich vu F@st Mobile Techcombank. Click link de xem chi tiet giao dich https://m.techcombank.com.vn/fastalink/' + linkDetail
                    };
                    TCBNativeBridge.sendMessageToGooglePlusFriend(gplusSuccess,gplusError,resultType);
                    break;
            }

        } else {
            ErrorBox(r.Status);
        }
    }
}]);
