var divIdLanguage=null;

var functionError=[];
var lengthError=-1;

var app = {
    // Application Constructor
initialize: function() {
    this.bindEvents();
},
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
bindEvents: function() {
    document.addEventListener('deviceready', this.onDeviceReady, false);
},
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
onDeviceReady: function() {	
    app.receivedEvent('deviceready');   
    
},
    // Update DOM on a Received Event
receivedEvent: function(id) {
	app.callbackFunctionError();
},
backFunction:function(){
	window.history.back();
},
callbackFunctionError:function(){
	if(lengthError!=-1){
//		alert(functionError.length);
		for(i=0;i<functionError.length;i++){
//			alert(i);
			functionError[i]();
		}
		lengthError=-1;
		functionError=[];
	}
}
};

/////////////////////////////////////
//Tambahin : 
/////////////////////////////////////

////////////////
//START
////////////
if (JSON && JSON.stringify && JSON.parse) {
	var Session = Session || (function() {

		  // window object
		  var win = window.top || window;
		  
		  // session store
		  var store = (win.name ? JSON.parse(win.name) : {});
		  
		  // save store on page unload
		  function Save() {
		      win.name = JSON.stringify(store);
		  };
		  
		  // page unload event
		  if (window.addEventListener) window.addEventListener("unload", Save, false);
		  else if (window.attachEvent) window.attachEvent("onunload", Save);
		  else window.onunload = Save;

		  // public methods
		  return {
		  
		      // set a session variable
		      setItem: function(name, value) {
		          store[name] = value;
		      },
		      
		      // get a session value
		      getItem: function(name) {
		          return (store[name] ? store[name] : undefined);
		      },// get a session value
		      removeItem: function(name) {
		         delete store[name] ;
		      },
		      
		      // clear session
		      clear: function() { store = {}; },
		      
		      // dump session data
		      dump: function() { return JSON.stringify(store); }

		  };

		})();
	
	}


////////////////
//END
////////////


function repl(test){
    var bf = '';
    for(var a=0;a<test.length;a++){
        if(test[a]=='\"')bf+='&#34;';
        else bf+=test[a];
    }
    return bf;
}

function convertObjToStr(cd){
    return repl(JSON.stringify(cd));
}

function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

function processLanguages(){    
//    alert('run processLanguagesAndroid()');
    
    var elements = document.getElementsByTagName("language");
    var arr = new Array();
    var j=0;
    for(i in elements){
        if(isNumber(i)){
            arr[i] = elements[i].getAttribute("key");
	        j=i;
        }
    }
    var elementOptions = document.getElementsByTagName("option");
    for(i in elementOptions){
        if(isNumber(i)){
        	 var value = elementOptions[i].getAttribute("language");
             if(value!=null){
     	         ++j;
                 arr[j]=value;
             }
        }
    }
    
    var elementInputs = document.getElementsByTagName("input");
    for(ii in elementInputs){
        if(isNumber(ii) && elementInputs[ii].hasAttribute("placeholderKey")){
            var value = elementInputs[ii].getAttribute("placeholderKey");
            if(value!=null){
    	        ++j;
                arr[j]=value;
            }
        }
    }
    
    var elementTextAreas= document.getElementsByTagName("textarea");
    for(ii in elementTextAreas){
        if(isNumber(ii) && elementTextAreas[ii].hasAttribute("placeholderKey")){
            var value = elementTextAreas[ii].getAttribute("placeholderKey");
            if(value!=null){
    	        ++j;
                arr[j]=value;
            }
        }
    }
    
    translate({string: arr},'');
//    if (!checkSupportDate()) {
		datePicker();
//	}
    //checkVersion("changeTransition");
}

