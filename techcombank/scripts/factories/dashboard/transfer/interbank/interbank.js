'use strict';

tcbmwApp.factory('interBankFactory', function(){

  return {
    txnInfo : {
      currency:'VND'
    },
    resetTxnInfo : function() {
      this.txnInfo = {
        currency:'VND'
      };
    }
  }
});


