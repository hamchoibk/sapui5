'use strict';

tcbmwApp.controller('sendMoneyMainController',['$scope','$state','$rootScope','friendFactory','sendMoneyTransferFactory',function($scope,$state,$rootScope,friendFactory,sendMoneyTransferFactory){
    $scope.isMetaDataAdded = false;
    $scope.friend={};
    $scope.isPhototaken = false;
    $scope.isVideotaken = false;
    $scope.isAudiotaken = false;
    $scope.validatePin=true;

    $scope.currencyCode = 'VND';
    var baseStatus = {
        isBack: true,
        onBack: function() {
            sendMoneyTransferFactory.resetAccountDetail();
            sendMoneyTransferFactory.resetSendMoneyUserInputs();
            friendFactory.resetFriendUser();

            if ($rootScope.previousState.name == 'accounts'){
                $state.go($rootScope.previousState.name);
            }else if ($rootScope.previousState.name == 'dashboard.home'){
                $state.go('dashboard.home');
            }else{
                $state.go('dashboard.socialindex');
            }

            var newIndex = statuses.indexOf($scope.status) - 1;
            if (newIndex > -1) {
                $scope.status = statuses[newIndex];
                $scope.status.move = 'ltr';
                $scope.navigationBarStatus = $scope.status;
            }
        },
        isClose:true,
        onAction: function() {
            sendMoneyTransferFactory.resetAccountDetail();
            sendMoneyTransferFactory.resetSendMoneyUserInputs();
            friendFactory.resetFriendUser();

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
        angular.extend({title: 'NAVBAR_TRANSFER_SEND_MAIN'}, baseStatus)
    ];

    $scope.status = statuses[0];
    // init data
    if ( !$scope.isPhototaken ){
        $('#photoImage').attr('src' ,'images/32-camera.png');
    }
    if ( !$scope.isVideotaken ){
        $('#videoImage').attr('src' ,'images/32-video.png');
    }
    if ( !$scope.isAudiotaken){
        $('#audioImage').attr('src', 'images/32-audio.png');
    }

    var accountDetail=sendMoneyTransferFactory.getAccountDetails()[currentAccountIdx];

    /***** Only accept send money from Locally currency *****/

    while(accountDetail.currency != "VND") {
        currentAccountIdx++;
        if (currentAccountIdx >= session.accounts.length) {
            currentAccountIdx = 0;
        }
        accountDetail=sendMoneyTransferFactory.getAccountDetails()[currentAccountIdx];
    }

    /***** Only accept send money from Locally currency end *****/

    console.log("sendmoneymain -- currentAccountIdx == ", currentAccountIdx);
    sendMoneyTransferFactory.setAccountDetail(accountDetail);

    $scope.account = {
        id:accountDetail.id,
        accountType:accountDetail.accountType,
        accountNumber:accountDetail.accountNumber,
        availableBalance:accountDetail.availableBalance,
        dayLimit:accountDetail.dayLimit,
        accountName:accountDetail.accountName,
        transactionLimit:accountDetail.transactionLimit,
        paymentInstrumentId:accountDetail.paymentInstrumentId
    }
    $scope.selectVisible=sendMoneyTransferFactory.getAccountDetails().length>1;

    $scope.sendMoneyUserInputs = sendMoneyTransferFactory.getSendMoneyUserInputs();

    var imgData=sendMoneyTransferFactory.getImageMetaData();
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

    var videoData=sendMoneyTransferFactory.getVideoMetaData();
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

    var audioData=sendMoneyTransferFactory.getAudioMetaData();
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

    $scope.clickSelectAccount = function(){
        sendMoneyTransferFactory.setSendMoneyUserInputs($scope.sendMoneyUserInputs);
        $state.go('sendmoneyselectaccount');
    }

    var fname = friendFactory.getFriendUser();
    console.log(fname);
    if ( fname.name == '')
    {
        $scope.friend = getMessage('SEND_MONEY_SELECT_FRIEND');
        $scope.isMetaDataAdded = false;
        $scope.friendSelected = false;

        $('button.sendToWhom').addClass('show');

        $('div.sendToWhom').removeClass('show');
        $('div.sendToWhom').addClass('hide');
    }
    else
    {

        $('button.sendToWhom').removeClass('show');
        $('button.sendToWhom').addClass('hide');
        $('div.sendToWhom').addClass('show');
        $scope.friend = ""+fname.name;
        $scope.friendPhoto = friendFactory.getFriendPhoto();
        if ( fname.socialType == 'SMS' && fname.friendDetail.profile.fromContact){
            $scope.friendNumber = fname.mobileNumber;
        }else{
            $scope.friendNumber = '';
        }
        $scope.friendSelected = true;
    }

    $('input#amount').focus(function() {
                $(this).prop('type', 'number').val($scope.sendMoneyUserInputs.amount);
    }).blur(function() {
        var self = $(this),value = self.val();
        $scope.sendMoneyUserInputs.amount=value;

        $scope.sendMoneyUserInputs.parsedAmount='';

        if(value) {
            $scope.sendMoneyUserInputs.parsedAmount = parseInt(value).formatMoney(0);
            $('#scrollArea').scrollTop($("#scrollArea")[0].scrollHeight);
        }

         self.data('number', value).prop('type', 'text').val($scope.sendMoneyUserInputs.parsedAmount);
    });

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
            sendMoneyTransferFactory.setImageMetaData(response);
        }else{
            $scope.isPhototaken = false;
            image.attr("src","images/32-camera.png");
            $('li p.photoShow').show();
            sendMoneyTransferFactory.setImageMetaData('');

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
            sendMoneyTransferFactory.setVideoMetaData(responseVideo);


        }else{
            $scope.isVideotaken = false;
            video.attr('src','images/32-video.png');
            $('li p.videoShow').show();
            sendMoneyTransferFactory.setVideoMetaData('');

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
            sendMoneyTransferFactory.setAudioMetaData(responseAudio);

        }else{
            $scope.isAudiotaken = false;
            audio.attr('src','images/32-audio.png');
            $('li p.audioShow').show();
            sendMoneyTransferFactory.setAudioMetaData('');

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
    $scope.isMetaDataAdded = true;
    $scope.clickSend = function(){
        $scope.loading = true;
        sendMoneyTransferFactory.setSendMoneyUserInputs($scope.sendMoneyUserInputs);
        SendMoney();
    };

    $scope.clickSendToWhom = function(){
        friendFactory.setRequestMoneyType('sendMoney');
        sendMoneyTransferFactory.setSendMoneyUserInputs($scope.sendMoneyUserInputs);
        $state.go('socialList');
    };

    $('input#pin').focus(function() {
        $(this).prop('type', 'text').val($scope.sendMoneyUserInputs.linkPinCode);

    }).blur(function() {
        var self = $(this),value = self.val();
        $scope.sendMoneyUserInputs.linkPinCode=value;

        if(value && value.length != 4) {
            MessageBox("","SEND_MONEY_MAIN_VALIDATE_PIN");
            $scope.validatePin=false;
        }
        else {
            $scope.validatePin=true;
        }

        self.data('text', value).prop('type', 'text').val($scope.sendMoneyUserInputs.linkPinCode);

    });


    function SendMoney() {
        console.log("socialMode",$scope.socialMode);
            var loadinfo = [];

            //var friend = getFriend(sessionStorage.choosenFriend);
            loadinfo["loadamount"] = $scope.sendMoneyUserInputs.amount ? parseFloat($scope.sendMoneyUserInputs.amount) : 0;
            loadinfo["loadtext"] = $scope.sendMoneyUserInputs.message;
            loadinfo["fromacct"] = $scope.friendNumber;
            loadinfo["toacct"] = "Send Money: " + $scope.friend;
            loadinfo["fee"] = 0;
            loadinfo["sysid"] = '';
            loadinfo["referno"] = '';
            session.transit_value = loadinfo;
            session.transit_value.transfer_type = "sendmoney";
            var payer = {};
            payer.identifier = {};
            payer.identifier.type = "1";
            payer.identifier.value = session.customer.id;
            payer.paymentInstrumentId = $scope.account.paymentInstrumentId;

            var payee = {};
            payee.identifier = {};
            payee.identifier.type = "5";
            payee.identifier.value = "fastacash";
            payee.paymentInstrumentType = 304;
            var attribute = [];
            attribute[0] = {};
            attribute[0].key = "405";
            var channel = fname.socialType;
            console.log(fname.socialType);
            if (fname.socialType == "SMS") {
                //format phonenumber to E164 format
                attribute[0].value = "mobile_" + formatLocal("vn",fname.mobileNumber).replace(/[^0-9]/g,"");
                channel = "mobile";
            } else
            attribute[0].value = fname.mobileNumber;

            attribute[1] = {
                key: "412",
                value: channel
            };
            if ($scope.sendMoneyUserInputs.linkPinCode) {
                attribute[2] = {
                    key: "410",
                    value: $scope.sendMoneyUserInputs.linkPinCode
                };
            }
            if (fname.socialType == "SMS" && fname.friendDetail.profile.fromContact) {
                attribute[attribute.length] = {
                    key: "413",
                    value: $scope.friend + " " + formatLocal("vn",fname.mobileNumber).replace(/[^0-9]/g,"")
                };
            } else {

                attribute[attribute.length] = {
                    key: "413",
                    value: $scope.friend
                };
            }
            attribute[attribute.length] = {
                key: "414",
                value: $scope.friendPhoto
            };


            attribute[attribute.length] = {
                key: "424",
                value: $scope.socialMode
            };

            //

            var txn = new TxnData(1006, session.transit_value.loadamount,
                'order111', session.transit_value.loadtext);


            appstate = trans.TRAN_UNLOADSVA;
            $scope.loading = true;
            $rootScope.safetyApply(function(){});
            mc.cashout(sendMoneyBack, payer, payee, attribute, txn, true);

        }
        function sendMoneyBack(r) {
            $scope.loading = false;
            $rootScope.safetyApply(function(){});
            if (preAuthoriseBack(r)) {
                //session.transit_value.transfer_type = "sendmoney";
                var transferFee = 0;
                if (r.MoneyFee !== undefined && r.MoneyFee != null && r.MoneyFee.length>0) {
                    var fee = r.MoneyFee[0];
                   transferFee = (fee.value + fee.vat);
                }
                session.transit_value.UnstructuredData = r.UnstructuredData;
                session.transit_value.transferFee = transferFee;
                session.transit_value.fastalink = r.UnstructuredData[0].Value;
                $state.go('sendMoneyPreConfirm');
                //$.mobile.changePage("#fundtransfersum");
            } else {
                appstate = trans.TRAN_IDLE;
            }
        }

        $scope.showSocialMode = fname.socialType == "fb" ? true : false;
        $scope.socialMode = "private";
}]);
