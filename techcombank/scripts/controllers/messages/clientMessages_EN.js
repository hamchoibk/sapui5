'use strict';

tcbmwApp.config(['$translateProvider',function ($translateProvider) {
    $translateProvider
        .translations('en', {
            CLOSE:'Close',
            ERROR_CODE_30000:'Please enter username or mobile number',
            ERROR_CODE_30001:'Please enter your password',
            ERROR_CODE_30002:'Please enter your username/mobile number and password',
            ERROR_CODE_30003:'Please provide a valid mobile number',
            ERROR_CODE_30004:'The password does not match, including 6-8 characters both letters, digits and does not enter accented Vietnamese',
            ERROR_CODE_30005:'The passwords do not match',
            ERROR_CODE_30006: 'Full name is too long',
            ERROR_CODE_30066: 'Full name is too short',
            ERROR_CODE_30007:'Only numeric/alphanumeric code allowed OR Please enter a numeric/alphanumeric  code',
            ERROR_CODE_30008:'ID number only allowed numeric, must be at least 7 characters and less than 15 characters',
            ERROR_CODE_30009:'Please enter your numeric account number',
            ERROR_CODE_30010:'Message content must not exceed 200 characters.',
            ERROR_CODE_30011:'Recipient field cannot be left blank, please select a friend',
            ERROR_CODE_30012:'Pin code(if has) must be 4 number characters',
            ERROR_CODE_30013:'Recipient field cannot be left blank, please select a friend ',
            ERROR_CODE_30014:'Full name field cannot contain numbers and special characters',
            ERROR_CODE_30015:'Please enter your alphanumeric identity number',
            ERROR_CODE_30016:'Please enter a valid amount',
            ERROR_CAMERA_DEVICE:'TCB does not have access to your camera. To enable access go to: Settings > TCB > Privacy > Camera',
            ERROR_MICROPHONE_DEVICE:'TCB does not have access to your microphone. To enable access go to: Settings > TCB > Privacy > Mircophone'
            });

}]);