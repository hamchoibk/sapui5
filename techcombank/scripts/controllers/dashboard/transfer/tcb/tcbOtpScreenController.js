tcbmwApp.controller('TCBOtpScreenController',['$scope','$state','tcbTransferFactory','$rootScope',function($scope,$state,tcbTransferFactory,$rootScope){

         if ( $state.current.name == 'tcbotpscreen'){
                var baseStatus = {
//                    isBack: false,
//                    onBack: function() {
//                        tcbTransferFactory.resetTransferDetails();
//                        $state.go('dashboard.transferhome');
//                        var newIndex = statuses.indexOf($scope.status) - 1;
//                        if (newIndex > -1) {
//                            $scope.status = statuses[newIndex];
//                            $scope.status.move = 'ltr';
//                            $scope.navigationBarStatus = $scope.status;
//                        }
//                    },
                    isClose:false,
                    onAction: function() {
                        tcbTransferFactory.resetTransferDetails();
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
		 
         $scope.confirmButtonClicked = function(){
                //$state.go('tcbtransactionsuccess');
                $scope.loading = true;
                $rootScope.safetyApply(function(){});
                mc.authenticationContinue(authContinueBack, session.transit_value.sysid, $scope.smsCode, $scope.pinCode);
         }

         function authContinueBack(r) {
            
            if (r.Status.code == "0") {
                var transRef = "";
                if (r.UnstructuredData && r.UnstructuredData.length != 0) {
                    transRef = r.Transaction.systemId + " " + getUnstructuredDataValue(r.UnstructuredData, "FtId");
                } else {
                    transRef = r.Transaction.systemId;
                }
                tcbTransferFactory.setTransactionReference(transRef);

                if (session.nextOtpScreen !== undefined && session.nextOtpScreen != null) {
                    $state.go(session.nextOtpScreen);
                    session.nextOtpScreen = null;
                } else
                $state.go('tcbtransactionsuccess');
            } else {
				$scope.loading = false;
                $rootScope.safetyApply(function(){});
                ErrorBox(r.Status);				
            }
         }
         //ng-model - smsCode
         //ng-model - pinCode
}]);
