'use strict';
tcbmwApp.factory('TopUpFactory',['_', function(_){
  return {
    topupInfo : {},
    reset : function() {
      this.topupInfo = {};
    }
  };
}]);