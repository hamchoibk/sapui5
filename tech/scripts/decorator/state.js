tcbmwApp.config(function ($provide) {
    $provide.decorator('$state', function ($delegate) {

        // let's locally use 'state' name
        var state = $delegate;

        // let's extend this object with new function
        // 'baseTransitionTo', which in fact, will keep the reference
        // to the original 'transitionTo' function
        state.baseTransitionTo = state.transitionTo;

        // here comes our new 'transitionTo' decoration
        var transitionTo = function (to, params, options) {


            // return processing to the 'baseTransitionTo' - original
            this.baseTransitionTo(to, params, options);

            //TODO: send data to GA as screen view
            ga(TRACKER_NAME+'.send', 'screenview', {
                //'appName': 'F@st Mobile',
                'screenName': to
                //'appVersion': setting.appinfo.applicationVersion
            });
        };

        // assign new 'transitionTo', right now decorating the old 'transitionTo'
        state.transitionTo = transitionTo;

        return $delegate;
    });
});