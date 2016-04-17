'use strict';
tcbmwApp.controller('PushNotificationController', ['$scope', '$state', '$rootScope', 'dialogService', function ($scope, $state, $rootScope, dialogService) {

    if ($state.current.name == 'pushnotification') {
        var baseStatus = {
            isClose: true,
            onAction: function () {
                $state.go('dashboard.home');
            }
        };
        var statuses = [
            angular.extend({title: "NAVBAR_PUSH_NOTIFICATION"}, baseStatus)
        ];

        $scope.status = statuses[0];

    }
    var accounts = getAccountsWithCategory();
    var accountsStatus = [];
    var accountList = [];
    var enableAll = false;
    $scope.edited = false;
    preparingData();

    $scope.loading = true;
    mc.getPushStatusOfAccounts(getPushStatusOfAccountsBack, accountsStatus);

    function getPushStatusOfAccountsBack(r) {
        if (r.Status.code == '0') {
            if (r.accountPush) {
                for(var i = 0; i < r.accountPush.length; i++) {
                    if (i == 0) {
                        enableAll = r.accountPush[i].pushStatus;
                    }
                    enableAll = enableAll * r.accountPush[i].pushStatus;
                    if (enableAll == 1) {
                        enableAll = true;
                    } else {
                        enableAll = false;
                    }
                    for (var j = 0; j < accounts.length; j++) {
                        for (var k = 0; k< accounts[j].subAccounts.length; k++) {
                            if (r.accountPush[i].accountNumber == accounts[j].subAccounts[k].accountNumber) {
                                accounts[j].subAccounts[k].pushStatus = r.accountPush[i].pushStatus;
                            }
                        }
                    }
                }
                $scope.accounts = accounts;
                $scope.enabledAll = enableAll;
                $rootScope.safetyApply(function(){});
            }
            $scope.loading = false;
            $rootScope.safetyApply(function(){});
        } else {
            $scope.loading = false;
            ErrorBox(r.Status);
            $state.go("dashboard.home");
        }
    }

    $scope.changeStatusAll = function () {
        for (var i = 0; i < accounts.length; i++) {
            for (var j = 0; j < accounts[i].subAccounts.length; j++) {
                if ($scope.enabledAll == true) {
                    accounts[i].subAccounts[j].pushStatus = true;
                } else {
                    accounts[i].subAccounts[j].pushStatus = false;
                }
            }
        }
        $scope.accounts = accounts;
        preparingData();
        $('#scrollArea').scrollTop($("#scrollArea")[0].scrollHeight);
        $scope.edited = true;
        $rootScope.safetyApply(function(){});
    }

    $scope.pushStatusChange = function(subAccount) {
        $scope.edited = true;
        $rootScope.safetyApply(function(){});
    }

    $scope.clickSave = function() {

//        Test service on web app
//        setting.appinfo.deviceId = '7F851D6B-1AEC-4184-880A-938B24C736A9';
        preparingData();
        $scope.loading = true;
        mc.savePushNotificationAccount(savePushNotificationAccountBack, accountList);
    }

    function savePushNotificationAccountBack(r) {
        if(r.Status.code == '0') {
            $scope.loading = false;
            MessageBox("", "PUSH_NOTIFICATION_UPDATE_SUCCESSFULLY");
            $state.go('dashboard.home');

        } else {
            $scope.loading = false;
            ErrorBox(r.Status);
        }
        $rootScope.safetyApply(function(){});
    }

    function preparingData() {
        while (accountList.length > 0) {
            accountList.pop();
        }
        while (accountsStatus.length > 0) {
            accountsStatus.pop();
        }
        for (var i = 0; i < accounts.length; i++) {
            for (var j = 0; j < accounts[i].subAccounts.length; j++) {
                accountsStatus.push({accountNumber: accounts[i].subAccounts[j].accountNumber});
                accountList.push({accountNumber: accounts[i].subAccounts[j].accountNumber, pushStatus: accounts[i].subAccounts[j].pushStatus});
            }
        }
    }

}]);


