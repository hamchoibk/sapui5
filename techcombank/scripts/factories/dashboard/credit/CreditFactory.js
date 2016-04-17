'use strict';
tcbmwApp.factory('CreditFactory',['_', function(_){
    return {
        loanInfo : {},
        reset : function() {
            this.loanInfo = {};
        }
    };
}]);