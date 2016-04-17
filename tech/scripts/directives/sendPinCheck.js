'use strict';
tcbmwApp.directive('sendPinCheck',['dialogService',function(dialogService){
    return {
        require:'ngModel',
        link: function(scope,elem,attrs,ctrl){
            var params = attrs.sendPinCheck.split(" ");
            var errorCode = params[0];
            var maxLength = params[1];
            elem.on('blur', function(){
                scope.$apply(function(){
                    var value = elem.val();
                    var length = elem.val().length;
                    if(length>parseInt(maxLength)){
                        ctrl.$setValidity('sendPinMatch', false);
                        dialogService.showModal(errorCode);
                    }else{
                        ctrl.$setValidity('sendPinMatch', true);
                    }
                });
            });
        }
    }
}]);