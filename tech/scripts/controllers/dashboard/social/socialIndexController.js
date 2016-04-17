'use strict';
tcbmwApp.controller('SocialIndexController',['$scope','$state','sendMoneyTransferFactory','AccountCashoutMobileParticularsFactory','AccountCashoutIDParticularsFactory','friendFactory','SocialFactory','TransactionsFactory','$rootScope',function($scope,$state,sendMoneyTransferFactory,AccountCashoutMobileParticularsFactory,AccountCashoutIDParticularsFactory,friendFactory,SocialFactory,TransactionsFactory,$rootScope){
    if ( $state.current.name == 'dashboard.socialindex'){
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
                angular.extend({title: 'NAVBAR_SOCIAL'}, baseStatus)
            ];

            $scope.status = statuses[0];
        }

        session.forOwner=false;

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

        $scope.profile = session.user.profile;
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
        $scope.clickConnect=function(){
             var particulars={
                   prevState:'dashboard.socialindex',
                   checkParameter:'',
                   trueLoad:''
                };

             SocialFactory.setParticulars(particulars);
             $state.go('dashboard.socialconnect');
        };

        $scope.clickSendMoney = function(){
            resetSendMoneyDetails();
            $state.go('sendMoney');
        };
        $scope.clickAskMoney = function(){
            $state.go('dashboard.askMoney');
        };
        $scope.clickMyFriends = function (){
            //$state.go('selectfriend');
            friendFactory.setRequestMoneyType('dashboard.socialindex');
            $state.go('socialList');
        };


        $scope.clickCashoutById = function(){

            AccountCashoutIDParticularsFactory.setSource('dashboard.socialindex');
            $state.go('cashoutid');
        };

        $scope.ClickCashoutByMobileNumber = function(){
            AccountCashoutMobileParticularsFactory.setSource('dashboard.socialindex');
            $state.go('cashoutmobile');
        };

        $scope.clickInquiry = function(){
            //$state.go('pendingtransactions');
            session.pendingTransactionParentPage = "dashboard.socialindex";
            TransactionsFactory.setSelectedStatusFilter("Pending");
            $state.go('transactionsstatusresult');
        };

        var resetSendMoneyDetails = function(){
            sendMoneyTransferFactory.resetAccountDetail();
            sendMoneyTransferFactory.resetSendMoneyUserInputs();
            friendFactory.resetFriendUser();

            sendMoneyTransferFactory.resetImageMetaData();
            sendMoneyTransferFactory.resetVideoMetaData();
            sendMoneyTransferFactory.resetAudioMetaData();
        };
}]);