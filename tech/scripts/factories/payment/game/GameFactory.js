/**
 * Created by vietnq4 on 1/20/15.
 */
'use strict';
tcbmwApp.factory('GameFactory',['_', function(_){
    return {
        topupGame : {},
        reset: function() {
            this.topupGame = {};
            this.topupAmount = "";
            this.parsedAmount = "";
        }
    };
}]);