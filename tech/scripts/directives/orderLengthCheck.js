'use strict';
tcbmwApp.directive('orderLengthCheck',['dialogService','$rootScope',function(dialogService,$rootScope){
    return {
        require:'ngModel',
        link: function(scope,elem,attrs,ctrl){
            var params = attrs.orderLengthCheck.split("|");
            console.log(params);
            var errorCode = params[0];
            var maxLength = params[1];
            elem.on('blur', function(){
                scope.$apply(function(){
                    var value = elem.val();
                    var length = elem.val().length;
                    if (value == "" || value == undefined) {
                        ctrl.$setValidity('orderlengthmatch', false);
                        var errorMessage1 = getMessage("ORDER_LENGTH_VALIDATION_MESSAGE1");
                        dialogService.showModal(params[0] + errorMessage1);
                    }
                    //else if(length != parseInt(maxLength)){
                    //    var errorMessage2 = getMessage("ORDER_LENGTH_VALIDATION_MESSAGE2");
                    //    ctrl.$setValidity('orderlengthmatch', false);
                    //    dialogService.showModal(params[0] +errorMessage2);
                    //}
                    else{
                        ctrl.$setValidity('orderlengthmatch', true);
                    }
                });
            });
        }
    }
}]);
