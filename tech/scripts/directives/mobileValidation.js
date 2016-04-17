'use strict';
tcbmwApp.directive('mobileCheck', ['dialogService',function (dialogService) {
    return {
        require: 'ngModel',
        link: function (scope, elem, attrs, ctrl) {
        var errorCode = attrs.mobileCheck;
            elem.on('blur', function () {
                scope.$apply(function () {
                    console.log(elem.val());
                    if(elem.val() == "" || elem.val() == undefined || !isValidNumber(elem.val(),"vn")){
                        ctrl.$setValidity('mobilematch', false);
                        dialogService.showModal(errorCode);
                    }else{
                        if (elem.val().substring(0,2) == "09" && elem.val().length == 10) {
                            ctrl.$setValidity('mobilematch', true);
                        } else if (elem.val().substring(0,2) == "01" && elem.val().length == 11) {
                            ctrl.$setValidity('mobilematch', true);
                        } else {
                            ctrl.$setValidity('mobilematch', false);
                            dialogService.showModal(errorCode);
                        }
                    }
                });
            });
        }
    }
}]);