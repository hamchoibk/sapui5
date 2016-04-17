'use strict';
tcbmwApp.directive('addressCheck',['dialogService',function(dialogService){
    return{
        require: 'ngModel',
        link:function(scope,elem,attrs,ctrl){
            var errorCode = attrs.addressCheck;
            console.log(errorCode);
            elem.on('blur',function(){
                scope.$apply(function () {
                    var value = elem.val();
                    var pattern = /[^a-zA-Z0-9_,-\.\s\ ]/g;
                    if (value == "") {
                        ctrl.$setValidity('addressmatch', false);
                        dialogService.showModal("SIGNUP_MAIN_ADDRESS_VALIDATION");
                    }
                    if(value != undefined && pattern.test(value)===true){
                        ctrl.$setValidity('addressmatch', false);
                        dialogService.showModal(errorCode);
                    }else{
                        ctrl.$setValidity('addressmatch', true);
                    }

                });

            });
        }
    }
}] );