function processLanguagesDiv(divId){
	var elements = document.getElementById(divId).getElementsByTagName("language");
    var arr = new Array();
    var j=0;
    for(i in elements){
        if(isNumber(i)){
            arr[i] = elements[i].getAttribute("key");
	        j=i;
        }
    }
    var elementOptions = document.getElementById(divId).getElementsByTagName("option");
    for(i in elementOptions){
        if(isNumber(i) && elementOptions[i].hasAttribute("language")){
        	 var value = elementOptions[i].getAttribute("language");
             if(value!=null){
                 ++j;
                 arr[j]=value;
             }
        }
    }
    var elementInputs = document.getElementById(divId).getElementsByTagName("input");
    for(ii in elementInputs){
        if(isNumber(ii) && elementInputs[ii].hasAttribute("placeholderKey")){
            var value = elementInputs[ii].getAttribute("placeholderKey");
            if(value!=null){
            	++j;
                arr[j]=value;            	
            }
                
        }
    }
    
    var elementTextAreas= document.getElementById(divId).getElementsByTagName("textarea");
    for(ii in elementTextAreas){
        if(isNumber(ii) && elementTextAreas[ii].hasAttribute("placeholderKey")){
            var value = elementTextAreas[ii].getAttribute("placeholderKey");
            if(value!=null){
    	        ++j;
                arr[j]=value;
            }
        }
    }
    
    translate({string: arr},divId);
//    if (!checkSupportDate()) {
//		datePicker();
//	}
}


function checkSupportDate() { 
	var el = document.createElement('input'), notADateValue = 'not-a-date'; 
	el.setAttribute('type','date'); 
	el.setAttribute('value', notADateValue); 
	return !(el.value === notADateValue); 
}

function datePicker(){
	try { 
		var elements = document.getElementsByTagName("input");
		if(elements!=null){
		    for(i in elements){
		        if(elements[i].getAttribute("type")=="date"){
		        	var id=elements[i].getAttribute("id");
		        	//var value=document.getElementById(id).value;
		        	//alert(id);
		            //elements[i].parentNode.setAttribute("onclick","dateNative('"+id+"');");
					var div = document.createElement('div');
		        	div.setAttribute("onclick","dateNative('"+id+"',document.getElementById('"+id+"').value);");
		        	div.setAttribute("style","width: 100%; height: 100%; position: absolute; left: 0px; top: 0px; z-index: 9999;");
		            elements[i].parentNode.appendChild(div);
		            elements[i].setAttribute("disabled","disabled");
		        }
		    }
		}
	}catch(err) {
		console.log(err);
    }
}

function changeTransition(){
	var elements=document.getElementsByTagName("a");
	for(i in elements){
		elements[i].setAttribute("data-transition","none");
	}
}

function checkVersion(callback){
	try{
		NativeClass.nativeFunctionCheckVersion([callback],function(result) {alert("Success : \r\n"+result);},
	            function(error) {alert("Error : \r\n"+error);});
	}catch(e){
		lengthError++;
		functionError[lengthError]=function(){
			NativeClass.nativeFunctionCheckVersion([callback],function(result) {alert("Success : \r\n"+result);},
		            function(error) {alert("Error : \r\n"+error);});	
		}
	}
	
}

function getVersionApp(callback){
	try{
		NativeClass.nativeFunctionGetVersionApp([callback],function(result) {alert("Success : \r\n"+result);},
	            function(error) {alert("Error : \r\n"+error);});
	}catch(e){
		lengthError++;
		functionError[lengthError]=function(){
			NativeClass.nativeFunctionGetVersionApp([callback],function(result) {alert("Success : \r\n"+result);},
		            function(error) {alert("Error : \r\n"+error);});	
		}
	}
	
}

function startInterceptSMS(no, pattern, callback){
	try{
		NativeClass.nativeFunctionStartInterceptSMS([no, pattern, callback],function(result) {alert("Success : \r\n"+result);},
	            function(error) {alert("Error : \r\n"+error);});
	}catch(e){
		lengthError++;
		functionError[lengthError]=function(){
			NativeClass.nativeFunctionStartInterceptSMS([no, pattern, callback],function(result) {alert("Success : \r\n"+result);},
		            function(error) {alert("Error : \r\n"+error);});
		}
	}
}

