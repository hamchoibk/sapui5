'use strict';
tcbmwApp.controller('signupConfirmController',['$location','$scope','signupUserDetailsFactory','signupTermsConditions', '$state','$rootScope',function ($location,$scope,signupUserDetailsFactory,signupTermsConditions,$state,$rootScope) {
    function captchaBack(r) {
        console.log(r);
        if (r.Status.code == 0) {
            $scope.loading = false;
            console.log($("#captchaImg"));
            $scope.captcharId = r.id;
            signupUserDetailsFactory.setCapchaId($scope.captcharId);
            $("#captchaImg").attr("src",smartphoneService.urlWithoutWS + r.url);
            $rootScope.safetyApply(function(){});
        }
    }
    $scope.loading = true;
    mc.createCaptcha(captchaBack);

    $scope.showClearCapcha = false;
    $('#scrollArea').scrollTop($("#scrollArea")[0].scrollHeight);

//    var hasArcIB = signupUserDetailsFactory.getArcIB();
    $scope.username = signupUserDetailsFactory.getUserName();
    $scope.mobileNumber = signupUserDetailsFactory.getMobileNumber();
    $scope.identityNumber = signupUserDetailsFactory.getIdentityNumber();
//    $scope.issueDate = signupUserDetailsFactory.getIssueDate();
//    $scope.dob = signupUserDetailsFactory.getDOB();
//    console.log(signupUserDetailsFactory.getIssueDate());
//    $scope.issueDateFormated = signupUserDetailsFactory.getFormatedIssueDate();
//    $scope.dobFormated = signupUserDetailsFactory.getFormatedDOB();
//    $scope.issuePickedDate = signupUserDetailsFactory.getIssuePickedDate();
//    $scope.dobPickedDate = signupUserDetailsFactory.getDOBPickedDate();
    $scope.address = signupUserDetailsFactory.getAddress() + " " +signupUserDetailsFactory.city;
    $scope.signupEmail = signupUserDetailsFactory.getEmail();
    $scope.capchaCode = signupUserDetailsFactory.getCapchaCode();

    $('input#capchaCode').focus(function() {
        if($scope.capchaCode != undefined && $scope.capchaCode.length>0) {
            $scope.showClearCapcha = true;
            $rootScope.safetyApply(function(){});
        }
    }).blur(function(){
        $scope.showClearCapcha = false;
    });

    if (isiOsDevice) {
        var dob = signupUserDetailsFactory.getFormatedDOB();
        $scope.dobFormated = new Date(dob).format("dd/mm/yyyy");
        var issueDate = signupUserDetailsFactory.getFormatedIssueDate();
        $scope.issueDateFormated = new Date(issueDate).format("dd/mm/yyyy");
    } else {
        $scope.dobFormated = signupUserDetailsFactory.getFormatedDOB();
        $scope.issueDateFormated = signupUserDetailsFactory.getFormatedIssueDate();
    }

    var imgData1=signupUserDetailsFactory.imgData1;
    if(imgData1=='' || imgData1 == undefined){
        var image1 = angular.element("#photoImage1");
        image1.attr("src","images/32-camera.png");
        $('li p.photoShow').show();

    }
    else{
        var image1 = angular.element("#photoImage1");
        image1.attr("src","data:image/jpeg;base64," + imgData1);
        $('li p.photoShow').hide();
    }

    var imgData2=signupUserDetailsFactory.imgData2;
    if(imgData2=='' || imgData2 == undefined){
        $scope.isImgData2 = false;
        var image2 = angular.element("#photoImage2");
        image2.attr("src","images/32-camera.png");
        $('li p.photoShow').show();
    }
    else{
        $scope.isImgData2 = true;
        var image2 = angular.element("#photoImage2");
        image2.attr("src","data:image/jpeg;base64," + imgData2);
        $('li p.photoShow').hide();
    }

//    $scope.termsConditionsAgreedFlag = signupTermsConditions.getTermsFlag();
    $scope.termsConditionsAgreedFlag = "checked";

    var baseStatus = {
        isBack: true,
        onBack: function() {

            signupUserDetailsFactory.setPassword("");
            signupUserDetailsFactory.setConfirmPassword("");
            signupUserDetailsFactory.setCapchaCode("");
            $scope.capchaCode = "";
            $state.go("signup");
            var newIndex = statuses.indexOf($scope.status) - 1;
            if (newIndex > -1) {
                $scope.status = statuses[newIndex];
                $scope.status.move = 'ltr';
                $scope.navigationBarStatus = $scope.status;
            }
        },
        isClose:true,
        onAction: function() {
            $state.go('main');

            var newIndex = statuses.indexOf($scope.status) - 1;
            if (newIndex > -1) {
                $scope.status = statuses[newIndex];
                $scope.status.move = 'ltr';
                $scope.navigationBarStatus = $scope.status;
            }
        }
    };
    var status = 'NAVBAR_SIGNUP_CAPCHA';
    var statuses = [
        angular.extend({title: status}, baseStatus)
    ];
//    $scope.hasArcIB = hasArcIB;

    $scope.status = statuses[0];
    function precheckBack(r) {
        $scope.loading = false;
        $rootScope.safetyApply(function(){});
        if (r.Status.code == "0") {
            //save unstructuredData
            signupUserDetailsFactory.setCapchaCode("");
            $location.path('/signupsmsvalidation');
            $rootScope.safetyApply(function(){});
        } else {
            ErrorBox(r.Status);
        }

    }
    $scope.changeTNCFlag = function() {
        $scope.termsConditionsAgreedFlag = $("#tnccheck").is(":checked");
    };
    $scope.termsConditionsButtonClicked = function(){
        signupUserDetailsFactory.setCapchaCode($scope.capchaCode); //to cache capcha in capchascreen
        $location.path('/signuptermsconditions');
    };

    $scope.refreshButtonClicked = function(){
        //Regenerate capcha
        $scope.loading = true;
        mc.createCaptcha(captchaBack);
    };

    $scope.clickNext = function(){
        signupUserDetailsFactory.setCapchaCode($scope.capchaCode);
        $scope.loading = true;
        mc.precheckCreateCustomerAndSendSMSToken(precheckBack,signupUserDetailsFactory);
    };
    $scope.clearCapcha = function() {
        $scope.capchaCode = '';
        $scope.showClearCapcha = false;
        $('#capchaCode').focus();
    }
    $scope.didChangeCapcheCode = function() {
        if($scope.capchaCode !=undefined && $scope.capchaCode.length > 0) {
            $scope.showClearCapcha = true;
        } else  {
            $scope.showClearCapcha = false;
        }
    };

}]);

