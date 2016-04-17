'use strict';

tcbmwApp.controller('UserDetailsScreenController',['$scope','signupUserDetailsFactory','$location', 'signupTermsConditions','$rootScope',function ($scope,signupUserDetailsFactory,$location,signupTermsConditions,$rootScope) {
    $scope.signup = {
        mobileNumber : signupUserDetailsFactory.getMobileNumber(),
        userName : signupUserDetailsFactory.getUserName(),
        password:signupUserDetailsFactory.getPassword(),
        confirmPassword : signupUserDetailsFactory.getConfirmPassword(),
        identityNumber:signupUserDetailsFactory.getIdentityNumber(),
        pickedDate:signupUserDetailsFactory.getIssuePickedDate(),
        issueDate: signupUserDetailsFactory.getIssueDate()? new Date(signupUserDetailsFactory.getIssueDate()).format("dd/mm/yyyy"):signupUserDetailsFactory.getIssueDate(),
        hasArcIB:signupUserDetailsFactory.getArcIB(),
        issueFormatedDate:signupUserDetailsFactory.getFormatedIssueDate()
    };
    if ($scope.signup.hasArcIB) {
        console.log($scope.signup.issueDate);
        $scope.signup.issueFormatedDate = $scope.signup.issueDate;
        if (signupUserDetailsFactory.editMode==false) {
            $scope.disableMobileEdit = true;
        } else
            $scope.disableMobileEdit = false;
    } else {
        $scope.disableMobileEdit = false;
    }
    $scope.isMobile = isAndroid || isiOsDevice;
    $scope.isAndroid = isAndroid;
    $scope.isiOsDevice = isiOsDevice;

    var baseStatus = {
        isBack: true,

        onBack: function() {
            signupUserDetailsFactory.clear();
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
    if ($scope.signup.hasArcIB)
        status = 'NAVBAR_ACTIVATE_USERDETAILS';
    var statuses = [
        angular.extend({title: status}, baseStatus)
    ];

    $scope.status = statuses[0];

    $scope.termsConditionsAgreedFlag = "checked";
//    $scope.termsConditionsAgreedFlag = signupTermsConditions.getTermsFlag();

    $scope.clickNext = function(){
        saveUserDetails();
        if ($scope.signup.hasArcIB)
        {
//            $location.path('/signupcapcha');
            $scope.loading = true;
            mc.precheckCreateCustomerAndSendSMSToken(precheckBack,signupUserDetailsFactory);
        } else {
            $scope.loading = true;
            $rootScope.safetyApply(function(){});
            mc.checkCredentialStrength(checkCredentialStrengthBack,$scope.signup.password);
        }
        
    };
    function checkCredentialStrengthBack(r) {
        $scope.loading = false;
        
        if (r.Status.code == "0") {
            $location.path('/signupcapcha');
        } else {
            ErrorBox(r.Status);
        }
        $rootScope.safetyApply(function(){});
    }
    $scope.focusDate = function($event) {
        if (!$scope.signup.hasArcIB) {
            if (isAndroid) {
                var d = new Date();
                if ($scope.signup.pickedDate !== undefined)
                    d = new Date($scope.signup.pickedDate);
                var options = {
                  date: d,
                  mode: 'date'
                };

                datePicker.show(options, function(date){
                  var tmpDate = date;  
                  try {
                      var parseDate = new Date(tmpDate);
                      if (parseDate != "Invalid Date") {
                          $scope.signup.pickedDate = date;
                          signupUserDetailsFactory.setPickedDate(date);
                          $scope.signup.issueFormatedDate = parseDate.format("dd/mm/yyyy");
                          $event.target.blur();
                          $rootScope.safetyApply(function(){});
                      }
                  } catch (e) {
                      console.log(e.message);
                  }
                });
                $event.target.blur();
            }
            
        }
    }

    $scope.changeTNCFlag = function() {
        $scope.termsConditionsAgreedFlag = $("#tnccheck").is(":checked");
    };

    $scope.termsConditionsButtonClicked = function(){
        $location.path('/signuptermsconditions');
    };

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

    var saveUserDetails = function (){
        console.log($scope.signup.mobileNumber);
        signupUserDetailsFactory.setUserName($scope.signup.userName);
        signupUserDetailsFactory.setMobileNumber(formatLocal("vn","" + $scope.signup.mobileNumber).replace(/ /g,""));
        signupUserDetailsFactory.setPassword($scope.signup.password);
        signupUserDetailsFactory.setConfirmPassword($scope.signup.confirmPassword);
        signupUserDetailsFactory.setIdentityNumber($scope.signup.identityNumber);
        if ($scope.isAndroid && !$scope.signup.hasArcIB) {
            signupUserDetailsFactory.setIssueDate($scope.signup.pickedDate);
            signupUserDetailsFactory.setFormatedIssueDate($scope.signup.issueFormatedDate);
        }
        else
        if (isiOsDevice && !$scope.signup.hasArcIB) {
            signupUserDetailsFactory.setFormatedIssueDate($scope.signup.issueFormatedDate);
            signupUserDetailsFactory.setIssueDate($scope.signup.issueFormatedDate);
        }
        else if (!$scope.signup.hasArcIB) {
            signupUserDetailsFactory.setFormatedIssueDate($scope.signup.issueFormatedDate);
            signupUserDetailsFactory.setIssueDate($scope.signup.issueFormatedDate);
        }
    }
    

}]);