function updateURL(var1){
	try{
		NativeClass.nativeFunctionUpdateURL([var1],function(result) {alert("Success : \r\n"+result);},
				function(error) {alert("Error : \r\n"+error);});
	}catch(e){
		lengthError++;
		NativeClass.nativeFunctionUpdateURL([var1],function(result) {alert("Success : \r\n"+result);},
				function(error) {alert("Error : \r\n"+error);});
	}
}

//ActivateToken
function activateToken(pin1,pin2,act,callback) {
	try{
	     NativeClass.nativeFunctionActivateToken([pin1, pin2, act, callback],function(result) {alert("Success : \r\n"+result);},
	             function(error) {alert("Error : \r\n"+error);});
	}catch(e){
		lengthError++;
		functionError[lengthError]=function(){
		     NativeClass.nativeFunctionActivateToken([pin1, pin2, act, callback],function(result) {alert("Success : \r\n"+result);},
		             function(error) {alert("Error : \r\n"+error);});
		}
	}
}

//ActivateToken2
function activateToken2(newPin,newPinConfirm,act,oldPin,service, callback) {
	try{
		NativeClass.nativeFunctionActivateToken2([newPin,newPinConfirm,act,oldPin,service, callback],function(result) {alert("Success : \r\n"+result);},
	             function(error) {alert("Error : \r\n"+error);});
	}catch(e){
		lengthError++;
		functionError[lengthError]=function(){
			NativeClass.nativeFunctionActivateToken2([newPin,newPinConfirm,act,oldPin,service, callback],function(result) {alert("Success : \r\n"+result);},
		             function(error) {alert("Error : \r\n"+error);});
		}
	}
     
}

//GoToView
function goToView(var1){
	try{
	    NativeClass.nativeFunctionGoToView([var1],function(result) {alert("Success : \r\n"+result);},
	                               function(error) {alert("Error : \r\n"+error);});
	}catch(e){
		lengthError++;
		functionError[lengthError]=function(){
		    NativeClass.nativeFunctionGoToView([var1],function(result) {alert("Success : \r\n"+result);},
		                               function(error) {alert("Error : \r\n"+error);});
		}
	}
};

//GoToNewView
function goToNewView(var1){
	try{
	    NativeClass.nativeFunctionGoToNewView([var1],function(result) {alert("Success : \r\n"+result);},
                function(error) {alert("Error : \r\n"+error);});
	}catch(e){
		lengthError++;
		functionError[lengthError]=function(){
		    NativeClass.nativeFunctionGoToNewView([var1],function(result) {alert("Success : \r\n"+result);},
                    function(error) {alert("Error : \r\n"+error);});			
		}
	}
}

//Login
function login(var1){
	try{
	    NativeClass.nativeFunctionLogin([var1],function(result) {alert("Success : \r\n"+result);},
                function(error) {alert("Error : \r\n"+error);});
	}catch(e){
		lengthError++;
		functionError[lengthError]=function(){
		    NativeClass.nativeFunctionLogin([var1],function(result) {alert("Success : \r\n"+result);},
                    function(error) {alert("Error : \r\n"+error);});
			
		}
	}
}

//Language
function translate(var1,var2){
	try{
	    NativeClass.nativeFunctionTranslate([var1,var2],function(result) {alert("Success : \r\n"+result);},
                function(error) {alert("Error : \r\n"+error);});
	}catch(e){
		lengthError++;
		functionError[lengthError]=function(){
		    NativeClass.nativeFunctionTranslate([var1,var2],function(result) {alert("Success : \r\n"+result);},
                    function(error) {alert("Error : \r\n"+error);});
			
		}
	}
}


//BackToView
function backToView(){
	try{
	    NativeClass.nativeFunctionBackToView([null],function(result) {alert("Success : \r\n"+result);},
                function(error) {alert("Error : \r\n"+error);});
	}catch(e){
		lengthError++;
		functionError[lengthError]=function(){
		    NativeClass.nativeFunctionBackToView([null],function(result) {alert("Success : \r\n"+result);},
                    function(error) {alert("Error : \r\n"+error);});
			
		}
	}
}

