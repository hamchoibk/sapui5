'use strict';

/**
 * @ngdoc overview
 * @name tcbmwApp
 * @description
 * # tcbmwApp
 *
 * Main module of the application.
 */

var resolve = {
    delay: function ($q, $timeout) {
        var delay = $q.defer();
        $timeout(delay.resolve, 0, false);
        return delay.promise;
    }
};

var underscore = angular.module('underscore', []);
underscore.factory('_', function () {
    return window._;
});

var tcbmwApp = angular.module('tcbmwApp', [

        'ngAnimate',
        'ngCookies',
        'ngResource',
        'ngRoute',
        'ngSanitize',
        'ngTouch',
        'navigationBar',
        'ui.router',
        'ui.bootstrap',
        'underscore',
        'pascalprecht.translate',
        'mediaPlayer',
        'cordovaModule',
        'uiSwitch',
        'swipe'
])
    .config(['$stateProvider', '$urlRouterProvider', '$sceProvider', function ($stateProvider, $urlRouterProvider, $sceProvider) {

        $sceProvider.enabled(false);
        CordovaApp.initialize();
        $urlRouterProvider.otherwise("/");
        $stateProvider
            .state('main', {
                url: '/',
                templateUrl: 'views/main/main.html',
                controller: 'mainController'
            })
            .state('login', {
                url: '/login',
                templateUrl: 'views/login/login.html',
                controller: 'loginController'
            })
            .state('signupuserdetails', {
                url: '/signupuserdetails',
                templateUrl: 'views/signup/userDetails.html',
                controller: 'UserDetailsScreenController'
            })
            .state('signup', {
                url: '/signup',
                templateUrl: 'views/signup/signupMain.html',
                controller: 'signupMainController'
            })
            .state('signupcapcha', {
                url: '/signupcapcha',
                templateUrl: 'views/signup/capchaScreen.html',
                controller: 'CapchaScreenController'
            })
            .state('signupconfirm', {
                url: '/signupconfirm',
                templateUrl: 'views/signup/signupConfirm.html',
                controller: 'signupConfirmController'
            })
            .state('signupsmsvalidation', {
                url: '/signupsmsvalidation',
                templateUrl: 'views/signup/smsValidation.html',
                controller: 'SmsValidationScreenController'
            })
            .state('signuptermsconditions', {
                url: '/signuptermsconditions',
                templateUrl: 'views/signup/termsConditions.html',
                controller: 'TermsConditionsScreenController'
            })
            .state('signupSuccess', {
                url: '/signupSuccess',
                templateUrl: 'views/signup/signupSuccess.html',
                controller: 'signupSuccessController'
            })
            .state('dashboard', {
                url: '/dashboard',
                templateUrl: 'views/dashboard/dashboard.html',
                controller: 'dashboardController'
            })
            .state('dashboard.home', {
                url: '/home',
                templateUrl: 'views/dashboard/home.html',
                controller: 'HomeController'
            })
            .state('accounts', {
                url: '/accounts',
                templateUrl: 'views/dashboard/accounts/accounts.html',
                controller: 'AccountsController'
            })
            .state('accountDetails', {
                url: '/accountDetails',
                templateUrl: 'views/dashboard/accounts/accountDetails.html',
                controller: 'AccountDetailsController'
            })
            .state('accounttransactionsummary', {
                url: '/accountTransactionSummary/:accountNumber',
                templateUrl: 'views/dashboard/accounts/accountTransactionSummary.html',
                controller: 'AccountTransactionSummaryController'
            })
            .state('accountlatesttransactions', {
                url: '/accountLatestTransactions',
                templateUrl: 'views/dashboard/accounts/accountLatestTransactions.html',
                controller: 'AccountLatestTransactionsController'
            })
            .state('accounttransactiondetail', {
                url: '/accountTransactionDetail',
                templateUrl: 'views/dashboard/accounts/accountTransactionDetail.html',
                controller: 'AccountTransactionDetailController'
            })
            .state('dashboard.transferhome', {
                url: '/transfer',
                templateUrl: 'views/dashboard/transfer/transferhome.html',
                controller: 'TransferHomeController'
            })
            .state('dashboard.transfer', {
                url: '/transfer',
                templateUrl: 'views/dashboard/transfer.html',
                controller: 'TransferController'
            })
            .state('tcbindex', {
                url: '/tcbindex',
                templateUrl: 'views/dashboard/transfer/tcb/tcbindex.html',
                controller: 'TCBIndexController'
            })
            .state('tcbbeneficiarylist', {
                url: '/tcbbeneficiarylist',
                templateUrl: 'views/dashboard/transfer/tcb/tcbbeneficiarylist.html',
                controller: 'TCBBeneficiaryListController'
            })
            .state('tcbconfirmation', {
                url: '/tcbconfirmation',
                templateUrl: 'views/dashboard/transfer/tcb/tcbconfirmation.html',
                controller: 'TCBConfirmationController'
            })
            .state('tcbotpscreen', {
                url: '/tcbotpscreen',
                templateUrl: 'views/dashboard/transfer/tcb/tcbotpscreen.html',
                controller: 'TCBOtpScreenController'
            })
            .state('tcbtransactionsuccess', {
                url: '/tcbtransactionsuccess',
                templateUrl: 'views/dashboard/transfer/tcb/tcbtransactionsuccess.html',
                controller: 'TCBTranscationSuccessController'
            })
            .state('tcbselectaccount', {
                url: '/tcbselectaccount',
                templateUrl: 'views/dashboard/transfer/tcb/tcbselectaccount.html',
                controller: 'TCBSelectAccountController'
            })
            .state('sendMoney', {
                url: '/send',
                templateUrl: 'views/dashboard/transfer/send/sendMoneyMain.html',
                controller: 'sendMoneyMainController'
            })
            .state('sendmoneyselectaccount', {
                url: '/sendmoneyselectaccount',
                templateUrl: 'views/dashboard/transfer/send/sendMoneySelectAccount.html',
                controller: 'SendMoneySelectAccountController'
            })
            .state('socialList', {
                url: '/socialList',
                templateUrl: 'views/dashboard/transfer/send/socialList.html',
                controller: 'socialListController'
            })
            .state('selectFromFriendList', {
                url: '/selectFromFriendList',
                templateUrl: 'views/dashboard/transfer/send/friendList.html',
                controller: 'friendListController'
            })
            .state('sendMoneyPreConfirm', {
                url: '/sendMoneyPreConfirm',
                templateUrl: 'views/dashboard/transfer/send/sendMoneyPreConfirm.html',
                controller: 'sendMoneyPreConfirmController'
            })
            .state('sendMoneyOTP', {
                url: '/sendMoneyOTP',
                templateUrl: 'views/dashboard/transfer/send/sendMoneyOTP.html',
                controller: 'sendMoneyOTPController'
            })
            .state('sendMoneySuccess', {
                url: '/sendMoneySuccess',
                templateUrl: 'views/dashboard/transfer/send/sendMoneySuccess.html',
                controller: 'sendMoneySuccessController'
            })
            .state('askAcceptConfirm', {
                url: '/askAcceptConfirm',
                templateUrl: 'views/receivepage/askAcceptConfirm.html',
                controller: 'askAcceptConfirmController'
            })
            .state('askAcceptConfirmDone', {
                url: '/askAcceptConfirmDone',
                templateUrl: 'views/receivepage/askAcceptConfirmDone.html',
                controller: 'askAcceptConfirmDoneController'
            })
            .state('dashboard.socialindex', {
                url: '/socialindex',
                templateUrl: 'views/dashboard/social/socialIndex.html',
                controller: 'SocialIndexController'
            })
            .state('dashboard.socialconnect', {
                url: '/socialconnect',
                templateUrl: 'views/dashboard/social/socialConnect.html',
                controller: 'SocialConnectController'
            })
            .state('dashboard.cashoutindex', {
                url: '/cashout',
                templateUrl: 'views/dashboard/cashout/cashoutIndex.html',
                controller: 'CashoutIndexController'
            })
            .state('cashoutmobile', {
                url: '/cashoutmobile',
                templateUrl: 'views/cashout/cashoutMobile.html',
                controller: 'CashoutMobileController'
            })
            .state('cashoutaccountselector', {
                url: '/cashoutaccountselector',
                templateUrl: 'views/cashout/cashoutAccountSelector.html',
                controller: 'CashoutAccountSelectorController'
            })
            .state('cashoutmobileconfirm', {
                url: '/cashoutmobileconfirm',
                templateUrl: 'views/cashout/cashoutMobileConfirm.html',
                controller: 'CashoutMobileConfirmController'
            })
            .state('cashoutmobilesuccess', {
                url: '/cashoutmobilesuccess',
                templateUrl: 'views/cashout/cashoutMobileSuccess.html',
                controller: 'CashoutMobileSuccessController'
            })
            .state('cashoutid', {
                url: '/cashoutid',
                templateUrl: 'views/cashout/cashoutID.html',
                controller: 'CashoutIDController'
            })
            .state('cashoutidconfirm', {
                url: '/cashoutidconfirm',
                templateUrl: 'views/cashout/cashoutIDConfirm.html',
                controller: 'CashoutIDConfirmController'
            })
            .state('cashoutidsuccess', {
                url: '/cashoutidsuccess',
                templateUrl: 'views/cashout/cashoutIDSuccess.html',
                controller: 'CashoutIDSuccessController'
            })
            .state('cashoutotp', {
                url: '/cashoutotp',
                templateUrl: 'views/cashout/cashoutOTP.html',
                controller: 'CashoutOTPController'
            })
            .state('transactionsindex', {
                url: '/transactionsindex',
                templateUrl: 'views/transactions/transactionsIndex.html',
                controller: 'TransactionsIndexController'
            })
            .state('transactionsstatusresult', {
                url: '/transactionsstatusresult',
                templateUrl: 'views/transactions/transactionsStatusResult.html',
                controller: 'TransactionsStatusResultController'
            })
            .state('transaction', {
                url: '/transaction/:transactionId',
                templateUrl: 'views/transactions/transaction.html',
                controller: 'TransactionController'
            })
            .state('transactionDetails', {
                url: '/transactionDetails',
                templateUrl: 'views/transactions/transactionDetails.html',
                controller: 'transactionDetailsController'
            })
            .state('banktransactionsummary', {
                url: '/banktransactionsummary',
                templateUrl: 'views/transactions/banktransactionsummary.html',
                controller: 'BankTransactionSummaryController'
            })
            .state('cashoutdetail', {
                url: '/cashoutdetail',
                templateUrl: 'views/transactions/cashoutdetail.html',
                controller: 'CashOutDetailsController'
            })
            .state('askwalletAcceptConfirm', {
                url: '/askwalletAcceptConfirm',
                templateUrl: 'views/transactions/askwalletAcceptConfirm.html',
                controller: 'askwalletAcceptConfirmController'
            })
            .state('askwalletAcceptConfirmDone', {
                url: '/askwalletAcceptConfirmDone',
                templateUrl: 'views/transactions/askwalletAcceptConfirmDone.html',
                controller: 'askwalletAcceptConfirmDoneController'
            })
            .state('socialdetails', {
                url: '/socialdetails',
                templateUrl: 'views/transactions/socialdetails.html',
                controller: 'SocialDetailsController'
            })
            .state('receivepage', {
                url: '/receivepage',
                templateUrl: 'views/receivepage/receivepage.html',
                controller: 'ReceivePageController'
            })
            .state('beneficiarysearch', {
                url: '/beneficiarysearch',
                templateUrl: 'views/beneficiaryList/beneficiarySearch.html',
                controller: 'BeneficiarySearchController'
            })
            .state('addBeneficiary', {
                url: '/addBenficiary',
                templateUrl: 'views/beneficiaryList/addBeneficiary.html',
                controller: 'addBeneficiaryController'
            })
            .state('changepassword', {
                url: '/changepassword',
                templateUrl: 'views/changepassword/changePassword.html',
                controller: 'ChangePasswordController'
            })
            .state('help', {
                url: '/help',
                templateUrl: 'views/help/help.html',
                controller: 'HelpController'
            })
            .state('contactus', {
                url: '/contactus',
                templateUrl: 'views/contactus/contactUs.html',
                controller: 'ContactUsController'
            })
            .state('promotion', {
                url: '/promotion',
                templateUrl: 'views/promotion/promotion.html',
                controller: 'promotionController'
            })
            .state('notifications', {
                url: '/notifications',
                templateUrl: 'views/notifications/notifications.html',
                controller: 'NotificationsController'
            })
            .state('profile', {
                url: '/profile',
                templateUrl: 'views/profile/profile.html',
                controller: 'ProfileController'
            })
            .state('profilenonkyc', {
                url: '/profilenonkyc',
                templateUrl: 'views/profile/profileNonKYC.html',
                controller: 'ProfileNonKYCController'
            })
            .state('addressLocation', {
                url: '/addressLocation',
                templateUrl: 'views/profile/addressLocation.html',
                controller: 'addressLocationController'
            })
            /* Ask Money */
            .state('dashboard.askMoney', {
                url: '/askMoney',
                templateUrl: 'views/dashboard/askMoney/askMoneyIndex.html',
                controller: 'askMoneyIndexController'
            })
            /* via eWallet */
            .state('askMoneyEwalletMain', {
                url: '/askMoneyEwalletMain',
                templateUrl: 'views/dashboard/askMoney/eWallet/askMoneyEWalletMain.html',
                controller: 'askMoneyEWalletMainController'
            })
            .state('askMoneyEWalletBeneficiary', {
                url: '/askMoneyEwalletBeneficiary',
                templateUrl: 'views/dashboard/askMoney/eWallet/askMoneyEWalletBeneficiaryList.html',
                controller: 'askMoneyEWalletBeneficiaryListController'
            })
            .state('askMoneyEWalletConfirm', {
                url: '/askMoneyEwalletConfirm',
                templateUrl: 'views/dashboard/askMoney/eWallet/askMoneyEWalletConfirm.html',
                controller: 'askMoneyEWalletConfirmController'
            })
            .state('askMoneyEWalletSuccess', {
                url: '/askMoneyEwalletSuccess',
                templateUrl: 'views/dashboard/askMoney/eWallet/askMoneyEWalletSuccess.html',
                controller: 'askMoneyEWalletSuccessController'
            })
            /* via social channel */
            .state('askMoneySocialMain', {
                url: '/askMoneysocialMain',
                templateUrl: 'views/dashboard/askMoney/social/askMoneySocialMain.html',
                controller: 'askMoneySocialMainController'
            })
            .state('askMoneySocialList', {
                url: '/askMoneysocialList',
                templateUrl: 'views/dashboard/askMoney/social/askMoneySocialChannelList.html',
                controller: 'askMoneySocialChannelListController'
            })
            .state('askMoneySocialConfirm', {
                url: '/askMoneySocialConfirm',
                templateUrl: 'views/dashboard/askMoney/social/askMoneySocialConfirm.html',
                controller: 'askMoneySocialConfirmController'
            })
            .state('askMoneySocialSuccess', {
                url: '/askMoneysocialSuccess',
                templateUrl: 'views/dashboard/askMoney/social/askMoneySocialSuccess.html',
                controller: 'askMoneySocialSuccessController'
            })
            .state('locateindex', {
                url: '/locateindex',
                templateUrl: 'views/atmlocator/locateindex.html',
                controller: 'LocateIndexController'
            })
            .state('locatesearch', {
                url: '/locatesearch',
                templateUrl: 'views/atmlocator/locatesearch.html',
                controller: 'LocateSearchController'
            })
            .state('locatedetails', {
                url: '/locatedetails',
                templateUrl: 'views/atmlocator/locatedetails.html',
                controller: 'LocateDetailsController'
            })
            .state('locatemap', {
                url: '/locatemap',
                templateUrl: 'views/atmlocator/locatemap.html',
                controller: 'LocateMapController'
            })
            .state('pendingtransactions', {
                url: '/pendingtransactions',
                templateUrl: 'views/transactions/pending/pendingTransactions.html',
                controller: 'PendingTransactionsController'
            })
            .state('pendingtransactiondetails', {
                url: '/pendingtransactiondetails',
                templateUrl: 'views/transactions/pending/pendingTransactionDetails.html',
                controller: 'PendingTransactionDetailsController'
            })
            .state('selectfriend', {
                url: '/selectfriend',
                templateUrl: 'views/friend/selectFriend.html',
                controller: 'SelectFriendController'
            })
            .state('dashboard.friendcontactdetail', {
                url: '/friendcontactdetail',
                templateUrl: 'views/dashboard/friend/friendContactDetails.html',
                controller: 'FriendContactDetailsController'
            })
            .state('settings', {
                url: '/settings',
                templateUrl: 'views/settings/settings.html',
                controller: 'settingsController'
            })
            .state('latesttransactionssummary', {
                url: '/latesttransactionssummary',
                templateUrl: 'views/transactions/latest/latestTransactionsSummary.html',
                controller: 'LatestTransactionsSummaryController'
            })
            .state('latestttransactiondetails', {
                url: '/latestttransactiondetails',
                templateUrl: 'views/transactions/latest/latestTransactionDetails.html',
                controller: 'LatestTransactionDetailsController'
            })
            .state('forgotpasswordmain', {
                url: '/forgotpasswordmain',
                templateUrl: 'views/forgotpassword/forgotPasswordMain.html',
                controller: 'ForgotPasswordMainController'
            })
            .state('forgotpasswordotp', {
                url: '/forgotpasswordotp',
                templateUrl: 'views/forgotpassword/forgotPasswordOTP.html',
                controller: 'ForgotPasswordOTPController'
            })
            .state('spreadluv', {
                url: '/spreadluv',
                templateUrl: 'views/dashboard/spread/spreadtheluv.html',
                controller: 'SpreadTheLoveController'
            })
            .state('interbankindex', {
                url: '/interbankindex',
                templateUrl: 'views/dashboard/transfer/interbank/interBankIndex.html',
                controller: 'interBankIndexController'
            })
            .state('interbankbeneficiarylist', {
                url: '/interbankbeneficiarylist',
                templateUrl: 'views/dashboard/transfer/interbank/interbankbeneficiarylist.html',
                controller: 'InterBankBeneficiaryListController'
            })
            .state('interbankconfirmation', {
                url: '/interbankconfirmation',
                templateUrl: 'views/dashboard/transfer/interbank/interbankconfirmation.html',
                controller: 'InterBankConfirmationController'
            })
            .state('interbankotpscreen', {
                url: '/interbankotpscreen',
                templateUrl: 'views/dashboard/transfer/interbank/interbankotpscreen.html',
                controller: 'InterBankOtpScreenController'
            })
            .state('interbanktransactionsuccess', {
                url: '/interbanktransactionsuccess',
                templateUrl: 'views/dashboard/transfer/interbank/interbanktransactionsuccess.html',
                controller: 'InterBankTranscationSuccessController'
            })
            .state('banklist', {
                url: '/banklist',
                templateUrl: 'views/dashboard/transfer/interbank/banklist.html',
                controller: 'BankListController'
            })
            .state('branchlist', {
                url: '/branchlist',
                templateUrl: 'views/dashboard/transfer/interbank/branchlist.html',
                controller: 'BranchListController'
            })
            .state('provincelist', {
                url: '/provincelist',
                templateUrl: 'views/dashboard/transfer/interbank/provincelist.html',
                controller: 'ProvinceListController'
            })
            .state('paymentindex', {
                url: '/paymentindex',
                templateUrl: 'views/payment/paymentindex.html',
                controller: 'PaymentController'
            })
            .state('topupscreen', {
                url: '/topupscreen',
                templateUrl: 'views/payment/topupscreen.html',
                controller: 'TopUpScreenController'
            })
            .state('topupconfirm', {
                url: '/topupconfirm',
                templateUrl: 'views/payment/topupconfirm.html',
                controller: 'TopUpConfirmController'
            })
            .state('topupotp', {
                url: '/topupotp',
                templateUrl: 'views/payment/topupotp.html',
                controller: 'TopUpOtpController'
            })
            .state('topupsuccess', {
                url: '/topupsuccess',
                templateUrl: 'views/payment/topupsuccess.html',
                controller: 'TopUpSuccessController'
            })
            .state('gamelist', {
                url: '/gamelist',
                templateUrl: 'views/payment/game/gamelist.html',
                controller: 'GameListController'
            })
            .state('topupgamescreen', {
                url: '/topupgamescreen',
                templateUrl: 'views/payment/game/topupgamescreen.html',
                controller: 'TopUpGameScreenController'
            })
            .state('selectrecentorder', {
                url: '/selectrecentorder',
                templateUrl: 'views/payment/game/selectrecentorder.html',
                controller: 'SelectRecentOrderController'
            })
            .state('topupgameotp', {
                url: '/topupgameotp',
                templateUrl: 'views/payment/game/topupgameotp.html',
                controller: 'TopUpGameOtpController'
            })
            .state('topupgameconfirm', {
                url: '/topupgameconfirm',
                templateUrl: 'views/payment/game/topupgameconfirm.html',
                controller: 'TopUpGameConfirmController'
            })
            .state('topupgamesuccess', {
                url: '/topupgamesuccess',
                templateUrl: 'views/payment/game/topupgamesuccess.html',
                controller: 'TopupGameSuccessController'
            })
            .state('topupgameenteramountscreen', {
                url: '/topupgameenteramountscreen',
                templateUrl: 'views/payment/game/topupgameenteramountscreen.html',
                controller: 'TopupGameEnterAmountController'
            })
            .state('billpaymentindex', {
                url: '/billpaymentindex',
                templateUrl: 'views/payment/billpayment/billpaymentindex.html',
                controller: 'BillPaymentIndexController'
            })
            .state('billpaymentmain', {
                url: '/billpaymentmain',
                templateUrl: 'views/payment/billpayment/billpaymentmain.html',
                controller: 'BillPaymentMainController'
            })
            .state('billpaymentconfirm', {
                url: '/billpaymentconfirm',
                templateUrl: 'views/payment/billpayment/billpaymentconfirm.html',
                controller: 'BillPaymentConfirmController'
            })
            .state('billpaymentotp', {
                url: '/billpaymentotp',
                templateUrl: 'views/payment/billpayment/billpaymentotp.html',
                controller: 'BillPaymentOtpController'
            })
            .state('billpaymentsuccess', {
                url: '/billpaymentsuccess',
                templateUrl: 'views/payment/billpayment/billpaymentsuccess.html',
                controller: 'BillPaymentSuccessController'
            })
//        credit card payment

            .state('cardpaymentindex', {
                url: '/cardpaymentindex',
                templateUrl: 'views/card/cardPaymentIndex.html',
                controller: 'CardPaymentIndexController'
            })
            .state('cardpaymentmain', {
                url: '/cardpaymentmain',
                templateUrl: 'views/card/cardPaymentMain.html',
                controller: 'CardPaymentMainController'
            })
            .state('cardpaymentconfirm', {
                url: '/cardpaymentconfirm',
                templateUrl: 'views/card/cardPaymentConfirm.html',
                controller: 'CardPaymentConfirmController'
            })
            .state('cardpaymentotp', {
                url: '/cardpaymentotp',
                templateUrl: 'views/card/cardPaymentOtp.html',
                controller: 'CardPaymentOtpController'
            })
            .state('cardpaymentsuccess', {
                url: '/cardpaymentsuccess',
                templateUrl: 'views/card/cardPaymentSuccess.html',
                controller: 'CardPaymentSuccessController'
            })
            .state('cardpaymentlist', {
                url: '/cardpaymentlist',
                templateUrl: 'views/card/cardPaymentList.html',
                controller: 'CardPaymentListController'
            })
            .state('cardstatementindex', {
                url: '/cardstatementindex',
                templateUrl: 'views/card/cardstatementindex.html',
                controller: 'CardStatementIndexController'
            })
            .state('cardstatementdetails', {
                url: '/cardstatementdetails',
                templateUrl: 'views/card/cardstatementdetails.html',
                controller: 'CardStatementDetailsController'
            })
//        evn payment
            .state('listorderpaymentlists', {
                url: '/listorderpaymentlists',
                templateUrl: 'views/payment/listorder/listorderpaymentlists.html',
                controller: 'ListOrderPaymentListsController'
            })
            .state('listorderpaymentmain', {
                url: '/listorderpaymentmain',
                templateUrl: 'views/payment/listorder/listorderpaymentmain.html',
                controller: 'ListOrderPaymentMainController'
            })
            .state('listorderpaymentconfirm', {
                url: '/listorderpaymentconfirm',
                templateUrl: 'views/payment/listorder/listorderpaymentconfirm.html',
                controller: 'ListOrderPaymentConfirmController'
            })
            .state('listorderpaymentotp', {
                url: '/listorderpaymentotp',
                templateUrl: 'views/payment/listorder/listorderpaymentotp.html',
                controller: 'ListOrderPaymentOtpController'
            })
            .state('listorderpaymentsuccess', {
                url: '/listorderpaymentsuccess',
                templateUrl: 'views/payment/listorder/listorderpaymentsuccess.html',
                controller: 'ListOrderPaymentSuccessController'
            })
            .state('listorderpaymentben', {
                url: '/listorderpaymentben',
                templateUrl: 'views/payment/listorder/listorderpaymentben.html',
                controller: 'ListOrderPaymentBenController'
            })
            .state('pushnotification', {
                url: '/notification',
                templateUrl: 'views/dashboard/pushnotification/pushnotification.html',
                controller: 'PushNotificationController'
            })
            .state('demo', {
                url: '/demo',
                templateUrl: 'views/demo/demo.html',
                controller: 'DemoController'
            })
            .state('depositindex', {
                url: '/depositindex',
                templateUrl: 'views/dashboard/deposit/depositindex.html',
                controller: 'DepositIndexController'
            })
            .state('depositdetail', {
                url: '/depositdetail',
                templateUrl: 'views/dashboard/deposit/depositdetail.html',
                controller: 'DepositDetailController'
            })
            .state('creditindex', {
                url: '/creditindex',
                templateUrl: 'views/dashboard/credit/creditindex.html',
                controller: 'CreditIndexController'
            })
            .state('creditdetail', {
                url: '/creditdetail',
                templateUrl: 'views/dashboard/credit/creditdetail.html',
                controller: 'CreditDetailController'
            })
            .state('paymentindexl2', {
                url: '/paymentindexl2',
                templateUrl: 'views/payment/paymentgrouplevel2.html',
                controller: 'PaymentGroupLevel2Controller'
            })
            .state('paymentindexl3', {
                url: '/paymentindexl3',
                templateUrl: 'views/payment/paymentgrouplevel3.html',
                controller: 'PaymentGroupLevel3Controller'
            })
    //        instant transfer immediately
            .state('dashboard.instanttransferindex', {
                url: '/instanttransferindex',
                templateUrl: 'views/dashboard/transfer/instantTransfer/instantTransferIndex.html',
                controller: 'instantTransferIndexController'
            })
            .state('instanttransfertocardmain', {
                url: '/instanttransfertocardmain',
                templateUrl: 'views/dashboard/transfer/instantTransfer/instantTransferToCardMain.html',
                controller: 'instantTransferToCardMainController'
            })
            .state('instanttransfertoaccountmain', {
                url: '/instanttransfertoaccountmain',
                templateUrl: 'views/dashboard/transfer/instantTransfer/instantTransferToAccountMain.html',
                controller: 'instantTransferToAccountMainController'
            })
            .state('instanttransferconfirm', {
                url: '/instanttransferconfirm',
                templateUrl: 'views/dashboard/transfer/instantTransfer/instantTransferConfirm.html',
                controller: 'instantTransferConfirmController'
            })
            .state('instanttransferotp', {
                url: '/instanttransferotp',
                templateUrl: 'views/dashboard/transfer/instantTransfer/instantTransferOtp.html',
                controller: 'instantTransferOtpController'
            })
            .state('instanttransfersuccess', {
                url: '/instanttransfersuccess',
                templateUrl: 'views/dashboard/transfer/instantTransfer/instantTransferSuccess.html',
                controller: 'instantTransferSuccessController'
            })
            .state('instanttransferbenlist', {
                url: '/instanttransferbenlist',
                templateUrl: 'views/dashboard/transfer/instantTransfer/instantTransferBenList.html',
                controller: 'instantTransferBenListController'
            })
            .state('instanttransferbanklist', {
                url: '/instanttransferbanklist',
                templateUrl: 'views/dashboard/transfer/instantTransfer/instantTransferBankList.html',
                controller: 'instantTransferBankListController'
            })
            .state('getstartedindex', {
                url: '/getstartedindex',
                templateUrl: 'views/getstarted/getstartedindex.html',
                controller: 'getStartedIndexController'
            })
            .state('active', {
                url: '/active',
                templateUrl: 'views/getstarted/active.html',
                controller: 'activeController'
            })
            .state('new', {
                url: '/new',
                templateUrl: 'views/getstarted/new.html',
                controller: 'newController'
            })
            .state('errorpage', {
                url: '/errorpage',
                templateUrl: 'views/exceptionHandler/errorpage.html',
                controller: 'errorPageController'
            })
    }])
    .config(['$compileProvider', function ($compileProvider) {
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|file|tel):/);
    }])
    .run(['$rootScope', '$translate', function ($rootScope, $translate) {
        FastClick.attach(document.body);
        $rootScope.cordovaReady = false;
        $rootScope.previousState = {};
        $rootScope.isDialogOpen = false; //To make sure only one dialog is shown at one time
        $rootScope.suppressDialog = false;
        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            $rootScope.highlightHomeIconinDashboard = "";
            $rootScope.highlightAskIconinDashboard = "";
            $rootScope.highlightSendIconinDashboard = "";
            $rootScope.highlightInTCBIconinDashboard = "";
            if (toState.name === "dashboard.home") {
                $rootScope.highlightHomeIconinDashboard = "current";
            }
            else if (toState.name === "dashboard.askMoney") {
                $rootScope.highlightAskIconinDashboard = "current";
            }
            $rootScope.previousState.name = fromState.name;
            $rootScope.previousState.params = fromParams;
        });

        //TODO: overwrite $apply() method to apply information changes to view manually
        $rootScope.safetyApply = function(fn) {
            var phase = this.$root.$$phase;
            if(phase == '$apply' || phase == '$digest') {
                if(fn && (typeof(fn) === 'function')) {
                    fn();
                }
            } else {
                this.$apply(fn);
            }
        };

    }])
    .directive('slideController', ['$swipe', '$click',
        function ($swipe, $click) {
            return {
                restrict: 'EA',
                link: function (scope, ele, attrs, ctrl) {
                    var startX, pointX;
                    $swipe.bind(ele, {
                        'start': function (coords) {
                            startX = coords.x;
                            pointX = coords.y;
                        },
                        'move': function (coords) {
                            var delta = coords.x - pointX;
                        },
                        'end': function (coords) {
                        },
                        'cancel': function (coords) {
                        }
                    });
                }
            }
        }])
;



