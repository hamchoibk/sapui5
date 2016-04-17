tcbmwApp.controller('LocateSearchController',['$scope','$state','AtmLocatorFactory','$rootScope',function($scope,$state,AtmLocatorFactory,$rootScope){
   
   if ( $state.current.name == 'locatesearch'){
        var baseStatus = {
            isBack: true,
            onBack: function() {
                console.log(statuses);
                session.selectedATM = null;
                $state.go('locateindex');
                
                var newIndex = statuses.indexOf($scope.status) - 1;
                
                if (newIndex > -1) {
                    $scope.status = statuses[newIndex];
                    $scope.status.move = 'ltr';
                    $scope.navigationBarStatus = $scope.status;
                    //statuses.splice(newIndex+1,1);
                    
                }
            }
        };

        var statuses = [
            angular.extend({title: 'NAVBAR_ATMLOCATOR_LOCATE_SEARCH' }, baseStatus)
        ];

       $scope.status = statuses[0];
       
    }
    var atmList = session.atmList;
    if (!atmList)
        atmList=[];
    var loadedATM = [];
    for(var idx=0;(idx<20) && (idx<atmList.length);idx++) {
        loadedATM.push(atmList[idx]);
    }
    $scope.atmList = loadedATM;
    $scope.clickATM = function (atm) {
        session.selectedATM = atm;
        $state.go('locateindex');
        console.log(atm);
    }
    var isProcessing = false;
    $("#atmList").scroll(function() {
        console.log("scroll");
        if (isProcessing) return;
        
        var scrollTop = $(this).scrollTop();
        var height = $(this).height();
        var scrollLength = $(this)[0].scrollHeight - height;
        if (scrollLength - scrollTop<100) {
            console.log("refresh data");
            isProcessing = true;
            loadMore();
            setTimeout(function(){ $scope.$apply()},0);
            isProcessing = false;
        }
    });
    function loadMore() {
        //var social = friendFactory.getChoosenSocial();
       // var friends = friendFactory.getFriendList(social);
        var filteredList = atmList.filter(filterByName);
        var last = $scope.atmList.length - 1;
        for(var i = 1; i <= 8; i++) {
            //console.log(i, last, friends.length);
            if (last + i< filteredList.length) {
                $scope.atmList.push(filteredList[last + i]);
                //console.log(last + i);
            }
            
        }
        //console.log($scope.friends.length);
    };
    function filterByName(atm) {
        if ($scope.query !== undefined)
            return atm.LocationDetail.toLowerCase().indexOf($scope.query.toLowerCase())>=0;
        else
            return true;
    }
    $scope.filterATM = function(query) {
        console.log($scope.query);
        var filteredList = atmList.filter(filterByName);
        
        //$scope.friends = filteredList;
        loadedATM = [];
        for(var idx=0;(idx<20) && (idx<filteredList.length);idx++) {
            loadedATM.push(filteredList[idx]);
        }
        $scope.atmList = loadedATM;
        setTimeout(function(){ $scope.$apply()},0);
    };
}]);