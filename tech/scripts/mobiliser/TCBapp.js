/**
 * storing our JavaScript in a separate file allows us to manage our app's
 * behaviour separately from the markup and presentation
 *
 * if you have a larger app, you will want to split your application code into
 * multiple js files
 */

/* Customization constants */
var MAX_SESSION_TIME = 15 * 60 * 1000;   /* Allow 15 minutes per session. To be aligned with server side timeout. */
var MAX_TRANSACTION_TIME = 60 * 2.5 * 1000;    /* Allow maximum one minute for response on POST. Align with server side timeout. */

var CACHE_OTHER_IDENTIFICATIONS = true; /* Set this to cache other identifications and avoid repeated calls to server*/

var CACHE_ALERT_NOTIFICATION_MSG_IDS = true; /*Set this to avoid caching of alert notification message ids*/

var CACHE_SERVICE_PACKAGES = true; /* Set this to avoid caching of service package calls between a single session*/
var CACHE_TRANSACTIONS = true; /*Set this to avoid repeatitive calling to get the list of transactions*/

/* Add more device types here to add alerts */
// TODO : do we need to specify both integers and strings ?? Check server response.
var ALLOWED_DEVICE_TYPES = [0, 7, "0", "7"]; //Only email and mobile are allowed to be added in alerts;
//Adding both the integer version and string version to ensure that a strict check do not prevent from matching types

var TYPE_ACCOUNT_SALARY = 120;
var TYPE_ACCOUNT_FOREIGN = 140;
var TYPE_BEN_WALLET = 0;
var TYPE_BEN_IN_TCB = 1;
var TYPE_BEN_EXTERNAL = 2;
var TYPE_BEN_CARD_247 = 5;
var TYPE_BEN_ACCOUNT_247 = 6;
var TYPE_BEN_CREDIT_CARD_ACCOUNT = 4;
var TYPE_CREDIT_CARD_ACCOUNT = 130;
/* End of customization constants */


/* globals */
var setting = new Setting();
var mc;
var session = new LoginSession();
// timer for each transaction
var mcTimer = new Timer();
// timer for each session
var sessionTimer = new Timer();
var trans = {
    // TODO: remove quotes to optimize space
    TRAN_IDLE: 0,
    TRAN_LOGIN: 1,
    TRAN_WALLET: 2,
    TRAN_CREDITCARD: 3,
    TRAN_BANK: 4,
    TRAN_SVA: 5,
    TRAN_SENDMONEY: 6,
    TRAN_SENDBILL: 7,
    TRAN_CHANGEPIN: 8,
    TRAN_TXN: 9,
    TRAN_REGISTERBILL: 10,
    TRAN_CREATEWALLET: 11,
    TRAN_BLOCKACCOUNT: 12,
    TRAN_CHANGEPASSPWORD: 13,
    TRAN_CREATECUSTOMER: 14,
    TRAN_ENTERPAYBILL: 15,
    TRAN_PAYANEWBILL: 16,
    TRAN_SENDREQUEST: 17,
    TRAN_LOADSVA: 18,
    TRAN_UNLOADSVA: 19,
    TRAN_UPDATEWALLET: 20,
    TRAN_DELETEWALLET: 21,
    TRAN_TOPUP: 22,
    TRAN_NOTIFICATION: 23,
    TRAN_CREATESMSTOKEN: 24,
    TRAN_CREATEBALALERT: 25,
    TRAN_UPDATEBALALERT: 26,
    TRAN_DELETEBALALERT: 27,
    TRAN_DELETECARD: 28,
    TRAN_LOGOUT: 29,
    TRAN_VIEWCOUPONS: 30,
    TRAN_PURCHASECOUPON:31,
    TRAN_DELETECOUPON:32,
    TRAN_ROOTCATEGORY:33,
    TRAN_CHILDCATEGORY:34,
    TRAN_COUPONTYPESFORCATEGORY:35,
    TRAN_ASSIGNCOUPON:36,
    TRAN_FINDCOUPONBYTAG:37,
    TRAN_CATEGORYTREE:38,
    TRAN_SETPRIMARY:39,
    TRAN_ALERTLIST:50,
    TRAN_OTHERIDEN:51,
    TRAN_ADDALERT:52,
    TRAN_ALERTDETAIL:53,
    TRAN_UPDATEALERT:54,
    TRAN_DELETEALERT:55,
    TRAN_NOTIFMSGID:56,
    TRAN_ALERTNOTIFMSG:57,
    TRAN_CUSTOMERPACKAGE:58,
    TRAN_TRANSACTIONTYPES : 59
};
var input_length = {
    // TODO : move into configuration file
    'username':32,
    'password':32,
    'passcode':16,
    'protocol':10,
    'ip':32,
    'port':5,
    'sendnumber':14,
    'sendamount':8,
    'request_number':14,
    'requestamount':8,
    'billalias':80,
    'billrefno':80,
    'billamount':8,
    'topup_number':14,
    'nickname':80,
    'acctno':32,
    'bankcode':15,
    'branchcode':15,
    'acctholder':80,
    'cardnickname':80,
    'cardno':16,
    'cardcvv':6,
    'cardholder':80,
    'loadamount':8,
    'loadtext':80,
    'unloadamount':8,
    'unloadtext':80,
    'threshold':8,
    'old_pin':32,
    'new_pin':32,
    'confirmnew_pin':32,
    'blockpin':32,
    'new_pin_login':32,
    'prepaidamount':8
};
var rootUrl;
// jQM option for page transitions
var page_opt = {transition: "none", changeHash: false, showLoadMsg : false};

var appstate = trans.TRAN_IDLE;
// online mode or demo mode
var gui_version = false;

// authentication via username/pwrd or msisdn/pin
var auth_type = '0';

// default language English
var language = 'en';

// used for coupon
var locale = '';
var mimeType = '';

// used for coupon and 'locate us'
var geoLocation = null;

