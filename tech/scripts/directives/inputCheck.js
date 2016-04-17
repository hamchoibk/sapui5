'use strict';
tcbmwApp.directive('inputCheck',['dialogService',function(dialogService){
    return {
        require:'ngModel',
        link: function(scope,elem,attrs,ctrl){
            var errorCode = attrs.inputCheck;
            elem.on('blur', function(){
                scope.$apply(function(){
                    var value = elem.val();
                    if(value == "" || value == undefined){
                        ctrl.$setValidity('inputmatch', false);
                        dialogService.showModal(errorCode);
                    }else{
                        ctrl.$setValidity('inputmatch', true);
                    }
                });
            });
        }
    }
}]);