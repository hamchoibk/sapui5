(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var navbar = angular.module('navigationBar');

var template = ' \
<div class="navbar-screen redBorderBottom"> \
  <div class="navbar-title"> \
    <h1><b>{{status.title| translate }}</b></h1> \
  </div> \
  <div class="navbar-back home" ng-if="status.isHome"> \
    <a role="button" ng-show="showHome" ng-click="status.onHome()"></a> \
  </div> \
  <div class="navbar-back menu" ng-if="status.toggleMenu">\
    <a role="button" ng-show="showMenu" ng-click="status.onToggleMenu()"></a> \
  </div>\
  <div id="backButton" class="navbar-back" ng-show="showBack" ng-click="status.onBack()"> \
    <a role="button" ></a> \
  </div> \
  <div id="closeButton" class="navbar-action ng-if=status.isClose"  ng-show="showAction" ng-click="status.onAction()"> \
    <a role="button" id="btnAction"></a> \
  </div> \
  <div class="navbar-action ng-if=status.isAdd"> \
    <a role="button" ng-show="showAdd" ng-click="status.onAdd()" id="btnAdd"></a> \
  </div> \
  <div class="navbar-action ng-if=status.isLogoutRequired"> \
    <a role="button" ng-show="showLogout" ng-click="status.onLogout()" id="btnSignOut"></a> \
  </div> \
</div>';

module.exports = navbar.directive('navigationBarScreen', function() {
  return {
    restrict: 'E',
    replace: true,
    template: template,
    scope: {
      status: '='
    },
    require: '^navigationBar',
    link: function(scope, elt, attrs, navigationBarCtrl) {
      scope.$watch('status', function(status, oldStatus) {
        scope.showBack = !!(status && status.onBack );
        scope.showMenu = !!(status && status.onToggleMenu);
        scope.showAction = !!(status && status.onAction );
        scope.showAdd = !!(status && status.onAdd );
        scope.showHome = !!(status && status.onHome);
        scope.showLogout = !!(status && status.onLogout);
      }, true);
    }
  };
});

},{}],2:[function(require,module,exports){
var navbar = angular.module('navigationBar');

var template = ' \
<nav class="navbar" ng-class="{ \
    \'before-rtl\': beforeRtl, \
    \'before-ltr\': beforeLtr, \
    \'show-rtl\': showRtl, \
    \'show-ltr\': showLtr \
  }"> \
  <navigation-bar-screen status="status" class="current"></navigation-bar-screen> \
  <navigation-bar-screen status="prevStatus" class="previous"></navigation-bar-screen> \
</nav>';

module.exports = navbar.directive('navigationBar', function($rootScope) {
  return {
    restrict: 'E',
    replace: true,
    template: template,
    scope: {
      /* status is an object containing the following properties:
       * String title
       * String backLabel
       * String actionLabel
       * String ('ltr', 'rtl', 'none') move
       * Function onBack
       * Function onAction
       */
      status: '='
    },
    controller: function() {
      // Necessary for the directive dependency
      if($rootScope.suppressDialog===true){
            $rootScope.suppressDialog = false;
      };

      $("#closeButton").on('touchstart mousedown',function(){
           $rootScope.suppressDialog = true; //Dont show a pop up if X button is clicked
       });

      $("#backButton").on('touchstart mousedown',function(){
        $rootScope.suppressDialog = true; //Dont show a pop up if back button is clicked
      });
    },
    link: function(scope, elt, attrs) {

      function resetAnim() {
        scope.beforeRtl = false;
        scope.beforeLtr = false;
        scope.showRtl = false;
        scope.showLtr = false;
      }

      // scope.$evalAsync fixes a Chrome 30.0.1599 transition bug: the X
      // position of the text moves at the end of the transition. OK on Safari 7.0
      // requestAnimationFrame fixes a Firefox 28.0a2 transition bug: the transition
      // is not always applied.
      function forceDomApply(fn) {
        window.requestAnimationFrame(function(){
          scope.$evalAsync(fn);
        });
      }

      scope.prevStatus = null;

      resetAnim();

      scope.$watch('status', function(status, prevStatus) {

        if (!status || status === prevStatus) return;

        // No anim
        if (status.move === 'none') {
          scope.prevStatus = null;
          return;
        }

        // Right-to-left / left-to-right anims
        resetAnim();
        scope.prevStatus = prevStatus;

        scope.beforeRtl = (status.move === 'rtl');
        scope.beforeLtr = (status.move === 'ltr');

        forceDomApply(function(){
          scope.showRtl = scope.beforeRtl;
          scope.showLtr = scope.beforeLtr;
        });
      }, true);

        if($('body').height()<=480){
            $('.navbar').addClass('short');
        }


        //detect ios smaller than 7 version to apply short navigation
        function iOSversion() {
            if (/iP(hone|od|ad)/.test(navigator.platform)) {
                // supports iOS 2.0 and later: <http://bit.ly/TJjs1V>
                var v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
                return [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || 0, 10)];
            }
        }

        var ua = navigator.userAgent.toLowerCase();
        var isAndroid = ua.indexOf("android") > -1; //&& ua.indexOf("mobile");
        if(isAndroid) {
            $('.navbar').addClass('android');
        }
        else {
            ver = iOSversion();

            if (ver && ver[0] < 7) {
                $('.navbar').addClass('short');
                $('body').addClass('narrow');
                $('html').addClass('narrow');
            }
            if (ver && ver[0] >= 7 && $(window).height() <= 480) {
                $('.navbar').removeClass('short');
            }
        }
    }
  };
});

},{}],3:[function(require,module,exports){
module.exports = angular.module('navigationBar', []);

require('./directives/navigation-bar');
require('./directives/navigation-bar-screen');

},{"./directives/navigation-bar":2,"./directives/navigation-bar-screen":1}]},{},[3])