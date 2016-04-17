'use strict';
tcbmwApp.directive('passwordLengthCheck',['dialogService',function(dialogService){
    return {
        require:'ngModel',
        link: function(scope,elem,attrs,ctrl){
            var errorCode = attrs.passwordLengthCheck;
            elem.on('blur', function(){
                scope.$apply(function(){
                    var value = elem.val();
                    if(value == "" || value == undefined ||value.length < 6 || value.length > 8){
                        ctrl.$setValidity('passwordlengthmatch', false);
                        dialogService.showModal(errorCode);
                    }else{
                        ctrl.$setValidity('passwordlengthmatch', true);
                    }
                });
            });
        }
    }
}]);