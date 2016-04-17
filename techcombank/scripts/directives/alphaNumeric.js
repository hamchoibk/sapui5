'use strict';
tcbmwApp.directive('alphanumericCheck',['dialogService',function(dialogService){
    return{
        require: 'ngModel',
        link:function(scope,elem,attrs,ctrl){
            var errorCode = attrs.alphanumericCheck;
            console.log(errorCode);
            elem.on('blur',function(){
               scope.$apply(function () {
                    var value = elem.val();
                    var pattern = /[^0-9]/g;
                    if(value=="" || value == undefined || pattern.test(value)===true){
                        ctrl.$setValidity('alphanumericmatch', false);
                        dialogService.showModal(errorCode);
                    } else if (value.length != 0 && (value.length < 7 ||value.length > 15)) {
                        ctrl.$setValidity('alphanumericmatch', false);
                        dialogService.showModal(errorCode);
                    } else{
                        ctrl.$setValidity('alphanumericmatch', true);
                    }
                });

            });
        }
    }
}] );