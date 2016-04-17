'use strict';
tcbmwApp.directive('billNoCheck',['dialogService','$rootScope',function(dialogService,$rootScope){
    return {
        require:'ngModel',
        link: function(scope,elem,attrs,ctrl){
            var errorCode = attrs.billNoCheck;
            elem.on('blur', function(){
                scope.$apply(function(){
                    var length = elem.val();
                    if(length=="" || length==undefined || parseInt(length)<=0){
                        var errorMessage = ($rootScope.languageCode == false) ? " không được để trống"  : " must be required";
                        ctrl.$setValidity('billnomatch', false);
                        console.log("bill No check"+errorCode + errorMessage );
                        dialogService.showModal(errorCode + errorMessage);
                    }else{
                        ctrl.$setValidity('billnomatch', true);
                    }
                });
            });
        }
    }
}]);