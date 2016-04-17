'use strict';
tcbmwApp.directive('stopEvent', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            element.bind('click', function (e) {
                console.log("stop event burn");
                e.stopPropagation();
            });
        }
    };
});