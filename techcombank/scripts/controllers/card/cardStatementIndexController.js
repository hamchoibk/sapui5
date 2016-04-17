'use strict';
tcbmwApp.controller('CardStatementIndexController',['$scope','$state','CardFactory', '$rootScope',function($scope,$state,CardFactory,$rootScope){
    if ( $state.current.name == 'cardstatementindex'){
        var baseStatus = {
            isBack: true,
            onBack: function() {
                CardFactory.cardInfo = $scope.cardInfo;
                $scope.cardInfo.fromDateFormatedDate = '';
                $scope.cardInfo.toDateFormatedDate = '';
                session.cycles = undefined;
                $state.go('cardpaymentindex');
                var newIndex = statuses.indexOf($scope.status) - 1;
                if (newIndex > -1) {
                    $scope.status = statuses[newIndex];
                    $scope.status.move = 'ltr';
                    $scope.navigationBarStatus = $scope.status;
                }
            },
            isClose : true,
            onAction : function() {
                $state.go('dashboard.home');
            }
        };

        var statuses = [
            angular.extend({title: 'NAVBAR_CARD_STATEMENT'}, baseStatus)
        ];

        $scope.status = statuses[0];
    }

    $scope.cardInfo = CardFactory.cardInfo;
    if ($rootScope.previousState.name == "cardstatementdetails") {
        $scope.cardInfo.cyclesListOpen = CardFactory.cardInfo.cyclesListOpen;
        $scope.cardInfo.byDateOpen = CardFactory.cardInfo.byDateOpen;
    } else {
        $scope.cardInfo.cyclesListOpen = false;
        $scope.cardInfo.byDateOpen = false;
    }
    $scope.isMobile = isiOsDevice || isAndroid;
    $scope.isiOsDevice = isiOsDevice;

    if ($rootScope.previousState.name == "cardstatementdetails" && session.cycles != undefined) {
        $scope.cycles = session.cycles;
        addPrettyDateToCycles($scope.cycles);
        $rootScope.safetyApply(function(){});
    } else {
        $scope.loading = true;
        mc.getCardStatementCycles(getStatementCycleBack, $scope.cardInfo.cardAccountNumber);
    }

    function getStatementCycleBack(r) {
        if (r.Status.code == "0") {
            if(r.cycles.length == 0) {
                $scope.cardInfo.haveNoCycle = true;
            } else {
                $scope.cardInfo.haveNoCycle = false;
                $scope.cycles = r.cycles;
                session.cycles = r.cycles;
                addPrettyDateToCycles($scope.cycles);
            }
            $scope.loading = false;
            $rootScope.safetyApply(function(){});
        } else {
            $scope.loading = false;
            ErrorBox(r.Status);
        }
    }

    $scope.selectCycle = function(cycle) {
        CardFactory.cardInfo = $scope.cardInfo;
        CardFactory.txnQuery = {
            cardAccountNumber : $scope.cardInfo.cardAccountNumber,
            cycleId : cycle.cycleId,
            cycleDate: cycle.date,
            byDate : false
        }
        $state.go('cardstatementdetails');
    }


    $scope.clickSearch = function() {
        CardFactory.cardInfo = $scope.cardInfo;
        if($scope.cardInfo.toDateFormatedDate < $scope.cardInfo.fromDateFormatedDate) {
            MessageBox("", "FROM_DATE_TO_DATE_DOUBLE_VALIDATION");
            return;
        }
        CardFactory.txnQuery = {
            cardAccountNumber : $scope.cardInfo.cardAccountNumber,
            fromDate : $scope.cardInfo.fromDateFormatedDate,
            toDate : $scope.cardInfo.toDateFormatedDate,
            byDate : true
        }
        $state.go('cardstatementdetails');
    }

    $scope.selectFromDate = function($event) {
        if (isAndroid) {
            var d = new Date();
            if ($scope.cardInfo.fromDatePickedDate !== undefined) {
                d = new Date($scope.cardInfo.fromDatePickedDate);
            }

            var options = {
                date: d,
                mode: 'date'
            };

            datePicker.show(options, function(date){
                var tmpDate = date;
                try {
                    var parseDate = new Date(tmpDate);
                    var today = new Date();
                    if (parseDate != "Invalid Date") {
                        $scope.cardInfo.fromDatePickedDate = date;
                        CardFactory.cardInfo.fromDatePickedDate = date;
                        $scope.cardInfo.fromDateFormatedDate = parseDate.format("yyyy-mm-dd");
                        $rootScope.safetyApply(function(){});
                    }
                } catch (e) {
                    console.log(e.message);
                }
            });

            $event.target.blur();
        }

    }

    $scope.selectToDate = function($event) {
        if (isAndroid) {
            var d = new Date();
            if ($scope.cardInfo.toDatePickedDate !== undefined) {
                d = new Date($scope.cardInfo.toDatePickedDate);
            }

            var options = {
                date: d,
                mode: 'date'
            };

            datePicker.show(options, function(date){
                var tmpDate = date;
                try {
                    var parseDate = new Date(tmpDate);
                    var today = new Date();
                    if (parseDate != "Invalid Date") {
                        $scope.cardInfo.toDatePickedDate = date;
                        CardFactory.cardInfo.toDatePickedDate = date;
                        $scope.cardInfo.toDateFormatedDate = parseDate.format("yyyy-mm-dd");
                        $rootScope.safetyApply(function(){});
                    }
                } catch (e) {
                    console.log(e.message);
                }
            });

            $event.target.blur();
        }

    }

    function addPrettyDateToCycles(cycles) {
        for(var i = 0; i < cycles.length; i++) {
            var cycle = cycles[i];
            cycle.prettyDate = new Date(cycle.date).format('dd-mm-yyyy');
        }
    }

}]);