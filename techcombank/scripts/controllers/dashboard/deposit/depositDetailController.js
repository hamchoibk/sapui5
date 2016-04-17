'use strict';
tcbmwApp.controller('DepositDetailController',['$scope','DepositFactory','$state','$rootScope',function ($scope,DepositFactory,$state,$rootScope) {
    if ( $state.current.name == 'depositdetail'){
        var baseStatus = {
            isBack: true,
            onBack: function() {
                $state.go('depositindex');
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
            angular.extend({title: 'NAVBAR_DEPOSIT_DETAIL'}, baseStatus)
        ];

        $scope.status = statuses[0];
    }
    var temp = angular.extend({}, DepositFactory.depositInfo);
    $scope.depositInfo = temp;
    $scope.hideForSuperkid = true;
    $scope.depositInfo.principleAmountFormated = parseInt(DepositFactory.depositInfo.principleAmount).formatMoney(0);
    $scope.depositInfo.amountInterestFormated =parseInt(DepositFactory.depositInfo.interestAmount).formatMoney(0);
    if (DepositFactory.depositInfo.term.indexOf("[M]")!= -1) {
        $scope.depositInfo.term = ($rootScope.languageCode == false) ? DepositFactory.depositInfo.term.replace("\[M\]", "tháng") : DepositFactory.depositInfo.term.replace("\[M\]", "months");
    } else if (DepositFactory.depositInfo.term.indexOf("[Y]")!= -1) {
        $scope.depositInfo.term = ($rootScope.languageCode == false) ? DepositFactory.depositInfo.term.replace("\[Y\]", "năm") : DepositFactory.depositInfo.term.replace("\[Y\]", "years");
    } else if (DepositFactory.depositInfo.term.indexOf("[W]")!= -1) {
        $scope.depositInfo.term = ($rootScope.languageCode == false) ? DepositFactory.depositInfo.term.replace("\[W\]", "tuần") : DepositFactory.depositInfo.term.replace("\[W\]", "weeks");
    }

    if (DepositFactory.depositInfo.depositCode == "03") {
        $scope.hideForSuperkid = false;
        $scope.lablePrincipleAmount = "DEPOSIT_INDEX_SUPER_KID_PRINCIPLE_AMOUNT";
    } else {
        $scope.hideForSuperkid = true;
        $scope.lablePrincipleAmount = "DEPOSIT_INDEX_PRINCIPLE_AMOUNT";
    }
    $rootScope.safetyApply(function(){});
}]);
