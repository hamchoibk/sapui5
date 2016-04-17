'use strict';
tcbmwApp.controller('AccountsController',['$scope','AccountFactory','$state','$rootScope',function ($scope,AccountFactory,$state,$rootScope) {
    if ( $state.current.name == 'accounts'){
//        console.log('Inside if');
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
            angular.extend({title: 'NAVBAR_ACCOUNTS'}, baseStatus)
        ];

        $scope.status = statuses[0];
    }
    if ($rootScope.previousState.name == 'dashboard.home') {
        console.log("$rootScope.previousState.name",$rootScope.previousState.name);
        $scope.loading = true;
        mc.getWallets(walletBack, session.customer.id, 0);
    }
    else
        $scope.accounts = getAccountsWithCategory();

    console.log("getAccountsWithCategory() == ", getAccountsWithCategory());

    $scope.showMoreMenu=function(e, accountIndex){
        console.log(accountIndex);
        var target = e.target
        var newY = target.getBoundingClientRect().top + 30 + $(document).scrollTop();
        var newX = target.getBoundingClientRect().left - 260;
        $scope.accountIndex = accountIndex;
        $('.moreMenu').css('top', newY);
        if(newY+140 > $(window).height()){
            $('html, body').animate({
                scrollTop: $(target).offset().top
            }, 2000);
        }
        $('.moreMenu').css('left', newX);
        $('.moreMenu').addClass('show');
        $('.overlay').addClass('show');
        if(session.accounts[accountIndex].bankAccount != null && session.accounts[accountIndex].bankAccount.type == TYPE_ACCOUNT_FOREIGN) {
            $scope.disableBankTransfer = true;
            $scope.disableSendMoney = true;
        } else {
            $scope.disableBankTransfer = false;
            $scope.disableSendMoney = false;
        }
    };

    $scope.clickViewDetails = function(){
        currentAccountIdx = $scope.accountIndex;
        $state.go('accountDetails');
    };

    $scope.clickInquiry = function(){
        currentAccountIdx = $scope.accountIndex;
        $state.go('accountlatesttransactions');
    }
    
    $scope.clickBankTransfer = function() {
        currentAccountIdx = $scope.accountIndex;
        $state.go('tcbindex');
    }
    $scope.clickSendMoney = function() {
        currentAccountIdx = $scope.accountIndex;
        $state.go('sendMoney');
    }
    $scope.dimissPopUp =function(){
        $('.moreMenu').removeClass('show');
        $('.overlay').removeClass('show');
    }

    $scope.onReload = function() {
        $scope.loading = true;
        mc.getWallets(walletBack, session.customer.id, 0);
    };

    function walletBack(data) {
        $scope.loading = false;
        if (data.Status.code == "0") {
            session.accounts = data.walletEntries;
            if (session.accounts.length == 0) {
                MessageBox(getMessage("SYSTEM_IS_MAINTAINING"));
                session = new LoginSession();
                mc.logout(function() {});
                TransactionsFactory.resetSocialTransactionsList();
                $state.go("login");
                if (window.cookies)
                    window.cookies.clear(function() {
                        console.log('Cookies cleared!');
                    });
            }
            mc.getIdentifications(function(data) {
                if (data.Status.code == "0") {
                    //
                    var msisdn;

                    for(var idx in data.identifications) {
                        console.log(data.identifications[idx].type, data.identifications[idx].identification);
                        if (data.identifications[idx].type == 0) {
                            msisdn = data.identifications[idx].identification;
                            break;
                        }
                    }
                    msisdn = formatLocal("vn", msisdn).replace(/ /g,"");
                    session.msisdn = msisdn;
                    for(var i in session.accounts) {
                        if (session.accounts[i].sva != null) {
                            session.accounts[i].msisdn = msisdn;
                            session.accounts[i].currency = session.accounts[i].sva.currency;

                        } else if (session.accounts[i].bankAccount != null) {
                            //
                            session.accounts[i].msisdn = session.accounts[i].bankAccount.accountNumber;
                            session.accounts[i].currency = session.accounts[i].bankAccount.currency;

                        }
                    }
                    $scope.accounts = getAccountsWithCategory();
                    $rootScope.safetyApply(function(){});

                }
            },session.customer.id);
        } else {
            ErrorBox(data.Status);
        }
    };

}]);
