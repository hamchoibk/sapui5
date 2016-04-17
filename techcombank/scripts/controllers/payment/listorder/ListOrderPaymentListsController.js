'use strict';
tcbmwApp.controller('ListOrderPaymentListsController',['$scope','$rootScope','$state','AccountSelectorFactory', 'ListOrderPaymentFactory',function ($scope,$rootScope,$state,AccountSelectorFactory,ListOrderPaymentFactory) {
    if ( $state.current.name == 'listorderpaymentlists'){
        var baseStatus = {
            isBack: true,
            onBack: function() {
                $state.go('listorderpaymentmain');
                var newIndex = statuses.indexOf($scope.status) - 1;
                if (newIndex > -1) {
                    $scope.status = statuses[newIndex];
                    $scope.status.move = 'ltr';
                    $scope.navigationBarStatus = $scope.status;
                }
            },
            isClose:true,
            onAction: function() {
                AccountSelectorFactory.resetAccount();
                ListOrderPaymentFactory.reset();
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
            angular.extend({title: 'NAV_BAR_LIST_ORDER_PAYMENT_SELECT_THE_BILL'}, baseStatus)
        ];

        $scope.status = statuses[0];
    }

    for(var i = 0; i < session.listBills.length; i++) {
        var order = session.listBills[i];
        order.prettyFromDate = new Date(order.period.startDate).format('dd-mm-yyyy');
        order.prettyToDate = new Date(order.period.endDate).format('dd-mm-yyyy');
    }

    if (session.listBills.length == 1) {
        $scope.showAlert = false;
    } else {
        $scope.showAlert = true;
    }

    $scope.orders = session.listBills;
    $rootScope.safetyApply(function(){});

    $scope.selectOrder = function(order) {
        if (order.billId != session.listBills[0].billId) {
            MessageBox("", "SELECT_THE_BILL_MESSAGE");
            return;
        } else {
            $state.go("listorderpaymentmain");
        }
    }

}]);