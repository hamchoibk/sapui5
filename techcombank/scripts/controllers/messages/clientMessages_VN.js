'use strict';

tcbmwApp.config(['$translateProvider',function ($translateProvider) {
    $translateProvider
        .translations('vn', {
            CLOSE:'Đóng',
            ERROR_CODE_30000:'Vui lòng nhập tên đăng nhập hoặc số điện thoại',
            ERROR_CODE_30001:'Vui lòng nhập mật khẩu',
            ERROR_CODE_30002:'Vui lòng nhập tên đăng nhập/số điện thoại và mật khẩu',
            ERROR_CODE_30003:'Vui lòng cung cấp số điện thoại chính xác',
            ERROR_CODE_30004:'Mật khẩu không đúng định dạng (độ dài 6-8 ký tự bao gồm chữ, số và không nhập tiếng việt có dấu)',
            ERROR_CODE_30005:'Xác nhận mật khẩu không chính xác',
            ERROR_CODE_30006:'Họ tên quá dài',
            ERROR_CODE_30066:'Họ tên quá ngắn',
            ERROR_CODE_30007:'Vui lòng nhập số hoặc kí tự',
            ERROR_CODE_30008:'Vui lòng nhập số CMND là chữ số, tối thiểu 7 kí tự và tối đa 15 kí tự',
            ERROR_CODE_30009:'Vui lòng nhập số tài khoản',
            ERROR_CODE_30010:'Nội dung thông điệp không được vượt quá 200 kí tự.',
            ERROR_CODE_30011:'Vui lòng chọn người nhận',
            ERROR_CODE_30012:'Mã bảo mật (nếu có) phải là 4 chữ số',
            ERROR_CODE_30013:'Vui lòng chọn người nhận',
            ERROR_CODE_30014:'Tên đầy đủ không được chứa kí tự số và kí tự đặc biệt',
            ERROR_CODE_30015:'Vui lòng nhập số CMT hoặc hộ chiếu',
            ERROR_CODE_30016:'Vui lòng nhập số tiền đúng định dạng',
            ERROR_CAMERA_DEVICE: 'TCB không có quyền truy cập vào máy ảnh của bạn. Để cho phép truy cập vào: Settings > TCB > Privacy > Camera ',
            ERROR_MICROPHONE_DEVICE: 'TCB không có quyền truy cập vào micro của bạn. Để cho phép truy cập vào: Settings > TCB > Privacy > Mircophone '
        });

}]);