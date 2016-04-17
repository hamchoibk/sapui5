'use strict';
/**
 * @ngdoc function
 * @name tcbmwApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the tcbmwApp
 */
tcbmwApp.controller('mainController', ['$scope','$location','$timeout','$rootScope','$translate','dialogService','$state','signupUserDetailsFactory',function ($scope,$location,$timeout,$rootScope,$translate,dialogService,$state,signupUserDetailsFactory) {

    $rootScope.suppressDialog = false;
    var oldLocation = '';
    $scope.init = function(){
    };
    $scope.$on('$routeChangeStart', function(angularEvent, next) {
        console.log("routeChangeStart");
        var isDownwards = false;
        if (next && next.$$route) {
            var newLocation = next.$$route.originalPath;
            if (oldLocation !== newLocation && oldLocation.indexOf(newLocation) !== -1) {
                isDownwards = false;
            }

            oldLocation = newLocation;
        }

        $scope.isDownwards = isDownwards;

    });

    $scope.signup=function(){
        session.provinceList = undefined;
        signupUserDetailsFactory.clear();
        signupUserDetailsFactory.imgData1 = "";
        signupUserDetailsFactory.imgData2 = "";
        signupUserDetailsFactory.city = "";
        $state.go('signup');

    };

    $scope.clickPromos = function(){
        $location.path('/promotion');
    };

    $scope.login=function(){
        //$location.path('/login');
        $state.go('login');
    };

    $scope.clickProduct = function(){
        window.open("https://www.techcombank.com.vn/san-pham-dich-vu-tai-chinh-ca-nhan", '_blank', 'location=yes');
    };

    $scope.clickDeals = function(){
        window.open("https://techcombank.com.vn/khach-hang-ca-nhan/chuong-trinh-uu-dai/khuyen-mai-cho-san-pham", '_blank', 'location=yes');
        
    };

    $scope.clickContactus = function(){''
        $location.path('/contactus');
    };

    $scope.clickATMLocator = function(){
        $location.path('/locateindex');
    }

    $scope.clickDemo = function(){
        $location.path('/getstartedindex');
    }

//    function success(data){
//        console.log(data);
//    };
//
//    function failure(data){
//        console.log(data);
//    };

    /*** Support selecting environment ****/
    //if(setting.selectedServer == undefined) {
    //    $scope.selectedServer = (setting.port == 8080) ? 0 : ((setting.port == 8090) ? 1 : 2);
    //} else {
    //    $scope.selectedServer = setting.selectedServer;
    //}
    //
    //$scope.didSelectServer = function() {
    //    setting.selectedServer = $scope.selectedServer;
    //    if(setting.selectedServer == 0) {
    //        //dev
    //        setting.protocol = "http://";
    //        setting.ipaddress = "mbtest.techcombank.com.vn";
    //        setting.port = 8080;
    //    } else if(setting.selectedServer == 1) {
    //        //uat
    //        setting.protocol = "http://";
    //        setting.ipaddress = "mbtest.techcombank.com.vn";
    //        setting.port = 8090;
    //    } else {
    //        //live
    //        setting.protocol = "https://";
    //        setting.ipaddress ="m.techcombank.com.vn";
    //        setting.port = 443;
    //    }
    //    mc = new MobiliserClient(); //re-initialize mobiliser client
    //}
    /*** End support selecting environment ***/
}]);