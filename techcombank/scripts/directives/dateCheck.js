'use strict';
tcbmwApp.directive('dateCheck',['dialogService',function(dialogService){
    return{
        require: 'ngModel',
        link:function(scope,elem,attrs,ctrl){
            var errorCode = attrs.dateCheck;
            console.log(errorCode);
            elem.on('blur',function(){
                scope.$apply(function () {
                    var value = elem.val();
                    var date = new Date (value);
                    var today = new Date();
                    if(value == "" || today < date){
                        ctrl.$setValidity('datematch', false);
                        dialogService.showModal(errorCode);
                    }else{
                        ctrl.$setValidity('datematch', true);
                    }

                });

            });
        }
    }
}] );