/* reference to twitter object. remove because widget library is deprecated
 var twitterPlugin = null;
 */

// reference to facebook connect object. TODO : move ?
var facebookConnect;

// true if external Camera app is started
var cameraInOperation;

var successUrl = "http://www.techcombank.com.vn";
var errorUrl = "http://tcb832402904.vn/error.html";

// TODO : extend ?
var isiPad = navigator.userAgent.match(/iPad/i) !== null;
var isiPhone = navigator.userAgent.match(/iPhone/i) !== null;
var isiPod = navigator.userAgent.match(/iPod/i) !== null;
var isAndroid = navigator.userAgent.match(/android/i) !== null;
var isIE = /MSIE (\d+\.\d+);/.test(navigator.userAgent);

var isiOsDevice = (isiPad || isiPhone || isiPod);
var flagOrientation;

// TODO: standardize event listeners ?

window.onorientationchange = function() { checkorientation(window.orientation); };

//Array structure to hold org unit data at global level
// TODO: why do we need this at global level ?

var transactiontypes = [];

// flag of workaround for iPhone iOS7
var iPhone7Fix = false;
startApp();
function showProgress() {
    $("#app-container").scope().loading = true;
}
function MessageBox(title, content) {
    if (content) {
        angular.element("#app-container").injector().get("dialogService").showModal(title,content);
    } else {
        angular.element("#app-container").injector().get("dialogService").showModal(title);
    }
    //Will implement later
    //alert(str);
    /*
     if (isiOsDevice || isAndroid) {
     if (content === undefined) {
     navigator.notification.alert(
     title,  // message
     null         // callback
     );
     } else {
     navigator.notification.alert(
     content,  // message
     null,        // callback
     title
     );
     }


     } else {
     if (content === undefined) {
     alert(title);
     }
     else {
     alert(content);
     }
     //$("#messagebox").popup("open");
     //alert(str);
     }*/

}

function TcbNotificationBox(title, content) {
    if (content) {
        angular.element("#app-container").injector().get("dialogService").showTcbNotification(title,content);
    } else {
        angular.element("#app-container").injector().get("dialogService").showTcbNotification(title);
    }
}


function ErrorBox(status) {
    console.log(status);
    var code = status.code;
    var text = status.value;
    var idx = text.indexOf("|");
    var vnMessage = text.substr(0,idx);
    var enMessage = text.substr(idx+1);
    if ($("#app-container").scope().languageCode) {
        if (parseInt(code)>=20000)
            MessageBox(enMessage);
        else
            MessageBox(enMessage + " (code " + code + ")");
    } else {
        if (parseInt(code)>=20000)
            MessageBox(vnMessage);
        else
            MessageBox(vnMessage + " (mã " + code + ")");
    }

}
function Confirm(title, callback, content, buttons) {
    var defaultButtons = ["MESSAGE_BOX_OK", "MESSAGE_BOX_CANCEL"];
    if (buttons)
        defaultButtons = buttons;
    if (content) {
        angular.element("#app-container").injector().get("dialogService").showModalWithParams(modalOptions = {
            closeButtonText: defaultButtons[1],
            actionButtonText: defaultButtons[0],
            headerText: title,
            bodyText: content
        }).then(callback);
    } else {
        angular.element("#app-container").injector().get("dialogService").showModalWithParams(modalOptions = {
            closeButtonText: defaultButtons[1],
            actionButtonText: defaultButtons[0],
            headerText:"",
            bodyText: title
        }).then(callback);
    }
}
function MessageBoxCallback(callback,title, content) {
    //Will implement later
    //alert(str);
    if (isiOsDevice || isAndroid) {
        if (content === undefined) {
            navigator.notification.alert(
                title,  // message
                callback         // callback
            );
        } else {
            navigator.notification.alert(
                content,  // message
                callback,        // callback
                title
            );
        }


    } else {
        if (content === undefined) {
            alert(title);
            callback();
        }
        else {
            alert(content);
            callback();
        }
        //$("#messagebox").popup("open");
        //alert(str);
    }
}

function hideProgress() {
    //$scope.loading = false;
    $("#page-loader").hide();
}

function startAppTimer(w) {
    if (!mcTimer.on_flag) {
        console.log("startTimer");
        mcTimer.on_flag = 1;
        mcTimer.handle = setTimeout(timeOutCancel,w);
    }
}

function stopAppTimer() {
    console.log("stopped");
    clearTimeout(mcTimer.handle);
    mcTimer.on_flag = 0;

}

function timeOutCancel() {
    console.log("timeot");
    try {
        smartphoneService.request.abort();
    } catch (ex) {

    }
    stopAppTimer();
    MessageBox("Connection timeout");
    hideProgress();

    /*if (appstate == trans.TRAN_LOGIN) {
     $('#username').val('');
     $('#password').val('');
     }*/
    appstate = trans.TRAN_IDLE;
}

function startSessionTimer() {
    if (!sessionTimer.on_flag) {
        sessionTimer.on_flag = 1;
        sessionTimer.handle = setTimeout(sessionTimeOut,  session.sessionTimeoutWindow);
    } else {
        resetSessionTimer();
    }
}

function stopSessionTimer() {
    clearTimeout(sessionTimer.handle);
    sessionTimer.on_flag = 0;
}

function resetSessionTimer() {
    if (sessionTimer.on_flag) {
        clearTimeout(sessionTimer.handle);
        sessionTimer.handle = setTimeout(sessionTimeOut, session.sessionTimeoutWindow);
    }
}

function sessionTimeOut() {
    if (session.customer.id) {
        if ($("#app-container").scope().languageCode)
            TcbNotificationBox("Session timeout. Please re-login!");
        else
            TcbNotificationBox("Hết phiên làm việc. Mời bạn đăng nhập lại!");
        endSession(true);
    }
}
function endSession(data) {
    if (data) {
        //
        sessionTimer.on_flag = 0;
        session.customer.id = null;
        mc.logout(logoutBack);
        session = new LoginSession();
        window.location = "./index.html#/login";
        function logoutBack(r) {

        }
    }
}

