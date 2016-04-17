'use strict';

    tcbmwApp.directive('pwCheck', ['signupUserDetailsFactory','dialogService',function (signupUserDetailsFactory,dialogService) {
    return {
        require: 'ngModel',
        link: function (scope, elem, attrs, ctrl) {
            var firstPassword = '#' + attrs.pwCheck;
            if (signupUserDetailsFactory.getArcIB()){
                ctrl.$setValidity('pwmatch', true);
            }else{
                elem.on('blur', function () {
                   if($(firstPassword).val().length!=0 && elem.val()!=0){
                        scope.$apply(function () {
                            var pwd = $(firstPassword).val();
    //                        console.log("First password = "+pwd+"  Second password = "+elem.val())
                            //var ok = (pwd.length>=6 && pwd.length<=8);  // && pwd.match(/[A-Za-z]/) && pwd.match(/\d+/
    //                        console.log("Ok = "+ok);
    //                        console.log(ok && (elem.val() === $(firstPassword).val()));
                            if((elem.val() === $(firstPassword).val())){
                                ctrl.$setValidity('pwmatch',true);
                            }else{
                                dialogService.showModal('ERROR_CODE_30005');
                            }
                        });
                    }else{
                        ctrl.$setValidity('pwmatch',false);
                    }
                });
            }

        }
    }

}]);