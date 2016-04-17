'use strict';
tcbmwApp.factory('BillPaymentFactory',['_', function(_){
    return {
        billInfo : {},
        reset : function() {
            this.billInfo = {};
        }
    };
}]);
