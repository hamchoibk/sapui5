tcbmwApp.controller('addBeneficiaryController',['$scope','$state','$filter','tcbTransferFactory','$rootScope',function($scope,$state,$filter,tcbTransferFactory,$rootScope){
    if ( $state.current.name == 'addBeneficiary'){
        if (session.selectedBeneficiary) {
        //Edit
        $scope.isEdit = true;
        $scope.accountName = session.selectedBeneficiary.name;
        $scope.accountNumber = session.selectedBeneficiary.accountNumber;
    } else 
        $scope.isEdit = false;
        var baseStatus = {
            isBack: true,
            onBack: function() {
                $state.go('beneficiarysearch');
                var newIndex = statuses.indexOf($scope.status) - 1;
                if (newIndex > -1) {
                    $scope.status = statuses[newIndex];
                    $scope.status.move = 'ltr';
                    $scope.navigationBarStatus = $scope.status;
                }
            }
        };
        var statuses = $scope.isEdit?[
            angular.extend({title: 'NAVBAR_BENEFICIARYLIST_EDIT'}, baseStatus)
        ]:[
            angular.extend({title: 'NAVBAR_BENEFICIARYLIST_ADD'}, baseStatus)
        ];
        
        $scope.status = statuses[0];
    }
    
    $scope.confirm = function(){

        $scope.loading = true;
        $rootScope.safetyApply(function(){});
        if(session.selectedBeneficiary != null && session.selectedBeneficiary.type == "COMMON_EXTERNAL_ACCOUNT") {
          //update external ben //TODO : update branch & bank
            mc.updateBeneficiary(updateBeneficiaryBack,session.selectedBeneficiary.benId, $scope.accountName, $scope.accountNumber, TYPE_BEN_EXTERNAL);
            return;
        }
        if ($scope.accountNumber.length == 14) {
            $scope.benType = TYPE_BEN_IN_TCB;
            mc.getPaymentInstrument(getPaymentInstrument, $scope.accountNumber, 2);
        } else {
            $scope.benType = TYPE_BEN_WALLET;
            mc.getPaymentInstrument(getPaymentInstrument, formatLocal("vn", $scope.accountNumber).replace(/[^0-9]/g,""), 1);
        }

    }
    function getPaymentInstrument(r) {
        if (r.Status.code == "0") {
            if (r.PaymentInstrument != null) {
                //got account, save to ben
                if (session.selectedBeneficiary != null) {
                    //update ben
                    //MessageBox("Need update ben API");
                    mc.updateBeneficiary(updateBeneficiaryBack,session.selectedBeneficiary.benId, $scope.accountName, $scope.accountNumber, $scope.benType);
                } else {
                    //add
                    var ben = {
                      benName: $scope.accountName,
                      accountNumber: $scope.accountNumber,
                      active:true,
                      type:$scope.benType};
                    mc.createBeneficiary(createBeneficiaryBack, ben);
                }
            } else {
                $scope.loading = false;
                $rootScope.safetyApply(function(){});
                MessageBox("COMMON_ACCOUNT_DOES_NOT_EXIST");
            }
        } else {
            $scope.loading = false;
            $rootScope.safetyApply(function(){});
            ErrorBox(r.Status);
        }
    }
    function updateBeneficiaryBack(r) {
        $scope.loading = false;
        $rootScope.safetyApply(function(){});
        if (r.Status.code == "0") {
            MessageBox("COMMON_UPDATED_BENEFICIARY");
            $state.go('beneficiarysearch');
            
        } else {
            MessageBox("ERROR");
        }
    }
    function createBeneficiaryBack(r) {
        $scope.loading = false;
        $rootScope.safetyApply(function(){});
        if (r.Status.code == "0") {
            MessageBox("COMMON_ADDED_BENEFICIARY");
            $state.go('beneficiarysearch');
            
        } else {
            MessageBox("COMMON_DUPLICATED_BENEFICIARY_ENTRY");
        }
    }
}]);