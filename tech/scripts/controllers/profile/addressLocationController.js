'use strict';
tcbmwApp.controller('addressLocationController',['$scope','$state','ProfileFactory','$rootScope',function ($scope,$state,ProfileFactory,$rootScope) {
    if ( $state.current.name == 'addressLocation'){
                var baseStatus = {
                    isBack:true,
                    onBack: function() {
                      $state.go('profile');

                      var newIndex = statuses.indexOf($scope.status) - 1;
                      if (newIndex > -1) {
                            $scope.status = statuses[newIndex];
                            $scope.status.move = 'ltr';
                            $scope.navigationBarStatus = $scope.status;
                      }
                    }
                };

                var statuses = [
                    angular.extend({title: 'Location'}, baseStatus)
                ];

                $scope.status = statuses[0];
    }
    
    mc.getLookups(getLookupsBack,"addresslocation");
    function getLookupsBack(r) {
        if (r.Status.code == "0") {
            $scope.locations = r.lookupEntities;
        } else {
            ErrorBox(r.Status);
        }
    }
}]);