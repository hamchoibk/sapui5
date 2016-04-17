'use strict';

/**
 * @ngdoc function
 * @name tcbmwApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the tcbmwApp
 */


tcbmwApp.controller('loginController', ['$scope','$location','$timeout','$state','signupUserDetailsFactory','dialogService','$rootScope','$translate','TransactionsFactory',function ($scope,$location,$timeout,$state,signupUserDetailsFactory,dialogService,$rootScope,$translate,TransactionsFactory) {
    TransactionsFactory.resetSocialTransactionsList();
    currentAccountIdx = 0;
    if (window.cookies)
        window.cookies.clear(function() {
            console.log('Cookies cleared!');
        });
    $scope.login={username:'' , password:''};
    session.cachedSocialTrasactions = false;
    stopSocialTransationsTimeout();
    $scope.isLoading = false;
    $('#page-loader').hide();
    var oldLocation = '';
    $scope.$on('$routeChangeStart', function(angularEvent, next) {

        var isDownwards = true;
        if (next && next.$$route) {
            var newLocation = next.$$route.originalPath;
            if (oldLocation !== newLocation && oldLocation.indexOf(newLocation) !== -1) {
                isDownwards = false;
            }

            oldLocation = newLocation;
        }

        $scope.isDownwards = isDownwards;
    });

    session.updateDevice = false;

//        function updateDeviceIdToPushNotification() {
//            mc.updateDeviceToPushNotification(updateDeviceToPushNotificationBack);
//        }
//
//        function updateDeviceToPushNotificationBack(r) {
//            if(r.Status.code == '0') {
//                MessageBox("", "UPDATE_DEVICE_TO_PUSH_SUCCESSFULLY");
//                $location.path("/notification");
//            } else {
//                ErrorBox(r.Status);
//            }
//        }

    function loginBack(r) {

        if (r.Status.code == "0") {
            //check push notification status if user signin with another device
            if (r.UnstructuredData && getUnstructuredDataValue(r.UnstructuredData, "LoginTokenChange") == "Please Confirm") {
                session.updateDevice = true;
//                    Confirm("ASK_UPDATE_DEVICE_TO_PUSH_MESSAGE", updateDeviceIdToPushNotification);
            }

            //Done, get other user information
            session.customer = r.customer;
            if (session.customer.displayName  == null)
                session.customer.displayName = "";
            session.sessionId = r.sessionId;
            session.accounts = null;
            session.user = null;
            session.customer.login = $scope.login.username;
            window.localStorage.setItem("lastLoginName",$scope.login.username);
            session.sessionTimeoutWindow =  parseInt(r.sessionTimeoutSeconds)*1000;
            startSessionTimer();
            $location.path("/dashboard/home");
            $scope.loading = false;
            //$rootScope.safetyApply(function(){});
            $rootScope.safetyApply(function(){});
        } else
        if (r.Status.code == "10006") {
            //Signup KYC
            signupUserDetailsFactory.setUD(r.UnstructuredData);
            signupUserDetailsFactory.setArcIB(true);
            for(var key in r.UnstructuredData) {
                switch (r.UnstructuredData[key].Key) {
                    case "CustomerIdentity":
                        signupUserDetailsFactory.setIdentityNumber(r.UnstructuredData[key].Value);
                        break;
                    case "T24FullName":
                        signupUserDetailsFactory.setUserName(r.UnstructuredData[key].Value);
                        break;
                    case "CustomerIdentityIssueDate":
                        if (r.UnstructuredData[key].Value == null || r.UnstructuredData[key].Value == undefined || r.UnstructuredData[key].Value == "") {
                            $location.path('/login');
                            $scope.login.password = "";
                            $scope.loading = false;
                            $scope.showClearPassword = false;
                            $rootScope.safetyApply(function(){});
                            MessageBox("Dang nhap that bai. Thieu thong tin ngay cap CMND");
                            return;
                        } else {
                            var issueDate = r.UnstructuredData[key].Value;
                            var year = parseInt(issueDate.substr(0,4));
                            var month = parseInt(issueDate.substr(4,2));
                            var day = parseInt(issueDate.substr(6,2));
                            var d = new Date(year,month-1, day);
                            signupUserDetailsFactory.setIssueDate(d.format("yyyy-mm-dd"));
                            break;
                        }


                    case "RSAMobileNumber":
                        var mobileListStr = r.UnstructuredData[key].Value;
                        mobileListStr = mobileListStr.replace("[","").replace("]","").replace(" ","");
                        var mobileList = mobileListStr.split(",");
                        if (mobileListStr.length>0 && mobileList[0]!="null") {
                            signupUserDetailsFactory.setMobileNumber(mobileList[0]);
                            console.log("co so dien thoai");
                            signupUserDetailsFactory.editMode = false;
                        } else {
                            console.log("ko co so dien thoai");
                            signupUserDetailsFactory.editMode = true;
                        }
                        break;
                    default:

                        break;
                }
            }
            $location.path('/signupuserdetails');
            $scope.loading = false;
            //$rootScope.safetyApply(function(){});
            $rootScope.safetyApply(function(){});
        } else if (r.Status.code == "332") {
            session.customer = r.customer;
            ErrorBox(r.Status);
            $state.go('changepassword');
            $scope.loading = false;
        } else
        {
            ErrorBox(r.Status);
            $scope.login.password = "";
            $scope.showClearPassword = false;
            $scope.loading = false;
            //$rootScope.safetyApply(function(){});
            $rootScope.safetyApply(function(){});
        }
    };
    $scope.submit=function(){
        if (!$scope.login.username && !$scope.login.password){
            dialogService.showModal('ERROR_CODE_30002');
        }
        else if(!$scope.login.username){
            dialogService.showModal('ERROR_CODE_30000');
        }
        else if (!$scope.login.password){
            dialogService.showModal('ERROR_CODE_30001');
        }
        else{
            $scope.loading = true;
            $scope.showClearUserName = false;
            $scope.showClearPassword = false;
            //$rootScope.safetyApply(function(){});
            $rootScope.safetyApply(function(){});
            mc.login(loginBack,$scope.login);
        }
    };

    $scope.clickSubmit = function(event){
        if (event.which === 13)
        {
            if (!$scope.login.username && !$scope.login.password){
                dialogService.showModal('ERROR_CODE_30002');
            }
            else if(!$scope.login.username){
                dialogService.showModal('ERROR_CODE_30000');
            }
            else if (!$scope.login.password){
                dialogService.showModal('ERROR_CODE_30001');
            }
            else{
                $scope.loading = true;
                //$rootScope.safetyApply(function(){});
                $rootScope.safetyApply(function(){});
                mc.login(loginBack,$scope.login);
            }
        }
    };

    $scope.clickBack = function(){
        // TODO :: To check if user is logged in or not, maintain the state if so,
        $state.go('main');
    };

    $scope.forgotPassword = function(){
        $state.go('forgotpasswordmain');
    };
    $scope.signup=function(){
        $location.path('/signupuserdetails');
    };

    var lastLoginName = window.localStorage.getItem("lastLoginName");

    $('input#input-username').focus(function() {
        if($scope.login.username != undefined && $scope.login.username.length>0) {
            $scope.showClearUserName = true;
            //$rootScope.safetyApply(function(){});
            $rootScope.safetyApply(function(){});
        }
    });

    $('input#input-password').focus(function() {
        if($scope.login.password != undefined && $scope.login.password.length>0) {
            $scope.showClearPassword = true;
            //$rootScope.safetyApply(function(){});
        }
    });

    $scope.showClearUserName = false;
    $scope.showClearPassword = false;

    if(lastLoginName != undefined) {
        $scope.login.username = lastLoginName;
//    $scope.showClearUserName = true;
    }

    $scope.didChangePassword = function() {
        if($scope.login.password != undefined && $scope.login.password.length > 0) {
            $scope.showClearPassword = true;
        } else {
            $scope.showClearPassword = false;
        }
    };

    $scope.didChangeUserName = function() {
        if($scope.login.username !=undefined && $scope.login.username.length > 0) {
            $scope.showClearUserName = true;
        } else  {
            $scope.showClearUserName = false;
        }
    };

    $scope.clearUserName = function() {
        $scope.login.username = '';
        $scope.showClearUserName = false;
        $('#input-username').focus();
    };

    $scope.clearPassword = function() {
        $scope.login.password = '';
        $scope.showClearPassword = false;
        $('#input-password').focus();
    };
}]);
