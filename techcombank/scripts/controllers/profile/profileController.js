'use strict';
tcbmwApp.controller('ProfileController',['$scope','$state','ProfileFactory','dialogService','$rootScope',function ($scope,$state,ProfileFactory,dialogService,$rootScope) {
    if ( $state.current.name == 'profile'){
                var baseStatus = {
                    isBack:true,
                    onBack: function() {
                      $state.go('dashboard.home');

                      var newIndex = statuses.indexOf($scope.status) - 1;
                      if (newIndex > -1) {
                            $scope.status = statuses[newIndex];
                            $scope.status.move = 'ltr';
                            $scope.navigationBarStatus = $scope.status;
                      }
                    }
                };

                var statuses = [
                    angular.extend({title: 'NAVBAR_PROFILE'}, baseStatus)
                ];

                $scope.status = statuses[0];
    }
    
    //$scope.profile = ProfileFactory.getProfile();
    $scope.isiOsDevice = isiOsDevice;
    $scope.isAndroid = isAndroid;
    $scope.loading = true;
    mc.getCustomerProfile(getCustomerProfileBack);
    //var photoImage = $('#profile_face');
    if (localStorage.getItem(Sha256.hash("" +session.customer.id) + "profilePicture")) {
        
        $scope.photo = "data:image/jpeg;base64," + localStorage.getItem(Sha256.hash("" +session.customer.id) + "profilePicture");
        $scope.isPhototaken = true;
        
    } else {
        if (session.user.profile.photo && session.user.profile.photo!= "images/profile-placeholder.png") {
            $scope.photo = session.user.profile.photo;
        } else {
             $scope.photo = "images/profile_face.png";
        }
    }
    if (localStorage.getItem(Sha256.hash("" +session.customer.id) + "profileBackground")) {
        $scope.isBGtaken = true;
        $scope.background = "data:image/jpeg;base64," + localStorage.getItem(Sha256.hash("" +session.customer.id) + "profileBackground");
    } else {
        $scope.background = "images/profile_scenary.png";
    }

   $('input#male')[0].disabled = true;
   $('input#female')[0].disabled = true;

     /* Bank Transactions */
    
    $scope.changePassword=function(){
        var profile=$scope.profile;

        var profileData ={
             fullName:profile.fullName,
             sex:profile.sex,
             fibname:profile.fibname,
             mbbname:profile.mbbname,
             idnumber:profile.idnumber,
             issuedate:profile.issuedate,
             email: profile.email,
             addrl1:profile.addrl1,
             addrl2:profile.addrl2,
             addrl3:profile.addrl3,
             addrl4:profile.addrl4,
             custSector:profile.custSector,
             password:ProfileFactory.getPassword()
        };

        ProfileFactory.setProfile(profileData);

        $state.go('changepassword');
    }
    
    $scope.save=function(){
        var profile=$scope.profile;

         var profileData ={
             fullName:profile.fullName,
             sex:profile.sex,
             fibname:profile.fibname,
             mbbname:profile.mbbname,
             idnumber:profile.idnumber,
             issuedate:profile.issuedate,
             email: profile.email,
             addrl1:profile.addrl1,
             addrl2:profile.addrl2,
             addrl3:profile.addrl3,
             addrl4:profile.addrl4,
             custSector:profile.custSector,
             password:ProfileFactory.getPassword()
         };
         // Use Profile Data to do whatever is required

         ProfileFactory.clear();
         if ($scope.isKYC) {
             MessageBox(getMessage("PROFILE_KYC_SAVED"));
             $state.go('dashboard.home');
         } else {
             session.profile.fullName = profile.fullName;
             session.profile.address.gender = profile.sex;
             session.profile.address.email = profile.email;
             session.profile.address.street1 = profile.addrl1;
             session.profile.identity.identity = profile.idnumber;
             if (!isAndroid) {
                 session.profile.identity.dateIssued = new Date(profile.issuedate).getTime();
             }
             session.profile.identity.issuePlace = profile.issuePlace;
             mc.updateCustomerProfile(updateCustomerProfileBack,session.profile);
         }
         
         
    }
    function updateCustomerProfileBack(r) {
        if (r.Status.code == "0") {
            session.user.profile.name = $scope.profile.fullName;
            //alert('Profile Data saved!');
            dialogService.showModal("PROFILE_DATA_IS_SAVED");
            $state.go('dashboard.home');
        } else {
            ErrorBox(r.Status);
        }
    }
    function getCustomerProfileBack(r) {
        $scope.loading = false;
        if (r.Status.code == "0") {
            session.profile = r.profile;
            var profile = {};
            profile.fullName = session.profile.fullName;
            if (session.profile.address) {
                profile.sex = session.profile.address.gender;
                profile.email = session.profile.address.email;
                profile.addrl1 = session.profile.address.street1;
            } else {
                session.profile.address = {customerId:session.customer.id};
            }
            if (session.profile.identifications) {
                for(var idx in session.profile.identifications) {
                    if (session.profile.identifications[idx].type == 0) {
                        profile.mbbname = session.profile.identifications[idx].identification;
                    } else if (session.profile.identifications[idx].type == 100) {
                        profile.fibname = session.profile.identifications[idx].identification;
                        $scope.isKYC = true;
                    } 
                    
                }
                
            } else {
                session.profile.identifications = {};
            }
            if (session.profile.identity) {
                profile.idnumber = session.profile.identity.identity;
                if (isiOsDevice && !$scope.isKYC) {
                    profile.issuedate = (new Date(session.profile.identity.dateIssued)).format("yyyy-mm-dd");
                } else
                profile.issuedate = (new Date(session.profile.identity.dateIssued)).format("dd/mm/yyyy");
                profile.issuePlace = session.profile.identity.issuePlace;
            } else {
                session.profile.identity = {customerId:session.customer.id};
            }
            $scope.profile = profile;
            
        } else {
            
            ErrorBox(r.Status);
        }
        $rootScope.safetyApply(function(){});
    }
    $scope.focusDate = function($event) {
        if (!$scope.isKYC) {
            var d = new Date();
            if (session.profile !== undefined && session.profile.identity.dateIssued !== undefined) {
                d = new Date(session.profile.identity.dateIssued);
            }
            var options = {
              date: d,
              mode: 'date'
            };

            datePicker.show(options, function(date){
              var tmpDate = date;  
              try {
                  var parseDate = new Date(tmpDate);
                  if (parseDate != "Invalid Date") {
                      session.profile.identity.dateIssued = parseDate.getTime();
                      $scope.profile.issuedate = parseDate.format("dd/mm/yyyy");
                      $event.target.blur();
                      $rootScope.safetyApply(function(){});
                  }
              } catch (e) {
                  console.log(e.message);
              }
            });
            
        }
        $event.target.blur();
    }
    $scope.clickPhoto = function(){
        if ( $scope.isPhototaken){
            TCBNativeBridge.getPicture(successCallback,error,'removePhoto');
        }else{
            TCBNativeBridge.getPicture(successCallback,error,'Photo');
        }
    };
    var error = function(error){
        MessageBox(error);
    };
    var successCallback = function(responseDict){
        var response = {
            data : responseDict.imageData,
            photoCapture:responseDict.isPhotoCaptured
        };
        var image = angular.element('#profile_face');

        if ( response.photoCapture == 'true'){
            $scope.isPhototaken = true;
            session.user.profile.photo = "data:image/jpeg;base64," + response.data;
            image.css("background-image", "url(data:image/jpeg;base64," + response.data + ")");
            localStorage.setItem(Sha256.hash("" +session.customer.id) + "profilePicture", response.data);
        }else{
            $scope.isPhototaken = false;
            session.user.profile.photo = "images/profile-placeholder.png";
            image.css("background-image", "url(images/profile_face.png)");
            localStorage.removeItem(Sha256.hash("" +session.customer.id) + "profilePicture");
        }
    };
    $scope.clickBackground = function(){
        if ( $scope.isBGtaken){
            TCBNativeBridge.getPicture(successBGCallback,error,'removePhoto');
        }else{
            TCBNativeBridge.getPicture(successBGCallback,error,'Photo');
        }
    };
    var successBGCallback = function(responseDict){
        var response = {
            data : responseDict.imageData,
            photoCapture:responseDict.isPhotoCaptured
        };
        var image = angular.element('#profile_scenary');

        if ( response.photoCapture == 'true'){
            $scope.isBGtaken = true;
            session.user.profile.background = "data:image/jpeg;base64," + response.data;
            image.css("background-image", "url(data:image/jpeg;base64," + response.data + ")");
            localStorage.setItem(Sha256.hash("" +session.customer.id) +"profileBackground", response.data);
        }else{
            $scope.isBGtaken = false;
            session.user.profile.background = "images/fbcover.jpg";
            image.css("background-image", "url(images/profile_scenary.png)");
            localStorage.removeItem(Sha256.hash("" +session.customer.id) + "profileBackground");
        }
    };
}]);