'use strict';
angular.module('cordovaModule',[])
    .service('CordovaService',['$document', '$q',
    function($document, $q){
        var d = $q.defer(),
        resolved = false;

        var self = this;
        this.ready = d.promise;

        document.addEventListener('deviceready',function(){
            setTimeout(function() {
                navigator.splashscreen.hide();
            }, 4000);
            resolved = true;
            d.resolve(window.cordova);
        });

        setTimeout(function() {
            if (!resolved) {
                 if (window.cordova)
                    d.resolve(window.cordova);
            }
        }, 3000);

    }]);