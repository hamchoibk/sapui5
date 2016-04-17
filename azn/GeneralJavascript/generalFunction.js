function checkLanguage(){
	setContentData([{source: 'server',service:'CheckLanguage',dataIds:[{dataId: 'locale',dataType:'text',source:'param'}]}], 'checkLanguageCallBack');
}

function setLocale(){
	setContentData([{source: 'server',service:'CheckLanguage',dataIds:[{dataId: 'locale',dataType:'text',source:'param'}]}], '');
}

function checkLanguageCallBack(){
	var languageNya = getContentData('locale');
	if (languageNya == 'en') {
		$('#englishLang').addClass("selected");
		$('#bahasaLang').removeClass("selected");
	} else if (languageNya == 'id') {
		$('#englishLang').removeClass("selected");
		$('#bahasaLang').addClass("selected");
	} else {
		$('#englishLang').removeClass("selected");
		$('#bahasaLang').removeClass("selected");
	}
}

function validasiMessageToken(tokenOkCd){
	var locale = getContentData('locale');
	var tokenInactive = 'Token is inactive';
	var wrongPin = 'Invalid PIN';
	var tokenLocked = 'Token is Locked';

	if(locale == "id"){
		tokenInactive='Token belum aktif';
		wrongPin='PIN Salah';
		tokenLocked = 'Token terkunci';
	}
	
	if(tokenOkCd == -1){
		alert(tokenInactive);
	}else if(tokenOkCd == -2){
		alert(wrongPin);
	}else if(tokenOkCd == -3){
		alert(tokenLocked);
	}
}

function showPopup(idPopup) {
	$('#' + idPopup + "-popup").removeClass('ui-popup-hidden');
	$('#' + idPopup + "-popup").addClass('ui-popup-active');
	$('#' + idPopup + "-popup").attr('style', 'height:90%;width:90%; top: 5%; left: 5%;');
	$('#' + idPopup + "-screen").removeClass('ui-screen-hidden');
	$('#' + idPopup + "-screen").removeClass('ui-popup-screen');
	$('#' + idPopup + "-screen").removeClass('ui-overlay-b');
	$('#' + idPopup + "-screen").addClass('ui-popup-screen');
	$('#' + idPopup + "-screen").addClass('ui-overlay-b');
	$('#' + idPopup + "-screen").addClass('in');
}

function loadMessageResourceAlert(key){
	setContentData([{source: 'server',service:'MessageResource', params:{key:key}, dataIds:[{dataId: 'valueResource',dataType:'text',source:'param'}]}], 'languageAlert');
}

function languageAlert(){
	if(getContentData('ok')==1){
		alert(getContentData('valueResource'));
	}else{
		alert(getContentData('message'));
	}
}

function loadMessageResourceAlertPlusCall(key){
	setContentData([{source: 'server',service:'MessageResource', params:{key:key}, dataIds:[{dataId: 'valueResource',dataType:'text',source:'param'}]}], 'languageAlertPlusCall');
}

function languageAlertPlusCall(){
	if(getContentData('ok')==1){
		invokeService({action: [{source: 'native', service: 'OpenCallAlert',params:{message: getContentData('valueResource')}}]});
	}else{
		alert(getContentData('message'));
	}
}

//add by Sendhy 20Mei2014
function overwriteType(inputId){
	document.getElementById(inputId).setAttribute("type","tel");
	setTimeout(function(){document.getElementById(inputId).setAttribute("type","password");}, 750);
}

function keypressType(inputId){
	document.getElementById(inputId).setAttribute("type", "password");
}
//end add