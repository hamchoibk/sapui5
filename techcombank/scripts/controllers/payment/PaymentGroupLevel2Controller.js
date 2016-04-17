'use strict';
tcbmwApp.controller('PaymentGroupLevel2Controller', ['$scope', '$rootScope', 'AccountFactory', 'TopUpFactory', 'ListOrderPaymentFactory', 'BillPaymentFactory', 'GameFactory', '$state',
    function ($scope, $rootScope, AccountFactory, TopUpFactory, ListOrderPaymentFactory, BillPaymentFactory, GameFactory, $state) {
    if ($state.current.name == 'paymentindexl2') {
        var baseStatus = {
            isBack: true,
            onBack: function () {
                $state.go('paymentindex');
                console.log("on back payment l2");
                var newIndex = statuses.indexOf($scope.status) - 1;
                if (newIndex > -1) {
                    $scope.status = statuses[newIndex];
                    $scope.status.move = 'ltr';
                    $scope.navigationBarStatus = $scope.status;
                }
            },

            isClose: true,
            onAction: function () {
                $state.go('dashboard.home');

                var newIndex = statuses.indexOf($scope.status) - 1;
                if (newIndex > -1) {
                    $scope.status = statuses[newIndex];
                    $scope.status.move = 'ltr';
                    $scope.navigationBarStatus = $scope.status;
                }
            }
        };
        var statuses = [];
        if (session.paymentNameL1 != undefined) {
            statuses = [
                angular.extend({title: session.paymentNameL1}, baseStatus)
            ];
        } else {
            statuses = [
                angular.extend({title: 'NAVBAR_PAYMENT'}, baseStatus)
            ];
        }

        $scope.status = statuses[0];
    }
    if ($rootScope.previousState.name == "paymentindex") {
        $scope.loading = true;
        mc.getPaymentsByGroup(getPaymentByGroupBack, session.paymentL2Key);
    } else {
        $scope.payments = session.l2Payments;
        $scope.loading = false;
        $rootScope.safetyApply(function(){});
    }

    function getPaymentByGroupBack(r) {
        if (r.Status.code == "0") {
            var payments = angular.extend([], r.paymentTypes);
            session.l2Payments = payments;
            $scope.payments = filterPaymentNameByLanguage(payments);
            $scope.loading = false;
            $rootScope.safetyApply(function(){});
        } else {
            $scope.loading = false;
            $rootScope.safetyApply(function(){});
            ErrorBox(r.Status);
        }
    };

    $scope.selectBill = function(bill) {
        session.paymentL3Key = [];
        TopUpFactory.reset();
        GameFactory.reset();
        BillPaymentFactory.reset();
        ListOrderPaymentFactory.reset();
        session.paymentPreviousState = $state.current.name;
        var billInfo = angular.extend({}, bill);
        if (billInfo.flowType == 1) {
            BillPaymentFactory.billInfo = billInfo;
            $state.go('billpaymentmain');
        } else if (billInfo.flowType == 2) {
            GameFactory.topupGame = billInfo;
            $state.go('topupgamescreen');
        } else if (billInfo.flowType == 4) {
            session.listBills = undefined;
            ListOrderPaymentFactory.listOrderInfo = billInfo;
            $state.go('listorderpaymentmain');
        } else if (billInfo.flowType == 3) {
            GameFactory.topupGame = billInfo;
            $state.go('topupgameenteramountscreen');
        } else if (billInfo.groupL3 != null) {
            session.paymentL3Key.push(billInfo.groupL3);
            session.paymentNameL2 = billInfo.name;
            $state.go("paymentindexl3");
        }
    };

    function filterPaymentNameByLanguage(payments) {
        for (var i = 0; i<payments.length; i++) {
            var paymentName = payments[i].name.split("|");
            payments[i].name = ($rootScope.languageCode == false) ? paymentName[0]  : paymentName[1];
        }

        console.log("payments == ", payments);

        return payments;
    }


}]);