'use strict';
tcbmwApp.controller('HelpController',['$scope','$state', '$filter','$rootScope',function ($scope,$state,$filter,$rootScope) {
    if ( $state.current.name == 'help'){
            var baseStatus = {
                    isBack:true,
                    onBack: function() {
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
                angular.extend({title: 'NAVBAR_HELP'}, baseStatus)
            ];

            $scope.status = statuses[0];
    }
    var temp =[];
    for ( var i = 1; i <= 23; i++) {
        temp.push({
                                question:$filter('translate')('QUESTION_' + i),
                                answer:$filter('translate')('ANSWER_'+ i),
                                open:false
        });
        $scope.questions = temp;
    }

}]);