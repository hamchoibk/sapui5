'use strict';
tcbmwApp.directive('alphabetCheck',['dialogService',function(dialogService){
    return{
        require: 'ngModel',
        link:function(scope,elem,attrs,ctrl){
            var errorCode = attrs.alphabetCheck;
            console.log(errorCode);
            elem.on('blur',function(){
               scope.$apply(function () {
                    var value = elem.val();
                    var pattern = /[^a-zA-Z\s\ ]/g;
                   if (value.split(" ").join("").length < 3 ) {
                       ctrl.$setValidity('alphabetmatch', false);
                       dialogService.showModal("ERROR_CODE_30066");
                   } else if(value != undefined && pattern.test(value)===true){
                        ctrl.$setValidity('alphabetmatch', false);
                        dialogService.showModal(errorCode);
                    }else{
                        ctrl.$setValidity('alphabetmatch', true);
                    }

                });

            });
        }
    }
}] );