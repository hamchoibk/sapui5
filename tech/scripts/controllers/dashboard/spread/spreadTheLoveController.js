'use strict';

tcbmwApp.controller('SpreadTheLoveController',['$rootScope','$scope','$location','$state','$filter', function($rootScope,$scope,$location,$state,$filter) {

    if ( $state.current.name == 'spreadluv'){
        var baseStatus = {
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

        var statuses = [
            angular.extend({title: 'SPREAD_THE_LUV'}, baseStatus)
        ];

        $scope.status = statuses[0];
    }


    var iosLink = "https://itunes.apple.com/us/app/techcombank-mobile-banking/id907021262";
    var androidLink = "https://play.google.com/store/apps/details?id=com.fastacash.tcb";
    function spreadLoveCallback(r) {
        $scope.loading = false;
        $rootScope.safetyApply(function(){});
        if (r.Status.code == "0") {
            if ( $rootScope.previousState.name == 'sendMoneySuccess'){
                $state.go('sendMoneySuccess');
            }else if ( $rootScope.previousState.name == 'askMoneySocialSuccess'){
                $state.go('askMoneySocialSuccess');
            }
        } 
    }
    function getMessage(key) {
        return $filter('translate')(key);
    };
    function postMessage()
    {
        
        $scope.loading = true;
        mc.spreadLove(spreadLoveCallback,message);
        
    }
    var message =  getMessage('SPREAD_LOVE_MESSAGE');
    var spread_love_title = getMessage('SPREAD_THE_LUV');
    if ( isAndroid){
        message = ' '+message+' '+androidLink;
    }
    else {
        message = ' '+message+' '+iosLink;
    }
    $scope.clickFacebook = function(){
        Confirm(spread_love_title,postMessage,message,['SPREAD_LUV_POST','SPREAD_LUV_CANCEL']);
    },

    $scope.clickSkip = function(){

        if ( $rootScope.previousState.name == 'sendMoneySuccess'){
            $state.go('sendMoneySuccess');
        }else if ( $rootScope.previousState.name == 'askMoneySocialSuccess'){
            $state.go('askMoneySocialSuccess');
        }
    }
}]);