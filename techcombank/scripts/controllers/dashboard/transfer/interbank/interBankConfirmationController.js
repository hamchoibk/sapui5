tcbmwApp.controller('InterBankConfirmationController',['$scope','$state','interBankFactory','$rootScope',function($scope,$state,interBankFactory,$rootScope){
  if ( $state.current.name == 'interbankconfirmation'){
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
      },
      isClose:true,
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
      angular.extend({title: 'NAVBAR_INTER_BANK'}, baseStatus)
    ];

    $scope.status = statuses[0];
  }

  $scope.txnInfo = interBankFactory.txnInfo;

  $scope.confirm = function(){
    $scope.loading = true;
    mc.preAuthorisationContinue(callback,interBankFactory.txnInfo.systemId);
  };

  function callback(r) {
    $scope.loading = false;
    $rootScope.safetyApply(function(){});
    if (r.Status.code == "0") {
      //Done, no OTP, move to last step
      var ft = {};
      if (r.UnstructuredData !== undefined) {
        //check if a FT exist
        ft.ft_key = r.UnstructuredData[0].Key;
        ft.ft_code = r.UnstructuredData[0].Value;
        interBankFactory.txnInfo.ftId =  ft.ft_code;
      }

      $state.go('interbanktransactionsuccess');
    } else if (r.Status.code == "2521") {
      //OTP page
      $state.go('interbankotpscreen');
    } else {
      ErrorBox(r.Status);
      appstate = trans.TRAN_IDLE;
    }
  }

}]);