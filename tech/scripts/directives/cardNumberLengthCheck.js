'use strict';
tcbmwApp.directive('cardNumberLengthCheck',['dialogService',function(dialogService){
    return {
        require:'ngModel',
        link: function(scope,elem,attrs,ctrl){
            var errorCode = attrs.cardNumberLengthCheck;
            elem.on('blur', function(){
                scope.$apply(function(){
                    var value = elem.val().trim();
                    if (value == "" || value == undefined) {
                        ctrl.$setValidity('cardnumberlengthmatch', false);
                        dialogService.showModal("INSTANT_TRANSFER_CARD_NUMBER_BLANK_VALIDATION");
                    } else if(value.length < 13 || value.length > 19){
                        ctrl.$setValidity('cardnumberlengthmatch', false);
                        dialogService.showModal(errorCode);
                    }else{
                        ctrl.$setValidity('cardnumberlengthmatch', true);
                    }
                });
            });
        }
    }
}]);