'use strict';
tcbmwApp.controller('CreditIndexController',['$scope','CreditFactory','$state','$rootScope',function ($scope,CreditFactory,$state,$rootScope) {
    if ( $state.current.name == 'creditindex'){
        var baseStatus = {
            isBack: true,
            onBack: function() {
                CreditFactory.reset();
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
            angular.extend({title: 'NAVBAR_CREDIT_INDEX'}, baseStatus)
        ];

        $scope.status = statuses[0];
    }

    console.log("CreditFactory.loanInfo == ", CreditFactory.loanInfo);

    $scope.showMoreMenu=function(e, accountIndex, mainLoanName){
        console.log(accountIndex);
        console.log(mainLoanName);
        var target = e.target
        var newY = target.getBoundingClientRect().top + 30 + $(document).scrollTop();
        var newX = target.getBoundingClientRect().left - 260;
        $scope.accountIndex = accountIndex;
        $scope.mainLoanName = mainLoanName;
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
        console.log($scope.mainLoanName);
        CreditFactory.loanInfo = session.loanAccounts[$scope.accountIndex];
        CreditFactory.loanInfo.mainLoanName = $scope.mainLoanName;
        $state.go('creditdetail');
    }

    $scope.clickLoan = function(accountIndex, mainLoanName){
        console.log("session.loanAccounts.[accountIndex] == ", session.loanAccounts[accountIndex]);
        CreditFactory.loanInfo = session.loanAccounts[accountIndex];
        CreditFactory.loanInfo.mainLoanName = mainLoanName;
        $state.go('creditdetail');
    }

    $scope.clickWithdraw = function() {
    }


    $scope.dimissPopUp =function(){
        $('.moreMenu').removeClass('show');
        $('.overlay').removeClass('show');
    }

    if ($rootScope.previousState.name != "creditdetail") {
        $scope.loading = true;
        mc.getLoanAccount(getLoanAccountBack);
    } else {
        $scope.loans = preparingLoanData(session.loanAccounts);
        $scope.loading = false;
    }

    function getLoanAccountBack(r) {
        if (r.Status.code == "0") {
            session.loanAccounts = angular.extend([], r.loanAccounts);
            var loanAccounts = angular.extend([], r.loanAccounts);
            $scope.loans = preparingLoanData(loanAccounts);
            $scope.loading = false;
            $rootScope.safetyApply(function(){});
        } else {
            $scope.loading = false;
            ErrorBox(r.Status);
        }
    }

//    var dummyData = [
//        {loanCode: "01" , loanName: "", contractNumber: "173342561", currencyCode: "VND", disbursementDate: "01/01/2015", maturityDate: "31/12/2015", purpose: "Đánh lô", disbursementAccount: "19024701457010", outstandingBalance: 38000000, interest: "4.5%", autoDebitAccount: "19024701457010", accountName: "Trinh Trung Kien"},
//        {loanCode: "02" , loanName: "", contractNumber: "174278912", currencyCode: "VND", valueDate: "01/01/2015", maturityDate: "31/12/2015", purpose: "Đánh đề trả góp", principalDueDate: "15/9/2015", principalPeriodTemp: 62000000, interestAmountPeriodTemp: 2500000, interest: "7.5%", interestDueDate: "20/9/2015"},
//        {loanCode: "02" , loanName: "", contractNumber: "012937254", currencyCode: "VND", valueDate: "01/01/2015", maturityDate: "31/12/2015", purpose: "Đánh lô và đề trả góp", principalDueDate: "15/9/2015", principalPeriodTemp: 10000000, interestAmountPeriodTemp: 2500000, interest: "7.5%", interestDueDate: "20/9/2015"}
//    ];


    function preparingLoanData(loanAccounts) {
        var loans=[
            {
                mainLoanName: "CREDIT_ONLINE",
                open:true,
                havingNoLoan:true,
                subAccounts:[]
            },
            {
                mainLoanName: "CREDIT_OVER_COUNTER",
                open:true,
                havingNoLoan:true,
                subAccounts: []
            }
        ];

        if (CreditFactory.loanInfo.loanCode != undefined) {
            if (CreditFactory.loanInfo.loanCode == "01") {
                loans[0].open = true;
                loans[1].open = false;
            } else {
                loans[1].open = true;
                loans[0].open = false;
            }
        }
        for (var i = 0; i < loanAccounts.length; i++) {
            var acc = loanAccounts[i];
            var subAcc = {accountIndex:i};

            if (acc.loanCode == "01") {
                subAcc.loanCode = acc.loanCode;
                subAcc.loanName = acc.loanName;
                subAcc.contractNo = acc.contractNo;
                subAcc.currency = acc.currency;
                subAcc.valueDate = acc.valueDate;
                subAcc.maturityDate = acc.maturityDate;
                subAcc.purpose = acc.purpose;
                subAcc.disbursementAccount = acc.disbursementAccount;
                subAcc.outstandingBalance = parseInt(acc.outstandingBalance).formatMoney(0);
                subAcc.interestRate = acc.interestRate;
                subAcc.maturity = acc.maturity;
                subAcc.autoDebitAccount = acc.autoDebitAccount;
                subAcc.accountName = acc.accountName;
                loans[0].subAccounts.push(subAcc);
            } else {
                subAcc.loanCode = acc.loanCode;
                subAcc.loanName = acc.loanName;
                subAcc.contractNo = acc.contractNo;
                subAcc.currency = acc.currency;
                subAcc.valueDate = acc.valueDate;
                subAcc.maturityDate = acc.maturityDate;
                subAcc.purpose = acc.purpose;
                subAcc.principalDueDate = acc.principleDueDate;
                subAcc.principalPeriodTemp = parseInt(acc.principlePeriod).formatMoney(0);
                subAcc.outstandingBalance = parseInt(acc.outstandingBalance).formatMoney(0);
                subAcc.interestAmountPeriodTemp = parseInt(acc.interestAmount).formatMoney(0);
                subAcc.interestRate = acc.interestRate;
                subAcc.interestDueDate = acc.interestDueDate;
                loans[1].subAccounts.push(subAcc);
            }
        }

        if (loans[0].subAccounts && loans[0].subAccounts.length != 0) {
            loans[0].havingNoLoan = false;
        } else
            loans[0].havingNoLoan = true;
        if (loans[1].subAccounts && loans[1].subAccounts.length != 0) {
            loans[1].havingNoLoan = false;
        } else
            loans[1].havingNoLoan = true;

        console.log("credits ==", loans);

        return loans;
    }

}]);
