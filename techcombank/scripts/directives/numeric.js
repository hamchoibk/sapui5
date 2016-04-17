'use strict';
tcbmwApp.directive('numericCheck',['dialogService',function(dialogService){
    return{
        require: 'ngModel',
        link:function(scope,elem,attrs,ctrl){
            var errorCode = attrs.numericCheck;
           // console.log(errorCode);
            elem.on('blur',function(){
               scope.$apply(function () {
                    var value = elem.val();
                    if(value.length == 0){
//                        if (attrs.required)
//                                dialogService.showModal(errorCode);

                    }else{
                        var pattern = /[^0-9]/g;
                        // console.log(pattern.test(value));
                        if(pattern.test(value)!==false){
                            dialogService.showModal(errorCode);
                        }else{
                            ctrl.$setValidity('numericmatch', true);
                        }
                    }

                });

            });
        }
    }
}] );