function registerPushNotificationBack(r) {
    //TODO: check first time open app
    var firstTimecheck= window.localStorage.getItem("first_time");
    console.log("firstTimecheck == ", firstTimecheck);

    if (firstTimecheck == null || firstTimecheck == undefined || firstTimecheck == "") {
        console.log("Playing demo");
        window.location = "./index.html#/getstartedindex";
        window.localStorage.setItem("first_time", "Played Demo");
    } else {
        console.log("no playing demo");
        window.localStorage.setItem("first_time", "No");
    }

    //end
}

function getLookupsBack(r) {
    if (r.Status.code == "0") {
        var latestversion = "";
        if (isiOsDevice) {
            latestversion = r.lookupEntities[0].name;
        } else if (isAndroid) {
            latestversion = r.lookupEntities[1].name;
        } else {
            console.log("check latest version not a mobile device, latest version default is first element of server response");
            latestversion = latestversion = r.lookupEntities[0].name;
        }

        if (latestversion != undefined && latestversion != "") {
            if (latestversion > setting.appinfo.applicationVersion) {
                console.log("### new version available");
                Confirm('UPDATE_TO_LATEST_VERSION', updateLatestVersion);
            }
        }
    } else {
        console.log("failed to check latest version from server error == ", r.Status);
    }
}

function updateLatestVersion() {
    if (isiOsDevice) {
        console.log("### open ios link");
        window.open("https://itunes.apple.com/us/app/f-st-mobile/id931883425?ls=1&mt=8", '_system');
    } else if (isAndroid) {
        console.log("### open android link");
        window.open("https://play.google.com/store/apps/details?id=com.fastacash.tcb", '_system');
    } else {
        console.log("check latest version not a mobile device, link to update default for android");
        window.open("https://play.google.com/store/apps/details?id=com.fastacash.tcb", '_system');
    }
}

function initApp(){
    //TODO: check latest version from server
    mc.getLookups(getLookupsBack, "latestversion");

    //end

    //TODO: register push notification service and send registration id to server, setup handler to popup push message
    try {
        setting.initAppLauched = true;
        setting.appinfo.device = device.platform + "/" + device.version + " " + device.model;
        setting.appinfo.deviceId = device.uuid;
        setting.appinfo.otherDeviceId = device.cordova;

        document.addEventListener("backbutton", onBackKey, false);

        //check if iPhone iOS7 for Apps
        if (device.platform === "iOS" && device.version === "7.0" && device.name.match(/iPhone/i))
            iPhone7Fix = true;

        //implement new push notification plugin
        var push = PushNotification.init({ "android": {"senderID": "65046774429"},
            "ios": {"alert": "true", "badge": "true", "sound": "true"}, "windows": {} } );

        push.on('registration', function(data) {
            // data.registrationId
            console.log("data.registrationId == ", data.registrationId);
            if(isAndroid) {
                setting.regId = "[adr]"+data.registrationId;
            } else if (isiOsDevice) {
                setting.token = "[ios]"+data.registrationId;
            }
            mc.registerPushNotification(registerPushNotificationBack,data.registrationId);
        });

        push.on('notification', function(data) {
            // data.message,
            // data.title,
            // data.count,
            // data.sound,
            // data.image,
            // data.additionalData
            console.log("notification data == ", data);
            TcbNotificationBox(data.message);
        });

        push.on('error', function(e) {
            // e.message
            console.log("push notification error == ", e);
        });
    } catch (ex) {
        setting.error = ex;
    }

    //end

    //TODO: Check Push Notification Status and Alert to customer only for ios
    if (isiOsDevice) {
        TCBNativeBridge.getPushNotificationStatus(successCallBack, error, "getPushNotificationStatus");
    }

    //end
}

function successCallBack(responseDict) {
    if (responseDict == "No") {
        MessageBox("","PUSH_NOTIFICATION_PERMISSION_ALERT_CONTENT");
    }
}

function error(error) {
    console.log("getPushNotificationStatus error == ", error);
}

function startApp() {
    // TODO : remove typeof check and delete ?
    setting.startAppLauched = true;

    if (typeof mc !== 'undefined' )
        delete mc;
    mc = new MobiliserClient();
    var checksettings = window.localStorage.getItem("setting_ipaddress");
    if ( checksettings !== null && typeof checksettings !== 'undefined' ) {
        setting.ipaddress = window.localStorage.getItem("setting_ipaddress");
        setting.protocol = window.localStorage.getItem("setting_protocol");
        setting.port = window.localStorage.getItem("setting_port");

        // TODO remove delete ?
        delete mc;
        mc = new MobiliserClient();
    }
    //initApp();
}

/**
 @description Initialise event listeners and settings when document.ready is fired
 */
function initDocument(){
    if (document.addEventListener) {
        document.addEventListener("pause", onPause, false);
        document.addEventListener("resume", onResume, false);
        document.addEventListener("orientationChanged", onOrientationChanged);
    }

    /*var checksettings = window.localStorage.getItem("protocol");
     if ( checksettings !== null && typeof checksettings !== 'undefined' ) {
     setting.protocol = window.localStorage.getItem("protocol");
     setting.ipaddress = window.localStorage.getItem("ipaddress");
     setting.port = window.localStorage.getItem("port");
     setting.wsname = window.localStorage.getItem("wsname");
     // TODO remove delete ?
     delete mc;
     mc = new MobiliserClient();
     }*/
    var checksettings = window.localStorage.getItem("setting_ipaddress");
    if ( checksettings !== null && typeof checksettings !== 'undefined' ) {
        setting.protocol = window.localStorage.getItem("setting");

        // TODO remove delete ?
        delete mc;
        mc = new MobiliserClient();
    }

    var checkDeviceUuid = window.localStorage.getItem("deviceUuid");
    if ( checkDeviceUuid !== null && typeof checkDeviceUuid !== 'undefined' ) {
        setting.appinfo.deviceId = window.localStorage.getItem("deviceUuid");
    } else {
        setting.appinfo.deviceId = UUIDv4();
        window.localStorage.setItem("deviceUuid", setting.appinfo.deviceId);
    }
}

