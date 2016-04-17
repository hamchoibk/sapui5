'use strict';
tcbmwApp.directive('maxlengthCheck',['dialogService',function(dialogService){
    return {
        require:'ngModel',
        link: function(scope,elem,attrs,ctrl){
            var params = attrs.maxlengthCheck.split(" ");
            var errorCode = params[0];
            var maxLength = params[1];
            elem.on('blur', function(){
                scope.$apply(function(){
                    var value = elem.val();
                    var length = elem.val().length;
                    if (value == "") {
                        ctrl.$setValidity('match', false);
                        dialogService.showModal("SIGNUPMAIN_MAIN_NAME_VALIDATION");
                    } else if(length>parseInt(maxLength)){
                        elem.val(value.slice(0,maxLength));
                        ctrl.$setValidity('match', false);
                        dialogService.showModal(errorCode);
                    }else{
                         ctrl.$setValidity('match', true);
                    }
                });
            });
        }
    }
}]);