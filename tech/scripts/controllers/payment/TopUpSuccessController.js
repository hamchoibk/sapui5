'use strict';

tcbmwApp.controller('TopUpSuccessController',['$scope','$rootScope','$state','AccountSelectorFactory','TopUpFactory',function($scope,$rootScope,$state,AccountSelectorFactory,TopUpFactory){
  $scope.forOwner = session.forOwner;
  if ( $state.current.name == 'topupsuccess'){
    var baseStatus = {
      isClose:true,
      onAction: function() {

        AccountSelectorFactory.resetAccount();

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
    $scope.isPrePaid = TopUpFactory.isPrePaid;
  $scope.sourceAccount = TopUpFactory.topupInfo.sourceAccount;
  $scope.topupNumber = TopUpFactory.topupInfo.topupNumber;
  $scope.parsedAmount = TopUpFactory.topupInfo.parsedAmount;
  $scope.contactName = TopUpFactory.topupInfo.contactName;
  $scope.ftId = TopUpFactory.topupInfo.ftId;
  $scope.fee = TopUpFactory.topupInfo.fee;
  if(TopUpFactory.topupInfo.txnNote != undefined) {
    //get message following language used
    var tmp = TopUpFactory.topupInfo.txnNote.split("|");
    var vnNote = tmp[0] + ' (mã ' + TopUpFactory.topupInfo.merchantErrorCode + ')';
    var enNote = tmp[1] + ' (code ' + TopUpFactory.topupInfo.merchantErrorCode + ')';
    $scope.txnNote = ($rootScope.languageCode == false) ? vnNote  : enNote;
  }

  $scope.done=function(){
    AccountSelectorFactory.resetAccount();
    TopUpFactory.reset();
    $state.go('dashboard.home');
  }

  $scope.transactMore=function(){

    AccountSelectorFactory.resetAccount();
    TopUpFactory.reset();
    $state.go('topupscreen');
  }

  updateBalance();

}]);