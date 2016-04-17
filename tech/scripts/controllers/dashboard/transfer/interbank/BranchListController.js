tcbmwApp.controller('BranchListController',['$scope','$state','$filter','interBankFactory','$rootScope',function($scope,$state,$filter,interBankFactory,$rootScope){
  if($rootScope.suppressDialog === true){
    $rootScope.suppressDialog = false;
  }

  if ( $state.current.name == 'branchlist'){
    var baseStatus = {
      isBack: true,
      onBack: function() {

        $state.go('provincelist');
        var newIndex = statuses.indexOf($scope.status) - 1;
        if (newIndex > -1) {
          $scope.status = statuses[newIndex];
          $scope.status.move = 'ltr';
          $scope.navigationBarStatus = $scope.status;
        }
      }
    };

    var statuses = [
      angular.extend({title: 'NAVBAR_TCB_BRANCH_LIST'}, baseStatus)
    ];
    $scope.status = statuses[0];
  }

  $scope.loading = true;


  mc.getBranches(interBankFactory.txnInfo.destBank.id,interBankFactory.txnInfo.destProvince.id, getBranchBack);

  $scope.selectBranch = function(branch) {
    interBankFactory.txnInfo.destBranch = branch;
    interBankFactory.didSelectBen = false;
    $state.go('interbankindex');
  }

  function getBranchBack(r) {
    $scope.loading = false;
    $rootScope.safetyApply(function(){});

    if(r.Status.code == 0) {
      $scope.branches = r.branches;
      $rootScope.safetyApply(function(){});
    } else {
      ErrorBox(r.Status)
    }
  }

}]);

