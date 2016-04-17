'use strict';
tcbmwApp.controller('SelectFriendController',['$scope','$state','FavouritesFactory','$rootScope',function ($scope,$state,FavouritesFactory,$rootScope) {
    if ( $state.current.name == 'selectfriend'){
            var baseStatus = {
                    isBack:true,
                    onBack: function() {
                        FavouritesFactory.resetFavourite();
                        $state.go('dashboard.socialindex');

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

            var statuses = [
                angular.extend({title: 'NAVBAR_SELECTFRIEND'}, baseStatus)
            ];

            $scope.status = statuses[0];
    }

    $scope.friends=FavouritesFactory.findAll();

    $scope.contactDetail=function(id){
        var friend=FavouritesFactory.findById(id);
        FavouritesFactory.setFavourite(friend);

        $state.go('dashboard.friendcontactdetail');
    }
}]);