tcbmwApp.controller('ProvinceListController',['$scope','$state','$filter','interBankFactory','$rootScope',function($scope,$state,$filter,interBankFactory,$rootScope){
  if($rootScope.suppressDialog === true){
    $rootScope.suppressDialog = false;
  }

  if ( $state.current.name == 'provincelist'){
    var baseStatus = {
      isBack: true,
      onBack: function() {

        $state.go('banklist');

        var newIndex = statuses.indexOf($scope.status) - 1;
        if (newIndex > -1) {
          $scope.status = statuses[newIndex];
          $scope.status.move = 'ltr';
          $scope.navigationBarStatus = $scope.status;
        }
      }
    };

    var statuses = [
      angular.extend({title: 'NAVBAR_TCB_PROVINCE_LIST'}, baseStatus)
    ];
    $scope.status = statuses[0];
  }

  $scope.loading = true;
  mc.getProvincesByBank(interBankFactory.txnInfo.destBank.id, getProvincesBack);
  $scope.bankName = interBankFactory.txnInfo.destBank.name;

  function getProvincesBack(r) {
    console.log('getProvincesBack',r);
    $scope.loading = false;
    $rootScope.safetyApply(function(){});
    if(r.Status.code == 0) {
      interBankFactory.tmpProvinceList = r.provinces;
      $scope.provinces = r.provinces;
      $rootScope.safetyApply(function(){});
    } else {
      ErrorBox(r.Status)
    }
  }

  $scope.selectProvince = function(province) {
    interBankFactory.txnInfo.destProvince = province;
    $state.go('branchlist');
  }
}]);

