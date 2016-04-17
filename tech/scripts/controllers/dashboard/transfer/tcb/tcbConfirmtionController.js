tcbmwApp.controller('TCBConfirmationController',['$scope','$state','tcbTransferFactory', '$rootScope',function($scope,$state,tcbTransferFactory,$rootScope){
    if ( $state.current.name == 'tcbconfirmation'){
        var baseStatus = {
            isBack: true,
            onBack: function() {
                $state.go('tcbindex');
                var newIndex = statuses.indexOf($scope.status) - 1;
                if (newIndex > -1) {
                    $scope.status = statuses[newIndex];
                    $scope.status.move = 'ltr';
                    $scope.navigationBarStatus = $scope.status;
                }
            },
            isClose:true,
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
        angular.extend({title: 'NAVBAR_TCB_CONFIRMATION'}, baseStatus)
        ];

        $scope.status = statuses[0];
    }

    var transferDetails=tcbTransferFactory.getTransferDetails();

    if(transferDetails.destinationAccountDetails.payeeImage==null)
        transferDetails.destinationAccountDetails.payeeImage='https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg?sz=50';

    $scope.transferDetails = transferDetails;
    console.log("transferDetails", transferDetails);

    $scope.sendButtonClicked = function(){
       //$state.go('tcbotpscreen');
       $scope.loading = true;
       $rootScope.safetyApply(function(){});
       mc.preAuthorisationContinue(preAuthorisationContinueBack, session.transit_value.sysid);
    };
    function preAuthorisationContinueBack(r) {        
        if (r.Status.code == "0") {

            var transRef = r.Transaction.systemId;
            if (r.UnstructuredData) {
                if (r.UnstructuredData.length == 1) {
                    transRef = transRef + " " + r.UnstructuredData[0].Value;
                }
            }
            tcbTransferFactory.setTransactionReference(transRef);


            $state.go('tcbtransactionsuccess');
        } else 
        if (r.Status.code == "2521") {
            $state.go('tcbotpscreen');
        } else {
			$scope.loading = false;
			$rootScope.safetyApply(function(){});
            ErrorBox(r.Status);
        }
    }
}]);