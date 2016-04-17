function languageProcess(data) {
	if (data == 'en') {
		$('#englishLang').addClass("selected");
		$('#bahasaLang').removeClass("selected");
		englishLanguageProcess();
	} else if (data == 'id') {
		$('#englishLang').removeClass("selected");
		$('#bahasaLang').addClass("selected");
		indonesiaLanguageProcess();
	} else {
		$('#englishLang').removeClass("selected");
		$('#bahasaLang').removeClass("selected");
	}
}
		
function englishLanguageProcess(){
	invokeService({action: [{source: 'native',service: 'UpdateConfigs',params: {language: 'en'}}]}, 'engLangCB');
	
	//setContentData([{source: 'native',service:'UpdateConfigs',params: {language: 'en'}}], 'languageProcessCallback');
}

function engLangCB(){
	processLanguages();
	setLocale();
	goToHTML({viewId: 'myaccount.html'});
}

function indonesiaLanguageProcess(){
	invokeService({action: [{source: 'native',service: 'UpdateConfigs',params: {language: 'id'}}]}, 'indLangCB');
	
	//setContentData([{source: 'native',service:'UpdateConfigs',params: {language: 'id'}}], 'languageProcessCallback');
}

function indLangCB(){
	processLanguages();
	setLocale();
	goToHTML({viewId: 'myaccount.html'});
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
