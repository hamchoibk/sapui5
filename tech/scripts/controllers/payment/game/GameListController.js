'use strict';
tcbmwApp.controller('GameListController',['$scope','$rootScope','$state', '$filter','AccountSelectorFactory','GameFactory','BillPaymentFactory',function ($scope,$rootScope,$state,$filter,AccountSelectorFactory,GameFactory,BillPaymentFactory) {
  if ( $state.current.name == 'gamelist'){
    var baseStatus = {
        isBack: true,
        onBack: function() {
            $state.go('paymentindex');
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
            BillPaymentFactory.reset();
            GameFactory.reset();
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
      angular.extend({title: 'NAVBAR_GAME_SELECT_GAME_LIST'}, baseStatus)
    ];

    $scope.status = statuses[0];
  }
    if ($rootScope.previousState.name == "topupgamescreen"
        || $rootScope.previousState.name == "topupgameenteramountscreen"
        || $rootScope.previousState.name ==  "topupgamesuccess") {
        $scope.topupGames = session.topupGames;
    } else {
        $scope.loading = true;
        mc.getPaymentsByGroup(getPaymentByGroupBack, ["Game"]);
    }



    function getPaymentByGroupBack (r) {
        if (r.Status.code == "0") {
            $scope.topupGames = r.paymentTypes;
            session.topupGames = r.paymentTypes;
            $scope.loading = false;
            $rootScope.safetyApply(function(){});
        } else {
            ErrorBox(r.Status);
        }
    };

  $scope.selectGame = function(game) {

      var topupGame = {};
      topupGame.flowType = game.flowType;
      topupGame.paymentName = game.paymentName;
      topupGame.code = game.code;
      topupGame.havingAmountList = game.havingAmountList;
      topupGame.iconUrl = game.iconUrl;
      topupGame.id = game.id;
      topupGame.name = game.name;
      topupGame.piType = game.piType;
      topupGame.usecase = game.usecase;
      topupGame.groupL1 = game.groupL1;
      if (game.spareFields.spareString2 != null) {
          topupGame.successMessage = game.spareFields.spareString2;
      }
      GameFactory.topupGame = topupGame;
      BillPaymentFactory.billInfo = topupGame;

      if (topupGame.flowType == 1) {
          $state.go('billpaymentmain');
      } else if (topupGame.flowType == 2) {
          $state.go('topupgamescreen');
      } else {
          $state.go('topupgameenteramountscreen');
      }
  }
}]);