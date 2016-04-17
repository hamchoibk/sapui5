tcbmwApp.controller('BankListController',['$scope','$state','$filter','interBankFactory','$rootScope',function($scope,$state,$filter,interBankFactory,$rootScope){
  if($rootScope.suppressDialog === true){
    $rootScope.suppressDialog = false;
  }

  if ( $state.current.name == 'banklist'){
    var baseStatus = {
      isBack: true,
      onBack: function() {
        $state.go('interbankindex');
        var newIndex = statuses.indexOf($scope.status) - 1;
        if (newIndex > -1) {
          $scope.status = statuses[newIndex];
          $scope.status.move = 'ltr';
          $scope.navigationBarStatus = $scope.status;
        }
      }
    };

    var statuses = [
      angular.extend({title: 'NAVBAR_TCB_BANK_LIST'}, baseStatus)
    ];
    $scope.status = statuses[0];
  }
    $scope.loading = true;
    //mc.getBanks(getBanksBack);
    console.log("$rootScope.previousState =", $rootScope.previousState );

    if ($rootScope.previousState.name != "provincelist") {

      $scope.loading = true;
      mc.getBanks(getBanksBack);
    } else {

        setTimeout(function(){

                $scope.banks = interBankFactory.bankList;
                $scope.loading = false;
                $rootScope.safetyApply(function(){});
            }

            ,1000);

    }


  $scope.selectBank = function(bank) {
    interBankFactory.txnInfo.destBank = bank;
    $state.go('provincelist')
  }

  function getBanksBack(r) {

    $scope.loading = false;

    if(r.Status.code == 0) {
      interBankFactory.bankList = r.banks;
      $scope.banks = r.banks;

    } else {
      ErrorBox(r.Status);
    }

    $rootScope.safetyApply(function(){});

  }
}]);

