'use strict'
tcbmwApp.config(function ($provide) {
    $provide.decorator("$exceptionHandler", ['$injector', '$delegate', function ($injector, $delegate) {
        var $location, $rootScope, $state;
        return function (exception, cause) {
            $location = $location || $injector.get('$location');
            $state = $state || $injector.get('$state');
            $delegate(exception, cause);

            //TODO: send data to GA by event tracking
            var eventAction = "Time: " + new Date() + " - "
                            + "Error message: " + exception.message + " - "
                            + "Device: " + setting.appinfo.deviceId + " - "
                            //+ "Customer: " + session.customer.id + " - "
                            + "Controller: " + $state.current.controller;
            ga(
                TRACKER_NAME+'.send',
                'event',
                'Angularjs Exception',
                eventAction,
                exception.stack,
                0,
                true
            );

            //TODO: transition to friendly error page
            $location.path('/errorpage');

            //TODO: send data to GA by exception tracking
            //ga(
            //    'send',
            //    'exception',
            //    {
            //        'exDescription': exception,
            //        'exFatal': true
            //    }
            //);
        };
    }]);
});