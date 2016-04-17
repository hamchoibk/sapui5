'use strict';
tcbmwApp.controller('signupMainController',['$scope','$rootScope','signupUserDetailsFactory','$location',function ($scope,$rootScope,signupUserDetailsFactory,$location) {
    var baseStatus = {
        isBack: true,

        onBack: function() {
            signupUserDetailsFactory.clear();
            signupUserDetailsFactory.city = "";
            signupUserDetailsFactory.imgData1 = "";
            signupUserDetailsFactory.imgData2 = "";
            $location.path('/');
            var newIndex = statuses.indexOf($scope.status) - 1;
            if (newIndex > -1) {
                $scope.status = statuses[newIndex];
                $scope.status.move = 'ltr';
                $scope.navigationBarStatus = $scope.status;
            }
        }
    };
    var status = 'NAVBAR_SIGNUP_USERDETAILS';
    var statuses = [
        angular.extend({title: status}, baseStatus)
    ];

    $scope.status = statuses[0];
    $rootScope.suppressDialog = false;
    checkIdentity();

    if ($rootScope.previousState.name == "signupconfirm" && session.provinceList != undefined) {
        $scope.provinceList = session.provinceList;
    } else {
        $scope.loading = true;
        mc.getAllProvinces(getAllProvincesBack);
    }

    $scope.signup = {
        mobileNumber : signupUserDetailsFactory.getMobileNumber(),
        userName : signupUserDetailsFactory.getUserName(),
        password:signupUserDetailsFactory.getPassword(),
        confirmPassword : signupUserDetailsFactory.getConfirmPassword(),
        identityNumber:signupUserDetailsFactory.getIdentityNumber(),
        issuePickedDate:signupUserDetailsFactory.getIssuePickedDate(),
        issueDate: signupUserDetailsFactory.getIssueDate(),
        issueFormatedDate:signupUserDetailsFactory.getFormatedIssueDate(),
        dob: signupUserDetailsFactory.getDOB(),
        dobPickedDate: signupUserDetailsFactory.getDOBPickedDate(),
        dobFormatedDate: signupUserDetailsFactory.getFormatedDOB(),
        address: signupUserDetailsFactory.getAddress(),
        email: signupUserDetailsFactory.getEmail(),
        promotionCode: signupUserDetailsFactory.getPromotionCode(),
        city: signupUserDetailsFactory.city
    };

    $scope.isMobile = isAndroid  || isiOsDevice;
    $scope.isAndroid = isAndroid;
    $scope.isiOsDevice = isiOsDevice;

    $scope.isPhototaken1 = false;
    $scope.isPhototaken2 = false;

    var imgData1=signupUserDetailsFactory.imgData1;
    if(imgData1=='' || imgData1 == undefined){
        $scope.isPhototaken1 = false;
        var image1 = angular.element("#photoImage1");
        image1.attr("src","images/32-camera.png");
        $('li p.photoShow').show();

    }
    else{
        $scope.isPhototaken1 = true;
        var image1 = angular.element("#photoImage1");
        image1.attr("src","data:image/jpeg;base64," + imgData1);
        $('li p.photoShow').hide();
    }

    var imgData2=signupUserDetailsFactory.imgData2;
    if(imgData2=='' || imgData2 == undefined){
        $scope.isPhototaken2 = false;
        var image2 = angular.element("#photoImage2");
        image2.attr("src","images/32-camera.png");
        $('li p.photoShow').show();
    }
    else{
        $scope.isPhototaken2 = true;
        var image2 = angular.element("#photoImage2");
        image2.attr("src","data:image/jpeg;base64," + imgData2);
        $('li p.photoShow').hide();
    }

    $scope.clickNext = function(){
        if(signupUserDetailsFactory.imgData1 == undefined || signupUserDetailsFactory.imgData1 == "" ||
            signupUserDetailsFactory.imgData2 == undefined || signupUserDetailsFactory.imgData2 == "") {
            $('.signup-identity').addClass('signup-identity-alert');
            $rootScope.safetyApply(function(){});
            MessageBox("", "SIGNUP_MAIN_INPUT_IDENTIFIER_SCAN");
            return;
        }
        saveUserDetails();
        $scope.loading = true;
        $rootScope.safetyApply(function(){});
        mc.checkCredentialStrength(checkCredentialStrengthBack,$scope.signup.password);
    };

    function checkCredentialStrengthBack(r) {
        $scope.loading = false;

        if (r.Status.code == "0") {
            $location.path('/signupconfirm');
        } else {
            ErrorBox(r.Status);
            signupUserDetailsFactory.setPassword("");
            signupUserDetailsFactory.setConfirmPassword("");
        }
        $rootScope.safetyApply(function(){});
    }

    $scope.focusIssueDate = function($event) {
        if (isAndroid) {
            var d = new Date();
            if ($scope.signup.issuePickedDate !== undefined)
                d = new Date($scope.signup.issuePickedDate);
            var options = {
                date: d,
                mode: 'date'
            };

            datePicker.show(options, function(date){
                var tmpDate = date;
                try {
                    var parseDate = new Date(tmpDate);
                    var today = new Date();
                    if (parseDate != "Invalid Date") {
                        $scope.signup.issuePickedDate = date;
                        signupUserDetailsFactory.setIssuePickedDate(date);
                        $scope.signup.issueFormatedDate = parseDate.format("dd/mm/yyyy");
                        $event.target.blur();
                        if (today < parseDate) {
                            $scope.signupform.issueDate.$setValidity('issuedatematch', false);
                            MessageBox("", "SIGNUP_MAIN_ISSUE_DATE_VALIDATION");
                        } else {
                            $scope.signupform.issueDate.$setValidity('issuedatematch', true);
                        }
                        $rootScope.safetyApply(function(){});
                    }
                } catch (e) {
                    console.log(e.message);
                }
            });
            $event.target.blur();
        }

    }

    function getAllProvincesBack(r) {
        console.log('getProvincesBack',r);
        if(r.Status.code == 0) {
            $scope.provinceList = r.provinces;
            session.provinceList = r.provinces;
            $scope.loading = false;
            $rootScope.safetyApply(function(){});
        } else {
            $scope.loading = false;
            $rootScope.safetyApply(function(){});
            ErrorBox(r.Status)
        }
    }

    $scope.focusDOB = function($event) {
        if (isAndroid) {
            var d = new Date();
            if ($scope.signup.dobPickedDate !== undefined) {
                d = new Date($scope.signup.dobPickedDate);
            }

            var options = {
                date: d,
                mode: 'date'
            };

            datePicker.show(options, function(date){
                var tmpDate = date;
                try {
                    var parseDate = new Date(tmpDate);
                    var today = new Date();
                    if (parseDate != "Invalid Date") {
                        $scope.signup.dobPickedDate = date;
                        signupUserDetailsFactory.setDOBPickedDate(date);
                        $scope.signup.dobFormatedDate = parseDate.format("dd/mm/yyyy");
                        $event.target.blur();
                        var age = (today - parseDate)/365/24/60/60/1000;
                        if (parseInt(age) < 18) {
                            $scope.signupform.DOB.$setValidity('dobmatch', false);
                            MessageBox("", "SIGNUP_MAIN_DOB_VALIDATION");
                        } else {
                            $scope.signupform.DOB.$setValidity('dobmatch', true);
                        }
                        $rootScope.safetyApply(function(){});
                    }
                } catch (e) {
                    console.log(e.message);
                }
            });

            $event.target.blur();
        }

    }

    $scope.clickPhoto1 = function(){
        if ( $scope.isPhototaken1){
            TCBNativeBridge.getPicture(successCallback1,error1,'removePhoto');
        }else{
            TCBNativeBridge.getPicture(successCallback1,error1,'Photo');
        }
    };
    $scope.clickPhoto2 = function(){
        if ( $scope.isPhototaken2){
            TCBNativeBridge.getPicture(successCallback2,error2,'removePhoto');
        }else{
            TCBNativeBridge.getPicture(successCallback2,error2,'Photo');
        }
    };

    function checkIdentity() {
        if(signupUserDetailsFactory.imgData1 != "" && signupUserDetailsFactory.imgData2 != "" &&
            signupUserDetailsFactory.imgData1 != undefined && signupUserDetailsFactory.imgData2 != undefined) {
            $('.signup-identity').removeClass('signup-identity-alert');
        } else {
            $('.signup-identity').addClass('signup-identity-alert');
        }
        $rootScope.safetyApply(function(){});
    }

    var successCallback1 = function(responseDict){
        var response = {
            data : responseDict.imageData,
            photoCapture:responseDict.isPhotoCaptured
        };
        var image = angular.element("#photoImage1");
        if ( response.photoCapture == 'true'){
            $scope.isPhototaken1 = true;
            image.attr("src","data:image/jpeg;base64," + response.data);
            $('li p.photoShow').hide();
            signupUserDetailsFactory.imgData1 = response.data;
        }else{
            $scope.isPhototaken1 = false;

            image.attr("src","images/32-camera.png");
            $('li p.photoShow').show();
            signupUserDetailsFactory.imgData1 = "";
        }
        checkIdentity();
    };

    var error1 = function(error){
        if ( error === 'ERROR_CAMERA_DEVICE'){
            MessageBox('ERROR_CAMERA_DEVICE');
        }
        checkIdentity();
    };

    var successCallback2 = function(responseDict){
        var response = {
            data : responseDict.imageData,
            photoCapture:responseDict.isPhotoCaptured
        };
        var image = angular.element("#photoImage2");
        if ( response.photoCapture == 'true'){
            $scope.isPhototaken2 = true;
            image.attr("src","data:image/jpeg;base64," + response.data);
            $('li p.photoShow').hide();
            signupUserDetailsFactory.imgData2 = response.data;
        }else{
            $scope.isPhototaken2 = false;
            image.attr("src","images/32-camera.png");
            $('li p.photoShow').show();
            signupUserDetailsFactory.imgData2 = "";

        }
        checkIdentity();
    };

    var error2 = function(error){
        if ( error === 'ERROR_CAMERA_DEVICE'){
            MessageBox('ERROR_CAMERA_DEVICE');
        }
        checkIdentity();
    };

    var saveUserDetails = function (){
        signupUserDetailsFactory.setUserName($scope.signup.userName);
        signupUserDetailsFactory.setMobileNumber(formatLocal("vn","" + $scope.signup.mobileNumber).replace(/ /g,""));
        signupUserDetailsFactory.setPassword($scope.signup.password);
        signupUserDetailsFactory.setAddress($scope.signup.address);
        signupUserDetailsFactory.city = $scope.signup.city;
        signupUserDetailsFactory.setEmail($scope.signup.email);
        signupUserDetailsFactory.setIdentifierScan1($scope.identifierScan1);
        signupUserDetailsFactory.setIdentifierScan2($scope.identifierScan2);
        signupUserDetailsFactory.setConfirmPassword($scope.signup.confirmPassword);
        signupUserDetailsFactory.setIdentityNumber($scope.signup.identityNumber);

        if ($scope.signup.promotionCode != "" || $scope.signup.promotionCode != undefined) {
            signupUserDetailsFactory.setPromotionCode($scope.signup.promotionCode);
        }

        if ($scope.isAndroid) {
            signupUserDetailsFactory.setIssueDate($scope.signup.issuePickedDate);
            signupUserDetailsFactory.setFormatedIssueDate($scope.signup.issueFormatedDate);

            signupUserDetailsFactory.setDOB($scope.signup.dobPickedDate);
            signupUserDetailsFactory.setFormatedDOB($scope.signup.dobFormatedDate);
        }
        else if (isiOsDevice) {
            signupUserDetailsFactory.setFormatedIssueDate($scope.signup.issueFormatedDate);
            signupUserDetailsFactory.setIssueDate($scope.signup.issueFormatedDate);

            signupUserDetailsFactory.setFormatedDOB($scope.signup.dobFormatedDate);
            signupUserDetailsFactory.setDOB($scope.signup.dobFormatedDate);
        }
        else {
            signupUserDetailsFactory.setFormatedIssueDate($scope.signup.issueFormatedDate);
            signupUserDetailsFactory.setIssueDate($scope.signup.issueFormatedDate);

            signupUserDetailsFactory.setFormatedDOB($scope.signup.dobFormatedDate);
            signupUserDetailsFactory.setDOB($scope.signup.dobFormatedDate);
        }
    }

    $('input#email').focus(function() {

    }).blur(function() {
        $('#scrollArea').scrollTop($("#scrollArea")[0].scrollHeight);
    });

}]);