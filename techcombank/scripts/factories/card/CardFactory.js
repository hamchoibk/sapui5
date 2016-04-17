'use strict';
tcbmwApp.factory('CardFactory',['_', function(_){
    return {
        cardInfo : {},
        txnQuery : {},
        reset : function() {
            this.cardInfo = {};
            this.txnQuery = {};
        }
    };
}]);