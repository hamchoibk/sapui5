'use strict';

tcbmwApp.controller('CapchaScreenController',['$location','$scope','signupUserDetailsFactory','signupTermsConditions','$rootScope',function ($location,$scope,signupUserDetailsFactory,signupTermsConditions,$rootScope) {
//    function captchaBack(r) {
//        console.log(r);
//        if (r.Status.code == 0) {
//            $scope.loading = false;
//            console.log($("#captchaImg"));
//            $scope.captcharId = r.id;
//            signupUserDetailsFactory.setCapchaId($scope.captcharId);
//            $("#captchaImg").attr("src",smartphoneService.urlWithoutWS + r.url);
//            $rootScope.safetyApply(function(){});
//        }
//    }
//    $scope.loading = true;
//    mc.createCaptcha(captchaBack);
    var hasArcIB = signupUserDetailsFactory.getArcIB();
    $scope.username = signupUserDetailsFactory.getUserName();
    $scope.mobileNumber = signupUserDetailsFactory.getMobileNumber();
    $scope.identityNumber = signupUserDetailsFactory.getIdentityNumber();
    $scope.issueDate = signupUserDetailsFactory.getIssueDate();
    console.log(signupUserDetailsFactory.getIssueDate());
    $scope.issueDateFormated = (new Date(signupUserDetailsFactory.getIssueDate())).format("dd/mm/yyyy");
    $scope.capchaCode = signupUserDetailsFactory.getCapchaCode();

    $scope.termsConditionsAgreedFlag = signupTermsConditions.getTermsFlag();

    var baseStatus = {
        isBack: true,
        onBack: function() {
            $location.path('/signupuserdetails');
            var newIndex = statuses.indexOf($scope.status) - 1;
            if (newIndex > -1) {
                $scope.status = statuses[newIndex];
                $scope.status.move = 'ltr';
                $scope.navigationBarStatus = $scope.status;
            }
        }
    };
    var status = 'NAVBAR_SIGNUP_CAPCHA';
    if (hasArcIB)
        status = 'NAVBAR_ACTIVATE_CAPCHA';
    var statuses = [
        angular.extend({title: status}, baseStatus)
    ];
    $scope.hasArcIB = hasArcIB;

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

    }]);