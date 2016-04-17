'use strict';
tcbmwApp.controller('TCBIndexController', ['$scope', '$state', 'tcbTransferFactory', '$rootScope', function ($scope, $state, tcbTransferFactory, $rootScope) {

    var transferDetails = tcbTransferFactory.getTransferDetails();
    console.log("transferDetails == ", transferDetails);

    console.log("session.accounts == ", session.accounts);
    var ca = getCurrentAccount();

    console.log("selected account == ", ca);

    /***** Only accept transfer money from Locally currency *****/

    while(ca.currency != "VND") {
        ca = getNextAccount();
    }

    /***** Only accept transfer money from Locally currency end *****/

    transferDetails.sample = false;
    transferDetails.sourceAccountType = ca.accountType;
    transferDetails.sourceAccountNumber = ca.accountNumber;
    transferDetails.sourceAccountName = ca.displayName;
    transferDetails.balance = ca.balance;
    transferDetails.currency = ca.currency;
    transferDetails.paymentInstrumentId = ca.paymentInstrumentId;
    transferDetails.addToAccountListFlag = true;
    tcbTransferFactory.setTransferDetails(transferDetails);

    $scope.transferDetails = transferDetails;
    $scope.hasMoreThanOneSourceAccounts = tcbTransferFactory.hasMoreThanOneSourceAccounts;
    $scope.currencyCode = 'VND';
    $scope.addAccountToList = function () {
        console.log($scope.transferDetails.destinationAccountDetails.payeeAccountNumber);
        $scope.transferDetails.addToAccountListFlag = true;
        tcbTransferFactory.setTransferDetails($scope.transferDetails);
    };
    function getPaymentInstrumentBack(r) {
        if (r.Status.code == 0) {
            if (r.PaymentInstrument !== undefined) {
                $scope.transferDetails.destinationAccountDetails.paymentInstrumentId = r.PaymentInstrument.id;
                $scope.transferDetails.destinationAccountDetails.customerId = r.PaymentInstrument.customerId;
                if (r.PaymentInstrument.type == 0) {
                    //SVA
                    $scope.transferDetails.destinationAccountDetails.payeeAccountType = "COMMON_SVA_ACCOUNT";
                    if (r.PaymentInstrument.spareFields != null)
                    //$scope.transferDetails.destinationAccountDetails.payeeName = r.PaymentInstrument.spareFields.spareString1;
                        if (!$scope.transferDetails.destinationAccountDetails.payeeName) {
                            if (r.PaymentInstrument.spareFields.spareString2 != null)
                                $scope.transferDetails.destinationAccountDetails.payeeName = r.PaymentInstrument.spareFields.spareString2;
                            else
                                $scope.transferDetails.destinationAccountDetails.payeeName = r.PaymentInstrument.spareFields.spareString1;
                        }
                    tcbTransferFactory.setTransferDetails($scope.transferDetails);

                } else {
                    //Bank Account
                    $scope.transferDetails.destinationAccountDetails.accountType = "COMMON_BANK_ACCOUNT";
                    if (!$scope.transferDetails.destinationAccountDetails.payeeName)
                        $scope.transferDetails.destinationAccountDetails.payeeName = r.PaymentInstrument.accountHolderName;
                    tcbTransferFactory.setTransferDetails($scope.transferDetails);

                }
                if ($scope.transferDetails.addToAccountListFlag) {
                    var type = TYPE_BEN_IN_TCB;
                    if (r.PaymentInstrument.type == 0)
                        type = TYPE_BEN_WALLET;
                    if (r.PaymentInstrument.type == TYPE_CREDIT_CARD_ACCOUNT) {
                        type = TYPE_BEN_CREDIT_CARD_ACCOUNT;
                    }
                    //save to beneficiary list
                    var ben = {
                        type: type,
                        benName: $scope.transferDetails.destinationAccountDetails.payeeName,
                        accountNumber: $scope.transferDetails.destinationAccountDetails.payeeAccountNumber,
                        active: true
                    }
                    mc.createBeneficiary(createBeneficiaryBack, ben);
                }
                CAtoCA();

            } else {
                $scope.loading = false;
                $rootScope.safetyApply(function(){});
                MessageBox("DESTINATION_ACCOUNT_IS_NOT_VALID");
            }
        } else {
            $scope.loading = false;
            $rootScope.safetyApply(function(){});
            ErrorBox(r.Status);
        }
    };


    $scope.clickSend = function () {
        // console.log('in click send');


        if (!isNaN(parseInt($scope.transferDetails.amount)))
            $scope.transferDetails.formatedAmount = (parseInt($scope.transferDetails.amount)).formatMoney(0);
        tcbTransferFactory.setTransferDetails($scope.transferDetails);
        if ($scope.transferDetails.sourceAccountType == "COMMON_SVA_ACCOUNT") {
            if ($scope.transferDetails.destinationAccountDetails.payeeAccountType == "COMMON_BANK_ACCOUNT_SAME_HOLDER") {
                unloadSVA();
            } else {
                //MessageBox("COMMON_IN_TCB_NOT_ALLOW_TRANSFER_FROM_SVA_TO_THIS_ACCOUNT");
                $scope.loading = true;
                $rootScope.safetyApply(function(){});
                if ($scope.transferDetails.destinationAccountDetails.payeeAccountNumber.length == 14)
                    mc.getPaymentInstrument(getPaymentInstrumentBack, $scope.transferDetails.destinationAccountDetails.payeeAccountNumber, 2);
                else
                    mc.getPaymentInstrument(getPaymentInstrumentBack, formatLocal("vn", "" + $scope.transferDetails.destinationAccountDetails.payeeAccountNumber).replace(/[^0-9]/g, ""), 1);

            }
        } else if ($scope.transferDetails.sourceAccountType == "COMMON_BANK_ACCOUNT") {
            if ($scope.transferDetails.destinationAccountDetails.payeeAccountType == "COMMON_SVA_SAME_HOLDER") {
                loadSVA();
            } else {
                $scope.loading = true;
                $rootScope.safetyApply(function(){});
                if ($scope.transferDetails.destinationAccountDetails.payeeAccountNumber.length == 14)
                    mc.getPaymentInstrument(getPaymentInstrumentBack, $scope.transferDetails.destinationAccountDetails.payeeAccountNumber, 2);
                else
                    mc.getPaymentInstrument(getPaymentInstrumentBack, formatLocal("vn", $scope.transferDetails.destinationAccountDetails.payeeAccountNumber).replace(/[^0-9]/g, ""), 1);
            }
        } else {
            //need i18n
            MessageBox("COMMON_PLEASE_SELECT_SOURCE_ACCOUNT");
        }
        //$state.go('tcbconfirmation');
    }

    if (!$scope.transferDetails || $scope.transferDetails.amount == null || $scope.transferDetails.amount == '' || $scope.transferDetails.amount <= 0)
        $scope.validAmount = false;
    else
        $scope.validAmount = true;

    $('input#amount').focus(function () {
        $(this).prop('type', 'number').val($scope.transferDetails.amount);
    }).blur(function () {
        var self = $(this), value = self.val();
        $scope.transferDetails.amount = value;

        $scope.transferDetails.parsedAmount = '';

        if (value)
            $scope.transferDetails.parsedAmount = parseInt(value).formatMoney(0);

        self.data('number', value).prop('type', 'text').val($scope.transferDetails.parsedAmount);
    });

    $scope.change = function () {
        if ($scope.transferDetails.parsedAmount && parseInt($scope.transferDetails.parsedAmount) > 0)
            $scope.validAmount = true;
        else
            $scope.validAmount = false;
    };

    $scope.openBenificiaryList = function () {
        $rootScope.suppressDialog = true;
        tcbTransferFactory.setTransferDetails($scope.transferDetails);
        $state.go('tcbbeneficiarylist');
    }

    $scope.clickSelectAccount = function () {
        if ($scope.hasMoreThanOneSourceAccounts == true) {
            tcbTransferFactory.setTransferDetails($scope.transferDetails);
            tcbTransferFactory.transferType = "local";
            $state.go('tcbselectaccount');
        }

    }
    //Key in account number field ng-model = transferDetails.messageContent
    //Key in amount field ng-model = transferDetails.amount

    function appLoadBack(r) {
        $scope.loading = false;
        $rootScope.safetyApply(function(){});
        if (preAuthoriseBack(r)) {
            if (r.MoneyFee !== undefined && r.MoneyFee != null && r.MoneyFee.length > 0) {
                var fee = r.MoneyFee[0];
                $scope.transferDetails.transferFee = (fee.value + fee.vat);
            } else {
                $scope.transferDetails.transferFee = 0;
            }
            tcbTransferFactory.setTransferDetails($scope.transferDetails);
            $state.go('tcbconfirmation');
        } else {
            appstate = trans.TRAN_IDLE;
        }
    }

    function unloadSVA() {
        var loadinfo = [];
        loadinfo["loadamount"] = $scope.transferDetails.amount ? parseFloat($scope.transferDetails.amount) : 0;
        loadinfo["loadtext"] = $scope.transferDetails.messageContent;
        loadinfo["fromacct"] = $scope.transferDetails.accountType;
        loadinfo["toacct"] = $scope.transferDetails.destinationAccountDetails.payeeAccountType + " " + $scope.transferDetails.destinationAccountDetails.payeeAccountNumber;
        loadinfo["fee"] = 0;
        loadinfo["sysid"] = '';
        loadinfo["referno"] = '';
        session.transit_value = loadinfo;

        var payer = {};
        payer.identifier = {};
        payer.identifier.type = "1";
        payer.identifier.value = session.customer.id;
        payer.paymentInstrumentId = $scope.transferDetails.paymentInstrumentId;

        var payee = {};
        payee.identifier = {};
        payee.identifier.type = "1";
        payee.identifier.value = session.customer.id;
        payee.paymentInstrumentId = $scope.transferDetails.destinationAccountDetails.paymentInstrumentId;

        var txn = new TxnData(1001, session.transit_value.loadamount,
            'order111', session.transit_value.loadtext);

        appstate = trans.TRAN_LOADSVA;
        $scope.loading = true;
        $rootScope.safetyApply(function(){});
        mc.load(appLoadBack, payer, payee, txn, true);
    }

    function CAtoCA() {
        console.log($scope.transferDetails);
        var loadinfo = [];
        loadinfo["loadamount"] = $scope.transferDetails.amount ? parseFloat($scope.transferDetails.amount) : 0;
        loadinfo["loadtext"] = $scope.transferDetails.messageContent;
        loadinfo["fromacct"] = $scope.transferDetails.accountType;
        loadinfo["toacct"] = $scope.transferDetails.destinationAccountDetails.payeeAccountType + " " + $scope.transferDetails.destinationAccountDetails.payeeAccountNumber;
        loadinfo["fee"] = 0;
        loadinfo["sysid"] = '';
        loadinfo["referno"] = '';
        session.transit_value = loadinfo;

        var payer = {};
        payer.identifier = {};
        payer.identifier.type = "1";
        payer.identifier.value = session.customer.id;
        payer.paymentInstrumentId = $scope.transferDetails.paymentInstrumentId;

        var payee = {};
        payee.identifier = {};
        payee.identifier.type = "1";
        payee.identifier.value = $scope.transferDetails.destinationAccountDetails.customerId;
        payee.paymentInstrumentId = $scope.transferDetails.destinationAccountDetails.paymentInstrumentId;
        var uc = 1002;
        if (payer.identifier.value == payee.identifier.value)
            uc = 1001;
        var txn = new TxnData(uc, session.transit_value.loadamount,
            'order111', session.transit_value.loadtext);

        appstate = trans.TRAN_LOADSVA;
        $scope.loading = true;
        $rootScope.safetyApply(function(){});
        mc.load(appLoadBack, payer, payee, txn, true);
    }

    function loadSVA() {
        var loadinfo = [];
        loadinfo["loadamount"] = $scope.transferDetails.amount ? parseFloat($scope.transferDetails.amount) : 0;
        loadinfo["loadtext"] = $scope.transferDetails.messageContent;
        loadinfo["fromacct"] = $scope.transferDetails.accountType;
        loadinfo["toacct"] = $scope.transferDetails.destinationAccountDetails.payeeAccountType + " " + $scope.transferDetails.destinationAccountDetails.payeeAccountNumber;
        loadinfo["fee"] = 0;
        loadinfo["sysid"] = '';
        loadinfo["referno"] = '';
        session.transit_value = loadinfo;

        var payer = {};
        payer.identifier = {};
        payer.identifier.type = "1";
        payer.identifier.value = session.customer.id;
        payer.paymentInstrumentId = $scope.transferDetails.paymentInstrumentId;

        var payee = {};
        payee.identifier = {};
        payee.identifier.type = "1";
        payee.identifier.value = session.customer.id;
        payee.paymentInstrumentId = $scope.transferDetails.destinationAccountDetails.paymentInstrumentId;

        var txn = new TxnData(1001, session.transit_value.loadamount,
            'order111', session.transit_value.loadtext);
        appstate = trans.TRAN_LOADSVA;
        $scope.loading = true;
        $rootScope.safetyApply(function(){});
        mc.load(appLoadBack, payer, payee, txn, true);
    }

    if ($state.current.name == 'tcbindex') {
        var baseStatus;

        if ($rootScope.previousState.name == 'dashboard.home') {
            var baseStatus = {
                isBack: true,
                onBack: function () {
                    tcbTransferFactory.resetTransferDetails();
                    $state.go($rootScope.previousState.name);

                    var newIndex = statuses.indexOf($scope.status) - 1;
                    if (newIndex > -1) {
                        $scope.status = statuses[newIndex];
                        $scope.status.move = 'ltr';
                        $scope.navigationBarStatus = $scope.status;
                    }
                }
            };
        }
        else {
            baseStatus = {
                isBack: true,
                onBack: function () {

                    tcbTransferFactory.resetTransferDetails();
                    if ($rootScope.previousState.name == 'accounts' || $rootScope.previousState.name == 'accountDetails' || $rootScope.previousState.name == 'dashboard.transferhome' || $rootScope.previousState.name == 'beneficiarysearch')
                        $state.go($rootScope.previousState.name);
                    else
                        $state.go('dashboard.transferhome');


                    var newIndex = statuses.indexOf($scope.status) - 1;
                    if (newIndex > -1) {
                        $scope.status = statuses[newIndex];
                        $scope.status.move = 'ltr';
                        $scope.navigationBarStatus = $scope.status;
                    }
                },
                isClose: true,
                onAction: function () {
                    tcbTransferFactory.resetTransferDetails();
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
            angular.extend({title: 'NAVBAR_TCB'}, baseStatus)
        ];
        $scope.status = statuses[0];
    }
    function createBeneficiaryBack(r) {
        //
    }

    $scope.changeAccountNumber = function () {
        //
        $scope.validAccount = false;
        var acc = lookupBenAccount($scope.transferDetails.destinationAccountDetails.payeeAccountNumber);
        if (acc != null) {
            console.log("ACC", acc);
            $scope.transferDetails.destinationAccountDetails.payeeName = acc.name;
            $scope.transferDetails.destinationAccountDetails.payeeAccountType = acc.type;
            if (acc.paymentInstrumentId) {
                $scope.transferDetails.destinationAccountDetails.paymentInstrumentId = acc.paymentInstrumentId;
            }
            $scope.validAccount = true;
            $rootScope.safetyApply(function(){});
            return;
        }
        if ($scope.transferDetails.destinationAccountDetails.payeeAccountNumber !== undefined &&
            $scope.transferDetails.destinationAccountDetails.payeeAccountNumber.length == 14)
            mc.getPaymentInstrument(getPaymentInstrumentBack2, $scope.transferDetails.destinationAccountDetails.payeeAccountNumber, 2);
        else if (
            $scope.transferDetails.destinationAccountDetails.payeeAccountNumber !== undefined &&
            isValidNumber($scope.transferDetails.destinationAccountDetails.payeeAccountNumber, "vn") && $scope.transferDetails.destinationAccountDetails.payeeAccountNumber.length > 9) {
            mc.getPaymentInstrument(getPaymentInstrumentBack2, formatLocal("vn", $scope.transferDetails.destinationAccountDetails.payeeAccountNumber).replace(/[^0-9]/g, ""), 1);
        } else {
            $scope.transferDetails.destinationAccountDetails.payeeName = "";
            setTimeout(function () {
                $rootScope.safetyApply(function(){});
            }, 0);
        }
    }

    function getPaymentInstrumentBack2(r) {
        //console.log("???");
        if (r.Status.code == 0) {
            if (r.PaymentInstrument !== undefined) {
                $scope.transferDetails.destinationAccountDetails.paymentInstrumentId = r.PaymentInstrument.id;
                $scope.transferDetails.destinationAccountDetails.customerId = r.PaymentInstrument.customerId;
                if (r.PaymentInstrument.type == 0) {
                    //SVA
                    $scope.transferDetails.destinationAccountDetails.payeeAccountType = "COMMON_SVA_ACCOUNT";
                    if (r.PaymentInstrument.spareFields != null)
                        if (r.PaymentInstrument.spareFields.spareString2 != null)
                            $scope.transferDetails.destinationAccountDetails.payeeName = r.PaymentInstrument.spareFields.spareString2;
                        else
                            $scope.transferDetails.destinationAccountDetails.payeeName = r.PaymentInstrument.spareFields.spareString1;
                    else if (r.PaymentInstrument.customerId == session.customer.id) {
                        //Holder
                        $scope.transferDetails.destinationAccountDetails.payeeName = session.customer.displayName;
                        $scope.transferDetails.destinationAccountDetails.payeeAccountType = "COMMON_SVA_SAME_HOLDER";
                    }
                    tcbTransferFactory.setTransferDetails($scope.transferDetails);
                    $scope.validAccount = true;
                } else {
                    //Bank Account
                    $scope.transferDetails.destinationAccountDetails.accountType = "COMMON_BANK_ACCOUNT";
                    $scope.transferDetails.destinationAccountDetails.payeeName = r.PaymentInstrument.accountHolderName;
                    tcbTransferFactory.setTransferDetails($scope.transferDetails);
                    $scope.validAccount = true;
                }
                console.log($scope.transferDetails.destinationAccountDetails);

            } else {
                $scope.transferDetails.destinationAccountDetails.payeeName = "";
                $scope.transferDetails.destinationAccountDetails.paymentInstrumentId = "";
                $scope.transferDetails.destinationAccountDetails.customerId = "";
            }
        } else {
            $scope.transferDetails.destinationAccountDetails.payeeName = "";
            $scope.transferDetails.destinationAccountDetails.paymentInstrumentId = "";
            $scope.transferDetails.destinationAccountDetails.customerId = "";
            ErrorBox(r.Status);
        }
        $rootScope.safetyApply(function(){});
    }

    var contactNumber;

    var successCallback = function (success) {

        if (success.phoneNumber != "Cancel") {
            $scope.loading = true;
            $rootScope.safetyApply(function(){});
            contactNumber = formatLocal("vn", success.phoneNumber).replace(/[^0-9]/g, "");
            //check if phone number is using mobile banking
            mc.getPaymentInstrument(getPiByContactBack, contactNumber, 1);
        }
    };

    var error = function (error) {
        MessageBox('Error \r\n' + error.statusMsg);
    };

    //don't display phone number validation popup when click select contact
    $('#selectContact').on('touchstart mousedown', function () {
        $rootScope.suppressDialog = true;
    });

    //don't display phone number validation popup when selecting beneficiary
    $('#beneficiaryListIcon').on('touchstart mousedown', function () {
        $rootScope.suppressDialog = true;
    });

    $scope.selectContact = function () {
        $rootScope.suppressDialog = false;
        TCBNativeBridge.getAddressBook(successCallback, error, 'SMS');
    }

    function getPiByContactBack(r) {
        $scope.loading = false;
        if (r.Status.code == 0) {
            if (r.PaymentInstrument !== undefined) {
                $scope.transferDetails.destinationAccountDetails.paymentInstrumentId = r.PaymentInstrument.id;
                $scope.transferDetails.destinationAccountDetails.customerId = r.PaymentInstrument.customerId;
                if (r.PaymentInstrument.type == 0) {
                    //SVA
                    $scope.transferDetails.destinationAccountDetails.payeeAccountType = "COMMON_SVA_ACCOUNT";
                    if (r.PaymentInstrument.spareFields != null) {
                        if (r.PaymentInstrument.spareFields.spareString2 != null) {
                            $scope.transferDetails.destinationAccountDetails.payeeName = r.PaymentInstrument.spareFields.spareString2;
                        } else {
                            $scope.transferDetails.destinationAccountDetails.payeeName = r.PaymentInstrument.spareFields.spareString1;
                        }
                    } else if (r.PaymentInstrument.customerId == session.customer.id) {
                        //Holder
                        $scope.transferDetails.destinationAccountDetails.payeeName = session.customer.displayName;
                        $scope.transferDetails.destinationAccountDetails.payeeAccountType = "COMMON_SVA_SAME_HOLDER";
                    }
                    $scope.transferDetails.destinationAccountDetails.payeeAccountNumber = contactNumber;
                    tcbTransferFactory.setTransferDetails($scope.transferDetails);
                    $scope.validAccount = true;
                }
            } else {
                $scope.transferDetails.destinationAccountDetails.payeeName = "";
                $scope.transferDetails.destinationAccountDetails.payeeAccountNumber = "";

                var vnMessage = "Số điện thoại " + contactNumber + " chưa đăng ký dịch vụ F@st Mobile";
                var enMessage = "Phone number " + contactNumber + " has not been registered for F@st Mobile";

                if ($("#app-container").scope().languageCode) {
                    MessageBox(enMessage);
                } else {
                    MessageBox(vnMessage);
                }
            }
        } else {
            console.log('error calling smartphone service');
            $scope.transferDetails.destinationAccountDetails.payeeName = "";
            $scope.transferDetails.destinationAccountDetails.payeeAccountNumber = "";
        }
        $rootScope.safetyApply(function(){});
    }
}]);