'use strict';

tcbmwApp.controller('TransferHomeController',['$scope','$state','tcbTransferFactory','$rootScope',function($scope,$state,tcbTransferFactory,$rootScope){
    if ( $state.current.name == 'dashboard.transferhome'){
            var baseStatus = {
                isBack: true,
                onBack: function() {
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
                angular.extend({title: 'NAVBAR_TCB_TRANSFER'}, baseStatus)
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

    $scope.beneficiaryList=function(){
        $state.go('beneficiarysearch');
    };

    $scope.clickDomestic = function(){

    };

    $scope.clickInTCB = function(){
        tcbTransferFactory.resetTransferDetails();
        $state.go('tcbindex');
    };

    $scope.clickInstantTransferImmediate = function(){
        $state.go('dashboard.instanttransferindex');
    };

    $scope.clickInterbank = function (){
		$state.go('interbankindex');
    };

    $scope.clickInstantTransfer = function(){

    };
}]);