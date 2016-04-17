'use strict';
tcbmwApp.factory('DepositFactory',['_', function(_){
    return {
        depositInfo : {},
        reset : function() {
            this.depositInfo = {};
        }
    };
}]);