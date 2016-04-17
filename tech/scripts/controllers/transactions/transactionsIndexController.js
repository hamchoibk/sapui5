'use strict';
//focus directive
tcbmwApp.directive('myFocus', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            element.bind('focus', function () {
                //apply scope (attributes)
                scope.$apply(attr.myFocus);
            });
        }
    };
});
//blur directive
tcbmwApp.directive('myBlur', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            element.bind('blur', function () {
                //apply scope (attributes)
                scope.$apply(attr.myBlur);
            });
        }
    };
});
tcbmwApp.controller('TransactionsIndexController',['$scope','TransactionsFactory','$state','$rootScope',function ($scope,TransactionsFactory,$state,$rootScope) {

       if ( $state.current.name == 'transactionsindex'){
            var baseStatus = {
                isBack: true,
                onBack: function() {

                    //TransactionsFactory.resetSocialTransactionsList();
                    TransactionsFactory.resetSocialTransactionsListIsOpen();

                    $state.go('dashboard.home');

                    var newIndex = statuses.indexOf($scope.status) - 1;
                    if (newIndex > -1) {
                        $scope.status = statuses[newIndex];
                        $scope.status.move = 'ltr';
                        $scope.navigationBarStatus = $scope.status;
                    }
                }
            };

            var statuses = [
                angular.extend({title: 'NAVBAR_TRANSACTIONS_TRANSACTIONSINDEX'}, baseStatus)
            ];

            $scope.status = statuses[0];
        }
    $scope.isMobile = isiOsDevice || isAndroid;
    $scope.isiOsDevice = isiOsDevice;
    $scope.socialTransactions = TransactionsFactory.getSocialTransactions();
    console.log("$scope.socialTransactions",$scope.socialTransactions);
    //if ($scope.socialTransactions.length == 0) {
    
    //}
    $scope.transactions=TransactionsFactory.findAll();
    $scope.userAccountDetails = getAccountDetails();
    $scope.search = {
        accountType:"Account Type",
        accountNumber:"",
        fromDate:"",
        toDate:"",
        fromAmount:"",
        toAmount:""
    };

    $scope.accountListAccordion={
        accountType:'',
        accountNumber:'',
        isOpen:false
    };

    if ($scope.userAccountDetails.length>0)
    {
        var data = $scope.userAccountDetails[0];
        $scope.search.accountType = data.accountType;
        $scope.search.accountNumber = data.accountNumber;
        $scope.search.data = data;

        $scope.accountListAccordion.accountType=data.accountType;
        $scope.accountListAccordion.accountNumber=data.accountNumber;
    }

    $scope.socialTransactionsListIsOpen = false;//TransactionsFactory.getSocialTransactionsListIsOpen();
    $scope.statusListIsOpen = false;
    $scope.bankTransactionsListIsOpen = false;
    
    $scope.socialTransactionsAccordion={
        heading:'TRANSACTIONS_INDEX_SOCIAL_TRANSACTIONS',
        isOpen:TransactionsFactory.getSocialTransactionsListIsOpen()
    };

//To send to server and search for transactions.
    $scope.doneFromDate = function () {
        var textbox = document.getElementById('frmDt');
        if (textbox.value === ''){
            textbox.type = 'text';
        }
    };
    
    $scope.doneToDate = function () {
        var textbox = document.getElementById('toDt');
        if (textbox.value === ''){
            textbox.type = 'text';
        }
    };
    $scope.pickedDates = [];
    $scope.selectDate = function(id) {
        var textbox = document.getElementById(id);
        if ($scope.isMobile) {
            var d = new Date();
            if ($scope.pickedDates[id]) {
                d = new Date($scope.pickedDates[id]);     
            }
            var options = {
              date: d,
              mode: 'date'
            };

            datePicker.show(options, function(date){
              var tmpDate = date;  
              try {
                  var parseDate = new Date(tmpDate);
                  if (parseDate != "Invalid Date") {
                      $scope.pickedDates[id] = date;
                      textbox.value = parseDate.format("dd/mm/yyyy");
                      textbox.blur();
                  }
              } catch (e) {
              }
            });
        }
    }
    

    $scope.clickSearch = function(){
        console.log($scope.search);
        $scope.search.type = 3;
        session.transactionSearch = $scope.search;
        if (isiOsDevice) {
            $scope.pickedDates["frmDt"] = $scope.search.fromDate;
            $scope.pickedDates["toDt"] = $scope.search.toDate;
        }
        session.transactionSearch.filter = $scope.pickedDates;
        $state.go('banktransactionsummary');
    }

    $scope.showTransactions = function(type){
        $scope.search.type = type;
        session.transactionSearch = $scope.search;
        //session.transactionSearch.account = $scope.search.data.paymentInstrument;
        $state.go('banktransactionsummary');
    };

    $scope.clickTransaction = function(data){
        TransactionsFactory.setSocialTransactionsListIsOpen(true);
            if(data.fastalink != null){
                TransactionsFactory.setSelectedSocialTransaction(data);
                $state.go('socialdetails');
            } else 
            {
                TransactionsFactory.setSelectedSocialTransaction(data);
                $state.go('cashoutdetail');
            }
    };

    $scope.acceptedClicked = function(){

       TransactionsFactory.setSelectedStatusFilter('Accepted');
        console.log("Accepted clicked");
        $state.go('transactionsstatusresult');
    }

    $scope.rejectedClicked = function(){
        TransactionsFactory.setSelectedStatusFilter('Rejected');
        console.log("Rejected Clicked");
        $state.go('transactionsstatusresult');
    }

   $scope.pendingClicked = function(){
        session.pendingTransactionParentPage = "transactionsindex";
        TransactionsFactory.setSelectedStatusFilter('Pending');
        console.log("pendingClicked clicked");
        $state.go('transactionsstatusresult');
    }

    $scope.cancelledClicked = function(){
        TransactionsFactory.setSelectedStatusFilter('Cancelled');
        console.log("cancelledClicked Clicked");
        $state.go('transactionsstatusresult');

    }

   $scope.expiredClicked = function(){
        TransactionsFactory.setSelectedStatusFilter('Expired');
        console.log("expiredClicked clicked");
        $state.go('transactionsstatusresult');
    }

    $scope.clickAccountType = function(data){
        $scope.search.accountType = data.accountType;
        $scope.search.accountNumber = data.accountNumber;
        $scope.search.data = data;

        $scope.accountListAccordion.accountType=data.accountType;
        $scope.accountListAccordion.accountNumber=data.accountNumber;
        $scope.accountListAccordion.isOpen=!$scope.accountListAccordion.isOpen;

        //$scope.toggleAccountTypeList();
        //$rootScope.safetyApply(function(){});
    };

    //Channel icons are shown only for social transactions. Must change according to server
    $scope.showChannelIcon = function(data){
        if(data.socialTxnType==='ask-link' || data.socialTxnType==='send-link'){
            if (data.additionalInfos && data.additionalInfos.otherData.data.value ==='mobile') {
                return false;
            } else {
                return true;
            }
        }else{
            return false;
        }
    }

    $scope.showLinkTyeIcon = function(data){
        if ( data.Linktype === 'sendExternal' || data.Linktype == 'request' ){
            return true;
        }else{
            return false;
        }
    }

    $scope.showPrefixDecs = function(data) {
        if (data.txnAmount<0) {
            if (data.socialTxnType=="ask-link" || data.socialTxnType=="ask-wallet" ) {
                return true;
            } else {
                return false;
            }
        } else {
            if (data.socialTxnType=="send-link") {
                return true;
            } else {
                return false;
            }
        }
    }

    $scope.showReceiveLabel = function (data) {
       if (data.socialTxnType=="send-link" && data.txnAmount > 0) {
           return true;
       } else {
           return false;
       }
    }

    $scope.showPrefixType = function(data) {
        if (data.socialTxnType=="ask-link" || data.socialTxnType=="ask-wallet") {
            return false;
        } else {
            return true;
        }
    }

    $scope.clickSocialTransaction = function() {
        console.log($scope.socialTransactionsAccordion.isOpen);
        if (!$scope.socialTransactionsAccordion.isOpen)
        if (!session.cachedSocialTrasactions) {
            $scope.loading = true;
            $rootScope.safetyApply(function(){});
            if (!session.fetchingSocialTransactions)
                mc.findSocialTransactions(findSocialTransactionBack,100);
            else {
                waitForSocialTransactions();
            }
        }
        setTimeout(function() {$rootScope.safetyApply(function(){});},0);
    }
    function waitForSocialTransactions() {
        if (!session.fetchingSocialTransactions) {
            $scope.socialTransactions = TransactionsFactory.getSocialTransactions();
            $scope.loading = false;
            $rootScope.safetyApply(function(){});
        } else {
            setTimeout(waitForSocialTransactions,100);
        }                   
        
    }

   $scope.showToOrFrom = function(data){
       if(data.Linktype === 'request' &&  data.txnAmount<0){
           return "From";
       }else if(data.Linktype === 'sendExternal' && data.txnAmount>0){
           return "From";
       }else{
           return "To";
       }
   }

   $scope.showAskedOrSent = function(data){
       if(data.Linktype === 'sendExternal' && data.txnAmount<0){
           return "Sent";
       }else if(data.Linktype === 'sendExternal' && data.txnAmount>0){
           return "Sent";
       }else if(data.Linktype === 'request' && data.txnAmount>0){
           return "Asked";
       }else if(data.Linktype === 'request' && data.txnAmount<0){
            return "Asked";
       }
   }

   $scope.getFormattedAmount = function(data){
       if(data.formatedAmount.charAt(0)==="-"){
           return data.formatedAmount.substring(1,data.formatedAmount.length);
       }else{
           return data.formatedAmount;
       }
   }


    function findSocialTransactionBack(r) {
            session.fetchingSocialTransactions = false;
            $scope.loading = false;
            $rootScope.safetyApply(function(){});
            if (r.Status.code == "0") {
                //isClicked = true;
                var trans = r.transactions;
                for(var idx in trans) {
                    var t = trans[idx];
                    t.status = capitaliseFirstLetter(t.status);
                    if (t.status == "Sent")
                        t.status = "Pending";
                    t.photo = "images/profile-placeholder.png";
                    t.fullLink = toFullLink(t.fastalink);
                    if (t.additionalInfos != null) {
                        t.additionalInfos = JSON.parse(t.additionalInfos);

                    }
                    t.formatedAmount = t.txnAmount.formatMoney(0);
                    if (t.additionalInfos && t.status == "Pending") {
                        if (t.additionalInfos.expire.days)
                            t.expiredDate= (addDate(new Date( t.additionalInfos.expire.sent_time), parseInt( t.additionalInfos.expire.days))).format("dd/mm/yyyy");
                        else
                            t.expiredDate= (addDate(new Date( t.additionalInfos.expire.sent_time), 3)).format("dd/mm/yyyy");
                    }
                    
                    if (t.socialTxnType == "ask-link" || t.socialTxnType == "ask-wallet") {
                        t.Linktype = "request";
                    } else
                    if (t.socialTxnType == "send-link") {
                        t.Linktype = "sendExternal";
                    }
                    if (t.socialTxnType == "cashout") {
                        t.name = t.txnDesc;
                    } else {
                        if (t.socialTxnType == "ask-wallet") {
                            //wallet
                            t.photo = "images/fb-profile.png";
                            if (t.txnAmount>0) {
                                t.name = t.payer.accountName;
                            } else {
                                t.name = t.payee.accountName;
                            }
                        } else {
                            //social
                            if (t.additionalInfos != null) {
                                var displayer;
                                if (t.txnAmount>0) {
                                    if (t.socialTxnType == "send-link") {
                                        //receiver
                                        displayer = t.additionalInfos.sender;
                                    } else {
                                        //ask link, owner
                                        displayer = t.additionalInfos.recipient;
                                    }
                                } else {
                                    if (t.socialTxnType == "send-link") {
                                        //owner
                                        displayer = t.additionalInfos.recipient;
                                    } else {
                                        //receiver
                                        displayer = t.additionalInfos.sender;
                                    }
                                }
                                if (displayer !== undefined) {
                                    if (displayer.profile != null) {
                                        t.name = displayer.profile.name;
                                        t.photo = displayer.profile.photo;
                                    } else {
                                        if (displayer.socials != null) {
                                            for(var i in displayer.socials.social) {
                                                if (displayer.socials.social[i]["$"] === undefined)
                                                {
                                                    if (displayer.socials.social["$"] == "mobile") {
                                                        t.name = displayer.socials.social["@id"];
                                                        t.photo = "images/fb-profile.png";
                                                        break;
                                                    }
                                                } else
                                                if (displayer.socials.social[i]["$"] == "mobile") {

                                                    t.name = displayer.socials.social[i].id;
                                                    t.photo = "images/fb-profile.png";
                                                    break;
                                                }
                                            }
                                        } else {
                                            //console.log(t);
                                        }
                                    }
                                }
                            } else {
                                if (t.txnAmount>0) {
                                    t.name = t.payer.accountName;
                                } else {
                                    t.name = t.payee.accountName;
                                }
                            }
                        }
                    }


                    t.date = (new Date(t.txnDate)).format("dd/mm/yyyy");
                }
                
           // console.log(trans.length);
            $scope.socialTransactions = trans;
            TransactionsFactory.setSocialTransactions($scope.socialTransactions);
            cacheSocialTransations();
            $rootScope.safetyApply(function(){});
        } else {
            ErrorBox(r.Status);
        }
    }
}]);

