
tcbmwApp.controller('dashboardController',['$scope','$location','$rootScope', function($scope,$location,$rootScope) {
	$scope.clickSignout = function() {
        stopSessionTimer();
		mc.logout(function(){});
        $location.path("/");
        //clear user data
        session = new LoginSession();
	}
}]);
