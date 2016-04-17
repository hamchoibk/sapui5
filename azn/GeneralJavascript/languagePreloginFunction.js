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
	invokeService({action: [{source: 'native',service: 'UpdateConfigs',params: {language: 'en'}}]});
	processLanguages();
	goToHTML({viewId: 'main.html'});
	//setContentData([{source: 'native',service:'UpdateConfigs',params: {language: 'en'}}], 'languageProcessCallback');
}

function indonesiaLanguageProcess(){
	invokeService({action: [{source: 'native',service: 'UpdateConfigs',params: {language: 'id'}}]});
	processLanguages();
	goToHTML({viewId: 'main.html'});
	//setContentData([{source: 'native',service:'UpdateConfigs',params: {language: 'id'}}], 'languageProcessCallback');
}
