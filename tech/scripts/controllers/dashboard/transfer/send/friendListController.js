'use strict';
tcbmwApp.controller('friendListController',['$scope','$state','friendFactory','FavouritesFactory','$rootScope',function($scope,$state,friendFactory,FavouritesFactory,$rootScope){
    var social = friendFactory.getChoosenSocial();
    var friends = friendFactory.getFriendList(social);
    var loadedFriends = [];
    for(var idx=0;(idx<20) && (idx<friends.length);idx++) {
        loadedFriends.push(friends[idx]);
    }
    $scope.friends = loadedFriends;
    //$scope.favourites=FavouritesFactory.findAll();
    var showFavourites=false;

    if(FavouritesFactory.findAll().length>0){
            showFavourites=true;
    }

    var baseStatus = {
        isBack: true,
        onBack: function() {

            if(friendFactory.getRequestMoneyType()=='askMoney')
                $state.go('askMoneySocialList');
            else
                $state.go('socialList');

            var newIndex = statuses.indexOf($scope.status) - 1;
            if (newIndex > -1) {
                $scope.status = statuses[newIndex];
                $scope.status.move = 'ltr';
                $scope.navigationBarStatus = $scope.status;
            }
        }
    };

    var title='';

    if(showFavourites){
        title='NAVBAR_TRANSFER_SEND_FRIENDLIST';
    }
    else{
        title='NAVBAR_TRANSFER_SEND_FRIENDLISTVIA'
    }
    var isProcessing = false;
    $("#friendList").scroll(function() {
        if (isProcessing) return;
        
        var scrollTop = $(this).scrollTop();
        var height = $(this).height();
        var scrollLength = $(this)[0].scrollHeight - height;
        if (scrollLength - scrollTop<100) {
            console.log("refresh data");
            isProcessing = true;
            loadMore();
            setTimeout(function(){ $scope.$apply()},0);
            isProcessing = false;
        }
    });
    var statuses = [
        angular.extend({title: title}, baseStatus)
    ];
    $scope.status = statuses[0];

    $scope.showFavourites=showFavourites;

    var choosenChannel = friendFactory.getChoosenSocial();
    if ( choosenChannel === 'google'){
        $scope.channelName = 'gplus';
    }else if ( choosenChannel === 'fb'){
        $scope.channelName = 'fb';
    }

    var error = function(error){
        MessageBox('Error \r\n'+error.statusMsg);
    };


    $scope.selectFavourite=function(friend){

        var friendObj={
            name:friend.profile.name,
            mobileNumber:friend.id,
            socialType:friendFactory.getChoosenSocial(),
            friendDetail: friend,
            photo:friend.profile.photo
        };

        friendFactory.setFriendUser(friendObj);
        friendFactory.setFriendPhoto(friendObj.photo);
        if (session.selectFriendFrom !== undefined && session.selectFriendFrom != null) {
            $state.go(session.selectFriendFrom);
            session.selectFriendFrom =  null;
        }
        var requesttype = friendFactory.getRequestMoneyType();
        if ( requesttype === 'askMoney'){
            $state.go('askMoneySocialMain');
        }else if ( requesttype === 'sendMoney'){
            $state.go('sendMoney');
        } else if( requesttype == 'dashboard.socialindex'){
            $state.go('dashboard.friendcontactdetail');
        }
    }

    function loadMore() {
        //var social = friendFactory.getChoosenSocial();
       // var friends = friendFactory.getFriendList(social);
        var filteredList = friends.filter(filterByName);
        var last = $scope.friends.length - 1;
        for(var i = 1; i <= 8; i++) {
            //console.log(i, last, friends.length);
            if (last + i< filteredList.length) {
                $scope.friends.push(filteredList[last + i]);
                //console.log(last + i);
            }
            
        }
        //console.log($scope.friends.length);
    };
    function filterByName(friend) {
        if ($scope.query !== undefined)
            return friend.profile.name.toLowerCase().indexOf($scope.query.toLowerCase())>=0;
        else
            return true;
    }
    $scope.filterFriends = function(query) {
        //console.log($scope.query);
        var filteredList = friends.filter(filterByName);
        //$scope.friends = filteredList;
        loadedFriends = [];
        for(var idx=0;(idx<20) && (idx<filteredList.length);idx++) {
            loadedFriends.push(filteredList[idx]);
        }
        $scope.friends = loadedFriends;
        setTimeout(function(){ $scope.$apply()},0);
    };



}]);