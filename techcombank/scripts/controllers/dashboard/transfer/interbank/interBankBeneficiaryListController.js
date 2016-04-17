tcbmwApp.controller('InterBankBeneficiaryListController',['$scope','$state','$filter','interBankFactory','$rootScope',function($scope,$state,$filter,interBankFactory,$rootScope){
  if($rootScope.suppressDialog === true){
    $rootScope.suppressDialog = false;
  }

  if ( $state.current.name == 'interbankbeneficiarylist'){
    var baseStatus = {
      isBack: true,
      onBack: function() {

        $state.go($rootScope.previousState.name);
        var newIndex = statuses.indexOf($scope.status) - 1;
        if (newIndex > -1) {
          $scope.status = statuses[newIndex];
          $scope.status.move = 'ltr';
          $scope.navigationBarStatus = $scope.status;
        }
      }
    };

    var statuses = [
      angular.extend({title: 'NAVBAR_TCB_BENIFICIARYLIST'}, baseStatus)
    ];

    $scope.status = statuses[0];
  }

  $scope.loading = true;

  mc.getBeneficiaries(getBenBack,2); //get external ben (type = 2)
  $scope.selectBeneficiary = function(ben){
    interBankFactory.txnInfo.benName = ben.benName;
    interBankFactory.txnInfo.benAccountNumber = ben.accountNumber;
    interBankFactory.txnInfo.destBank = {
      id:ben.bankCode,
      name:ben.bankName
    };
    interBankFactory.txnInfo.destBranch = {
      branchCode:ben.branchCode,
      name:ben.branchName
    }
    interBankFactory.txnInfo.destProvince = {
      id:ben.branchLocation
    }
    interBankFactory.didSelectBen = true;
    console.log(interBankFactory.txnInfo);

    $state.go($rootScope.previousState.name);
  }

  function getBenBack(r) {
    $scope.loading = false;
    $rootScope.safetyApply(function(){});
    if(r.Status.code == "0") {
      $scope.benList = r.benList;
      $rootScope.safetyApply(function(){});
    } else {
      ErrorBox(r.Status);
    }
  }
}]);

