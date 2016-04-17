'use strict';
tcbmwApp.directive('instantAccountCheck',['dialogService',function(dialogService){
    return{
        require: 'ngModel',
        link:function(scope,elem,attrs,ctrl){
            var errorCode = attrs.instantAccountCheck;
            console.log(errorCode);
            elem.on('blur',function(){
                scope.$apply(function () {
                    var value = elem.val();
                    var pattern = /[^0-9a-zA-Z]/g;
                    if(value=="" || value == undefined){
                        ctrl.$setValidity('instantaccountmatch', false);
                        dialogService.showModal("INSTANT_TRANSFER_ACCOUNT_BLANK_VALIDATION");
                    } else if (pattern.test(value)===true) {
                        ctrl.$setValidity('instantaccountmatch', false);
                        dialogService.showModal(errorCode);
                    } else{
                        ctrl.$setValidity('instantaccountmatch', true);
                    }
                });

            });
        }
    }
}] );