/**
 @description Initialise phonegap related functionality when the device is ready.
 */


function onPause() {
    if (cameraInOperation) {
        return;
    }

    if (smartphoneService.req) {
        //START 4085
        hideProgress();
        //END 4085
        smartphoneService.abort();
    }
    hideProgress();
    /*if ( session.sessionId !== '') {
     endSession(true);
     } else {
     // If user is interrupted while entering credentials and waiting for login process to finish,
     // stop progress indication, clear credentials and allow user to login again.
     //clearTextInput();
     hideProgress();
     }*/
}

function onResume() {
    if (cameraInOperation) {
        console.log("returned from camera operation");
        cameraInOperation = false;
    }
    if (session.customer.id) {
        //
        var currentTime = (new Date()).getTime();
        if (session.lastAPIcall) {
            var timeDiffer = currentTime - session.lastAPIcall;
            if (timeDiffer>MAX_SESSION_TIME) {
                //Expired Session
                sessionTimeOut();
                return;
            }
        }
    }
}

function onBackKey(e) {
    e.preventDefault();
    if ($(".navbar-back").length) {
        if (!$(".navbar-back").hasClass("menu")) {
            $(".navbar-back").click();
            return;
        }
    }
    if ($("#app-container").scope().languageCode)
        Confirm("Do you really want to exit the app?", confirmBack);
    else
        Confirm("Bạn có muốn thoát khỏi ứng dụng không?", confirmBack);

    function confirmBack(data) {
        navigator.app.exitApp();
    }

    /*if ($.mobile.activePage.is('#login') || $.mobile.activePage.is('#home-no-login')){
     e.preventDefault();
     navigator.app.exitApp();
     } else {

     e.preventDefault();
     //$(".back").click();
     //Disable back key
     //navigator.app.backHistory();
     }*/
}

// TODO: ensure this code is platform independent. iOS and Android use different values here.
checkorientation = function(o) {
    switch(o) {
        case 0: // portrait, home bottom
            flagOrientation = "portrait"; break;
        case 180: // portrait, home top
            flagOrientation = "portrait"; break;
        case -90: // landscape, home left
            flagOrientation = "landscape"; break;
        case 90: // landscape, home right
            flagOrientation = "landscape"; break;
    }
}

function onOrientationChanged() {
    /* redefine dim background height to cover whole screen */
    $("#progressDiv").css("height", $(document).height());
}

var dateFormat = function () {
    var token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
        timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
        timezoneClip = /[^-+\dA-Z]/g,
        pad = function (val, len) {
            val = String(val);
            len = len || 2;
            while (val.length < len) val = "0" + val;
            return val;
        };

    // Regexes and supporting functions are cached through closure
    return function (date, mask, utc) {
        var dF = dateFormat;

        // You can't provide utc if you skip other args (use the "UTC:" mask prefix)
        if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
            mask = date;
            date = undefined;
        }

        // Passing date through Date applies Date.parse, if necessary
        date = date ? new Date(date) : new Date;
        if (isNaN(date)) throw SyntaxError("invalid date");

        mask = String(dF.masks[mask] || mask || dF.masks["default"]);

        // Allow setting the utc argument via the mask
        if (mask.slice(0, 4) == "UTC:") {
            mask = mask.slice(4);
            utc = true;
        }

        var _ = utc ? "getUTC" : "get",
            d = date[_ + "Date"](),
            D = date[_ + "Day"](),
            m = date[_ + "Month"](),
            y = date[_ + "FullYear"](),
            H = date[_ + "Hours"](),
            M = date[_ + "Minutes"](),
            s = date[_ + "Seconds"](),
            L = date[_ + "Milliseconds"](),
            o = utc ? 0 : date.getTimezoneOffset(),
            flags = {
                d:    d,
                dd:   pad(d),
                ddd:  dF.i18n.dayNames[D],
                dddd: dF.i18n.dayNames[D + 7],
                m:    m + 1,
                mm:   pad(m + 1),
                mmm:  dF.i18n.monthNames[m],
                mmmm: dF.i18n.monthNames[m + 12],
                yy:   String(y).slice(2),
                yyyy: y,
                h:    H % 12 || 12,
                hh:   pad(H % 12 || 12),
                H:    H,
                HH:   pad(H),
                M:    M,
                MM:   pad(M),
                s:    s,
                ss:   pad(s),
                l:    pad(L, 3),
                L:    pad(L > 99 ? Math.round(L / 10) : L),
                t:    H < 12 ? "a"  : "p",
                tt:   H < 12 ? "am" : "pm",
                T:    H < 12 ? "A"  : "P",
                TT:   H < 12 ? "AM" : "PM",
                Z:    utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
                o:    (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
                S:    ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
            };

        return mask.replace(token, function ($0) {
            return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
        });
    };
}();

// Some common format strings
dateFormat.masks = {
    "default":      "ddd mmm dd yyyy HH:MM:ss",
    shortDate:      "m/d/yy",
    mediumDate:     "mmm d, yyyy",
    longDate:       "mmmm d, yyyy",
    fullDate:       "dddd, mmmm d, yyyy",
    shortTime:      "h:MM TT",
    mediumTime:     "h:MM:ss TT",
    longTime:       "h:MM:ss TT Z",
    isoDate:        "yyyy-mm-dd",
    isoTime:        "HH:MM:ss",
    isoDateTime:    "yyyy-mm-dd'T'HH:MM:ss",
    isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
};

