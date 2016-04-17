'use strict';
tcbmwApp.controller('sendMoneyOTPController',['$scope','$state','friendFactory','sendMoneyTransferFactory','$rootScope',function($scope,$state,friendFactory,sendMoneyTransferFactory,$rootScope){

    var baseStatus = {
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
        angular.extend({title: 'NAVBAR_TRANSFER_SEND_OTP'}, baseStatus)
    ];

    $scope.status = statuses[0];

    $scope.friend = friendFactory.getFriendUser();
    $scope.userInputs = sendMoneyTransferFactory.getSendMoneyUserInputs();
    var otpSuccessCallBack = function(success){
        if ( success === 'MSG_SEND'){
            $state.go('sendMoneySuccess');
            return;
        }
    };

    var otpErrorBack = function(error){
       if ( error === 'MSG_CANCEL'){
           $state.go('sendMoneySuccess');
       }
    };

    var gplusSuccess = function(success){
        if ( success === 'GPLUS_MESSAGE_SEND_SUCCESS'){
            $state.go('sendMoneySuccess');
        }
    };

    var gplusError = function(error){
        if ( error === 'GPLUS_MESSAGE_SEND_CANCELLED' || error === 'GPLUS_ERROR'){
            //MessageBox('Cancelled by user');
            $state.go('sendMoneySuccess');
        }
    }

    $scope.confirm = function(){
        $scope.loading = true;
        $rootScope.safetyApply(function(){});
        mc.authenticationContinue(authContinueBack, session.transit_value.sysid, $scope.smsCode, $scope.pinCode);
        
    };
    function authContinueBack(r) {
        //$scope.loading = false;
        //$rootScope.safetyApply(function(){});
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
                        //try {
                        //    TCBNativeBridge.sendSMSToFriend(otpSuccessCallBack,otpErrorBack,resultType);
                        //} catch (ex) {
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
                        console.log("I am inside try.....>>>>>");
                        TCBNativeBridge.sendMessageToGooglePlusFriend(gplusSuccess,gplusError,resultType);
                        break;
                }
        
        } else {
            //hideProgress();
			$scope.loading = false;
			$rootScope.safetyApply(function(){});
            ErrorBox(r.Status);
            appstate = trans.TRAN_IDLE;
        }
    }

}]);