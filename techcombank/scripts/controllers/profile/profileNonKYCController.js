'use strict';
tcbmwApp.controller('ProfileNonKYCController',['$scope', '$rootScope','$state','ProfileFactory','dialogService',function ($scope,$rootScope,$state,ProfileFactory,dialogService) {
    if ( $state.current.name == 'profilenonkyc'){
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
    if ($rootScope.previousState.name == "changepassword") {
        $scope.loading = false;
        $scope.provinceLists = session.provinceLists;
        $scope.profile = ProfileFactory.getProfile();
        if (ProfileFactory.imgData1 != undefined) {
            if (ProfileFactory.imgData1.indexOf("http") == 0) {
                angular.element("#photoImage1").attr("src",ProfileFactory.imgData1);
                console.log("ProfileFactory.imgData1.indexOf 1 ===", ProfileFactory.imgData1.indexOf("http"));
            } else {
                angular.element("#photoImage1").attr("src","data:image/jpeg;base64," + ProfileFactory.imgData1);
                console.log("ProfileFactory.imgData1.indexOf 2 ===", ProfileFactory.imgData1.indexOf("http"));
            }

        }
        if (ProfileFactory.imgData2 != undefined) {
            if (ProfileFactory.imgData2.indexOf("http") == 0) {
                console.log("ProfileFactory.imgData1.indexOf 1 ===", ProfileFactory.imgData2.indexOf("http"));
                angular.element("#photoImage2").attr("src",ProfileFactory.imgData2);
            } else {
                console.log("ProfileFactory.imgData1.indexOf 2 ===", ProfileFactory.imgData2.indexOf("http"));
                angular.element("#photoImage2").attr("src","data:image/jpeg;base64," + ProfileFactory.imgData2);
            }
        }
        console.log("ProfileFactory.profile = ", ProfileFactory.getProfile());
    } else {
        $scope.loading = true;
        mc.getCustomerProfile(getCustomerProfileBack);
        mc.getAllProvinces(getAllProvincesBack);
    }

    $scope.isiOsDevice = isiOsDevice;
    $scope.isAndroid = isAndroid;

    $scope.isPhototaken1 = false;
    $scope.isPhototaken2 = false;
    $scope.isInputIdentifierScan = false;


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

    $scope.changePassword=function(){
        var profile=$scope.profile;

        var profileData ={
            fullname:profile.fullname,
            sex:profile.sex,
            mbbname:profile.mbbname,
            idnumber:profile.idnumber,
            issuedate:profile.issuedate,
            email: profile.email,
            city: profile.city,
            addrl1:profile.addrl1,
            imgData1: ProfileFactory.imgData1,
            imgData2: ProfileFactory.imgData2
        };

        ProfileFactory.setProfile(profileData);

        $state.go('changepassword');
    }

    $scope.save=function(){
        var profile=$scope.profile;

        var profileData ={
            fullname:profile.fullname,
            sex:profile.sex,
            fibname:profile.fibname,
            mbbname:profile.mbbname,
            idnumber:profile.idnumber,
            issuedate:profile.issuedate,
            dob: profile.dob,
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
            MessageBox(getMessage("PROFILE_DATA_IS_SAVED"));
            $state.go('dashboard.home');
        } else {
            session.profile.fullName = profile.fullname;
            session.profile.address.gender = profile.sex;
            session.profile.address.email = profile.email;
            session.profile.address.street1 = profile.addrl1;
            session.profile.address.city = profile.city;
            session.profile.identity.identity = profile.idnumber;
            if (!isAndroid) {
                if (profile.issuedate != null) {
                    session.profile.identity.dateIssued = (new Date(profile.issuedate)).format("yyyy-mm-dd");
                }
                if (profile.dob != null) {
                    session.profile.dateOfBirth = (new Date(profile.dob)).format("yyyy-mm-dd");
                }
            }
            session.profile.identity.issuePlace = profile.issuePlace;
            if(session.profile.attachments.length==0) {
                session.profile.attachments = null;
            } else {
                if (ProfileFactory.imgData1 != undefined && ProfileFactory.imgData1 != "" && ProfileFactory.imgData1.indexOf("http") == -1) {
                    session.profile.attachments[0].content = ProfileFactory.imgData1;
                }
                if (session.profile.attachments[1] != undefined) {
                    if (ProfileFactory.imgData2 != undefined && ProfileFactory.imgData2 != "" && ProfileFactory.imgData2.indexOf("http") == -1 ) {
                        session.profile.attachments[1].content = ProfileFactory.imgData2;
                    }
                }
            }

            console.log("session.profile updated = ", session.profile);
            $scope.loading = true;
            mc.updateCustomerProfile(updateCustomerProfileBack,session.profile);
        }


    }
    function updateCustomerProfileBack(r) {
        $scope.loading = false;
        if (r.Status.code == "0") {
            session.user.profile.name = $scope.profile.fullname;
            //alert('Profile Data saved!');
            dialogService.showModal("PROFILE_DATA_IS_SAVED");
            $state.go('dashboard.home');
        } else {
            ErrorBox(r.Status);
        }
    }

    function getAllProvincesBack(r) {
        console.log('getProvincesBack',r);
        if(r.Status.code == 0) {
            $scope.provinceLists = r.provinces;
            session.provinceLists = r.provinces;
            $rootScope.safetyApply(function(){});
        } else {
            ErrorBox(r.Status)
        }
    }

    function getCustomerProfileBack(r) {
        console.log("getCustomerProfileBack =", r);

        if (r.Status.code == "0") {
            session.profile = r.profile;
            var profile = {};
            profile.fullname = session.profile.fullName;

            if (session.profile.attachments != null && session.profile.attachments[0]) {
//                ProfileFactory.imgData1 = session.profile.attachments[0].content;
                var imgData1= setting.protocol+setting.ipaddress +":"+ setting.port+ session.profile.attachments[0].url;
                ProfileFactory.imgData1 = imgData1;
                if(imgData1=='' || imgData1 == undefined || imgData1==null){
                    console.log("imgData1 false");
                    $scope.isInputIdentifierScan = false;
                    $scope.isPhototaken1 = false;
                    var image1 = angular.element("#photoImage1");
                    image1.attr("src","images/32-camera.png");
                    $('li p.photoShow').show();

                }
                else{
                    console.log("imgData1 true");
                    $scope.isInputIdentifierScan = true;
                    $scope.isPhototaken1 = true;
                    var image1 = angular.element("#photoImage1");
//                    image1.attr("src","images/loading.gif");
//                    $('img').on('load', function() {
                    // do whatever you want
//                        console.log("on load");
                    image1.attr("src", imgData1);
//                    });
                    $('li p.photoShow').hide();

                }
            }
            if (session.profile.attachments != null && session.profile.attachments[1]) {
//                ProfileFactory.imgData2 = session.profile.attachments[1].content;
                $scope.showImgData2 = true;
                var imgData2= setting.protocol+setting.ipaddress +":"+ setting.port + session.profile.attachments[1].url ;
                ProfileFactory.imgData2 = imgData2;
                if(imgData2=='' || imgData2 == undefined || imgData2==null){
                    console.log("imgData2 true");
                    $scope.isPhototaken2 = false;
                    var image2 = angular.element("#photoImage2");
                    image2.attr("src","images/32-camera.png");
                    $('li p.photoShow').show();
                }
                else{
                    console.log("imgData2 false");
                    $scope.isPhototaken2 = true;
                    var image2 = angular.element("#photoImage2");
//                    image2.attr("src","images/loading.gif");
//                    $('img').on('load', function() {
//                        do whatever you want
//                        console.log("on load");
                    image2.attr("src", imgData2);
//                    });
                    $('li p.photoShow').hide();
                }
            } else {
                $scope.showImgData2 = false;
//                var image2 = angular.element("#photoImage2");
//                image2.attr("src","images/32-camera.png");
//                $('li p.photoShow').show();
            }

            if (session.profile.address) {
                profile.sex = session.profile.address.gender;
                profile.email = session.profile.address.email;
                profile.addrl1 = session.profile.address.street1;
                profile.city = session.profile.address.city;

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
                    profile.issuedate = (new Date(session.profile.identity.dateIssued)).format("mm/dd/yyyy");
                profile.issuePlace = session.profile.identity.issuePlace;
            } else {
                session.profile.identity = {customerId:session.customer.id};
            }

            if (session.profile.dateOfBirth) {
                if (isiOsDevice && !$scope.isKYC) {
                    profile.dob = (new Date(session.profile.dateOfBirth)).format("yyyy-mm-dd");
                } else {
                    profile.dob = (new Date(session.profile.dateOfBirth)).format("mm/dd/yyyy");
                }
            }

            $scope.profile = profile;
            console.log("$scope.profile = ", $scope.profile);
            $scope.loading = false;
            $rootScope.safetyApply(function(){});


        } else {
            ErrorBox(r.Status);
        }
    }

    $scope.focusDOB = function($event) {
        if (!$scope.isKYC) {
            var d = new Date();
            if (session.profile.dateOfBirth)
                d = new Date(session.profile.dateOfBirth);
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
                        var age = (today - parseDate)/365/24/60/60/1000;
                        if (parseInt(age) < 18 || parseInt(age) < 0) {
                            $scope.signupform.DOB.$setValidity('dobmatch', false);
                            console.log("$scope.signupform.DOB = ", $scope.signupform.DOB);
                            MessageBox("", "SIGNUP_MAIN_DOB_VALIDATION");
                        } else {
                            $scope.signupform.DOB.$setValidity('dobmatch', true);
                        }
                        session.profile.dateOfBirth = parseDate.getTime();
                        $scope.profile.dob = parseDate.format("dd/mm/yyyy");
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

    $scope.focusIssueDate = function($event) {
        if (!$scope.isKYC) {
            var d = new Date();
            if (session.profile.identity.dateIssued)
                d = new Date(session.profile.identity.dateIssued);
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

    var successCallback1 = function(responseDict){
        var response = {
            data : responseDict.imageData,
            photoCapture:responseDict.isPhotoCaptured
        };
        var image = angular.element("#photoImage1");
        if ( response.photoCapture == 'true'){
            $scope.isPhototaken1 = true;
            image.attr("src","data:image/jpeg;base64," + response.data);
            ProfileFactory.imgData1 = response.data;
            $('li p.photoShow').hide();

        }else{
            $scope.isPhototaken1 = false;

            image.attr("src","images/32-camera.png");
            ProfileFactory.imgData1 = "";
            $('li p.photoShow').show();
        }
    };

    var error1 = function(error){
        if ( error === 'ERROR_CAMERA_DEVICE'){
            MessageBox('ERROR_CAMERA_DEVICE');
        }
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
            ProfileFactory.imgData2 = response.data;
            $('li p.photoShow').hide();
        }else{
            $scope.isPhototaken2 = false;
            image.attr("src","images/32-camera.png");
            ProfileFactory.imgData2 = "";
            $('li p.photoShow').show();

        }
    };

    var error2 = function(error){
        if ( error === 'ERROR_CAMERA_DEVICE'){
            MessageBox('ERROR_CAMERA_DEVICE');
        }
    };

}]);