// Internationalization strings
dateFormat.i18n = {
    dayNames: [
        "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
        "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
    ],
    monthNames: [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
        "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
    ]
};

// For convenience...
Date.prototype.format = function (mask, utc) {
    return dateFormat(this, mask, utc);
};
function initDatePicker(id) {
    return;
    try {
        if (isAndroid) {
            $(id).focus(function() {
                var options = {
                    date: new Date($(this).val()),
                    mode: 'date'
                };

                datePicker.show(options, function(date){
                    $(id).val(date);
                });
            });
        }
    } catch (ex) {
        //
        //not native
    }
}
function checkConnection() {
    if (navigator.connection) {
        var networkState = navigator.connection.type;

        var states = {};
        states[Connection.UNKNOWN]  = 'Unknown connection';
        states[Connection.ETHERNET] = 'Ethernet connection';
        states[Connection.WIFI]     = 'WiFi connection';
        states[Connection.CELL_2G]  = 'Cell 2G connection';
        states[Connection.CELL_3G]  = 'Cell 3G connection';
        states[Connection.CELL_4G]  = 'Cell 4G connection';
        states[Connection.CELL]     = 'Cell generic connection';
        states[Connection.NONE]     = 'No network connection';

        if (networkState === Connection.NONE ) return false;

    }
    return true;
}

Number.prototype.formatMoney = function(c, d, t){
    var n = this,
        c = isNaN(c = Math.abs(c)) ? 2 : c,
        d = d == undefined ? "." : d,
        t = t == undefined ? "," : t,
        s = n < 0 ? "-" : "",
        i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "",
        j = (j = i.length) > 3 ? j % 3 : 0;
    return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};

Number.prototype.formatMoneyVnd = function(c, d, t){
    var n = this,
        c = isNaN(c = Math.abs(c)) ? 2 : c,
        d = d == undefined ? "." : d,
        t = t == undefined ? "," : t,
        s = n < 0 ? "-" : "",
        i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "",
        j = (j = i.length) > 3 ? j % 3 : 0;
    return "VND " + s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};

