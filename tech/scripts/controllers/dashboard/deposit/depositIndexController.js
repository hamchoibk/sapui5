'use strict';
tcbmwApp.controller('DepositIndexController',['$scope','DepositFactory','$state','$rootScope',function ($scope,DepositFactory,$state,$rootScope) {
    if ( $state.current.name == 'depositindex'){
        var baseStatus = {
            isBack: true,
            onBack: function() {
                DepositFactory.reset();
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
            angular.extend({title: 'NAVBAR_DEPOSIT_INDEX'}, baseStatus)
        ];

        $scope.status = statuses[0];
    }

    console.log("DepositFactory.depositInfo == ", DepositFactory.depositInfo);

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
    };

    $scope.clickViewDetail = function(){
        DepositFactory.depositInfo = session.savingAccounts[$scope.accountIndex];
        $state.go('depositdetail');
    }

    $scope.clickDepositDetail = function(accountIndex){
        console.log("session.savingAccounts[accountIndex] == ", session.savingAccounts[accountIndex]);
        DepositFactory.depositInfo = session.savingAccounts[accountIndex];
        $state.go('depositdetail');
    }

    $scope.clickClose = function() {
    }

    $scope.clickDeposit = function() {
    }

    $scope.dimissPopUp =function(){
        $('.moreMenu').removeClass('show');
        $('.overlay').removeClass('show');
    }

    if ($rootScope.previousState.name != "depositdetail") {
        $scope.loading = true;
        mc.getSavingAccount(getSavingAccountBack);
    } else {
        $scope.deposits = preparingSavingData(session.savingAccounts);
        $scope.loading = false;
    }

    function getSavingAccountBack(r) {
        if (r.Status.code == "0") {
            session.savingAccounts = angular.extend([], r.savingAccounts);
            var deposits = angular.extend([], r.savingAccounts);
            $scope.deposits = preparingSavingData(deposits);
            $scope.loading = false;
            $rootScope.safetyApply(function(){});
        } else {
            $scope.loading = false;
            ErrorBox(r.Status);
        }
    }

//    var dummyData = [
//        {depositCode: "01" , depositName: "Tiết kiệm online", accountNumber: "14024701457010", currencyCode: "VND", valueDate: "01/01/2015", maturityDate: "31/12/2015", period: "1 năm", sourceAccount: "19024701457010", principleAmount: 45000000, interest: "4.5%", amountInterest: 4500000, maturity: "Tiền lãi và gốc chuyển tự động vào TK dưới đây", settlementAccount: "19024701457010", accountName: "Trinh Trung Kien"},
//        {depositCode: "01" , depositName: "Phát lộc online", accountNumber: "14024701457010", currencyCode: "VND", valueDate: "01/01/2015", maturityDate: "31/12/2015", period: "1 năm", sourceAccount: "19024701457010", principleAmount: 32000000, interest: "4.5%", amountInterest: 4500000, maturity: "Tiền lãi và gốc chuyển tự động vào TK dưới đây", settlementAccount: "19024701457010", accountName: "Trinh Trung Kien"},
//        {depositCode: "02" , depositName: "F@st saving", accountNumber: "14024701457010", currencyCode: "VND", valueDate: "01/01/2015", maturityDate: "31/12/2015", period: "1 năm", sourceAccount: "19024701457010", principleAmount: 1000000, interest: "4.5%", amountInterest: 4500000, maturity: "Tiền lãi và gốc chuyển tự động vào TK dưới đây", settlementAccount: "19024701457010", accountName: "Trinh Trung Kien"},
//        {depositCode: "03" , depositName: "Tích lũy tài tâm", accountNumber: "14024701457010", currencyCode: "VND", valueDate: "01/01/2015", maturityDate: "31/12/2015", period: "1 năm", sourceAccount: "19024701457010", principleAmount: 14000000, interest: "4.5%", amountInterest: 4500000, maturity: "Tiền lãi và gốc chuyển tự động vào TK dưới đây", settlementAccount: "19024701457010", accountName: "Trinh Trung Kien"},
//        {depositCode: "03" , depositName: "Tiết kiệm superkid", accountNumber: "14024701457010", currencyCode: "VND", valueDate: "01/01/2015", maturityDate: "31/12/2015", period: "1 năm", sourceAccount: "19024701457010", principleAmount: 56000000, interest: "4.5%", amountInterest: 4500000, maturity: "Tiền lãi và gốc chuyển tự động vào TK dưới đây", settlementAccount: "19024701457010", accountName: "Trinh Trung Kien"}
//    ];

    function preparingSavingData(savingAccounts) {
        var deposits=[
            {
                mainDepositName: "DEPOSIT_ONLINE",
                open:true,
                havingNoDeposit:true,
                subAccounts:[]
            },
            {
                mainDepositName: "DEPOSIT_OVER_COUNTER",
                open:true,
                havingNoDeposit:true,
                subAccounts: []
            },
            {
                mainDepositName: "DEPOSIT_SUPER_KID",
                open:true,
                havingNoDeposit:true,
                subAccounts: []
            }
        ];
        if (DepositFactory.depositInfo.depositCode != undefined) {
            if (DepositFactory.depositInfo.depositCode == "01") {
                deposits[0].open = true;
                deposits[1].open = false;
                deposits[2].open = false;
            } else if (DepositFactory.depositInfo.depositCode == "02") {
                deposits[1].open = true;
                deposits[0].open = false;
                deposits[2].open = false;
            } else {
                deposits[2].open = true;
                deposits[0].open = false;
                deposits[1].open = false;
            }
        }
        for (var i = 0; i < savingAccounts.length; i++) {
            var acc = savingAccounts[i];
            var subAcc = {accountIndex:i};
            if (acc.depositCode == "01") {
                subAcc.depositCode = acc.depositCode;
                subAcc.productName = acc.productName;
                subAcc.accountNo = acc.accountNo;
                subAcc.currency = acc.currency;
                subAcc.valDate = acc.valDate;
                subAcc.matDate = acc.matDate;
                subAcc.term = acc.term;
                subAcc.sourceAccount = acc.sourceAccount;
                subAcc.principleAmount = parseInt(acc.principleAmount).formatMoney(0);
                subAcc.intRate = acc.intRate;
                subAcc.interestAmount = parseInt(acc.interestAmount).formatMoney(0);
                subAcc.maturity = acc.maturity;
                subAcc.settleAccount = acc.settleAccount;
                subAcc.accountName = acc.accountName;
                deposits[0].subAccounts.push(subAcc);
            } else if (acc.depositCode == "02") {
                subAcc.depositCode = acc.depositCode;
                subAcc.productName = acc.productName;
                subAcc.accountNo = acc.accountNo;
                subAcc.currency = acc.currency;
                subAcc.valDate = acc.valDate;
                subAcc.matDate = acc.matDate;
                subAcc.term = acc.term;
                subAcc.sourceAccount = acc.sourceAccount;
                subAcc.principleAmount = parseInt(acc.principleAmount).formatMoney(0);
                subAcc.intRate = acc.intRate;
                subAcc.interestAmount = parseInt(acc.interestAmount).formatMoney(0);
                subAcc.maturity = acc.maturity;
                subAcc.settleAccount = acc.settleAccount;
                subAcc.accountName = acc.accountName;
                deposits[1].subAccounts.push(subAcc);
            } else {
                subAcc.depositCode = acc.depositCode;
                subAcc.productName = acc.productName;
                subAcc.accountNo = acc.accountNo;
                subAcc.currency = acc.currency;
                subAcc.valDate = acc.valDate;
                subAcc.matDate = acc.matDate;
                subAcc.term = acc.term;
                subAcc.sourceAccount = acc.sourceAccount;
                subAcc.principleAmount = parseInt(acc.principleAmount).formatMoney(0);
                subAcc.intRate = acc.intRate;
                subAcc.interestAmount = parseInt(acc.interestAmount).formatMoney(0);
                subAcc.maturity = acc.maturity;
                subAcc.settleAccount = acc.settleAccount;
                subAcc.accountName = acc.accountName;
                deposits[2].subAccounts.push(subAcc);
            }
        }

        if (deposits[0].subAccounts && deposits[0].subAccounts.length != 0) {
            deposits[0].havingNoDeposit = false;
        } else
            deposits[0].havingNoDeposit = true;
        if (deposits[1].subAccounts && deposits[1].subAccounts.length != 0) {
            deposits[1].havingNoDeposit = false;
        } else
            deposits[1].havingNoDeposit = true;
        if (deposits[2].subAccounts && deposits[2].subAccounts.length != 0) {
            deposits[2].havingNoDeposit = false;
        } else
            deposits[2].havingNoDeposit = true;

        return deposits;
    }

}]);
