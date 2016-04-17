'use strict';
tcbmwApp.directive('cityCheck',['dialogService',function(dialogService){
    return{
        require: 'ngModel',
        link:function(scope,elem,attrs,ctrl){
            var errorCode = attrs.cityCheck;
            console.log(errorCode);
            elem.on('blur',function(){
                scope.$apply(function () {
                    var value = elem.val();
                    if(value == ""){
                        ctrl.$setValidity('citymatch', false);
                        dialogService.showModal(errorCode);
                    }else{
                        ctrl.$setValidity('citymatch', true);
                    }

                });

            });
        }
    }
}] );