var currentAccountIdx = 0;
function getCurrentAccount() {
    if (session.accounts !== undefined && session.accounts != null && session.accounts.length>0) {
        var acc = session.accounts[currentAccountIdx];
        var ca = {
            paymentInstrumentId: acc.paymentInstrumentId,
            currency: acc.currency,
            displayName: acc.alias
        };
        if (acc.sva != null) {
            ca.availableBalance = acc.sva.creditBalance - (acc.sva.debitBalance + acc.sva.debitReserved);
            ca.accountNumber = acc.msisdn;
            ca.accountType = "COMMON_SVA_ACCOUNT";
        } else if (acc.bankAccount != null) {
            ca.availableBalance = (acc.bankAccount.spareFields.spareInteger1 - acc.bankAccount.spareFields.spareInteger4);
            ca.displayName = acc.bankAccount.accountHolderName;
            ca.accountNumber = acc.bankAccount.accountNumber;
            ca.accountType = "COMMON_BANK_ACCOUNT";
        }
        ca.balance = ca.availableBalance.formatMoney(0);
        return ca;
    } else return {paymentInstrumentId:0, currency:"VND", displayName:"",balance:0};
}
function getNextAccount() {
    if (session.accounts !== undefined && session.accounts != null) {
        currentAccountIdx++;
        if (currentAccountIdx >= session.accounts.length)
            currentAccountIdx = 0;
        return getCurrentAccount();
    } else return null;
}
function getAccountDetails() {
    accDetails = [];
    for(var idx =0; idx<session.accounts.length;idx++) {
        accDetails[idx] = {id:idx,dayLimit:0,transactionLimit:0,paymentInstrumentId: session.accounts[idx].paymentInstrumentId}
        var acc = session.accounts[idx];
        if (acc.sva != null) {
            accDetails[idx].accountNumber = acc.msisdn;
            accDetails[idx].accountName = acc.alias;
            accDetails[idx].accountType = "COMMON_SVA_ACCOUNT";
            accDetails[idx].currency = acc.currency;
            accDetails[idx].availableBalance = acc.sva.creditBalance - (acc.sva.debitBalance + acc.sva.debitReserved);
        } else {
            accDetails[idx].accountNumber = acc.bankAccount.accountNumber;
            accDetails[idx].accountName = acc.bankAccount.accountHolderName;
            accDetails[idx].accountType = "COMMON_BANK_ACCOUNT";
            accDetails[idx].currency = acc.currency;
            accDetails[idx].availableBalance = (acc.bankAccount.spareFields.spareInteger1 - acc.bankAccount.spareFields.spareInteger4);
            accDetails[idx].bankAccountType = acc.bankAccount.type;
        }
        accDetails[idx].availableBalance = accDetails[idx].availableBalance.formatMoney(0);
        accDetails[idx].sample = false;
    }
    if (accDetails.length ==0)
        return [];
    return accDetails;

}
function getSameHolderBeneficiaryList() {
    //sample data
    if (session.customer == "")
        return [
        ];
    var accList = [];
    for(var idx =0; idx<session.accounts.length;idx++) {
        var acc = session.accounts[idx];
        accList[idx] = {
            id:idx
        };
        if (acc.sva != null) {
            accList[idx].accountNumber = acc.msisdn;
            accList[idx].name = acc.alias;
            accList[idx].type = "COMMON_SVA_SAME_HOLDER";
            accList[idx].availableBalance = acc.sva.creditBalance - (acc.sva.debitBalance + acc.sva.debitReserved);
            accList[idx].availableBalance = acc.sva.currency + " " + accList[idx].availableBalance.formatMoney(0);

        } else {
            accList[idx].accountNumber = acc.bankAccount.accountNumber;
            accList[idx].name = acc.bankAccount.accountHolderName;
            accList[idx].type = "COMMON_BANK_ACCOUNT_SAME_HOLDER";
            accList[idx].availableBalance = (acc.bankAccount.spareFields.spareInteger1 - acc.bankAccount.spareFields.spareInteger4);
            accList[idx].availableBalance = acc.bankAccount.currency + " " + accList[idx].availableBalance.formatMoney(0);
        }
//        accList[idx].availableBalance = accList[idx].availableBalance.formatMoney(0);
        accList[idx].mobile = accList[idx].accountNumber + " " + accList[idx].name;
        accList[idx].paymentInstrumentId = acc.paymentInstrumentId;
        if (session.user !== undefined && session.user.profile != null)
            accList[idx].image = session.user.profile.photo + "?type=normal";
    }

    return accList;
}
function getBeneficiaryList() {
    //sample data
    if (session.customer == "")
        return [];
    if (session.bankBeneficiaryList !== undefined) {
        //has preloaded data
        var benList = [];
        for(var idx in session.bankBeneficiaryList) {
            var ben = session.bankBeneficiaryList[idx];
            benList[idx] = {
                id:idx,
                accountNumber: ben.accountNumber,
                name:ben.benName,
                benId:ben.beneficiaryId,
                type:"COMMON_BANK_ACCOUNT",
                mobile: ben.accountNumber + " " + ben.benName
            };
        }
        return  benList;
    }
    return [];
}
function getWalletBeneficiaryList() {
    //sample data
    if (session.customer == "")
        return [];
    if (session.walletBeneficiaryList) {
        //has preloaded data
        var benList = [];
        for(var idx in session.walletBeneficiaryList) {
            var ben = session.walletBeneficiaryList[idx];
            benList[idx] = {
                id:idx,
                accountNumber: ben.accountNumber,
                name:ben.benName,
                benId:ben.beneficiaryId,
                type:"COMMON_SVA_ACCOUNT",
                mobile: ben.accountNumber + " " + ben.benName
            };
        }
        return  benList;
    }
    return [];
}
function lookupBenAccount(accountNumber) {
    var sameHolder = getSameHolderBeneficiaryList();
    var bankBen = getBeneficiaryList();
    var walletBen = getWalletBeneficiaryList();
    for(var idx in sameHolder) {
        if (sameHolder[idx].accountNumber == accountNumber) {
            return sameHolder[idx];
        }
    }
    for(var idx in bankBen) {
        if (bankBen[idx].accountNumber == accountNumber) {
            return bankBen[idx];
        }
    }
    for(var idx in walletBen) {
        if (walletBen[idx].accountNumber == accountNumber) {
            return walletBen[idx];
        }
    }
    return null;
}
function getAccountsWithCategory() {
    var accounts=[
        {
            mainAccountName: "COMMON_SVA_ACCOUNT",
            open:true,
            subAccounts:[]
        },
        {
            mainAccountName: "COMMON_BANK_ACCOUNT",
            open:true,
            subAccounts: []
        }
    ];

    for(var idx =0; idx<session.accounts.length;idx++) {
        var acc = session.accounts[idx];
        var subAcc = {accountIndex:idx};

        if (acc.sva != null) {
            subAcc.accountNumber = acc.msisdn;
            subAcc.accountName = acc.alias;
            subAcc.accountBalance = acc.sva.currency + " "  + (acc.sva.creditBalance  - (acc.sva.debitBalance + acc.sva.debitReserved)).formatMoney(0);
            subAcc.pushStatus = "false";
            accounts[0].subAccounts.push(subAcc);
        } else {
            subAcc.accountNumber = acc.bankAccount.accountNumber;
            subAcc.accountName = acc.bankAccount.accountHolderName;
            subAcc.pushStatus = "false";
            if (acc.bankAccount.spareFields != null)
                subAcc.accountBalance = acc.bankAccount.currency + " " + (acc.bankAccount.spareFields.spareInteger1 - acc.bankAccount.spareFields.spareInteger4).formatMoney(0);
            else
                subAcc.accountBalance = "VND 0";
            accounts[1].subAccounts.push(subAcc);
        }
    }
    if (accounts[1].subAccounts.length==0)
        accounts.splice(1,1);
    if (accounts[0].subAccounts.length==0)
        accounts.splice(0,1);
    console.log(accounts);
    return accounts;
}

