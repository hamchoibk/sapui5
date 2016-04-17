'use strict';

tcbmwApp.controller('TopUpConfirmController',['$scope', '$rootScope' ,'$state','AccountSelectorFactory','TopUpFactory',function($scope,$rootScope,$state,AccountSelectorFactory,TopUpFactory){
  if ( $state.current.name == 'topupconfirm'){
    var baseStatus = {
      isBack:true,
      onBack: function() {
        $state.go('topupscreen');

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
        TopUpFactory.reset();
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
      angular.extend({title: TopUpFactory.isPrePaid ? 'NAVBAR_PREPAID_TOPUP' : 'NAVBAR_POSTPAID_TOPUP'}, baseStatus)
    ];

    $scope.status = statuses[0];
  }

  $scope.isPrePaid = TopUpFactory.isPrePaid;
  $scope.sourceAccount = TopUpFactory.topupInfo.sourceAccount;
  $scope.parsedAmount = TopUpFactory.topupInfo.parsedAmount;
  $scope.topupNumber = TopUpFactory.topupInfo.topupNumber;
  $scope.contactName = TopUpFactory.topupInfo.contactName;
  $scope.topupDate = TopUpFactory.topupInfo.topupDate;

  $scope.confirm = function(){
    $scope.loading = true;
    mc.preAuthorisationContinue(callback,TopUpFactory.topupInfo.systemId);
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
        TopUpFactory.topupInfo.ftId =  ft.ft_code;
      }


      $state.go('topupsuccess');
    } else if (r.Status.code == "2521") {
      //OTP page
      $state.go('topupotp');
    } else {
      ErrorBox(r.Status);
      appstate = trans.TRAN_IDLE;
    }
  }

}]);