//InvokeService
function invokeService(action,callback,cancel){
	try{
	    NativeClass.nativeFunctionInvokeService([action,callback,cancel],function(result) {alert("Success : \r\n"+result);},
                function(error) {alert("Error : \r\n"+error);});
	}catch(e){
		lengthError++;
		functionError[lengthError]=function(){
		    NativeClass.nativeFunctionInvokeService([action,callback,cancel],function(result) {alert("Success : \r\n"+result);},
		                                            function(error) {alert("Error : \r\n"+error);});
		}
	}
}

function invokeKeyboard(flag, callbackSuccess){
    try{
        NativeClass.nativeFunctionKeyboard([flag],callbackSuccess,
            function(error) {alert("Error : \r\n"+error);});
    }catch(e){
        lengthError++;
        functionError[lengthError]=function(){
            NativeClass.nativeFunctionKeyboard([flag],callbackSuccess,
                function(error) {alert("Error : \r\n"+error);});
        }
    }
}

function invokeTrackingAnalytics(event) {
	try{
        NativeClass.nativeFunctionTrackingAnalytics([event], 
        		function(result) {
        			alert("Success: \r\n" + result);
        		},
        		function(error) {
        			alert("Error : \r\n"+error);
        		}
        );
    }catch(e){
        lengthError++;
        functionError[lengthError]=function(){
            NativeClass.nativeFunctionTrackingAnalytics([event],
            		function(result) {
            			alert("Success: \r\n" + result);
            		},
            		function(error) {
            			alert("Error : \r\n"+error);
            		}	
            );
        }
    }
}

//AnimatePush
function animatePush(){
	try{NativeClass.nativeFunctionAnimatePush([null],function(result) {alert("Success : \r\n"+result);},
            function(error) {alert("Error : \r\n"+error);});
	}catch(e){
		lengthError++;
		functionError[lengthError]=function(){
			NativeClass.nativeFunctionAnimatePush([null],function(result) {alert("Success : \r\n"+result);},
                    function(error) {alert("Error : \r\n"+error);});
		}
	}
    
}

//GoToHTML
function goToHTML(var1){
	try{
		NativeClass.nativeFunctionGoToHTML([var1],function(result) {alert("Success : \r\n"+result);},
            function(error) {alert("Error : \r\n"+error);});
	}catch(e){
		lengthError++;
		functionError[lengthError]=function(){
			NativeClass.nativeFunctionGoToHTML([var1],function(result) {alert("Success : \r\n"+result);},
                    function(error) {alert("Error : \r\n"+error);});
		}
	}
    
}

//BackToHTML
function backToHTML(){
	try{
	    NativeClass.nativeFunctionBackToHTML([null],function(result) {alert("Success : \r\n"+result);},
                function(error) {alert("Error : \r\n"+error);});
	}catch(e){
		lengthError++;
		functionError[lengthError]=function(){
		    NativeClass.nativeFunctionBackToHTML([null],function(result) {alert("Success : \r\n"+result);},
		                                         function(error) {alert("Error : \r\n"+error);});		}
	}
}

//SetContentData
function setContentData(var1,var2){
	try{
		NativeClass.nativeFunctionSetContentData([var1,var2],function(result) {alert("Success : \r\n"+result);},
                function(error) {alert("Error : \r\n"+error);});
	}catch(e){
		lengthError++;
		functionError[lengthError]=function(){
			NativeClass.nativeFunctionSetContentData([var1,var2],function(result) {alert("Success : \r\n"+result);},
	                function(error) {alert("Error : \r\n"+error);});
		}
	}
    
}

//ResponseChallenge
function responseChallenge(pin,challenge, callback)
{
    try{
    	NativeClass.nativeFunctionResponseChalenge([pin, challenge, callback],function(result) {alert("Success : \r\n"+result);},
                function(error) {alert("Error : \r\n"+error);});
	}catch(e){
		lengthError++;
		functionError[lengthError]=function(){
			NativeClass.nativeFunctionResponseChalenge([pin, challenge, callback],function(result) {alert("Success : \r\n"+result);},
		             function(error) {alert("Error : \r\n"+error);});
		}
	}
}

