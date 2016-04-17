tcbmwApp.controller('LocateDetailsController',['$scope','$state','AtmLocatorFactory','$rootScope',function($scope,$state,AtmLocatorFactory,$rootScope){
   var selectedItem = {"id":11,"name":"Northen Security","district":"Quan Huyen","type":"Branch","location":"Techcombank Bac Ninh","address":"20, Nguyen Dang Dao Bac Ninh City, Bac Ninh Province","tel":"Tel: +84 (241) 989 3811 / Fax: +84 (241) 949 3811","latitude":13.868746,"longitude":108.65066};
   $scope.selectedItem = AtmLocatorFactory.getSelectedItem();
   $scope.selectedItem = selectedItem;
   if ( $state.current.name == 'locatedetails'){
        var baseStatus = {
            isBack: true,
            onBack: function() {
                $state.go('locateindex');
                var newIndex = statuses.indexOf($scope.status) - 1;
                if (newIndex > -1) {
                    $scope.status = statuses[newIndex];
                    $scope.status.move = 'ltr';
                    $scope.navigationBarStatus = $scope.status;
                }
            }
        };

        var statuses = [
            angular.extend({title:$scope.selectedItem.name }, baseStatus)
        ];

        $scope.status = statuses[0];

        $scope.showMapView = function(){
            $state.go('locatemap')
        }
    }
}]);