'use strict';

tcbmwApp.controller('instantTransferIndexController',['$scope','$rootScope','$state','instantTransferFactory',function($scope,$rootScope,$state,instantTransferFactory){
    if ( $state.current.name == 'dashboard.instanttransferindex'){
        var baseStatus = {
            isBack: true,
            onBack: function() {
                $state.go('dashboard.transferhome');
                var newIndex = statuses.indexOf($scope.status) - 1;
                if (newIndex > -1) {
                    $scope.status = statuses[newIndex];
                    $scope.status.move = 'ltr';
                    $scope.navigationBarStatus = $scope.status;
                }
            },
            isClose: true,
            onAction: function () {
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
            angular.extend({title: 'NAVBAR_INSTANT_TRANSFER'}, baseStatus)
        ];

        $scope.status = statuses[0];
    }
    var ca = getCurrentAccount();
    if (ca != null) {
        $scope.account = ca;
        if(ca.balance.length<10){
            $('.amount').removeClass('small')
        }else{
            $('.amount').addClass('small')
        }
        //$rootScope.$$phase || $rootScope.$apply();
    }
    var profileImage = angular.element("#profileImage");
    profileImage.css("background-image", "images/profile-placeholder.png");

    $scope.swapAccountValue = function(){
        //$('#currentAccount').toggleClass("hide");
        //$('#eWalletAccount').toggleClass("hide");
        var ca = getNextAccount();
        if (ca != null) {
            if(ca.balance.length<10){
                $('.amount').removeClass('small')
            }else{
                $('.amount').addClass('small')
            }
            $scope.account = ca;
            $rootScope.safetyApply(function(){});
        }
    };
    $scope.profile = session.user.profile;

    $scope.clickInstantTransferViaCard = function() {
        console.log("aaa");
        $state.go('instanttransfertocardmain');
    };

    $scope.clickInstantTransferViaAccount = function() {
        $state.go('instanttransfertoaccountmain');
    };


}]);