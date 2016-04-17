'use strict';

tcbmwApp.controller('TransactionsStatusResultController',['$scope','$rootScope','TransactionsFactory','$stateParams','$state',function ($scope,$rootScope,TransactionsFactory,$stateParams,$state,$q) {
    var title = '';
    var selectedStatusFilter = TransactionsFactory.getSelectedStatusFilter();

    $scope.isPending = false;

    if(selectedStatusFilter==='Accepted'){
         title = "NAVBAR_TRANSACTIONS_TRANSACTIONSTATUSRESULT_ACCEPTED";
    }else if(selectedStatusFilter==='Rejected'){
         title = "NAVBAR_TRANSACTIONS_TRANSACTIONSTATUSRESULT_REJECTED";
    }else if(selectedStatusFilter==='Pending'){
         title = "NAVBAR_TRANSACTIONS_TRANSACTIONSTATUSRESULT_PENDING";
         $scope.isPending = true;
    }else if(selectedStatusFilter==='Cancelled'){
         title = "NAVBAR_TRANSACTIONS_TRANSACTIONSTATUSRESULT_CANCELLED";
    }else if(selectedStatusFilter==='Expired'){
         title = "NAVBAR_TRANSACTIONS_TRANSACTIONSTATUSRESULT_EXPIRED";
    }

    $scope.selectedStatusFilter = selectedStatusFilter;
    
       if ( $state.current.name == 'transactionsstatusresult'){
            var baseStatus;

            if($rootScope.previousState.name=='dashboard.home'){
                baseStatus = {
                    isBack: true,
                    onBack: function() {
                        //$state.go('transactionsindex');
                        if (session.pendingTransactionParentPage)
                            $state.go(session.pendingTransactionParentPage);
                        else
                            $state.go('transactionsindex');
                        var newIndex = statuses.indexOf($scope.status) - 1;
                        if (newIndex > -1) {
                            $scope.status = statuses[newIndex];
                            $scope.status.move = 'ltr';
                            $scope.navigationBarStatus = $scope.status;
                        }
                    }
                };
            }
            else{
                baseStatus = {
                    isBack: true,
                    onBack: function() {
                        //$state.go('transactionsindex');
                        if (session.pendingTransactionParentPage)
                            $state.go(session.pendingTransactionParentPage);
                        else
                            $state.go('transactionsindex');
                        var newIndex = statuses.indexOf($scope.status) - 1;
                        if (newIndex > -1) {
                            $scope.status = statuses[newIndex];
                            $scope.status.move = 'ltr';
                            $scope.navigationBarStatus = $scope.status;
                        }
                    },
                    isClose:true,
                    onAction: function() {
                        $state.go('dashboard.home');

                        var newIndex = statuses.indexOf($scope.status) - 1;
                        if (newIndex > -1) {
                            $scope.status = statuses[newIndex];
                            $scope.status.move = 'ltr';
                            $scope.navigationBarStatus = $scope.status;
                        }
                    }
                };
            }

            var statuses = [
                           angular.extend({title: title}, baseStatus)
                       ];

           $scope.status = statuses[0];
        }



        var transactions = TransactionsFactory.findByStatus(selectedStatusFilter);
        //console.log(TransactionsFactory.getSocialTransactions()); 
        //console.log(transactions);
        $scope.transactions = transactions;
        /*$scope.loading = true;
        $rootScope.safetyApply(function(){});
        mc.findSocialTransactionsWithStatus(findSocialTransactionBack,30,selectedStatusFilter);*/
        
        //var bankTransactions = TransactionsFactory.findBankTransactionsByStatus(selectedStatusFilter);
        //$scope.transactions= transactions.concat(bankTransactions);

        $scope.clickTransaction = function(data){
            console.log(data);

            if(data.fastalink == null){
                    TransactionsFactory.setSelectedSocialTransaction(data);
                    $state.go('cashoutdetail');
                }else{
                    TransactionsFactory.setSelectedSocialTransaction(data);
                    $state.go('socialdetails');
                }
            
        };

        //Must change according to server data
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

    $scope.showToOrFrom = function(data){
        if(data.Linktype === 'request' &&  data.txnAmount<0){
            return "From";
        }else if(data.Linktype === 'sendExternal' && data.txnAmount>0){
            return "From";
        }else{
            return "To";
        }
    }
    $scope.showReceiveLabel = function (data) {
        if (data.socialTxnType=="send-link" && data.txnAmount > 0) {
            return true;
        } else {
            return false;
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

    $scope.showPrefixType = function(data) {
        if (data.socialTxnType=="ask-link" || data.socialTxnType=="ask-wallet") {
            return false;
        } else {
            return true;
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
                    //console.log(t);
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
                    if (t.mobSubUseCase == 301) {
                        t.photo = "images/dashboard-toMobileNumber.png";
                    } else if (t.mobSubUseCase == 302) {
                        t.photo = "images/dashboard-to_Id.png";
                    }
                } else {
                    if (t.socialTxnType == "ask-wallet") {
                        //wallet
                        t.photo = "images/dashboard-tcb.png";
                        if (t.txnAmount>0) {
                            t.name = t.payer.accountName;
                        } else {
                            t.name = t.payee.accountName;
                        }
                    } else {
                        //social
                        if (t.additionalInfos) {
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
                                if (displayer.profile != null &&
                                    (      t.additionalInfos.otherData.data.value != "mobile"
                                        || (t.socialTxnType == "send-link" && t.txnAmount<0)
                                        || (t.socialTxnType == "ask-link" && t.txnAmount>0)
                                        )
                                    ) {

                                    t.name = displayer.profile.name;
                                    t.photo = displayer.profile.photo;
                                    if (t.additionalInfos.otherData.data.value == "mobile") {
                                        t.photo = "images/icon-sms.png";
                                    }
                                } else {

                                    var displayerName = "";
                                    if (displayer.profile != null)
                                        displayerName = displayer.profile.name + " ";


                                    if (displayer.socials != null) {
                                        for(var i in displayer.socials.social) {
                                            if (displayer.socials.social[i]["$"] === undefined)
                                            {
                                                if (displayer.socials.social["$"] == "mobile") {
                                                    t.name = displayerName + displayer.socials.social["@id"];
                                                    t.photo = "images/icon-sms.png";
                                                    break;
                                                }
                                            } else
                                            if (displayer.socials.social[i]["$"] == "mobile") {
                                                t.name = displayerName + displayer.socials.social[i]["@id"];
                                                t.photo = "images/icon-sms.png";
                                                break;
                                            }
                                        }
                                    } else {
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

            TransactionsFactory.setSocialTransactions(trans);
            var pendingTransactions = TransactionsFactory.findByStatus("Pending");

            $scope.transactions = pendingTransactions;

            $scope.loading = false;
            $rootScope.safetyApply(function(){});

            cacheSocialTransations();
        } else {
            ErrorBox(r.Status);
        }
    }
   
}]);