//ManageNotification
function manageNotification(jsonObject, callback)
{
    try{
    	NativeClass.nativeFunctionManageNotification([jsonObject, callback],function(result) {alert("Success : \r\n"+result);},
                function(error) {alert("Error : \r\n"+error);});
	}catch(e){
		lengthError++;
		functionError[lengthError]=function(){
			NativeClass.nativeFunctionManageNotification([jsonObject, callback],function(result) {alert("Success : \r\n"+result);},
	                function(error) {alert("Error : \r\n"+error);});
		}
	}
}

function dateNative(id,value){	
	try{
		NativeClass.nativeFunctionDateNative(
				[value],
				function(result) {		
				document.getElementById(id).value=result;
				},
		        function(error) {alert("Error : \r\n"+error);});
	}catch(e){
		lengthError++;
		functionError[lengthError]=function(){
			NativeClass.nativeFunctionDateNative(
					[value],
					function(result) {		
					document.getElementById(id).value=result;
					},
			        function(error) {alert("Error : \r\n"+error);});
		}
	}
}

function getContentData(var1) {
    var var2;
   
    try {
        var2 = JSON.parse(Session.getItem(var1));
    } catch (err) {
        var2 = Session.getItem(var1);
    }finally{
    //	Session.removeItem(var1);
    }
    
    return var2;
}

function getNotificationParams(callback){
	try{
	    NativeClass.nativeFunctionGetNotificationParams([callback],function(result) {alert("Success : \r\n"+result);},
                function(error) {alert("Error : \r\n"+error);});
	}catch(e){
		lengthError++;
		functionError[lengthError]=function(){
		    NativeClass.nativeFunctionGetNotificationParams([callback],function(result) {alert("Success : \r\n"+result);},
                    function(error) {alert("Error : \r\n"+error);});			
		}
	}	
}

var NativeClass = {
    nativeFunctionGoToView: function(types, success, fail) {
        return cordova.exec(success, fail, "NativeClass", "goToView", types);
    },
    nativeFunctionGoToNewView: function(types, success, fail) {
        return cordova.exec(success, fail, "NativeClass", "goToNewView", types);
    },
    nativeFunctionLogin: function(types, success, fail) {
        return cordova.exec(success, fail, "NativeClass", "login", types);
    },
    nativeFunctionTranslate: function(types, success, fail){
        return cordova.exec(success, fail, "NativeClass", "translate", types);
    },
    nativeFunctionBackToView: function(types, success, fail){
        return cordova.exec(success, fail, "NativeClass", "backToView", types);
    },
    nativeFunctionInvokeService: function(types, success, fail){
        return cordova.exec(success, fail, "NativeClass", "invokeService", types);
    },
    nativeFunctionAnimatePush: function(types, success, fail){
        return cordova.exec(success, fail, "NativeClass", "animatePush", types);
    },
    nativeFunctionGoToHTML: function(types, success, fail){
        return cordova.exec(success, fail, "NativeClass", "goToHTML", types);
    },
    nativeFunctionBackToHTML: function(types, success, fail){
        return cordova.exec(success, fail, "NativeClass", "backToHTML", types);
    },
    nativeFunctionSetContentData: function(types, success, fail){
        return cordova.exec(success, fail, "NativeClass", "setContentData", types);
    },
    nativeFunctionActivateToken: function(types, success, fail){
        return cordova.exec(success, fail, "NativeClass", "activateToken", types);
    },
    nativeFunctionActivateToken2: function(types, success, fail){
        return cordova.exec(success, fail, "NativeClass", "activateToken2", types);
    },
    nativeFunctionDateNative: function(types, success, fail){
        return cordova.exec(success, fail, "NativeClass", "dateNative", types);
    },
    nativeFunctionCheckVersion: function(types, success, fail){
        return cordova.exec(success, fail, "NativeClass", "checkVersion", types);
    },
    nativeFunctionResponseChalenge: function(types, success, fail){
        return cordova.exec(success, fail, "NativeClass", "responseChallenge", types);
    },
	nativeFunctionStartInterceptSMS: function(types, success, fail){
		return cordova.exec(success, fail, "NativeClass", "startInterceptSMS", types);
	},
	nativeFunctionUpdateURL: function(types, success, fail){
		return cordova.exec(success, fail, "NativeClass", "updateURL", types);
	},
	nativeFunctionManageNotification: function(types, success, fail){
		return cordova.exec(success, fail, "NativeClass", "manageNotification", types);
	},
	nativeFunctionGetVersionApp: function(types, success, fail){
		return cordova.exec(success, fail, "NativeClass", "getVersionApp", types);
	},
	nativeFunctionGetNotificationParams: function(types, success, fail){
		return cordova.exec(success, fail, "NativeClass", "getNotificationParams", types);
	},
    nativeFunctionKeyboard : function(types, success, fail){
        return cordova.exec(success, fail, "NativeClass", "keyboard", types);
    },
    nativeFunctionTrackingAnalytics : function(types, success, fail) {
    	return cordova.exec(success, fail, "NativeClass", "trackingAnalytics", types);
    }

};

