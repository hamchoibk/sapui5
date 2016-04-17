tcbmwApp.controller('InterBankOtpScreenController',['$scope','$state','interBankFactory','$rootScope',function($scope,$state,interBankFactory,$rootScope){

  if ( $state.current.name == 'interbankotpscreen'){
    var baseStatus = {
      isBack: false,

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
      angular.extend({title: 'NAVBAR_TCB_OTP'}, baseStatus)
    ];

    $scope.status = statuses[0];
  }

  $scope.confirm = function(){
    $scope.loading = true;
    mc.authenticationContinue(callback,interBankFactory.txnInfo.systemId,$scope.smsCode,$scope.pinCode);
  }

  function callback(r) {

    $scope.loading = false;
    $rootScope.safetyApply(function(){});

    if (r.Status.code == "0") {


      if (r.UnstructuredData) {
        //check if a FT exist
        if (r.UnstructuredData.length == 1) {
            console.log("r======", r);
          interBankFactory.txnInfo.ftId = r.Transaction.systemId + " " + r.UnstructuredData[0].Value;
        }
      }
      $state.go('interbanktransactionsuccess');
    } else {
      appstate = trans.TRAN_IDLE;
      ErrorBox(r.Status);
    }
  }

}]);
