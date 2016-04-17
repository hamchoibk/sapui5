'use strict';

tcbmwApp.controller('ReceivePageController',['$rootScope','$scope','$filter','$state','TransactionsFactory','sendMoneyTransferFactory','dialogService',function ($rootScope,$scope,$filter,$state,TransactionsFactory,sendMoneyTransferFactory,dialogService) {
 $scope.transaction = session.newLinkDetails;
 console.log("$scope.transaction", $scope.transaction);
 
 console.log($scope.transaction);
 //$scope.transaction.txnDate=$scope.transaction.txnDate.format("dd/mm/yyyy");
 $scope.hasPinCode = ($scope.transaction.security)?true:false;
 if (!$scope.transaction.sender.profile) {
     $scope.transaction.sender.profile = {name:$scope.transaction.sender.socials.social[0]["id"],photo:"images/profile-placeholder.png"} 
 }
 var txDate=new Date($scope.transaction.expire.sent_time);
 $scope.transaction.formatedDate = txDate.format("dd/mm/yyyy");
 if ($scope.transaction.expire.days) {
     $scope.transaction.expiredDate = addDate(new Date($scope.transaction.expire.sent_time),parseInt($scope.transaction.expire.days)).format("dd/mm/yyyy");
 }
    $scope.transaction.amount = parseInt($scope.transaction.amount);
 if ($scope.transaction.type != "sendExternal") {
     $scope.transaction.amount  =  - $scope.transaction.amount;
 }
 $scope.transaction.formatedAmount =  $scope.transaction.amount.formatMoney(0);
 session.socialDetailsPreviousPage = $rootScope.previousState.name;
var link = $scope.transaction.code;
if ($scope.transaction.metadata) {
    getLinkDetailsBack();
}
$scope.transactionIcon = $scope.transaction.otherData[0].data.value;

 var accountDetail = sendMoneyTransferFactory.getAccountDetail();

    if(accountDetail.id==''){
        accountDetail=sendMoneyTransferFactory.getAccountDetails()[0];
    }
 $scope.account = {
    id:accountDetail.id,
    accountName:accountDetail.accountName,
    accountType:accountDetail.accountType,
    accountNumber:accountDetail.accountNumber,
    availableBalance:accountDetail.availableBalance,
    dayLimit:accountDetail.dayLimit,
    transactionLimit:accountDetail.transactionLimit,
    paymentInstrumentId:accountDetail.paymentInstrumentId
}
$scope.selectVisible=sendMoneyTransferFactory.getAccountDetails().length>1;
 
    if ( $state.current.name == 'receivepage'){
        var baseStatus = {

            isClose:true,
            onAction: function() {
                $state.go("dashboard.home");
                var newIndex = statuses.indexOf($scope.status) - 1;
                if (newIndex > -1) {
                    $scope.status = statuses[newIndex];
                    $scope.status.move = 'ltr';
                    $scope.navigationBarStatus = $scope.status;
                }
                
            }
        };
        var title = '';

        if($scope.transaction.type === "request"){
            title = "NAVBAR_TRANSACTIONS_SOCIALDETAIL_REQ";
            $scope.acceptButton="CASHOUT_DETAIL_ACCEPT_ASK";
            $scope.sourceAccountLable="CASHOUT_DETAIL_SOURCE_ACCOUNT";
            $scope.transactionType="Ask money via social network";
            $scope.transactionType=getMessage(title);
        }else if($scope.transaction.type === "sendExternal"){
             title = "NAVBAR_TRANSACTIONS_SOCIALDETAIL_TRANS";
            $scope.acceptButton="CASHOUT_DETAIL_ACCEPT_ACCEPT";
            $scope.sourceAccountLable="SOCIAL_DETAIL_SOURCE_ACCOUNT";
            $scope.transactionType="Send money via social network";
            $scope.transactionType=getMessage(title);
        }

        var statuses = [

            angular.extend({title: title}, baseStatus)
        ];

        $scope.status = statuses[0];
    }
    $scope.canReject = true;
    $scope.canAccept = true;
    $scope.canCancel = false;

    
    $scope.clickSelectAccount = function() {
        //
        //sendMoneyTransferFactory.setSendMoneyUserInputs($scope.sendMoneyUserInputs);
        $state.go('sendmoneyselectaccount');
    }
  
    $scope.clickAccept = function() {
        //Accept ask money request
        Confirm(getMessage("TRANSACTION_ACCEPT_TRANSACTION_CONFIRMATION"),confirmedAccept);
    }
    function confirmedAccept() {
        $scope.loading = true;
        
        if ($scope.transaction.type == "sendExternal") {
            //Accept send money request
            acceptLink();
        } else {
            //Accept ask money request
            mc.payBillLink(payBillBack,$scope.transaction.code, $scope.account.paymentInstrumentId);
        }
        $rootScope.safetyApply(function(){});
    }
    $scope.clickReject = function() {
        //Accept ask money request
        Confirm(getMessage("TRANSACTION_REJECT_TRANSACTION_CONFIRMATION"),confirmedReject);
    }

    function confirmedReject() {
        $scope.loading = true;

        if ($scope.transaction.type == "sendExternal") {
            rejectLink();
        } else {
            mc.rejectBillLink(rejectBillBack, $scope.transaction.code);
        }
        $rootScope.safetyApply(function(){});
    }
    $scope.clickCancel = function() {
        
        Confirm(getMessage("TRANSACTION_CANCEL_TRANSACTION_CONFIRMATION"),confirmedCancel);
    }
   
    function confirmedCancel() {
        $scope.loading = true;
        if ($scope.transaction.socialTxnType == "send-link") {
            //cancel send link
            cancelLink();
        } else {
            //cancel ask link
            mc.cancelBill(cancelBillBack, $scope.transaction.mobInvoiceId);
        }
        $rootScope.safetyApply(function(){});
    }
    $scope.clickCopyLink = function(){
        TCBNativeBridge.copyToClipboard(successCallback,error,$scope.transaction.fullLink);
    }

    var successCallback = function(){
        dialogService.showModal("SOCIAL_DETAIL_TRANSACTION_COPY_SUCCESS");
    }

    var error = function(error){
        dialogService.showModal("SOCIAL_DETAIL_TRANSACTION_COPY_ERROR");
    };

    function rejectBillBack(r) {
        $scope.loading = false;
       
        if (r.Status.code == "0") {
            //
            //session.transit_value = {sysid:parseTransactionSystemId(r)};
            //$state.go("askwalletAcceptConfirm");
            $scope.transaction.status = "Rejected";
            MessageBox($filter('translate')("SOCIAL_TRANSACTION_LINK_IS_REJECTED"));
            $scope.canAccept = false;
            $scope.canReject = false;
            $scope.canCancel = false;
            session.cachedSocialTrasactions = false;
            mc.getWallets(walletBack, session.customer.id, 0);
        } else {
            ErrorBox(r.Status);
        }
        $rootScope.safetyApply(function(){});
    }
    function cancelBillBack(r) {
        $scope.loading = false;
       
        if (r.Status.code == "0") {
            //
            //session.transit_value = {sysid:parseTransactionSystemId(r)};
            //$state.go("askwalletAcceptConfirm");
            $scope.transaction.status = "Cancelled";
            MessageBox($filter('translate')("SOCIAL_TRANSACTION_LINK_IS_CANCELLED"));
            $scope.canAccept = false;
            $scope.canReject = false;
            $scope.canCancel = false;
            session.cachedSocialTrasactions = false;
            mc.getWallets(walletBack, session.customer.id, 0);
        } else {
            ErrorBox(r.Status);
        }
        $rootScope.safetyApply(function(){});
    }
    function payBillBack(r) {
        $scope.loading = false;
        $rootScope.safetyApply(function(){});
        if (r.Status.code == "0") {
            //

            var fee = 0;
            if (r.MoneyFee !== undefined && r.MoneyFee != null && r.MoneyFee.length>0) {

                fee = r.MoneyFee[0].value +  r.MoneyFee[0].vat;
                console.log(fee);
            }
            session.transactionFee = fee;

            session.transit_value = {sysid:parseTransactionSystemId(r)};
            $state.go("askAcceptConfirm");
        } else {
            ErrorBox(r.Status);
        }
    }
    //Must get from server
    //$scope.expiresOnDate = "16/12/2014";
    //$scope.messageContent = "Message Content";
    function rejectLink() {
            var tranIdx = $scope.transaction.code;
            var trans = $scope.transaction;
            var amount = {
                currency: "VND",
                vat:0,
                value:Math.abs(trans.amount)
            };
            var cardlessCode = "123456";

            var refTrans = {
                systemId: 0,
                type:0,
                value:cardlessCode
            };
            var ud = [];
            ud[0] = {
                Key:"LinkCode",
                Value:trans.code
            };
            if ($scope.pinCode)
            ud[1] = {
                Key:"RejectPin",
                Value:$scope.pinCode
            };
            
            function captureCancelBack(r) {
                $scope.loading = false;
                if (r.Status.code == "0") {
                    session.cachedSocialTrasactions = false;
                    $scope.transaction.status = "Rejected";
                    MessageBox($filter('translate')("SOCIAL_TRANSACTION_LINK_IS_REJECTED"));
                    $scope.canAccept = false;
                    $scope.canCancel = false;
                    $scope.canReject = false;
                    mc.getWallets(walletBack, session.customer.id, 0);
                } else {
                    ErrorBox(r.Status);
                }
                $rootScope.safetyApply(function(){});
            }
            $scope.loading = true;
            mc.captureReject(captureCancelBack,refTrans,amount,ud);
        }
        function cancelLink() {
                var tranIdx = $scope.transaction.code;
                var trans = $scope.transaction;
                var amount = {
                    currency: trans.creditCurrency,
                    vat:0,
                    value:Math.abs(trans.txnAmount)
                };
                var cardlessCode = "123456";
                
                var refTrans = {
                    systemId: trans.mobiliserTxnId,
                    type:0,
                    value:cardlessCode
                };
                function captureCancelBack(r) {
                    $scope.loading = false;
                    if (r.Status.code == "0") {
                        session.cachedSocialTrasactions = false;
                        $scope.transaction.status = "Cancelled";
                        MessageBox($filter('translate')("SOCIAL_TRANSACTION_LINK_IS_CANCELLED"));
                        $scope.canAccept = false;
                        $scope.canCancel = false;
                        $scope.canReject = false;
                        mc.getWallets(walletBack, session.customer.id, 0);
                    } else {
                        ErrorBox(r.Status);
                    }
                    $rootScope.safetyApply(function(){});
                }
                mc.captureCancel(captureCancelBack,refTrans,amount);
        }
        function acceptLink() {
            var loadinfo = [];
            loadinfo["loadamount"] = $scope.transaction.amount;
            loadinfo["sysid"] = '';
            loadinfo["referno"] = '';
            session.transit_value = loadinfo;
            session.transit_value.transfer_type = "acceptLink";
            var payer = {};
            payer.identifier = {};
            payer.identifier.type = "5";
            payer.identifier.value = "fastacash";
            payer.paymentInstrumentType = "304";
            var payee = {};
            payee.identifier = {};
            payee.identifier.type = 1;
            payee.identifier.value = session.customer.id;
            payee.paymentInstrumentId = $scope.account.paymentInstrumentId;

           
            var attribute = [];
            attribute[0] = {};
            attribute[0].key = "408";
            attribute[0].value = $scope.transaction.code;
            attribute[1] = {};
            attribute[1].key = "410";
            //no pin
            if ($scope.hasPinCode)
                attribute[1].value = $scope.pinCode;    
            else    
                attribute[1].value = "";

            var txn = new TxnData(1007, session.transit_value.loadamount,
                'order111', session.transit_value.loadtext);

            function authorisationBack(r) {
                $scope.loading = false;
                if (r.Status.code == "0") {
                    session.cachedSocialTrasactions = false;
                    $scope.transaction.status = "Accepted";
                    $scope.canAccept = false;
                    $scope.canCancel = false;
                    $scope.canReject = false;
                    MessageBox($filter('translate')("SOCIAL_TRANSACTION_LINK_IS_ACCEPTED"));
                    mc.getWallets(walletBack, session.customer.id, 0); 
                    $scope.hasPinCode = false;
                    //$.mobile.changePage("#fundtransfersum");
                } else {
                    //appstate = trans.TRAN_IDLE;
                    ErrorBox(r.Status);
                }
                $rootScope.safetyApply(function(){});
            }
            appstate = trans.TRAN_UNLOADSVA;
            
            mc.authorisation(authorisationBack, payer, payee, attribute, txn, true);
        }
    $scope.clickVideo = function(data){
        TCBNativeBridge.getVideoURL(success,failure,data);
    }
    function getLinkDetailsBack() {
        var linkDetails = $scope.transaction;
        console.log(linkDetails);
        var metadata = linkDetails.metadata;
        if (metadata) {
            var tmpMetadata = {};

            if (metadata.images) {
                //has image
                tmpMetadata.photo = metadata.images[0].image.preview[0]["$"];
            }
            if (metadata.videos) {
                //has video
                mc.getDownloadUrl(getVideoUrlBack, metadata.videos[0].video.id);
                tmpMetadata.video = {preview:metadata.videos[0].video.preview[0]["$"]};
            }
            if (metadata.audios) {
                //has audio
                tmpMetadata.audio = metadata.audios[0].audio.preview;
                mc.getDownloadUrl(getAudioUrlBack, metadata.audios[0].audio.id)
            }
            if (metadata.texts) {
                mc.getDownloadUrl(getTextCallBack,metadata.texts[0].text.id);
            }
            $scope.metadata = tmpMetadata;
        }
        
    }
    function getTextCallBack(r) {
        if (r.Status.code == "0") {
            var data = JSON.parse(r.jsonString);
            $scope.transaction.txnDesc = data.params.param["$"];
            $rootScope.safetyApply(function(){});
        }
    }
    function getVideoUrlBack(r) {
    //console.log(JSON.parse(r.jsonString));
        if (r.Status.code == "0") {
            var data = JSON.parse(r.jsonString);
            $scope.metadata.video.url = data.url;
            $rootScope.safetyApply(function(){});
        }
    }
    function getAudioUrlBack(r) {
        //console.log(JSON.parse(r.jsonString));
        if (r.Status.code == "0") {
            var data = JSON.parse(r.jsonString);
            $scope.audioPlaylist = data.url;
            $rootScope.safetyApply(function(){});
        }
        
    }
    $scope.audioInPlay = false;
    $scope.audioPlaylist = [
        {src:"",type:"audio/mpeg"}
    ];
    $scope.togglePlayState = function () {
        if($scope.audioInPlay){
            $scope.audioPlayer.pause();
            $scope.audioInPlay = false;
            return;
        }
        //Play the selected audio
        if(!$scope.audioInPlay){
            $scope.audioInPlay = true;
            $scope.audioPlayer.play();
        }
    };

    $scope.seek = function(event){
        event.stopPropagation();
        if ( $scope.audioInPlay){
            var seekBar = $(event.target);
            seekBar = seekBar.hasClass("progress") ? seekBar : seekBar.parents(".progress");
            $timeout(function(){
                $scope.audioPlayer.currentTime = ((event.clientX -  seekBar.offset().left) * $scope.audioPlayer.duration) / seekBar.width();
                $scope.audioPlayer.seek($scope.audioPlayer.currentTime);
            }, 0);
        }

    };
    var success = function(data){
        console.log(data);
    };

    var failure = function(data){
        console.log(data);
    };
    function walletBack(data) {
        if (data.Status.code == "0") {
            if (data.walletEntries.length) {
                session.accounts = data.walletEntries;
                for(var idx in session.accounts) {
                    if (session.accounts[idx].sva) {
                        session.accounts[idx].msisdn = session.msisdn;
                    }
                }
            }
        }
    }
}]);