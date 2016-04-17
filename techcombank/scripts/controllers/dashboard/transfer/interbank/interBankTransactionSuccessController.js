tcbmwApp.controller('InterBankTranscationSuccessController',['$scope','$state','interBankFactory','$rootScope',function($scope,$state,interBankFactory,$rootScope){
  if ( $state.current.name == 'interbanktransactionsuccess'){
    var baseStatus = {
      isBack: false,
      onBack: function() {
        interBankFactory.resetTxnInfo();
        $state.go('dashboard.transferhome');
        var newIndex = statuses.indexOf($scope.status) - 1;
        if (newIndex > -1) {
          $scope.status = statuses[newIndex];
          $scope.status.move = 'ltr';
          $scope.navigationBarStatus = $scope.status;
        }
      },
      isClose:false,
      onAction: function() {
        interBankFactory.resetTxnInfo();
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
      angular.extend({title: 'NAVBAR_TCB_SUCCESS'}, baseStatus)
    ];

    $scope.status = statuses[0];
  }

  $scope.txnInfo = interBankFactory.txnInfo;

  var profileImage = angular.element("#profileImage");
  profileImage.attr("src", "images/profile-placeholder.png");


  $scope.clickTransactMore = function(){
    interBankFactory.resetTxnInfo();
    $state.go('interbankindex');
  };

  $scope.clickHome = function(){
    interBankFactory.resetTxnInfo();
    $state.go('dashboard.home');
  }
  if(interBankFactory.willCreateBen) {
    var ben = {
      type:TYPE_BEN_EXTERNAL,
      benName:$scope.txnInfo.benName,
      accountNumber:$scope.txnInfo.benAccountNumber,
      bankCode:$scope.txnInfo.destBank.id,
      branchCode:$scope.txnInfo.destBranch.branchCode,
      active:true,
      branchLocation:$scope.txnInfo.destProvince.id
    }
    mc.createBeneficiary(createBenBack,ben);
  }

  function createBenBack(r) {
    if(r.Status.code == "0") {
      console.log('successfully created ben');
    } else {
      console.log("create ben failed, error: " + r.Status.code);
    }
  }

  updateBalance();

}]);