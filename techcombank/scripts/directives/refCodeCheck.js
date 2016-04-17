'use strict';
tcbmwApp.directive('refCodeCheck',['dialogService',function(dialogService){
    return {
        require:'ngModel',
        link: function(scope,elem,attrs,ctrl){
            var errorCode = attrs.refCodeCheck;
            elem.on('blur', function(){
                scope.$apply(function(){
                    var length = elem.val();
                    console.log("length ==", length);
                    var pattern = /[^A-Za-z0-9]/g;
                    if (length != "") {
                        if (length.length > 20 || length.length < 8 || pattern.test(length)===true) {
                            ctrl.$setValidity('refcodematch', false);
                            dialogService.showModal(errorCode);
                        } else {
                            ctrl.$setValidity('refcodematch', true);
                        }
                    } else {
                        ctrl.$setValidity('refcodematch', true);
                    }
                });
            });
        }
    }
}]);