'use strict';
tcbmwApp.factory('ListOrderPaymentFactory',['_', function(_){
    return {
        listOrderInfo : {},
        reset : function() {
            this.listOrderInfo = {};
        }
    };
}]);
