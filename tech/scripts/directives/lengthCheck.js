'use strict';
tcbmwApp.directive('lengthCheck',['dialogService',function(dialogService){
    return {
        require:'ngModel',
        link: function(scope,elem,attrs,ctrl){
            var errorCode = attrs.lengthCheck;
            elem.on('blur', function(){
                scope.$apply(function(){
                    var length = elem.val();
                    if(parseInt(length)<=0){
                        ctrl.$setValidity('lengthmatch', false);
                        dialogService.showModal(errorCode);
                    }else{
                        ctrl.$setValidity('lengthmatch', true);
                    }
                });
            });
        }
    }
}]);