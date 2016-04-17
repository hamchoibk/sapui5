'use strict';
tcbmwApp.directive('vtcAccountCheck',['dialogService','$rootScope',function(dialogService,$rootScope){
    return {
        require:'ngModel',
        link: function(scope,elem,attrs,ctrl){
            var params = attrs.vtcAccountCheck;
            console.log(params);
//            var errorCode = params[0];
            var maxLength = 2;
            elem.on('blur', function(){
                scope.$apply(function(){
                    var value = elem.val();
                    var length = elem.val().length;
                    if (value == "" || value == undefined) {
                        ctrl.$setValidity('vtcaccountmatch', false);
                        var errorMessage1 = ($rootScope.languageCode == false) ? "Vui lòng nhập "  : "Please enter the ";
                        dialogService.showModal(errorMessage1 + params);
                    } else if(length<parseInt(maxLength)){
                        var errorMessage2 = ($rootScope.languageCode == false) ? " phải chứa tối thiểu 2 kí tự"  : " must include at least 2 characters";
                        ctrl.$setValidity('vtcaccountmatch', false);
                        dialogService.showModal(params +errorMessage2);
                    }else{
                        ctrl.$setValidity('vtcaccountmatch', true);
                    }
                });
            });
        }
    }
}]);