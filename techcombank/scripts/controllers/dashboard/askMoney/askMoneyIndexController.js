'use strict';
tcbmwApp.controller('askMoneyIndexController',['$scope','$rootScope','AccountFactory','$state',function ($scope,$rootScope,AccountFactory,$state) {
    if ( $state.current.name == 'dashboard.askMoney'){

        var baseStatus;

        if($rootScope.previousState.name == 'dashboard.home'){
            baseStatus = {
                isBack: true,
                onBack: function() {
                    $state.go($rootScope.previousState.name);

                    var newIndex = statuses.indexOf($scope.status) - 1;
                    if (newIndex > -1) {
                        $scope.status = statuses[newIndex];
                        $scope.status.move = 'ltr';
                        $scope.navigationBarStatus = $scope.status;
                    }
                }
            };
        }
        else{
            baseStatus = {
                isBack: true,
                onBack: function() {
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
                    $state.go('dashboard.home');

                    var newIndex = statuses.indexOf($scope.status) - 1;
                    if (newIndex > -1) {
                        $scope.status = statuses[newIndex];
                        $scope.status.move = 'ltr';
                        $scope.navigationBarStatus = $scope.status;
                    }
                }
            };
        }

        var statuses = [
            angular.extend({title: 'NAVBAR_ASKMONEY_INDEX'}, baseStatus)
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
        }

        $scope.swapAccountValue = function(){
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

    var profileImage = angular.element("#profileImage");
    profileImage.css("background-image", "images/profile-placeholder.png");
    $scope.profile = session.user.profile;

    
    $scope.clickAskMoneyViaSocial = function(){
        $state.go('askMoneySocialMain');
    };

    $scope.clickAskMoneyViaEwallet = function(){
        $state.go('askMoneyEwalletMain');
    };



}]);