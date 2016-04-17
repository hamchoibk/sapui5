'use strict';
tcbmwApp.service('dialogService', ['$modal','$rootScope',
    function ($modal,$rootScope) {

        var modalDefaults = {
            backdrop: true,
            keyboard: true,
            modalFade: true,
            templateUrl: 'views/dialog/dialog.html'
        };

        var modalOptions = {
            closeButtonText: 'Close',
            actionButtonText: 'OK',
            headerText: 'Proceed?',
            bodyText: 'Perform this action?'
        };

        this.showModalWithParams = function(customModalOptions){
            var customModalDefaults = {};
            customModalDefaults.backdrop = 'static';
            customModalDefaults.templateUrl = 'views/dialog/dialogWithOption.html';
            return this.show(customModalDefaults, customModalOptions);
        };

        this.showModal = function (title, message) {

            var customModalOptions = {
                closeButtonText: 'CLOSE',
                actionButtonText: '',
                headerText: '',
                bodyText: title
            };
            if (message) {
                customModalOptions.headerText = title;
                customModalOptions.bodyText = message;
            }
            var customModalDefaults = {};
            customModalDefaults.backdrop = 'static';
            return this.show(customModalDefaults, customModalOptions);
        };

        //customization to show tcb notification

        this.showTcbNotification = function (title, message) {

            var customModalOptions = {
                closeButtonText: 'CLOSE',
                actionButtonText: '',
                headerText: '',
                bodyText: title
            };
            if (message) {
                customModalOptions.headerText = title;
                customModalOptions.bodyText = message;
            }
            var customModalDefaults = {};
            customModalDefaults.backdrop = 'static';
            return this.popupNotification(customModalDefaults, customModalOptions);
        };

        this.popupNotification = function (customModalDefaults, customModalOptions) {
            //Create temp objects to work with since we're in a singleton service
            var tempModalDefaults = {};
            var tempModalOptions = {};

            //Map angular-ui modal custom defaults to modal defaults defined in service
            angular.extend(tempModalDefaults, modalDefaults, customModalDefaults);

            //Map modal.html $scope custom properties to defaults defined in service
            angular.extend(tempModalOptions, modalOptions, customModalOptions);

            if (!tempModalDefaults.controller) {
                tempModalDefaults.controller = function ($scope, $modalInstance) {
                    $scope.modalOptions = tempModalOptions;
                    $scope.modalOptions.ok = function (result) {
                        $modalInstance.close(result);
                    };
                    $scope.modalOptions.close = function (result) {
                        $modalInstance.dismiss('cancel');
                    };
                }
                tempModalDefaults.controller.$inject = ['$scope','$modalInstance'];

            }

            return $modal.open(tempModalDefaults).result;
        };

        //customization to show tcb notification end


        this.show = function (customModalDefaults, customModalOptions) {
            if($rootScope.isDialogOpen === true || $rootScope.suppressDialog === true){
                //console.log("in dialogService showModal, $rootScope.isDialogOpen is open");
                return;
            }else{
                //console.log("in dialogService showModal, $rootScope.isDialogOpen is not open");
                $rootScope.isDialogOpen = true;
            }
            //Create temp objects to work with since we're in a singleton service
            var tempModalDefaults = {};
            var tempModalOptions = {};

            //Map angular-ui modal custom defaults to modal defaults defined in service
            angular.extend(tempModalDefaults, modalDefaults, customModalDefaults);

            //Map modal.html $scope custom properties to defaults defined in service
            angular.extend(tempModalOptions, modalOptions, customModalOptions);

            if (!tempModalDefaults.controller) {
                tempModalDefaults.controller = function ($scope, $modalInstance) {
                    $scope.modalOptions = tempModalOptions;
                    $scope.modalOptions.ok = function (result) {
                        $rootScope.isDialogOpen = false;
                        $modalInstance.close(result);
                    };
                    $scope.modalOptions.close = function (result) {
                        $rootScope.isDialogOpen = false;
                        $modalInstance.dismiss('cancel');
                    };
                }
                tempModalDefaults.controller.$inject = ['$scope','$modalInstance'];

            }

            return $modal.open(tempModalDefaults).result;
        };

    }]);
