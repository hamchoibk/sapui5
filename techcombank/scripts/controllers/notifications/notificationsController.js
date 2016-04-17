'use strict';

tcbmwApp.controller('NotificationsController',['$scope','$state','$rootScope',function ($scope,$state,$rootScope) {
        if ( $state.current.name == 'notifications'){
            var baseStatus = {
                isClose:true,
                onAction: function() {
                    $state.go('dashboard.home');

                    var newIndex = statuses.indexOf($scope.status) - 1;
                    if (newIndex > -1) {
                        $scope.status = statuses[newIndex];
                        $scope.status.move = 'ltr';
                        $scope.navigationBarStatus = $scope.status;
                    }
                }
            };

            var statuses = [
                angular.extend({title: 'NAVBAR_NOTIFICATIONS'}, baseStatus)
            ];

            $scope.status = statuses[0];
        }

        $scope.notifications=[{"id":1,"accountNumber":1234567777777,"name":"Jasmine Swift","amount":"+200,000","date":"30/05/2014","link":"https://fsta.co/123456cool","channel":"googleplus","status":"Pending"},
                             {"id":2,"accountNumber":1234567777777,"name":"Jamina K.","amount":"+40,000","date":"29/05/2014","link":"https://fsta.co/123456cool","channel":"sms","status":"Pending"},
                             {"id":3,"accountNumber":1234567777777,"name":"Moang Bao Tran Le","amount":"-100,000","date":"28/05/2014","link":"https://fsta.co/123456cool","channel":"facebook","status":"Pending"},
                             {"id":4,"accountNumber":1234567777777,"name":"Mithral Steven","amount":"+4,0000","date":"27/05/2014","link":"https://fsta.co/123456cool","channel":"googleplus","status":"Pending"}];
}]);