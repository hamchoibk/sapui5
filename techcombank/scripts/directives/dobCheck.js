'use strict';
tcbmwApp.directive('dobCheck',['dialogService',function(dialogService){
    return{
        require: 'ngModel',
        link:function(scope,elem,attrs,ctrl){
            var errorCode = attrs.dobCheck;
            console.log(errorCode);
            elem.on('blur',function(){
                scope.$apply(function () {
                    var value = elem.val();
                    var dob = new Date (value);
                    var today = new Date();
                    var age = parseInt((today-dob)/365/24/60/60/1000);
                    if(age < 18){
                        ctrl.$setValidity('dobmatch', false);
                        dialogService.showModal(errorCode);
                    }else{
                        ctrl.$setValidity('dobmatch', true);
                    }

                });

            });
        }
    }
}] );