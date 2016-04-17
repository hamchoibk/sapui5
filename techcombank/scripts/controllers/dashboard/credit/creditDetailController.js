'use strict';
tcbmwApp.controller('CreditDetailController',['$scope','CreditFactory','$state','$rootScope',function ($scope,CreditFactory,$state,$rootScope) {
    if ( $state.current.name == 'creditdetail'){
        var baseStatus = {
            isBack: true,
            onBack: function() {
                $state.go('creditindex');
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

        var statuses = [
            angular.extend({title: 'NAVBAR_CREDIT_DETAIL'}, baseStatus)
        ];

        $scope.status = statuses[0];
    }
    $scope.isOnlineLoan = false;

    $scope.loanInfo = CreditFactory.loanInfo;
    console.log("$scope.loanInfo == ", $scope.loanInfo);
    if ($scope.loanInfo.mainLoanName == "CREDIT_ONLINE") {
        $scope.isOnlineLoan = true;
        $scope.loanInfo.outstandingBalanceFormated = parseInt(CreditFactory.loanInfo.outstandingBalance).formatMoney(0);
//        $scope.disbursementDate = new Date(CreditFactory.loanInfo.disbursementDate).format("dd/mm/yyyy");
//        $scope.maturityPrettyDate = new Date(CreditFactory.loanInfo.maturityDate).format("dd/mm/yyyy");
    } else {
        $scope.isOnlineLoan = false;
        $scope.loanInfo.principalPeriodTempFormated = parseInt(CreditFactory.loanInfo.principlePeriod).formatMoney(0);
        $scope.loanInfo.interestAmountPeriodTempFormated = parseInt(CreditFactory.loanInfo.interestAmount).formatMoney(0);
//        $scope.valueDatePretty = new Date(CreditFactory.loanInfo.valueDate).format("dd/mm/yyyy");
//        $scope.maturityDatePretty = new Date(CreditFactory.loanInfo.maturityDate).format("dd/mm/yyyy");
//        $scope.principalDueDatePretty = new Date(CreditFactory.loanInfo.principalDueDate).format("dd/mm/yyyy");
//        $scope.interestDueDatePretty = new Date(CreditFactory.loanInfo.interestDueDate).format("dd/mm/yyyy");
    }
    $rootScope.safetyApply(function(){});

}]);