function getAccountDetailsByIndex(idx) {
    var acc = session.accounts[idx];

    var account={
        "accountNumber":"",
        "availableBalance":"VND 6,000,000",
        "accountName":"Quey Le",
        "principleAmount":"VND 30,000,000",
        "interest":"VND 0",
        "openDate":"11/11/2001",
        "maturityDate":"11/11/2011"
    };
    if (acc.sva != null) {
        account.paymentInstrumentId = acc.paymentInstrumentId;
        account.accountNumber = acc.msisdn;
        account.availableBalance = acc.sva.currency + " " + (acc.sva.creditBalance - (acc.sva.debitBalance + acc.sva.debitReserved)).formatMoney(0);
        account.accountName = acc.alias;
    } else {
        account.paymentInstrumentId = acc.paymentInstrumentId;
        account.accountNumber = acc.bankAccount.accountNumber;
        account.availableBalance = acc.bankAccount.currency + " " + (acc.bankAccount.spareFields.spareInteger1 - acc.bankAccount.spareFields.spareInteger4).formatMoney(0);
        account.accountName = acc.bankAccount.accountHolderName;
    }
    return account;
}
function capitaliseFirstLetter(string)
{
    return string.charAt(0).toUpperCase() + string.slice(1);
}
function toFullLink(linkcode) {
    return "https://m.techcombank.com.vn/fastalink/" + linkcode;
}
function addDate(dateObject, numDays) {
    dateObject.setDate(dateObject.getDate() + numDays);
    return dateObject;
}
function isLinkedWith(social) {
    if (session.user !== undefined && session.user != null && session.user.socials != null) {
        for(var idx in session.user.socials.social) {
            if (session.user.socials.social[idx]["$"] == social && session.user.socials.social[idx].invalid != true)
                return true;
        }
    }
    return false;
}
if (!String.prototype.startsWith) {
    Object.defineProperty(String.prototype, 'startsWith', {
        enumerable: false,
        configurable: false,
        writable: false,
        value: function (searchString, position) {
            position = position || 0;
            return this.lastIndexOf(searchString, position) === position;
        }
    });
}
var socialTransactionTimeoutHandler;
function cacheSocialTransations() {
    stopSocialTransationsTimeout();
    session.cachedSocialTrasactions = true;
    socialTransactionTimeoutHandler = setTimeout(socialTransactionsTimeout,180000);
}
function stopSocialTransationsTimeout() {
    try {
        clearTimeout(socialTransactionTimeoutHandler);
    } catch (ex) {

    }
}
function socialTransactionsTimeout() {
    session.cachedSocialTrasactions = false;
}
function handleOpenURL(url) {
    console.log("received url: " + url);
    var linkCode = url.replace("tcb://","");
    if (linkCode.length ==  10) {
        session.newLinkIsOpen = true;
        session.newLinkCode = linkCode;
        showNewLink();

    }
}
function getMessage(key) {
    return angular.element("#app-container").injector().get("$filter")("translate")(key);
}
function showNewLink() {
    if (session.newLinkIsOpen) {
        if (session.customer.id)
            mc.getLinkDetails(getLinkDetailsBack,session.newLinkCode);
    }
    function getLinkDetailsBack(r) {
        //
        if (r.Status.code == "0") {
            var linkDetails = JSON.parse(r.jsonString).link;
            console.log(linkDetails);
            if (linkDetails.status == "sent") {
                if (linkDetails.recipient[0].wuid == session.customer.id) {
                    session.newLinkIsOpen = false;
                    Confirm(getMessage("YOU_HAVE_RECEIVED_A_NEW_TRANSACTION"),openTransaction);
                    linkDetails.status = "Pending";
                    session.newLinkDetails = linkDetails;
                } else {
                    if (linkDetails.otherData[0].data.value != "mobile") {
                        var message1 = getMessage("YOU_HAVE_RECEIVED_A_LINK_VIA");
                        var message2 = getMessage("DO_YOU_WANT_YOUR_ACCOUNT_TO_ASSOCIATED_TO");

                        var socialNetwork=linkDetails.otherData[0].data.value;

                        session.newLinkIsOpen = false;
                        linkDetails.status = "Pending";
                        session.newLinkDetails = linkDetails;

                        session.socialNetwork=socialNetwork;
                        session.validSocialRecipient=false;

                        if(linkDetails.recipient[0].socials.social.length){
                            for(var idx in linkDetails.recipient[0].socials.social){
                                if (linkDetails.recipient[0].socials.social[idx]["$"] == socialNetwork){
                                    session.linkSocialRecipient=linkDetails.recipient[0].socials.social[idx]["id"];
                                }
                            }
                        }

                        var social = "Facebook";
                        if (linkDetails.otherData[0].data.value != "fb")
                            social = "Google Plus";
                        var message = message1 + " " + social + ". " + message2 + " " + social + "?";

                        //var particulars = angular.element("#app-container").injector().get("SocialFactory").getParticulars();
                        //particulars.prevState = "dashboard.home";
                        //angular.element("#app-container").injector().get("SocialFactory").setParticulars(particulars);

                        Confirm(message,function() {
                            //angular.element("#app-container").injector().get("$state").transitionTo("dashboard.socialconnect");
                            mc.getSocialUrl(socialUrlBack, socialNetwork, successUrl, errorUrl);
                        });
                    }
                }
            }
        }
    }

    function openTransaction() {
        angular.element("#app-container").injector().get("$state").transitionTo("receivepage");
    }

    function clearSuccess() {

    }

    function clearError() {

    }

    function clearCookie() {
        if (isAndroid && window.cookies.clearExcept) {
            window.cookies.clearExcept(clearSuccess, clearError, mc.url);
        } else {
            if(window.cookies && !isAndroid) {
                window.cookies.clear(clearSuccess);
            }
        }
    }

    function socialUrlBack(r) {
        var scope=angular.element("#app-container").scope();
        if (r.Status.code == "0") {
            var data = JSON.parse(r.jsonString);
            if (isAndroid || isiOsDevice) {
                clearCookie();
                if (data.url.indexOf("facebook")>=0) {
                    data.url = data.url.replace("www.facebook.com","m.facebook.com");
                }
                var ref = window.open(data.url, '_blank', 'location=yes');
                scope.closeByUser = true;
                ref.addEventListener('exit', function(event) {

                    if (scope.closeByUser) {
                        mc.getUserDetails(getUserDetailBack);
                        mc.getFavoriteFriends(getFavoriteFriendBack);
                    }
                });
                ref.addEventListener('loadstart', function(event) {
                    if (event.url.indexOf( successUrl) == 0) {
                        scope.closeByUser = false;
                        ref.close();

                        //update user details
                        MessageBox(getMessage("SOCIAL_CONNECT_ACCOUNT_ASSOCIATED_SUCCESSFULLY"));
                        mc.getUserDetails(getUserDetailBack);
                        mc.getFavoriteFriends(getFavoriteFriendBack);
                    } else {
                        //Fail
                        if (event.url.indexOf(errorUrl)==0) {
                            scope.closeByUser = false;
                            ref.close();
                            if(event.url.indexOf("error_code=0x0103")!=-1){
                                MessageBox(getMessage("SOCIAL_CONNECT_USER_DENIED_PERMISSIONS"));
                            }else{
                                MessageBox(getMessage("SOCIAL_CONNECT_THIS_SOCIAL_IS_ALREADY_REGISTERED_TO_ANOTHER_ACCOUNT"));
                            }

                            scope.loading = false;
                            scope.$apply();
                        }
                    }
                });
            } else {
                scope.loading = false;
                scope.$apply();
                window.open(data.url);
            }
        } else {
            scope.loading = false;
            scope.$apply();
            ErrorBox(r.Status);
        }
    }

    function getUserDetailBack(r) {
        var scope=angular.element("#app-container").scope();
        session.cachedSocialTrasactions = false;
        if (r.Status.code == "0") {
            var userSocials = JSON.parse(r.jsonString);
            if (userSocials.user !== undefined && userSocials.user != null) {
                var previousProfile = angular.extend({},session.user.profile);
                var socialProfile = userSocials.user.profile;
                session.user = angular.extend({}, userSocials.user);
                session.user.profile = previousProfile;

                if (!localStorage.getItem(Sha256.hash("" +session.customer.id) + "profilePicture") && socialProfile && socialProfile.photo ) {
                    if (socialProfile.photo) {
                        session.user.profile.photo = socialProfile.photo + "?type=normal";
                    }
                    else {
                        session.user.profile.photo = "images/profile-placeholder.png";
                    }
                }

                var socials=userSocials.user.socials.social;

                for(var idx in socials){
                    if (socials[idx]["$"] == session.socialNetwork&&socials[idx]["id"]==session.linkSocialRecipient){
                        session.validSocialRecipient=true;
                    }
                }

                scope.$apply();
                mc.getFriends(getFriendBack);
            }
        } else {
            ErrorBox(r.Status);
            scope.loading = false;
            scope.$apply();
        }
    }

    function getFriendBack(r) {
        var scope=angular.element("#app-container").scope();
        scope.loading = false;
        scope.$apply();
        if (r.Status.code == "0") {
            var data = JSON.parse(r.jsonString);
            if (data.friend != null && data.friend.length ===undefined)
                data.friend = [data.friend];
            session.friends = data.friend;
            for(var i in session.friends) {
                var underscorePos = session.friends[i].id.indexOf("_");
                var type = session.friends[i].id.substr(0,underscorePos);
                if (type == "google")
                    type = "gplus";
                session.friends[i].type = type;
            }
        }
    }

    function getFavoriteFriendBack(r) {
        if (r.Status.code == "0") {
            var data = JSON.parse(r.jsonString);
            if (data.friend != null && data.friend.length === undefined)
                data.friend = [data.friend];

            for(var ii = data.friend.length-1; ii >=0 ; ii--) {
                //console.log(ii);
                if (data.friend[ii] === undefined) {
                    data.friend.splice(ii,1);
                    continue;
                }
                var underscorePos = data.friend[ii].id.indexOf("_");
                var type = data.friend[ii].id.substr(0,underscorePos);
                if (type == "google")
                    type = "gplus";
                data.friend[ii].type = type;
                if(data.friend[ii].profile == null && type != "mobile") {
                    data.friend.splice(ii,1);
                    continue;
                }

            }
            session.favoriteFriends = data.friend;
            for(var idx in session.favoriteFriends) {
                if (session.favoriteFriends[idx].socials!= null) {
                    if (session.favoriteFriends[idx].type == "mobile" && !session.favoriteFriends[idx].profile) {
                        session.favoriteFriends[idx].profile = {name:session.favoriteFriends[idx].socials.social["@id"],photo:"images/profile-placeholder.png"};
                    }
                }
            }

            if(session.validSocialRecipient){
                angular.element("#app-container").injector().get("$state").transitionTo("receivepage");
            }
        }
    }
}