function saveToWindow(str) {

    for (i in str) {
        Session.setItem(i, JSON.stringify(str[i]));
    }
}

function saveToWindowTranslate(str) {
    for (i in str) {
        Session.setItem(i, str[i]);
    }
}

function saveToStorage(key, value){
	Session.setItem(key, value);
}	

function saveContentData(key, value){
	saveToStorage(key, value);
}

function deleteContentData(key){
	Session.removeItem(key);
}

function deleteAllContentData(){
	Session.clear();
}

function getAllContentData(){
	return Session.dump();
}

function replaceFromWindow(){
   
    var elements = document.getElementsByTagName("language");
    var arr = new Array();
    for(i in elements){
        if(isNumber(i)){
            arr[i] = elements[i].textContent;
        }
    }
    
    for(j in arr){
        if(Session.getItem(elements[j].getAttribute("key"))){
            elements[j].innerHTML = Session.getItem(elements[j].getAttribute("key"));
        }
    }
    
    replaceTagOption();
    replaceInputOption();
    replaceTextAreaOption();
    
    for(j in arr){
        Session.removeItem(arr[j]);
    }
    
}


function replaceFromWindowDiv(divId){
    var elements = document.getElementById(divId).getElementsByTagName("language");
    var arr = new Array();
    for(i in elements){
        if(isNumber(i)){
            arr[i] = elements[i].textContent;
        }
    }
    for(j in arr){
        if(Session.getItem(elements[j].getAttribute("key"))){
            elements[j].innerHTML = getContentData(elements[j].getAttribute("key"));
        }
    }
    
    replaceTagOptionDiv(divId);
    replaceInputOptionDiv(divId);
    replaceTextAreaOptionDiv(divId);
    
    for(j in arr){
        Session.removeItem(arr[j]);
    }
}

function replaceInputOption(){
    var elements = document.getElementsByTagName("input");
    for(i in elements){
        if(isNumber(i)){
            var value = elements[i].getAttribute("placeholderKey");
            if(value!=null){
                if(Session.getItem(value)){
                    elements[i].setAttribute("placeholder",Session.getItem(value));
                }
            }
        }
    }
}

function replaceInputOptionDiv(divId){
    var elements = document.getElementById(divId).getElementsByTagName("input");
    for(i in elements){
        if(isNumber(i)){
            var value = elements[i].getAttribute("placeholderKey");
            if(value!=null){
                if(Session.getItem(value)){
                    elements[i].setAttribute("placeholder",Session.getItem(value));
                }
            }
        }
    }
}


function replaceTagOption(){
	var elements = document.getElementsByTagName("option");
    for(i in elements){
        if(isNumber(i)){
        	var value = elements[i].getAttribute("language");
            if(value!=null){
            	 if(Session.getItem(value)){
                     elements[i].innerHTML = Session.getItem(value);
                 }
            }
        }
    }
}

