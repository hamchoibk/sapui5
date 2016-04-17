/*****************************************************************************\

 Javascript "Service Client" library - JSON only

 @version: 0.2 - 2012.07.25
 @author: Daniel

\*****************************************************************************/

/*****************************************************************************
 * JSON Client
 */
smartphoneService = {
        user : null,
        pass : null,
        url : null,
        request : null,

        createXmlHttpRequest : function () {
            if (window.XMLHttpRequest) {
                return new XMLHttpRequest();
            } else if (window.ActiveXObject) {
                return new ActiveXObject("Microsoft.XMLHTTP");
            } else {
                throw "XMLHttpRequest not available";
            }
        },

        /*  Prototype JavaScript framework, version 1.5.1_rc2
         *  (c) 2005-2007 Sam Stephenson
         *
         *  Prototype is freely distributable under the terms of an MIT-style license.
         *  For details, see the Prototype web site: http://www.prototypejs.org/
         *
         *--------------------------------------------------------------------------*/
        toJSON: function(object) {
            var type = typeof object;
            switch (type) {
            case 'undefined':
            case 'function':
            case 'unknown': return;
            case 'object': break;
            default: return '"' + object.toString() + '"';
            }
            if (object === null) {
                return 'null';
            }
            if (object.ownerDocument === document) {
                return;
            }

            var results = [];
            if (object.length) { //array
                for (var i=0; i<object.length; i++) {
                    var value = this.toJSON(object[i]);
                    if (value !== undefined)
                        results.push(value);
                }
                return '[' + results.join(',') + ']';
            } else { //object
                for (var property in object) {
                    var value = this.toJSON(object[property]);
                    if (value !== undefined) {
                        property = (property.split('_')[0] == "pseudo") ? '@'+property.split('_')[1] : property;
                        results.push('"' + property + '"' + ':' + value);
                    }
                }
                return '{' + results.join(',') + '}';
            }
        },

        post : function(obj, methodName, func, requestCookie) {
            if (gui_version) {
                // get local example data for demo
                if (methodName == "getLookups")
                    methodName = methodName + "_" + obj.entityName;
                $.ajax({ url: rootUrl + "/pages/demoData/" + methodName + ".json", cache: false, async: true, dataType: "json"})
                .done(function(data) {
                    func(data); 
                });
            } else {
                // xmlhttprequest
                if (!checkConnection()) {
                    mc.network_access = false;
                    func({Status:{code: 20001,value: "Không có kết nối Internet" + "|" + "No network connection" }});
                    return false;
                } else
                    mc.network_access = true;
                if (session.customer.id) {
                    //
                    var currentTime = (new Date()).getTime();
                    if (session.lastAPIcall) {
                        var timeDiffer = currentTime - session.lastAPIcall;
                        if (timeDiffer >= MAX_SESSION_TIME) {
                            //Expired Session
                            //console.log("Timeout");
                            //session.customer.id = null;
                            sessionTimeOut();
                            return;
                        } else {
                            session.lastAPIcall = currentTime;
                        }
                    } else {
                        session.lastAPIcall = currentTime;
                    }
                }
                var req = this.createXmlHttpRequest();
                this.request = req;
                
                // timeout window for xmlhttprequest calls
                //console.log(MAX_TRANSACTION_TIME);
                //startAppTimer(MAX_TRANSACTION_TIME);
                
                req.onreadystatechange = function() {
                    if (req.readyState == 4) {            
                        if (req.status == 200) {
                            stopAppTimer();
                            //resetSessionTimer();
                            //hideProgress();
                            //console.log(req.responseText);
                            resetSessionTimer();
                            rememberMe = req.getResponseHeader("Set-Cookie");
                            if (rememberMe)
                                if (rememberMe.indexOf("REMEMBER")>0)
                                    session.rememberMe = rememberMe;
                            console.log(eval('('+ req.responseText +')'));
							func(eval('('+ req.responseText +')'));
							
                        } else {
                            resetSessionTimer();
                            //stopAppTimer();
                        
                            /*ServiceErrorMessage(methodName, req.status, req.statusText);
                            throw "Error:"+req.status+":"+req.statusText;*/
                            //console.log(req.status, req.statusText);
                            if (req.status != "0") //not timeout
                            {
                                if (req.status == "401") {
                                    //it should be session is expired. relogin
                                    sessionTimeOut();
                                } else 
                                func({Status:{code: parseInt(req.status) + 20000,value:req.statusText + "|" + req.statusText}});
                                
                            }
                            else
                                func({Status:{code: parseInt(req.status) + 20000,value:"CONNECTION_OFFLINE_OR_TIMEOUT|CONNECTION_OFFLINE_OR_TIMEOUT"}});
                                
                        }
                    }                };
                try {
                    req.open("POST", this.url+"/"+methodName, true);
                    req.timeout = MAX_TRANSACTION_TIME;
                    
                    req.setRequestHeader("Content-Type", "application/json");
                    req.setRequestHeader("Accept", "application/json");
                    if (!(session.rememberMe === undefined)) {
                        req.setRequestHeader("Access-Control-Allow-Credentials","true");
                        req.setRequestHeader("Cookie", session.rememberMe);
                    }

                    req.send(this.toJSON(obj));

                    console.log(methodName ,obj);
                } catch (ex) {
                    console.log(ex);
                }
            }
        },

        postData : function(data, url, func) {
            if (gui_version) {
            } else {
                // xmlhttprequest
                if (!checkConnection()) {
                    mc.network_access = false;
                    return false;
                } else
                    mc.network_access = true;

                var req = this.createXmlHttpRequest();
                this.request = req;
                
                // timeout window for xmlhttprequest calls
                startAppTimer(MAX_TRANSACTION_TIME);
                
                req.onreadystatechange = function() {
                    if (req.readyState == 4) {
                        stopAppTimer();
                        if (req.status == 200) {
                            resetSessionTimer();
                            func(eval('('+req.responseText+')'));
                        } else {
                            hideProgress();
                            ServiceErrorMessage("Post Data", req.status, req.statusText);
                            throw "Error:"+req.status+":"+req.statusText;
                        }
                    }
                };

                req.open("POST", this.urlWithoutWS + url, true);
                req.send(data);
            }
        },

        abort: function() {
            this.request.abort();
        }
};

/******************************************************************************
 util functions
 */
var Base64 = {

    // private property
    _keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

    // public method for encoding
    encode : function (input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;

        input = Base64._utf8_encode(input);

        while (i < input.length) {

            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }

            output = output +
            this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
            this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

        }

        return output;
    },

    // private method for UTF-8 encoding
    _utf8_encode : function (string) {
        string = string.replace(/\r\n/g,"\n");
        var utftext = "";

        for (var n = 0; n < string.length; n++) {

            var c = string.charCodeAt(n);

            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }

        return utftext;
    }

};

UUIDv4 = function b(a){return a?(a^Math.random()*16>>a/4).toString(16):([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,b)};


function ServiceErrorMessage(method, errStatus, errText) {
    MessageBox("Service error! " + errStatus + "\n Reason: "+ errText);
    setTimeout(function() { $.mobile.changePage($("#login"), {transition: "none", changeHash: false})},3000);
}

// TODO : redesign ? event handler to check for this ?

function checkConnectionStatus() {
    if (checkConnection() == true) {
        MessageBox("No Internet connectivity");
        return false;
    } else
        return true;
}