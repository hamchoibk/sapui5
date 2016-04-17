'use strict';
tcbmwApp.controller('FriendContactDetailsController',['$scope','$state','$rootScope','FavouritesFactory','friendFactory',function ($scope,$state,$rootScope,FavouritesFactory,friendFactory) {

    var friendObj=friendFactory.getFriendUser();

    if ( $state.current.name == 'dashboard.friendcontactdetail'){
            var baseStatus = {
                    isBack:true,
                    onBack: function() {
                        if(friendObj.socialType=='SMS'||$rootScope.previousState.name=='socialList')
                            $state.go('socialList');
                        else
                            $state.go('selectFromFriendList');

                        var newIndex = statuses.indexOf($scope.status) - 1;
                        if (newIndex > -1) {
                            $scope.status = statuses[newIndex];
                            $scope.status.move = 'ltr';
                            $scope.navigationBarStatus = $scope.status;
                        }
                    },
                    isClose:true,
                    onAction: function() {
                        FavouritesFactory.resetFavourite();
                        $state.go('dashboard.home');

                        var newIndex = statuses.indexOf($scope.status) - 1;
                        if (newIndex > -1) {
                            $scope.status = statuses[newIndex];
                            $scope.status.move = 'ltr';
                            $scope.navigationBarStatus = $scope.status;
                        }
                    }
            };

            var title='FRIEND_CONTACT_TITLE';

            var statuses = [
                angular.extend({title: title}, baseStatus)
            ];

            $scope.status = statuses[0];
    }

    var channel='';
    var channelUrl='';
    var channelUrlDisp='';
    var mobile='';
    var image='';

    $scope.showMobile=false;
    $scope.showEmail=false;

    if(friendObj.socialType=='google'){
        channel='gplus';
        var id=friendObj.friendDetail.id.replace('google_','');
        channelUrlDisp='gp:/profile/'+id;
        channelUrl='https://plus.google.com/'+id;
        image=friendObj.friendDetail.profile.photo;
    }
    else{
        channel=friendObj.socialType;
        if(channel=='fb'){
            var id=friendObj.friendDetail.id.replace('fb_','');
            channelUrlDisp='fb:/profile/'+id;
            channelUrl='https://www.facebook.com/'+id;
            image=friendObj.friendDetail.profile.photo;
        }
        else{
            var id=friendObj.mobileNumber;
            channelUrlDisp='sms:/'+id;
            channelUrl='#';
            image='images/icon-sms.png';
            mobile=id;
            $scope.showMobile=true;
        }
    }

    $scope.friend={
        imgUrl:image,
        name:friendObj.name,
        email:'',
        mobile:mobile,
        channel:channel,
        channelUrl:channelUrl,
        channelUrlDisp:channelUrlDisp
    };

    /*$scope.clickLastFiveTransaction = function(){

    };

    $scope.clickInstantTransfer = function(){

    };*/

    $scope.clickSendMoney= function(){
        $state.go('sendMoney');
    };

    $scope.clickAskMoney= function(){
        $state.go('askMoneySocialMain');
    };

}]);