function getExternalBeneficiaryList() {
    //sample data
    if (session.customer == "")
        return [];
    if (session.externalBeneficiaryList) {
        //has preloaded data
        var benList = [];
        for(var idx in session.externalBeneficiaryList) {
            var ben = session.externalBeneficiaryList[idx];
            benList[idx] = {
                id:idx,
                accountNumber: ben.accountNumber,
                name:ben.benName,
                benId:ben.beneficiaryId,
                type:"COMMON_EXTERNAL_ACCOUNT",
                mobile: ben.accountNumber + " " + ben.benName,
                bankCode:ben.bankCode,
                bankName:ben.bankName,
                branchCode:ben.branchCode,
                branchName:ben.branchName,
                branchLocation:ben.branchLocation
            };
        }
        return  benList;
    }
    return [];
}

function updateBalance() {
    mc.getWallets(updateBalanceBack, session.customer.id, 0);
}

function updateBalanceBack(data) {
    if (data.Status.code == "0") {
        if (data.walletEntries.length >0) {
            session.accounts = data.walletEntries;
            console.log("updateBalanceBack -- currentAccountIdx == ", currentAccountIdx);
            console.log("session.accounts == ", session.accounts);
            for(var idx in session.accounts) {
                if (session.accounts[idx].sva != null) {
                    session.accounts[idx].msisdn = session.msisdn;
                    session.accounts[idx].currency = session.accounts[idx].sva.currency;
                } else if (session.accounts[idx].bankAccount != null) {
                    session.accounts[idx].msisdn = session.accounts[idx].bankAccount.accountNumber;
                    session.accounts[idx].currency = session.accounts[idx].bankAccount.currency;

                }
            }
        }
    }
}

function filterSalaryAccount(account) {
    if(account.bankAccountType != undefined && account.bankAccountType == TYPE_ACCOUNT_SALARY) {
        return false;
    } else
        return true;
}

function filterForeignAccount(account) {
    if (account.bankAccountType != undefined && account.bankAccountType == TYPE_ACCOUNT_FOREIGN) {
        return false;
    } else
        return true;
}

/*
 * Get value by key in unstructured data given in Mobiliser response
 */
function getUnstructuredDataValue(list,key) {
    for(var i = 0; i < list.length; i++) {
        var object = list[i];
        if(object.Key === key) {
            return object.Value;
        }
    }
    return undefined;
}