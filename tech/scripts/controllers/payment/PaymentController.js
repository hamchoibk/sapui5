'use strict';
tcbmwApp.controller('PaymentController', ['$scope', '$rootScope', 'AccountFactory', 'TopUpFactory', 'ListOrderPaymentFactory', 'BillPaymentFactory', 'GameFactory', '$state',
    function ($scope, $rootScope, AccountFactory, TopUpFactory, ListOrderPaymentFactory, BillPaymentFactory, GameFactory, $state) {
        if ($state.current.name == 'paymentindex') {
            var baseStatus = {
                isBack: true,
                onBack: function () {
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
                angular.extend({title: 'NAVBAR_PAYMENT'}, baseStatus)
            ];

            $scope.status = statuses[0];
        }

        $scope.search = {name: ""};

        if ($rootScope.previousState.name == "dashboard.home") {
            $scope.loading = true;
            mc.getPaymentsByGroup(getPaymentByGroupBack);
        } else {
            $scope.loading = false;
            console.log("filterPaymentByGroupLevel1(session.paymentTypes) == ", filterPaymentByGroupLevel1(session.paymentTypes))
            console.log("filterPaymentByGroupLevel1(session.paymentTypes)[0] == ", filterPaymentByGroupLevel1(session.paymentTypes)[0])
            $scope.payments = filterPaymentByGroupLevel1(session.paymentTypes)[0];
            console.log("$scope.payments == ", $scope.payments);
            $scope.loading = false;
            $rootScope.safetyApply(function(){});
        }

        $('input#searchAll').focus(function () {

        }).blur(function () {
            if ($scope.search.name == "" || $scope.search.name == undefined) {
                $scope.payments = filterPaymentByGroupLevel1(session.paymentTypes)[0];
            } else {
                $scope.payments = filterPaymentNameByLanguage(filterPaymentByGroupLevel1(session.paymentTypes)[1]);
            }
            $rootScope.safetyApply(function(){});
        });

        $scope.filterByName = function() {
            if ($scope.search.name == "" || $scope.search.name == undefined) {
                $scope.payments = filterPaymentByGroupLevel1(session.paymentTypes)[0];
            } else {
                $scope.payments = filterPaymentNameByLanguage(filterPaymentByGroupLevel1(session.paymentTypes)[1]);
            }
            $rootScope.safetyApply(function(){});
        }

        function getPaymentByGroupBack(r) {
            if (r.Status.code == "0") {
                session.paymentTypes = angular.extend([], r.paymentTypes);
                var payments = angular.extend([], r.paymentTypes)
                $scope.payments = filterPaymentNameByLanguage(filterPaymentByGroupLevel1(payments)[0]);
                $scope.loading = false;
                $rootScope.safetyApply(function(){});
            } else {
                $scope.loading = false;
                $rootScope.safetyApply(function(){});
                ErrorBox(r.Status);
            }
        };

        function filterPaymentByGroupLevel1(paymentTypes) {
            var paymentL1 = [];
            var payment = [];
            var allPayments = [
                paymentL1,
                payment
            ];

            for (var i = 0; i < paymentTypes.length; i++) {
                if (paymentTypes[i].groupL1 == "Main") {
                    paymentL1.push(paymentTypes[i])
                }
                if (paymentTypes[i].groupL2 == null && paymentTypes[i].groupL3 == null) {
                    payment.push(paymentTypes[i])
                }
            }
            return allPayments;
        }

        $scope.selectBill = function (bill) {
            console.log("bill == ", bill);
            session.paymentL2Key = [];
            TopUpFactory.reset();
            GameFactory.reset();
            BillPaymentFactory.reset();
            ListOrderPaymentFactory.reset();
            session.paymentPreviousState = $state.current.name;
            var billInfo = angular.extend({}, bill);
            if (billInfo.flowType == 100 && billInfo.code == "TOPUP_MOBILE_PREPAID") {
                TopUpFactory.isPrePaid = true;
                $state.go("topupscreen");
            } else if (billInfo.flowType == 100 && billInfo.code == "POST_PAID_MOBILE_BILL") {
                TopUpFactory.isPrePaid = false;
                $state.go("topupscreen");
            } else if (billInfo.flowType == 100 && billInfo.groupL2 != null) {
                session.paymentL2Key.push(billInfo.groupL2);
                session.paymentNameL1 = billInfo.name;
                $state.go("paymentindexl2");
            } else if (billInfo.flowType == 1) {
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
            } else {
                MessageBox("", "Service is coming soon");
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