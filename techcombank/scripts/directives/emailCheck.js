'use strict';
tcbmwApp.directive('emailCheck',['dialogService',function(dialogService){
    return{
        require: 'ngModel',
        link:function(scope,elem,attrs,ctrl){
            var errorCode = attrs.emailCheck;
            console.log(errorCode);
            elem.on('blur',function(){
                scope.$apply(function () {
                    var value = elem.val();
                    var pattern = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
                    if (value == "" || value == undefined) {
                        ctrl.$setValidity('emailmatch', false);
                        dialogService.showModal('SIGNUP_ENTER_EMAIL');
                    } else if(pattern.test(value)===false){
                        ctrl.$setValidity('emailmatch', false);
                        dialogService.showModal(errorCode);
                    }else{
                        ctrl.$setValidity('emailmatch', true);
                    }

                });

            });
        }
    }
}] );