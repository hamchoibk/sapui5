'use strict';

var TCBNativeBridge = {
	getPicture: function(success, failure,resultType){
		cordova.exec(success, failure, "TCBNativeBridge", "capturePhoto", [resultType]);
	},
    removePicture:function(success,failure,resultType){
        cordova.exec(success,failure,"TCBNativeBridge","removePhoto",[resultType]);
    },
    getVideo:function(success,failure,resultType){
        cordova.exec(success, failure, "TCBNativeBridge", "captureVideo", [resultType]);
    },
    getAudio:function(success,failure,resultType){
        cordova.exec(success, failure, "TCBNativeBridge", "captureAudio", [resultType]);
    },
    getAddressBook:function(success,failure,resultType){
        cordova.exec(success, failure, "TCBNativeBridge", "contactList", [resultType]);
    },
    sendSMSToFriend:function(success,failure,resultType){
        cordova.exec(success, failure, "TCBNativeBridge", "sendSMS", [resultType]);
    },
    sendMessageToGooglePlusFriend:function(success,failure,resultType){
        cordova.exec(success,failure,"TCBNativeBridge","sendMessageViaGooglePlus",[resultType]);
    },
    uploadData:function(success,failure,resultType,data){
        cordova.exec(success,failure,"TCBNativeBridge","uploadMetaData",[resultType,data]);
    },
    getVideoURL:function(success,failure,resultType){
        cordova.exec(success,failure,"TCBNativeBridge","playVideo",[resultType]);
    },
    getAudioURL:function(success,failure,resultType,data){
        cordova.exec(success,failure,"TCBNativeBridge","playAudio",[resultType,data]);
    },
    copyToClipboard: function(success,failure,resultType){
        cordova.exec(success,failure,"TCBNativeBridge","copyToClipboard",[resultType]);
    },
    getPushNotificationStatus: function(success, failure,resultType){
        cordova.exec(success, failure, "TCBNativeBridge", "getPushNotificationStatus", [resultType]);
    }
};
module.exports = TCBNativeBridge;