function replaceTagOptionDiv(divId){
    var elements = document.getElementById(divId).getElementsByTagName("option");
  for(i in elements){
      if(isNumber(i)){
          var value = elements[i].getAttribute("language");
          if(value!=null){
                 if(Session.getItem(value)){
                   elements[i].innerHTML = Session.getItem(value);
               }
          }
      }
  }
}

function replaceTextAreaOption(){
    var elements = document.getElementsByTagName("textarea");
    for(i in elements){
        if(isNumber(i)){
            var value = elements[i].getAttribute("placeholderKey");
            if(value!=null){
                if(Session.getItem(value)){
                    elements[i].setAttribute("placeholder",Session.getItem(value));
                }
            }
        }
    }
}

function replaceTextAreaOptionDiv(divId){
    var elements = document.getElementById(divId).getElementsByTagName("textarea");
    for(i in elements){
        if(isNumber(i)){
            var value = elements[i].getAttribute("placeholderKey");
            if(value!=null){
                if(Session.getItem(value)){
                    elements[i].setAttribute("placeholder",Session.getItem(value));
                }
            }
        }
    }
}

function showHideLeft(idToShow, idToHide) {
//	console.log(document.body.scrollTop);
	document.body.scrollTop = 0;
    document.getElementById(idToShow).style.left = window.innerWidth + "px";
    document.getElementById(idToHide).style.left = 0 + "px";
    $('#' + idToShow).addClass('ui-page-active');
    var left = 0;
    var left2 = parseInt(document.getElementById(idToShow).style.left);

    function frameLeft() {
        left -= window.innerWidth / 4;
        left2 -= window.innerWidth / 4;
        document.getElementById(idToHide).style.left = left + 'px';
        document.getElementById(idToShow).style.left = left2 + 'px';
        if (left == -window.innerWidth) {
            clearInterval(id);
            $('#' + idToHide).removeClass('ui-page-active');
        }
    }
    var id = setInterval(frameLeft, 10 / 4);

}

function showHideRight(idToShow, idToHide) {
//	console.log(document.body.scrollTop);
	document.body.scrollTop = 0;
    document.getElementById(idToShow).style.left = -window.innerWidth + "px";
    document.getElementById(idToHide).style.left = 0 + "px";
    $('#' + idToShow).addClass('ui-page-active');
    var left = parseInt(document.getElementById(idToShow).style.left);
    var left2 = 0;

    function frameRight() {
        left += window.innerWidth / 4;
        left2 += window.innerWidth / 4;
        document.getElementById(idToShow).style.left = left + 'px';
        document.getElementById(idToHide).style.left = left2 + 'px';
        if (left == 0) {
            clearInterval(id);
            $('#' + idToHide).removeClass('ui-page-active');
        }
    }
    var id = setInterval(frameRight, 10 / 4);

}

function showHide(idToShow, idToHide) {
	showHideLeft(idToShow, idToHide);
}

function getSelectedOption(sel) {
    return sel.options[sel.selectedIndex].innerHTML;  
}

function collapseShow(divId){
//  alert(divId +'~'+ tabActive)
  if(divId != tabActive){
      document.getElementById(divId).style.display = 'block';
//      document.getElementById(divId+'icon').removeClass('ui-icon-arrow-r');
//      document.getElementById(divId+'icon').addClass('ui-icon-arrow-d');
      $('#'+divId+'icon').removeClass('ui-icon-arrow-r');
      $('#'+divId+'icon').addClass('ui-icon-arrow-d');
      if(tabActive != ''){
          document.getElementById(tabActive).style.display = 'none';
//          document.getElementById(tabActive+'icon').removeClass('ui-icon-arrow-r');
//          document.getElementById(tabActive+'icon').addClass('ui-icon-arrow-d');
          $('#'+tabActive+'icon').removeClass('ui-icon-arrow-d');
          $('#'+tabActive+'icon').addClass('ui-icon-arrow-r');
      }
      tabActive = divId;
  }else{
      document.getElementById(divId).style.display = 'none';
//      alert(divId+'icon');
//      alert(document.getElementById(divId+'icon').className);
      $('#'+divId+'icon').removeClass('ui-icon-arrow-d');
      $('#'+divId+'icon').addClass('ui-icon-arrow-r');
      tabActive = '';
  }
}

