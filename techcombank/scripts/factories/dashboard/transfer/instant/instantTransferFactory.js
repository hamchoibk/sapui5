'use strict';
tcbmwApp.factory('instantTransferFactory', function(){
    return {
        txnInfo : {},
        resetTxnInfo : function() {
            this.txnInfo = {};
            this.ben = {};
        }
    }
});


