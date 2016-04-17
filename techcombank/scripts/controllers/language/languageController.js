'use strict';

tcbmwApp.controller('TranslateController', ['$translate','$scope','$rootScope','CordovaService','dialogService',function($translate,$scope,$rootScope,CordovaService,dialogService) {
    CordovaService.ready.then(function() {
        if($rootScope.cordovaReady == false){
                 //setLanguageCode();
                 $rootScope.cordovaReady = true;
                 //checkConnection();
                 console.log("CordovaReady languagecode set");
          //     navigator.splashscreen.hide()
        };
    });
    
    
    var setLanguageCode = function(){
       if( $rootScope.languageCode == null || $rootScope.languageCode == undefined){
              var languageCode = localStorage.getItem("languageCode");
               console.log("languageCode is "+languageCode);
              if (languageCode) {
                  $rootScope.languageCode = (languageCode == "false")?false:true;
              }
              else
                  //set default language to vietnamese
                  $rootScope.languageCode = false;
              if ($rootScope.languageCode == true) {
                  $translate.use("en");
              } else {
                  $translate.use("vn");
              }
        } else {
          if ($rootScope.languageCode == true) {
              $translate.use("en");
          } else {
              $translate.use("vn");
          }
        }
       $scope.firstTimeOn = ($rootScope.languageCode)?true:false;
        $scope.languageCode = $rootScope.languageCode;
        
       console.log("languageCode is "+$rootScope.languageCode);
       setTimeout(function() { $rootScope.safetyApply(function(){});},0);
    };
    setLanguageCode();
    $scope.changeLanguage = function () {
        $rootScope.languageCode = !$rootScope.languageCode;
        localStorage.setItem("languageCode",$rootScope.languageCode);
        //console.log($rootScope.languageCode);
        if($rootScope.languageCode==false){
            $translate.use('vn');
        }else{
            $translate.use('en');
        }
    };

    $scope.onoffswitch=function() {
        
        //console.log("onoffswitch checked: "+$('#myonoffswitch')[0].checked)
        console.log($rootScope.languageCode);
        $rootScope.languageCode = !$rootScope.languageCode;
        localStorage.setItem("languageCode",$rootScope.languageCode);
        if($rootScope.languageCode==false){
            $('#myonoffswitch').prop('checked', false);
            $('#myonoffswitch').attr("checked", false);
            $('.onoffswitch-inner').removeClass("onoffswitch-inner-on");
            $('.onoffswitch-switch').removeClass("onoffswitch-switch-on");
            $translate.use('vn');
        }else{
            $('#myonoffswitch').prop('checked', true);

            $('#myonoffswitch').attr("checked", true);
            $('.onoffswitch-inner').addClass("onoffswitch-inner-on");
            $('.onoffswitch-switch').addClass("onoffswitch-switch-on");
            $translate.use('en');
        }
        $scope.languageCode = $rootScope.languageCode;
        setTimeout(function() { $rootScope.safetyApply(function(){});},0);
    }
}]);