//dipindahkan ke file iscroll-lite.js
//function iscrollActive() {
//	try{
//		document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
//		var myScroll=document.getElementsByClassName("iscroll");
//		for(i in myScroll){
//			myScroll[i] = new IScroll(myScroll[i], { mouseWheel: true,scrollbars: true });
//		}		
//	}catch(e){
//	}
//}

// Camera
var Camera = {
		  DestinationType:{
		    DATA_URL: 0,         // Return base64 encoded string
		    FILE_URI: 1,         // Return file uri (content://media/external/images/media/2 for Android)
		    NATIVE_URI: 2,        // Return native uri (eg. asset-library://... for iOS)
		    ALL_URI: 3        // Return base64 encoded string and file uri
		  },
		  EncodingType:{
		    JPEG: 0,             // Return JPEG encoded image
		    PNG: 1               // Return PNG encoded image
		  },
		  MediaType:{
		    PICTURE: 0,          // allow selection of still pictures only. DEFAULT. Will return format specified via DestinationType
		    VIDEO: 1,            // allow selection of video only, ONLY RETURNS URL
		    ALLMEDIA : 2         // allow selection from all media types
		  },
		  PictureSourceType:{
		    PHOTOLIBRARY : 0,    // Choose image from picture library (same as SAVEDPHOTOALBUM for Android)
		    CAMERA : 1,          // Take picture from camera
		    SAVEDPHOTOALBUM : 2  // Choose image from picture library (same as PHOTOLIBRARY for Android)
		  },
		  PopoverArrowDirection:{
		      ARROW_UP : 1,        // matches iOS UIPopoverArrowDirection constants to specify arrow location on popover
		      ARROW_DOWN : 2,
		      ARROW_LEFT : 4,
		      ARROW_RIGHT : 8,
		      ARROW_ANY : 15
		  },
		  Direction:{
		      BACK: 0,
		      FRONT: 1
		  }
		};

function getValue(value, defaultValue) {
    return value === undefined ? defaultValue : value;
}

/**
 * Gets a picture from source defined by "options.sourceType", and returns the
 * image as defined by the "options.destinationType" option.

 * The defaults are sourceType=CAMERA and destinationType=FILE_URI.
 *
 * @param {Function} successCallback
 * @param {Function} errorCallback
 * @param {Object} options
 */
Camera.getPicture = function(options, successCallback, errorCallback) {
    var quality = getValue(options.quality, 50);
    var destinationType = getValue(options.destinationType, Camera.DestinationType.ALL_URI);
    var sourceType = getValue(options.sourceType, Camera.PictureSourceType.CAMERA);
    var targetWidth = getValue(options.targetWidth, -1);
    var targetHeight = getValue(options.targetHeight, -1);
    var encodingType = getValue(options.encodingType, Camera.EncodingType.JPEG);
    var mediaType = getValue(options.mediaType, Camera.MediaType.PICTURE);
    var allowEdit = !!options.allowEdit;
    var correctOrientation = !!options.correctOrientation;
    var saveToPhotoAlbum = !!options.saveToPhotoAlbum;
    var maxSize = getValue(options.maxSize, -1);

    var args = [quality, destinationType, sourceType, targetWidth, targetHeight, encodingType,
                mediaType, allowEdit, correctOrientation, saveToPhotoAlbum, maxSize];

    cordova.exec(successCallback, errorCallback, "Camera", "takePicture", args);
    // XXX: commented out
    //return new CameraPopoverHandle();
};

function openCamera(opts, success, fail) {
    Camera.getPicture(opts,
        function(result) {
            if (success && result) {
            	result = JSON.parse(result);
                success(result.data, result.path);
            }
        },
        function(err) {
            if (fail) {
                fail(err);
            }
        });
}
