/**
 *  @overview
 * This is the actual response handling and processing of the web service calls
 * that are made by the MobiliserClient class. Any manipulation of the response,
 * extraction of needed data and the making of Data Objects (DO) out of the XML
 * document would be inserted here.
 *
 * @name SY_Transactions.js
 * @author SAP AG
 * @version 1.0
 *
 */

/**
  @function

  @param  r This is the XML document/JSON object that is returned by the AJAX call made by the MobiliserClient.
 */
var loginBack = function(r) {
    var rCode = getStatusCode(r);
    if (appstate == trans.TRAN_LOGIN) {
        if(rCode == '0') {
            loginParseXML(r);
            return true;
        } else {
            MessageBox(Str_alert_loignfailed + getErrorMessage(r));
            return false;
        }
    }
};

/**
  @function

  @param  r This is the XML document/JSON object that is returned by the AJAX call made by the MobiliserClient.
 */
var fbssologinBack = function(r) {
    var rCode = getStatusCode(r);
    if(rCode == '0') {
        fbssloginParseXML(r);
        return true;
    } else {
        MessageBox(Str_msg_failfacebooksso + getErrorMessage(r));
        return false;
    }
};

/**
  @function

  @param  r This is the XML document/JSON object that is returned by the AJAX call made by the MobiliserClient.
 */
var getRsaPublicKeyBack = function(r) {
    var rCode = getStatusCode(r);
    if("0" === rCode) {
        if (!session.keys) {
            session.keys = [];
        }
        session.keys[session.keyType] = r.key;
        return true;
    } else {
        MessageBox(Str_msg_failgetpublickey + getErrorMessage(r));
        return false;
    }
};

/**
  @function

  @param  r This is the XML document/JSON object that is returned by the AJAX call made by the MobiliserClient.
 */
var logoutBack = function(r) {
    var rCode = getStatusCode(r);
    if(rCode == '0') {
        $.mobile.changePage("login.html", page_opt);
        session = new LoginSession();
        return true;
    } else {
        MessageBox(Str_alert_logoutfailed + getErrorMessage(r));
        return false;
    }
};

/**
  @function

  @param  r This is the XML document/JSON object that is returned by the AJAX call made by the MobiliserClient.
 */
var changeCredentialBack = function(r) {
    hideProgress();

    var rCode = getStatusCode(r);
    if (appstate == trans.TRAN_CHANGEPIN) {
        if (rCode == '0') {
            // if succeeded then...
            $.mobile.changePage("changepindone.html", page_opt);
        } else {
            // if failed then...
            MessageBox(Str_alert_changepinfailed + getErrorMessage(r));
        }
    }
    appstate = trans.TRAN_IDLE;
};

/**
@function

@param  r This is the XML document/JSON object that is returned by the AJAX call made by the MobiliserClient.
*/
var checkCredentialBack = function(r) {
    var rCode = getStatusCode(r);
    if (rCode == '0') {
        if (appstate == trans.TRAN_BLOCKACCOUNT) {
            mc.updateCustomerBlockAccount(updateCustomerBack);
        } else {
            hideProgress();
            appstate = trans.TRAN_IDLE;
            MessageBox(Str_alert_correctpin);
            $.mobile.changePage("manage.html", page_opt);
        }
    } else {
        hideProgress();
        appstate = trans.TRAN_IDLE;
        MessageBox(getErrorMessage(r));
        $("#blockpin").val('');
    }
};

/**
  @function

  @param  r This is the XML document/JSON object that is returned by the AJAX call made by the MobiliserClient.
 */
var balanceInquiryBack = function(r) {
    var rCode = getStatusCode(r);
    if (rCode == '0') {
        session.pibalance= parseReturnEntry(r, 'Balance');
        return true;
    } else {
        MessageBox(Str_alert_balanceenqfailed + getErrorMessage(r));
        return false;
    }
};

/**
  @function

  @param  r This is the XML document/JSON object that is returned by the AJAX call made by the MobiliserClient.
 */
var getWalletBack = function(r) {
    //console.log("getWallet:" + JSON.stringify(r));
    var rCode = getStatusCode(r);
    if (rCode == '0') {
        walletParseXML(r);
        return true;
    } else {
        MessageBox(Str_alert_gettingwalletfailed + getErrorMessage(r));
        return false;
    }
};

/**
  @function

@param  xmlHttpReq
*/
var updateBankAccountBack = function(r) {
    var rCode = getStatusCode(r);
    if (rCode == '0') {
        return true;
    } else {
        MessageBox(Str_alert_updatepayfailed + getErrorMessage(r));
        return false;
    }
};

/**
  @function

@param  xmlHttpReq
*/
var setPrimaryBack = function(r) {
    var rCode = getStatusCode(r);
    if (rCode == '0') {
        return true;
    } else {
        MessageBox(Str_alert_primarywalletfail + getErrorMessage(r));
        return false;
    }
};

/**
  @function

  @param  r This is the XML document/JSON object that is returned by the AJAX call made by the MobiliserClient.
 */
var createWalletEntryBack = function(r) {
    var rCode = getStatusCode(r);
    if (rCode == '0') {
        return true;
    } else {
        MessageBox(Str_alert_addwalletentry + Str_alert_isfailed + getErrorMessage(r));
        return false;
    }
};

/**
  @function

  @param  r This is the XML document/JSON object that is returned by the AJAX call made by the MobiliserClient.
 */
var updateWalletEntryBack = function(r) {
    var rCode = getStatusCode(r);
    if (rCode == '0') {
        return true;
    } else {
        MessageBox(Str_alert_editwallet + Str_alert_isfailed + getErrorMessage(r));
        return false;
    }
};

/**
  @function

  @param  r This is the XML document/JSON object that is returned by the AJAX call made by the MobiliserClient.
 */
var deleteBankWalletEntryBack = function(r) {
    var rCode = getStatusCode(r);
    if (rCode == '0') {
        return true;
    } else {
        MessageBox(Str_alert_removewallet + Str_alert_isfailed + getErrorMessage(r));
        return false;
    }
};

/**
  @function

  @param  r This is the XML document/JSON object that is returned by the AJAX call made by the MobiliserClient.
 */
var deleteCardWalletEntryBack = function(r) {
    var rCode = getStatusCode(r);
    if (rCode == '0') {
        return true;
    } else {
        MessageBox(Str_alert_removecreditcard + Str_alert_isfailed + getErrorMessage(r));
        return false;
    }
};

/**
 * @description
 */
var deleteCustomerAlertByCustomerAndDataBack = function(r) {
    var rCode = getStatusCode(r);
    if (rCode == '0') {
        return true;
    } else {
        MessageBox(Str_alert_assoalertfailed + getErrorMessage(r));
        return false;
    }
};

/**
  @function

  @param  r This is the XML document/JSON object that is returned by the AJAX call made by the MobiliserClient.
 */
 var createSmsTokenBack = function(r) {
    hideProgress();

    var rCode = getStatusCode(r);
    if (appstate == trans.TRAN_CREATESMSTOKEN) {
        if (rCode == '0') {
            $.mobile.changePage("regpin.html", page_opt);
        } else {
            MessageBox(Str_alert_smstokenfailed + getErrorMessage(r));
        }
    }
    appstate = trans.TRAN_IDLE;
};

/**
  @function

  @param  r This is the XML document/JSON object that is returned by the AJAX call made by the MobiliserClient.
 */
var createFullCustomerBack = function(r) {
    hideProgress();

    var rCode = getStatusCode(r);
    if (appstate == trans.TRAN_CREATECUSTOMER) {
        if (rCode == '0') {
            var customerId = parseReturnEntry(r, 'customerId');
            $.mobile.changePage("regdone.html", page_opt);
        } else {
            MessageBox(Str_alert_createcustomerfailed + getErrorMessage(r));
        }
    }
    appstate = trans.TRAN_IDLE;
};

/**
  @function

  @param  r This is the XML document/JSON object that is returned by the AJAX call made by the MobiliserClient.
 */
var updateCustomerBack = function(r) {
    hideProgress();

    var rCode = getStatusCode(r);
    if (appstate == trans.TRAN_BLOCKACCOUNT) {
        if (rCode == '0') {
            MessageBox(Str_alert_accountblocked);
            $("#username").val('');
            $.mobile.changePage("login.html", page_opt);
        } else {
            hideProgress();
            MessageBox(Str_alert_blockfailed + getErrorMessage(r));
        }
    } else if (appstate == trans.TRAN_NOTIFICATION) {
        if (rCode == '0') {
            var mode = 0;
            if($('#checkbox-sms').is(':checked') && $('#marketpref').val() == "on")
                mode = mode | 1;
            if($('#checkbox-email').is(':checked') && $('#marketpref').val() == "on")
                mode = mode | 2;
            session.customer.modeId = mode;

             MessageBox(Str_alert_notificationsaved);
             $.mobile.changePage("manage.html", page_opt);
        } else {
            MessageBox(Str_alert_notificationfailed + getErrorMessage(r));
        }
    }
    appstate = trans.TRAN_IDLE;
};

/**
  @function

  @param  r This is the XML document/JSON object that is returned by the AJAX call made by the MobiliserClient.
 */
var createIdentificationBack = function(r) {
    var rCode = getStatusCode(r);
    if (appstate == trans.TRAN_CREATECUSTOMER) {
        if (rCode == '0') {
            mc.setCredential(registerPinBack, parseReturnEntry(r, 'customerId'), $('#mobilepin').val(), "0");
        } else {
            hideProgress();
            appstate = trans.TRAN_IDLE;
            MessageBox(Str_alert_identificationfailed + getErrorMessage(r));
        }
    }
};

/**
  @function

  @param  r This is the XML document/JSON object that is returned by the AJAX call made by the MobiliserClient.
 */
var getIdentificationsBack = function(r) {
    var rCode = getStatusCode(r);
    //console.log("getIdentifications:" + JSON.stringify(r));
    if (rCode == '0') {
        session.msisdn = parseIdentification(r);
        return true;
    } else {
        MessageBox(Str_alert_getidentificationfailed + getErrorMessage(r));
        return false;
    }
};

/**
  @function

  @param  r This is the XML document/JSON object that is returned by the AJAX call made by the MobiliserClient.
 */
var registerPinBack = function(r) {
    var rCode = getStatusCode(r);
    if (appstate == trans.TRAN_CREATECUSTOMER) {
        if (rCode == '0') {
            mc.setCredential(registerPasswordBack, session.customer.id, $('#webpwd').val(), "1");
        } else {
            hideProgress();
            appstate = trans.TRAN_IDLE;
            MessageBox(Str_alert_registercustomerpinfailed + getErrorMessage(r));
        }
    }
};

/**
  @function

  @param  r This is the XML document/JSON object that is returned by the AJAX call made by the MobiliserClient.
 */
var registerPasswordBack = function(r) {
    var rCode = getStatusCode(r);
    if (appstate == trans.TRAN_CREATECUSTOMER) {
        if (rCode == '0') {
            mc.createIdentification(registerBack, session.customer.id, msisdnformat($('#phoneno').val()), "0");
        } else {
            hideProgress();
            appstate = trans.TRAN_IDLE;
            MessageBox(Str_alert_customerpasswordfailed + getErrorMessage(r));
        }
    }
};

/**
  @function

  @param  r This is the XML document/JSON object that is returned by the AJAX call made by the MobiliserClient.
 */
var registerBack = function(r) {
    hideProgress();

    var rCode = getStatusCode(r);
    if (appstate == trans.TRAN_CREATECUSTOMER) {
        if (rCode == '0') {
            $.mobile.changePage("regpin.html", page_opt);
        } else {
            MessageBox(Str_alert_createcustomerfailed + getErrorMessage(r));
        }
    }
    appstate = trans.TRAN_IDLE;
};

/**
  @function

  @param  r This is the XML document/JSON object that is returned by the AJAX call made by the MobiliserClient.
 */
var findTxnsBack = function(r) {
    var rCode = getStatusCode(r);
    if (appstate == trans.TRAN_TXN) {
        if (rCode == '0') {
            if (txnsParseXML(r))
                return true;
            else {
                MessageBox(Str_alert_notransactionhistory);
                return false;
            }
        } else {
            MessageBox(Str_alert_gettransactionhistoryfailed + getErrorMessage(r));
            return false;
        }
    }
};

/**
@function

@param  r This is the XML document/JSON object that is returned by the AJAX call made by the MobiliserClient.
*/
var getTxnDetailsBack = function(r) {
    var rCode = getStatusCode(r);
    if (appstate == trans.TRAN_TXN) {
        if (rCode == '0') {
            session.transit_value = txnDetailParse(r);
            return true;
        } else {
            MessageBox(Str_alert_transactiondetailfailed + getErrorMessage(r));
            return false;
        }
    }
};

/**
  @function

  @param  r This is the XML document/JSON object that is returned by the AJAX call made by the MobiliserClient.
 */
var getInvoiceTypesByGroupBack = function(r) {
    hideProgress();

    var rCode = getStatusCode(r);
    if (appstate == trans.TRAN_TOPUP) {
        if (rCode == '0') {
            if (parseGroupInvoiceTypes(r))
                $.mobile.changePage("prepaid.html", page_opt);
            else {
                appstate = trans.TRAN_IDLE;
                MessageBox(Str_alert_nooperatorregistered);
            }
        } else {
            // if failed then...
            appstate = trans.TRAN_IDLE;
            MessageBox(Str_alert_getinvoicetypefailed + getErrorMessage(r));
        }
    }
};

/**
  @function

  @param  r This is the XML document/JSON object that is returned by the AJAX call made by the MobiliserClient.
 */
var createInvoiceForInvoiceTypeBack = function(r) {
    var rCode = getStatusCode(r);
    if (appstate == trans.TRAN_TOPUP) {
        if (rCode == '0') {
            mc.topUp(topUpCallBack, parseReturnEntry(r, 'invoiceId'));
        } else {
            hideProgress();
            appstate = trans.TRAN_IDLE;
            MessageBox(Str_alert_getinvoicetypefailed + getErrorMessage(r));
        }
    }
};

/**
  @function

  @param  r This is the XML document/JSON object that is returned by the AJAX call made by the MobiliserClient.
 */
var getBillTypeBack = function(r) {
    var rCode = getStatusCode(r);
    if (appstate == trans.TRAN_ENTERPAYBILL) {
        if (rCode == '0') {
            session.billTypes = [];
            parseInvoiceTypes(r);
            mc.getRegisteredBills(registeredBillsBack, session.customer.id);
        } else {
            hideProgress();
            appstate = trans.TRAN_IDLE;
            MessageBox(Str_alert_getbilltypefailed + getErrorMessage(r));
        }
    }
};

/**
  @function

  @param  r This is the XML document/JSON object that is returned by the AJAX call made by the MobiliserClient.
 */
var registeredBillsBack = function(r) {
    var rCode = getStatusCode(r);
    if (rCode == '0') {
        session.registeredbill = [];
        userbills = parseRegisteredBills(r);

        if( appstate == trans.TRAN_ENTERPAYBILL ) {
            mc.getOpenInvoices(getOpenInvoicesBack, session.customer.id);
        } else if ( appstate == trans.TRAN_PAYANEWBILL ) {
            hideProgress();
            appstate = trans.TRAN_IDLE;

            if (userbills) {
                $.mobile.changePage("paybilldetail.html", page_opt);
            } else
                MessageBox(Str_alert_registerbill);
        }
    } else {
        hideProgress();
        appstate = trans.TRAN_IDLE;
        MessageBox(Str_alert_registerbillfailed + getErrorMessage(r));
    }
};

/**
  @function

  @param  r This is the XML document/JSON object that is returned by the AJAX call made by the MobiliserClient.
 */
var registerSimpleBack = function(r) {
    hideProgress();

    var rCode = getStatusCode(r);
    if (appstate == trans.TRAN_REGISTERBILL) {
        if (rCode == '0') {
            MessageBox(Str_alert_registerbillsuccess);
            $.mobile.changePage("paybill.html", page_opt);
        } else {
            MessageBox(Str_alert_registersimplebackfailed + getErrorMessage(r));
        }
    }
    appstate = trans.TRAN_IDLE;
};

/**
  @function

  @param  r This is the XML document/JSON object that is returned by the AJAX call made by the MobiliserClient.
 */
var getOpenInvoicesBack = function(r) {
    hideProgress();

    var rCode = getStatusCode(r);
    if (rCode == '0') {
        var h1 = 0;
        var h2 = 0;
        session.openRequestArray = [];
        session.openBillArray = [];
        parseOpenInvoices(r);

        if (appstate == trans.TRAN_ENTERPAYBILL)
            $.mobile.changePage("paybill.html", page_opt);
        else if (appstate == trans.TRAN_SENDBILL)
            $.mobile.changePage("paybilldone.html", page_opt);
    } else {
        MessageBox(Str_alert_openinvoicefailed + getErrorMessage(r));
    }
    appstate = trans.TRAN_IDLE;
};

/**
  @function

  @param  r This is the XML document/JSON object that is returned by the AJAX call made by the MobiliserClient.
 */
var createInvoiceBack = function(r) {
    var rCode = getStatusCode(r);
    if (appstate == trans.TRAN_SENDBILL) {
        if (rCode == '0') {
            session.transit_value.invoiceId = parseReturnEntry(r, 'invoiceId');
            mc.payBill(payBillOrCancelBack, session.transit_value.invoiceId, $('#billfromaccount').val());
        } else {
            appstate = trans.TRAN_IDLE;
            hideProgress();
            MessageBox(Str_alert_createinvoicefailed + getErrorMessage(r));
        }
    }
};

/**
  @function

  @param  r This is the XML document/JSON object that is returned by the AJAX call made by the MobiliserClient.
 */
var preAuthoriseBack = function(r) {
    var rCode = getStatusCode(r);
    if (rCode == '0') {
        session.transit_value.sysid = parseTransactionSystemId(r);
        session.transit_value.referno = parseTransactionValue(r);
        session.transit_value.payerFee = parseTransactionFee(r, "false");
        session.transit_value.payeeFee = parseTransactionFee(r, "true");
        return true;
    } else if (rCode == '2501' && appstate == trans.TRAN_SENDMONEY) {
        return rCode;
    } else {
        ErrorBox(r.Status);
        return false;
    }
};

/**
  @function

  @param  r This is the XML document/JSON object that is returned by the AJAX call made by the MobiliserClient.
 */
var startVoucherBack = function(r) {
    var rCode = getStatusCode(r);
    if (appstate == trans.TRAN_SENDMONEY) {
        if (rCode == '0') {
            session.transit_value.sysid = parseTransactionSystemId(r);
            session.transit_value.referno = parseTransactionValue(r);
            session.transit_value.payerFee = parseTransactionFee(r, "false");
            session.transit_value.payeeFee = parseTransactionFee(r, "true");
            return true;
        } else {
            MessageBox(Str_alert_startvoucherfailed + getErrorMessage(r));
            return false;
        }
    }
};

/**
  @function

  @param  r This is the XML document/JSON object that is returned by the AJAX call made by the MobiliserClient.
*/
var confirmVoucherBack = function(r) {
    var rCode = getStatusCode(r);
    if (rCode == '0') {
        session.transit_value.sysid = parseTransactionSystemId(r);
        session.transit_value.referno = parsePickupCode(r);
        return true;
    } else {
        MessageBox(Str_alert_failedtoconfirmvoucher + getErrorMessage(r));
        return false;
    }
};

/**
  @function

  @param  r This is the XML document/JSON object that is returned by the AJAX call made by the MobiliserClient.
 */
var authoriseBack = function(r) {
    var failureMsg;

    var rCode = getStatusCode(r);
    if (appstate == trans.TRAN_SENDMONEY) {
        failureMsg = Str_alert_sendmoneyfailed;
    } else if (appstate == trans.TRAN_SENDREQUEST) {
        failureMsg = Str_alert_sendrequestfailed;
    } else if (appstate == trans.TRAN_LOADSVA) {
        failureMsg = Str_alert_loadSVAfailed;
    } else if (appstate == trans.TRAN_UNLOADSVA) {
        failureMsg = Str_alert_unloadsvafailed;
    }

    if (rCode == '0') {
        session.transit_value.sysid = parseTransactionSystemId(r);
        return true;
    } else {
        MessageBox(failureMsg + getErrorMessage(r));
        return false;
    }
};

/**
  @function

  @param  r This is the XML document/JSON object that is returned by the AJAX call made by the MobiliserClient.
 */
var demandForPaymentBack = function(r) {
    var rCode = getStatusCode(r);
    if (appstate == trans.TRAN_SENDREQUEST) {
        if (rCode == '0') {
            session.transit_value.sysid = parseReturnEntry(r, 'invoiceId');
            return true;
        } else {
            MessageBox(Str_alert_sendrequestfailed + getErrorMessage(r));
            return false;
        }
    }
};

/**
  @function

  @param  r This is the XML document/JSON object that is returned by the AJAX call made by the MobiliserClient.
 */
var topUpCallBack = function(r) {
    _payBillOrCancelBack(r, true);
};

/**
  @function

  @param  r This is the XML document/JSON object that is returned by the AJAX call made by the MobiliserClient.
 */
var payBillOrCancelBack = function(r) {
    _payBillOrCancelBack(r, true);
};

/**
  @function

  @param  r This is the XML document/JSON object that is returned by the AJAX call made by the MobiliserClient.
 */
var payBillBack = function(r) {
    _payBillOrCancelBack(r, false);
};

/**
  @function

  @param  r This is the XML document/JSON object that is returned by the AJAX call made by the MobiliserClient.
  @param  doCancel The flag to trigger cancel action.
  */
function _payBillOrCancelBack(r, doCancel) {
    var nextPage;
    var errmsg = null;
    if (appstate == trans.TRAN_SENDBILL) {
        nextPage = "paybillconfirm";
        errmsg = Str_alert_paybillfailed;
    } else if (appstate == trans.TRAN_TOPUP) {
        nextPage = "prepaidconfirm";
        errmsg = Str_alert_topupfailed;
    }

    var rCode = getStatusCode(r);
    if (rCode == '0') {
        session.transit_value.sysid = parseTransactionSystemId(r);
        session.transit_value.referno = parseTransactionValue(r);
        session.transit_value.payerFee = parseTransactionFee(r, "false");
        session.transit_value.payeeFee = parseTransactionFee(r, "true");
        $.mobile.changePage(nextPage + ".html", page_opt);
        hideProgress();
    } else {
        if (trans.TRAN_TOPUP != appstate && doCancel) { //openbill TRAN_SENDBILL state
            MessageBox(errmsg + getErrorMessage(r) +'\n'+ Str_alert_cancelinvoiceno + session.transit_value.invoiceId);
            mc.cancelBill(cancelBillBack, session.transit_value.invoiceId);
        } else {
            // if request fails to execute
            MessageBox(errmsg + getErrorMessage(r));
            hideProgress();
            appstate = trans.TRAN_IDLE;
        }
    }
}

/**
  @function

  @param  r This is the XML document/JSON object that is returned by the AJAX call made by the MobiliserClient.
 */
var continuePayOrCancelBack = function(r) {
    _continuePayInvoiceOrCancelBack(r, true);
};

/**
@function

@param  r This is the XML document/JSON object that is returned by the AJAX call made by the MobiliserClient.
*/
var continuePayBack = function(r) {
    _continuePayInvoiceOrCancelBack(r, false);
};

/**
@function

@param  r This is the XML document/JSON object that is returned by the AJAX call made by the MobiliserClient.
@param  doCancel The flag to trigger cancel action.
*/
function _continuePayInvoiceOrCancelBack(r, doCancel) {
    var nextPage;
    var errmsg = null;
    if (appstate == trans.TRAN_SENDBILL) {
        nextPage = "paybilldone";
        errmsg = Str_alert_paybillfailed;
    } else if (appstate == trans.TRAN_TOPUP) {
        nextPage = "prepaiddone";
        errmsg = Str_alert_topupfailed;
    }

    var rCode = getStatusCode(r);
    if (rCode == '0') {
        if (doCancel) {
            session.transit_value.sysid = parseTransactionSystemId(r);
            $.mobile.changePage(nextPage + ".html", page_opt);
            hideProgress();
            appstate = trans.TRAN_IDLE;
        } else { //openbill TRAN_SENDBILL state
            mc.getOpenInvoices(getOpenInvoicesBack, session.customer.id);
        }
    } else {
        if (doCancel) {
            MessageBox( errmsg + getErrorMessage(r) +'\n' + Str_alert_cancelinvoiceno + session.transit_value.invoiceId);
            mc.cancelBill(cancelBillBack, session.transit_value.invoiceId);
        } else { // if request fails to execute
            MessageBox(errmsg + getErrorMessage(r));
            hideProgress();
            appstate = trans.TRAN_IDLE;
        }
    }
}

/**
  @function

  @param  r This is the XML document/JSON object that is returned by the AJAX call made by the MobiliserClient.
 */
var cancelBillBack = function(r) {
    hideProgress();

    var rCode = getStatusCode(r);
    if (rCode != '0') {
        MessageBox(Str_alert_calncelinvoicefailed + getErrorMessage(r));
    }
    appstate = trans.TRAN_IDLE;
};

/**
  @function

  @param  r This is the XML document/JSON object that is returned by the AJAX call made by the MobiliserClient.
*/
var getBalanceAlertBack = function(r) {
    var rCode = getStatusCode(r);
    if (rCode == '0') {
        parseBalanceAlert(r);
        return true;
    } else {
        MessageBox(Str_alert_balancealertfailed + getErrorMessage(r));
        return false;
    }
};

/**
  @function

  @param  r This is the XML document/JSON object that is returned by the AJAX call made by the MobiliserClient.
*/
var createBalanceAlertBack = function(r) {
    var rCode = getStatusCode(r);
    if (rCode == '0') {
        return true;
    } else {
        MessageBox(Str_alert_addbalancealert + Str_alert_isfailed + getErrorMessage(r));
        return false;
    }
};

/**
  @function

  @param  r This is the XML document/JSON object that is returned by the AJAX call made by the MobiliserClient.
*/
var updateBalanceAlertBack = function(r) {
    var rCode = getStatusCode(r);
    if (rCode == '0') {
        return true;
    } else {
        MessageBox(Str_alert_editbalancealert + Str_alert_isfailed + getErrorMessage(r));
        return false;
    }
};

/**
  @function

  @param  r This is the XML document/JSON object that is returned by the AJAX call made by the MobiliserClient.
*/
var deleteBalanceAlertBack = function(r) {
    var rCode = getStatusCode(r);
    if (rCode == '0') {
        return true;
    } else {
        MessageBox(Str_alert_removebalancealert + Str_alert_isfailed + getErrorMessage(r));
        return false;
    }
};

/**
    @ResponseBack Coupon Features
 */

/**
@function

@param  r This is the XML document/JSON object that is returned by the AJAX call made by the MobiliserClient.
*/
var getMyCouponsBack = function(r) {
    var rCode = getStatusCode(r);
    if (rCode == '0') {
        couponparseXML(r);
        return true;
    } else {
        MessageBox(Str_alert_getcouponfailed + getErrorMessage(r));
        return false;
    }
};

/**
@function

@param  r This is the XML document/JSON object that is returned by the AJAX call made by the MobiliserClient.
*/
var deleteCouponBack = function(r) {
    var rCode = getStatusCode(r);
    if (rCode == '0') {
        MessageBox(Str_alert_coupondeletedsuccussfully);
        return true;
    } else {
        MessageBox(Str_alert_deletedcouponfailed + getErrorMessage(r));
        return false;
    }
};

/**
@function

@param  r This is the XML document/JSON object that is returned by the AJAX call made by the MobiliserClient.
*/
var purchaseCouponBack = function(r) {
    var rCode = getStatusCode(r);
    if (rCode == '0') {
        MessageBox(Str_alert_couponpurchasesuccess);
        return true;
    } else {
        MessageBox(Str_alert_couponpurchasefailed + getErrorMessage(r));
        return false;
    }
};

/**
@function

@param  r This is the XML document/JSON object that is returned by the AJAX call made by the MobiliserClient.
*/
var getRootCategoriesBack = function(r) {
    var rCode = getStatusCode(r);
    if (rCode == '0') {
        getRootCategoriesParseXML(r);
        return true;
    } else {
        MessageBox(Str_alert_rootcategoryfailed + getErrorMessage(r));
        return false;
    }
};

/**
@function

@param  r This is the XML document/JSON object that is returned by the AJAX call made by the MobiliserClient.
*/
var getCategoryTreeBack = function(r) {
    var rCode = getStatusCode(r);
    if (rCode == '0') {
         if (!getCategoryTreeBackParseXML(r))
             MessageBox(Str_alert_nocategoryavailable);
        return true;
    } else {
        MessageBox(Str_alert_rootcategoryfailed + getErrorMessage(r));
        return false;
    }
};

/**
@function

@param  r This is the XML document/JSON object that is returned by the AJAX call made by the MobiliserClient.
*/
var getChildCategoriesBack = function(r) {
    var rCode = getStatusCode(r);
    if (rCode == '0') {
        getChildCategoriesParseXML(r);
        return true;
    } else {
        MessageBox(Str_alert_childcategoryfailed + getErrorMessage(r));
        return false;
    }
};

/**
@function

@param  r This is the XML document/JSON object that is returned by the AJAX call made by the MobiliserClient.
*/
var getCouponTypesForCategoryBack = function(r) {
    var rCode = getStatusCode(r);
    if (rCode == '0') {
        getCouponTypesofCategoryParseXML(r);
        return true;
    } else {
        MessageBox(Str_alert_coupontypesfaild + getErrorMessage(r));
        return false;
    }
};

/**
@function

@param  r This is the XML document/JSON object that is returned by the AJAX call made by the MobiliserClient.
*/
var assignCouponBack = function(r) {
    var rCode = getStatusCode(r);
    if (rCode == '0') {
        MessageBox(Str_alert_couponaddedsuccess);
        return true;
    } else {
        MessageBox(Str_alert_assigncouponfailed + getErrorMessage(r));
        return false;
    }
};

/**
@function

@param  r This is the XML document/JSON object that is returned by the AJAX call made by the MobiliserClient.
*/
var findCouponTypesByTagsBack = function(r) {
    var rCode = getStatusCode(r);
    if (rCode == '0') {
        couponTypesByTagsparseXML(r);
        return true;
    } else {
        MessageBox(Str_alert_failedtogetcoupontypes + getErrorMessage(r));
        return false;
    }
};


/**
  @function retrieve upload URL

  @param  r This is the XML document/JSON object that is returned by the AJAX call made by the MobiliserClient.
 */
var getUploadPictureURLBack = function(r) {
    var rCode = getStatusCode(r);
    if (rCode == '0') {
        session.uploadUrl = parseReturnEntry(r, 'uploadUrl');
    } else {
        hideProgress();
        MessageBox(Str_alert_failgetuploadurl + getErrorMessage(r));
        appstate = trans.TRAN_IDLE;
    }
};

/**
  @function retrieve download URL

  @param  r This is the XML document/JSON object that is returned by the AJAX call made by the MobiliserClient.
 */
var downloadPictureURLBack = function(r) {
    var rCode = getStatusCode(r);
    if (rCode == '0') {
        session.downloads = [];
        if (r.pictures) {
            for (var i = 0, len = r.pictures.length, picture; i < len; i ++) {
                picture = r.pictures[i];
                session.downloads.push({url: picture.url, contentType: picture.contentType});
            }
        }
    } else
        MessageBox(Str_alert_failgetdownloadurl + getErrorMessage(r));
};

/**
  @function retrieve locations

  @param  r This is the XML document/JSON object that is returned by the AJAX call made by the MobiliserClient.
 */
var findNextAddressesBack = function(r) {
    var rCode = getStatusCode(r);
    if (rCode == '0') {
        session.locations = r.location;
    } else {
        hideProgress();
        MessageBox(Str_alert_failfindnextaddrs + getErrorMessage(r));
        appstate = trans.TRAN_IDLE;
    }
};

/**
  @function get Default TermAndConditions

  @param  r This is the XML document/JSON object that is returned by the AJAX call made by the MobiliserClient.
 */
var getDefaultTermAndConditionsBack = function(r) {
    var rCode = getStatusCode(r);
    if (rCode == '0') {
        session.defaultTermAndConditions = r.termAndCondition;
        return true;
    } else {
        MessageBox(Str_alert_failgetdefaulttandc + getErrorMessage(r));
        return false;
    }
};

/**
  @function get Open TermAndConditions

  @param  r This is the XML document/JSON object that is returned by the AJAX call made by the MobiliserClient.
 */
var getOpenTermAndConditionsBack = function(r) {
    var rCode = getStatusCode(r);
    if (rCode == '0') {
        session.openTermAndConditions = r.termAndCondition;
        return true;
    } else {
        MessageBox(Str_alert_failgetopentandc + getErrorMessage(r));
        return false;
    }
};

/**
  @function accept TermAndConditions

  @param  r This is the XML document/JSON object that is returned by the AJAX call made by the MobiliserClient.
 */
var acceptTermAndConditionsBack = function(r) {
    var rCode = getStatusCode(r);
    if (rCode == '0') {
        if (r.privileges)
            for (var i=0; i<r.privileges.length; i++)
                session.customer.privileges.push(r.privileges[i]);
        return true;
    } else {
        MessageBox(Str_alert_failaccepttandc + getErrorMessage(r));
        return false;
    }
};

/**
@function

@param  r This is the XML document/JSON object that is returned by the AJAX call made by the MobiliserClient.
*/
var findNextCouponTypesBack = function(r) {
    var rCode = getStatusCode(r);
    if (rCode == '0') {
        session.couponTypes = r.result;
        return true;
    } else {
        MessageBox(Str_alert_failedtogetcoupontypes + getErrorMessage(r));
        return false;
    }
};

/*****************************************************************************
 * Functions
 */

/**
  @function

  @param  r This is the XML document/JSON object that is returned by the AJAX call made by the MobiliserClient.
*/
function getStatusCode(r) {
    return r.Status.code.toString();
}

/**
  @function

  @param  r This is the XML document/JSON object that is returned by the AJAX call made by the MobiliserClient.
  @param  entryName This is string of the entry node name in XML document/JSON object.
*/
function parseReturnEntry(r, entryName) {
    return r[entryName];
}

/**
  @function

  @param  r This is the XML document/JSON object that is returned by the AJAX call made by the MobiliserClient.
  @param  entryName This is string of the entry node name in XML document/JSON object.
  @param  attrName This is string of attribute name of the entry node in XML document/JSON object.
*/
function parseReturnEntryAttr(r, entryName, attrName) {
    return r[entryName][attrName].toString();
}

/**
  @function

  @param  r This is the XML document/JSON object that is returned by the AJAX call made by the MobiliserClient.
*/
function parseIdentification(r) {
    var msisdn = null;
    if (r.identifications && r.identifications.length) {
        for(var i = 0;i < r.identifications.length;i++) {
            if (r.identifications[i].type == 0) {
                session.identification = r.identifications[i];
                msisdn = r.identifications[i].identification;
                break;
            }
        }
    }
    return msisdn;
}

/**
  @function

  @param  r This is the XML document/JSON object that is returned by the AJAX call made by the MobiliserClient.
*/
function parseTransactionSystemId(r) {
    if (r.Transaction && r.Transaction.systemId)
        return r.Transaction.systemId;
    else
        return null;
}

/**
  @function

  @param  r This is the XML document/JSON object that is returned by the AJAX call made by the MobiliserClient.
*/
function parseTransactionValue(r) {
    if (r.Transaction && r.Transaction.value)
        return r.Transaction.value;
    else
        return null;
}

/**
@function

@param  r This is the XML document/JSON object that is returned by the AJAX call made by the MobiliserClient.
*/
function parseTransactionFee(r, isPayee) {
    var transactionfee = 0;

	if (r.MoneyFee)
        for (var i=0; i<r.MoneyFee.length; i++)
            if (r.MoneyFee[i].payee == isPayee)
                transactionfee += parseFloat(r.MoneyFee[i].value);

    return transactionfee;
}

/**
  @function

  @param  r This is the XML document/JSON object that is returned by the AJAX call made by the MobiliserClient.
*/
function parseGroupInvoiceTypes(r) {
    // Callback to application processing
    if (r.invoiceType !== null) {
        session.transit_value = r.invoiceType;
        return r.invoiceType.length;
    } else
        return 0;
}

/**
  @function

  @param  r This is the XML document/JSON object that is returned by the AJAX call made by the MobiliserClient.
*/
function parseInvoiceTypes(r) {
    if (r.invoiceType !== null) {
        for (var i=0; i<r.invoiceType.length; i++) {
            session.billTypes[i] = new BillTypes();
            session.billTypes[i].billTypeId = r.invoiceType[i].id;
            session.billTypes[i].billTypeName = r.invoiceType[i].name;
            session.billTypes[i].billTypeGroupId = r.invoiceType[i].groupId;
        }
    }
}

/**
  @function

  @param  r This is the XML document/JSON object that is returned by the AJAX call made by the MobiliserClient.
*/
function parseRegisteredBills(r) {
    var userbills_number = 0;

    if (r.invoiceConfiguration !== null) {
        for (var i=0; i<r.invoiceConfiguration.length; i++) {
            session.registeredbill[i] = new Registeredbill();
            session.registeredbill[i].billConfigId = r.invoiceConfiguration[i].id;
            session.registeredbill[i].billTypeId = r.invoiceConfiguration[i].invoiceTypeId;
            session.registeredbill[i].alias =
                (r.invoiceConfiguration.alias === null) ? "" : r.invoiceConfiguration[i].alias;
            session.registeredbill[i].reference = r.invoiceConfiguration[i].reference;
            session.registeredbill[i].billTypeName = "";
            session.registeredbill[i].billTypeGroupId = "";
            for (var j=0; j<session.billTypes.length; j++) {
                if (session.billTypes[j].billTypeId == session.registeredbill[i].billTypeId) {
                    session.registeredbill[i].billTypeName = session.billTypes[j].billTypeName;
                    session.registeredbill[i].billTypeGroupId = session.billTypes[j].billTypeGroupId;
                    if (session.billTypes[j].billTypeGroupId == 0) {
                        userbills_number++;
                    }
                    break;
                }
            }
        }
    }
    return userbills_number;
}

/**
  @function

  @param  r This is the XML document/JSON object that is returned by the AJAX call made by the MobiliserClient.
*/
function parseOpenInvoices(r) {
    var h1=0;
    var h2=0;

    if (r.invoice !== null) {
        for (var i=0; i<r.invoice.length; i++) {
            var date = (r.invoice[i].data === null) ? "-" : epoch2UTC(r.invoice[i].date).split("T")[0];

            for (var j=0; j<session.registeredbill.length; j++) {
                if (r.invoice[i].invoiceConfigurationId == session.registeredbill[j].billConfigId) {
                    var billTypeName = session.registeredbill[j].alias + ":" +
                                        session.registeredbill[j].billTypeName;
                    var invConfReference = session.registeredbill[j].reference;

                    if (session.registeredbill[j].billTypeGroupId == 3) {
                        session.openRequestArray[h1] = new OpenBill();
                        session.openRequestArray[h1].billId = r.invoice[i].id;
                        session.openRequestArray[h1].billTypeName = billTypeName;
                        session.openRequestArray[h1].dueDate = date;
                        session.openRequestArray[h1].amount = r.invoice[i].amount / 100;
                        session.openRequestArray[h1].reference = invConfReference;
                        session.openRequestArray[h1].billreference = r.invoice[i].reference;
                        h1++;
                    } else if (session.registeredbill[j].billTypeGroupId == 0) {
                        session.openBillArray[h2] = new OpenBill();
                        session.openBillArray[h2].billId = r.invoice[i].id;
                        session.openBillArray[h2].billTypeName = billTypeName;
                        session.openBillArray[h2].dueDate = date;
                        session.openBillArray[h2].amount = r.invoice[i].amount / 100;
                        session.openBillArray[h2].reference = invConfReference;
                        session.openBillArray[h2].billreference = r.invoice[i].reference;
                        h2++;
                    }
                    break;
                }
            }
        }
    }
}

/**
  @function

  @param  r This is the XML document/JSON object that is returned by the AJAX call made by the MobiliserClient.
*/
function parsePickupCode(r) {
    for (var i=0; i<r.UnstructuredData.length; i++)
        if (r.UnstructuredData[i].Key == "PickupCode") {
            return r.UnstructuredData[i].Value;
            break;
        }
    return null;
}

/**
  @function

  @param  r This is the XML document/JSON object that is returned by the AJAX call made by the MobiliserClient.
*/
function parseBalanceAlert(r) {
    session.svaalert = [];
    for (var i=0; i<r.BalanceAlerts.length; i++) {
        session.svaalert[i] = new BalanceAlert();
        session.svaalert[i].id = r.BalanceAlerts[i].id;
        session.svaalert[i].paymentInstrumentId = r.BalanceAlerts[i].paymentInstrumentId;
        session.svaalert[i].threshold = r.BalanceAlerts[i].threshold / 100;
        session.svaalert[i].active = r.BalanceAlerts[i].active;
        session.svaalert[i].onlyTransition = r.BalanceAlerts[i].onlyTransition;
        session.svaalert[i].templateName = r.BalanceAlerts[i].templateName;
    }
}

/**
  @function

  @param  response This is the XML document/JSON object that is returned by the AJAX call made by the MobiliserClient.
 */
function loginParseXML(response) {
    if (response.sessionId !== null)
        session.sessionId = response.sessionId;
    if (response.sessionTimeoutSeconds !== null)
        sessionTimeoutWindow = response.sessionTimeoutSeconds * 1000;

    if (response.customer !== null) {
        session.customer = response.customer;
    }
}

/**
@function

@param  response This is the XML document/JSON object that is returned by the AJAX call made by the MobiliserClient.
*/
function fbssloginParseXML(response) {
    //console.log("fbssologin:" + JSON.stringify(response));
    if (response.sessionId !== null)
        session.sessionId = response.sessionId;
    if (response.sessionTimeoutSeconds !== null)
        sessionTimeoutWindow = response.sessionTimeoutSeconds * 1000;

    if (response.user !== null) {
        session.customer = response.user;
    }
}

/**
@function

@param  response This is the XML document/JSON object that is returned by the AJAX call made by the MobiliserClient.
*/
function getRsaPublicKeyParseXML(response) {
  if (response.sessionId !== null)
      session.sessionId = response.sessionId;
  if (response.sessionTimeoutSeconds !== null)
      sessionTimeoutWindow = response.sessionTimeoutSeconds * 1000;

  if (response.user !== null) {
      //session.customer.customerId = response.user.id;
      //session.customer.orgUnitId = response.user.orgUnitId;
      //session.customer.blacklist = response.user.blackListReason;
      //session.customer.active = response.user.active;
      //session.customer.test = response.user.test;
      //session.customer.displayName = response.user.displayName;
      //session.customer.riskCategoryId = response.user.riskCategoryId;
      //session.customer.typeId = response.user.customerTypeId;
      //session.customer.cancelId = response.user.cancellationReasonId;
      //session.customer.modeId = response.user.txnReceiptModeId;
  }
}

/**
  @function

  @param  response This is the XML document/JSON object that is returned by the AJAX call made by the MobiliserClient.
 */
function walletParseXML(response) {
    var j = 1, k = 0;
    session.accounts = [];
    session.totalaccounts = 0;

    for (var i=0; i<response.walletEntries.length; i++) {
        if (response.walletEntries[i].creditCard !== null) {
            session.accounts[j] = new Accounts();
            session.accounts[j].walletId = response.walletEntries[i].id;
            session.accounts[j].creditPriority = response.walletEntries[i].creditPriority;
            session.accounts[j].debitPriority = response.walletEntries[i].debitPriority;
            session.accounts[j].pIId = response.walletEntries[i].paymentInstrumentId;
            session.accounts[j].info = response.walletEntries[i].alias;
            session.accounts[j].type = "CreditCard";
            session.accounts[j].pIClass = 'creditcard';
            session.accounts[j].no = response.walletEntries[i].creditCard.cardNumber;
            session.accounts[j].acctHolderName = response.walletEntries[i].creditCard.cardHolderName;
            session.accounts[j].acctNumber = '';
            session.accounts[j].displayNumber = response.walletEntries[i].creditCard.displayNumber;
            session.accounts[j].extra1 = response.walletEntries[i].creditCard.cardType;
            session.accounts[j].extra2 = response.walletEntries[i].creditCard.securityNumber;
            session.accounts[j].extra3 = response.walletEntries[i].creditCard.yearExpiry;
            session.accounts[j].extra4 = response.walletEntries[i].creditCard.monthExpiry;
            j++;
        } else if (response.walletEntries[i].bankAccount !== null && response.walletEntries[i].bankAccount.status == 0) {
            session.accounts[j] = new Accounts();
            session.accounts[j].walletId = response.walletEntries[i].id;
            session.accounts[j].creditPriority = response.walletEntries[i].creditPriority;
            session.accounts[j].debitPriority = response.walletEntries[i].debitPriority;
            session.accounts[j].pIId = response.walletEntries[i].paymentInstrumentId;
            session.accounts[j].info = response.walletEntries[i].alias;
            session.accounts[j].type = "BankAccount";
            session.accounts[j].pIClass = 'bank';
            session.accounts[j].no = response.walletEntries[i].bankAccount.accountNumber;
            session.accounts[j].acctHolderName = response.walletEntries[i].bankAccount.accountHolderName;
            session.accounts[j].acctNumber = '';
            session.accounts[j].displayNumber = response.walletEntries[i].bankAccount.displayNumber;
            session.accounts[j].extra1 = response.walletEntries[i].bankAccount.bankCode;
            session.accounts[j].extra2 = response.walletEntries[i].bankAccount.branchCode;
            session.accounts[j].extra3 = response.walletEntries[i].bankAccount.bankName;
            session.accounts[j].extra4 = response.walletEntries[i].bankAccount.bankCountry;
            j++;
        } else if (response.walletEntries[i].sva !== null) {
            session.accounts[0] = new Accounts();
            session.accounts[0].walletId = response.walletEntries[i].id;
            session.accounts[0].creditPriority = response.walletEntries[i].creditPriority;
            session.accounts[0].debitPriority = response.walletEntries[i].debitPriority;
            session.accounts[0].pIId = response.walletEntries[i].paymentInstrumentId;
            session.accounts[0].info = response.walletEntries[i].sva.creditBalance -
                        response.walletEntries[i].sva.debitBalance;
            session.accounts[0].type = "SVA";
            session.accounts[0].pIClass = 'sva';
            session.accounts[0].no = '';
        } else if (response.walletEntries[i].offlineSva !== null) {
            session.offlinesvas[k] = new Accounts();
            session.offlinesvas[k].walletId = response.walletEntries[i].id;
            session.offlinesvas[k].creditPriority = response.walletEntries[i].creditPriority;
            session.offlinesvas[k].debitPriority = response.walletEntries[i].debitPriority;
            session.offlinesvas[k].pIId = response.walletEntries[i].paymentInstrumentId;
            session.offlinesvas[k].info = response.walletEntries[i].offlineSva.balanceAmount;
            session.offlinesvas[k].type = "OFFLINESVA";
            session.offlinesvas[k].pIClass = 'offlinesva';
            session.offlinesvas[k].no = response.walletEntries[i].offlineSva.svaCode;
            session.offlinesvas[k].displayNumber = response.walletEntries[i].offlineSva.svaCode;
            k++;
        }
    }
    session.totalaccounts = j;
}

/**
  @function

  @param  response This is the XML document/JSON object that is returned by the AJAX call made by the MobiliserClient.
 */
function txnsParseXML(response) {
    var max = response.transactions.length < 10 ? response.transactions.length : 10;

    for (var i=0; i<max; i++) {
        session.transaction[i] = new Transaction();

        if (response.transactions[i].id !== null)
            session.transaction[i].transactionId = response.transactions[i].id;

        if (response.transactions[i].creationDate !== null)
            session.transaction[i].transactionDate = epoch2UTC(response.transactions[i].creationDate);

        if (response.transactions[i].amount !== null)
            session.transaction[i].amount = response.transactions[i].amount.value / 100;

        if (response.transactions[i].useCase !== null)
            session.transaction[i].usecase = response.transactions[i].useCase;

        switch (session.transaction[i].usecase) {
            case 174:
            case 193:
            case 194:
            case 191:
            case 202:
                for (var j=0; j<session.totalaccounts; j++) {
                    if (response.transactions[i].payerPiId !== null &&
                        response.transactions[i].payerPiId == session.accounts[j].pIId)
                    session.transaction[i].amount *= -1;
                }
                break;
            case 173:
            case 161:
            case 500:
            case 502:
                session.transaction[i].amount *= -1;
                break;
        }
        session.transaction[i].amount = session.transaction[i].amount.toFixed(2);
    }

    return max;
}

/**
  @function

  @param  response This is the XML document/JSON object that is returned by the AJAX call made by the MobiliserClient.
*/
function txnDetailParse(response) {
    if (response.transaction !== null) {
        var tranDate = new Date(response.transaction.creationDate);
        var txn = new Object();
        txn.Date = tranDate.getFullYear()+'-'+pad2(tranDate.getMonth()+1)+'-'+pad2(tranDate.getDate());
        txn.Time = pad2(tranDate.getHours())+':'+pad2(tranDate.getMinutes())+':'+pad2(tranDate.getSeconds());
        txn.Type = getUseCaseName(response.transaction.useCase);
        txn.Error = response.transaction.errorCode;
        txn.Name = (response.transaction.payerDisplayName == session.customer.displayName) ?
                      response.transaction.payeeDisplayName :
                      response.transaction.payerDisplayName;
        txn.Reference = response.transaction.authCode;
        txn.Details = "";
        if (response.transaction.text !== null)
            txn.Details = response.transaction.text;
        txn.Amount = response.transaction.amount.value/100;
        txn.Amount = txn.Amount.toFixed(2);
        txn.Fee = (response.transaction.payerDisplayName == session.customer.displayName) ?
                (response.transaction.payerAmount.value/100) - txn.Amount :
                txn.Amount - (response.transaction.payeeAmount.value/100);
        txn.Fee = txn.Fee.toFixed(2);
        return txn;
    }
}

/**
@function

@param  response This is the XML document/JSON object that is returned by the AJAX call made by the MobiliserClient.
*/
function couponparseXML(response) {
    session.coupons = [];
    if (response.coupon) {
        for (var i=0; i<response.coupon.length; i++) {
            session.coupons[i] = new Coupon();
            session.coupons[i].id = response.coupon[i].id;
            session.coupons[i].customerId = response.coupon[i].customerId;
            if(session.coupons[i].couponType != null)
            {
                session.coupons[i].couponType.id = response.coupon[i].couponType.id;
                session.coupons[i].couponType.name = response.coupon[i].couponType.name;
                session.coupons[i].couponType.purchasePrice = response.coupon[i].couponType.purchasePrice ? (response.coupon[i].couponType.purchasePrice/100) : 0;
                session.coupons[i].couponType.purchaseCurrency = response.coupon[i].couponType.purchaseCurrency ? response.coupon[i].couponType.purchaseCurrency : '';
                if(response.coupon[i].couponType.description != null)
                {
                    session.coupons[i].couponType.description.caption = response.coupon[i].couponType.description.caption;
                    session.coupons[i].couponType.description.imageUrl = response.coupon[i].couponType.description.imageUrl;
                    session.coupons[i].couponType.description.thumbnailUrl = response.coupon[i].couponType.description.thumbnailUrl;
                }
            }
            session.coupons[i].status = response.coupon[i].status;
            session.coupons[i].serialNumber = response.coupon[i].serialNumber;
            session.coupons[i].validTo = getDateFormatOfSring(response.coupon[i].validTo);
            session.coupons[i].code = response.coupon[i].code;
            session.coupons[i].views = response.coupon[i].views;
            session.coupons[i].uses = response.coupon[i].uses;
        }
    }
}

/**
@function

@param  response This is the XML document/JSON object that is returned by the AJAX call made by the MobiliserClient.
*/
function getRootCategoriesParseXML(response) {
    session.categories = [];
    if(response.category != null) {
        for (var i=0; i<response.category.length; i++) {
            session.categories[i] = new Category();
            session.categories[i].id = response.category[i].id;
            session.categories[i].internalName = response.category[i].internalName;
            session.categories[i].caption = response.category[i].caption;
            session.categories[i].priority = response.category[i].priority;
            session.categories[i].noOfChildCategories = response.category[i].child;
            session.categories[i].parent = response.category[i].parent;
            session.categories[i].valid = false;
        }
        return true;
    } else
        return false;
}

/**
@function

@param  response This is the XML document/JSON object that is returned by the AJAX call made by the MobiliserClient.
*/
function getChildCategoriesParseXML(response) {
    session.categories = [];
    if(response.category != null) {
        for (var i=0; i<response.category.length; i++) {
            session.categories[i] = new Category();
            session.categories[i].id = response.category[i].id;
            session.categories[i].internalName = response.category[i].internalName;
            session.categories[i].caption = response.category[i].caption;
            session.categories[i].priority = response.category[i].priority;
            session.categories[i].noOfChildCategories = response.category[i].child;
            session.categories[i].parent = response.category[i].parent;
            session.categories[i].valid = false;
        }
        return true;
    } else
        return false;
}

/**
@function

@param  response This is the XML document/JSON object that is returned by the AJAX call made by the MobiliserClient.
*/
function getCouponTypesofCategoryParseXML(response) {
    session.couponTypes = [];
    if(response.couponType != null) {
        for (var i=0; i<response.couponType.length; i++) {
            session.couponTypes[i] = {};
            session.couponTypes[i].type = response.couponType[i];
            session.couponTypes[i].location = null;
            session.couponTypes[i].distance = null;
/*
            session.couponTypes[i] = new CouponType();
            session.couponTypes[i].description = new CouponTypeDescription();

            session.couponTypes[i].id = response.couponType[i].id;
            session.couponTypes[i].name = response.couponType[i].name;
            session.couponTypes[i].purchasePrice = response.couponType[i].purchasePrice ? (response.couponType[i].purchasePrice/100) : 0;
            session.couponTypes[i].purchaseCurrency = response.couponType[i].purchaseCurrency ? response.couponType[i].purchaseCurrency : '';
            session.couponTypes[i].maxViews = response.couponType[i].maxViews;
            session.couponTypes[i].maxUses = response.couponType[i].maxUses;
            session.couponTypes[i].isRestorableByUser = response.couponType[i].isRestorableByUser;
            if(response.couponType[i].description != null) {
                session.couponTypes[i].description.mimeType = response.couponType[i].description.mimeType;
                session.couponTypes[i].description.caption = response.couponType[i].description.caption;
                session.couponTypes[i].description.content = response.couponType[i].description.content;
                session.couponTypes[i].description.thumbnailUrl = response.couponType[i].description.thumbnailUrl;
                session.couponTypes[i].description.imageUrl = response.couponType[i].description.imageUrl;
            }
*/
        }
    }
}


/**
@function

@param  response This is the XML document/JSON object that is returned by the AJAX call made by the MobiliserClient.
*/
function couponTypesByTagsparseXML(response){
    session.couponTypes = [];
    if(response.couponType != null) {
        for (var i=0; i<response.couponType.length; i++) {
            session.couponTypes[i] = {};
            session.couponTypes[i].type = response.couponType[i];
            session.couponTypes[i].location = null;
            session.couponTypes[i].distance = null;
/*
            session.couponTypes[i] = new CouponType();
            session.couponTypes[i].id = response.couponType[i].id;
            session.couponTypes[i].name = response.couponType[i].name;
            session.couponTypes[i].purchasePrice = response.couponType[i].purchasePrice ? (response.couponType[i].purchasePrice/100) : 0;
            session.couponTypes[i].purchaseCurrency = response.couponType[i].purchaseCurrency ? response.couponType[i].purchaseCurrency : '';
            session.couponTypes[i].maxViews = response.couponType[i].maxViews;
            session.couponTypes[i].maxUses = response.couponType[i].maxUses;
            session.couponTypes[i].isRestorableByUser = response.couponType[i].isRestorableByUser;
            if(response.couponType[i].description != null) {
                session.couponTypes[i].description.mimetype = response.couponType[i].description.mimetype;
                session.couponTypes[i].description.caption = response.couponType[i].description.caption;
                session.couponTypes[i].description.content = response.couponType[i].description.content;
                session.couponTypes[i].description.thumbnailUrl = response.couponType[i].description.thumbnailUrl;
                session.couponTypes[i].description.imageUrl = response.couponType[i].description.imageUrl;
            }
*/
        }
    }
}

function getCategoryTreeBackParseXML(response) {
    var categories = response.rootCategories;
    if (categories && categories.length) {
        for (var i=0; i<session.categories.length; i++) {
            // Used to retrive an array from category tree, which is having the id value, matching with category id value.
            var resp = getArrayOfObjects(categories, "id", session.categories[i].id);
            if(resp.length) {
                session.categories[i].valid = true;
                // here resp.length is used to identify an object availability and (resp[0]['child'] != null) is used to check an object is not null.
                if(resp[0]['child'] != null)
                    session.categories[i].noOfChildCategories = resp[0]['child'].length;
                else
                    session.categories[i].noOfChildCategories = 0;
                
            }
        }
        return true;
    } else
        return false;
}

/**
  @function

  @param  usecase This is usecase number in the AJAX call response
*/
function getUseCaseName(usecase) {
    var strname = "";
    usecase = usecase.toString();
    switch(usecase) {
        case '202': strname = "Demand4Payment"; break;
        case '194': strname = "Request Money"; break;
        case '193': strname = "P2P"; break;
        case '191': strname = "Pay Bill"; break;
        case '174': strname = "Send Voucher"; break;
        case '173': strname = "Airtime Topup"; break;
        case '161': strname = "SVA Unload"; break;
        case '160': strname = "SVA Load"; break;
        case '500': strname = "NFC Transaction"; break;
        case '501': strname = "OfflineSVA Load"; break;
        case '502': strname = "OfflineSVA Unload"; break;
        case '503': strname = "P2P NFC Transaction"; break;
        case '504': strname = "NFC Transaction"; break;
    }
    return strname;
}

/**
  @function

  @param  r This is the XML document/JSON object that is returned by the AJAX call made by the MobiliserClient.
*/
function getErrorMessage(r) {
    var errValue = r.Status.value;
    var errCode = r.Status.code.toString();
    if(errValue !== null) {
        if (errCode == '329' || errCode == '201')
            return "Check your username or password and try again!";
        else if (errCode == '302')
            return "Your account is blocked! Please contact service provider.";
        else if(errCode == '2517')
            return "Payer has no valid wallet for this transaction";
        else if(errCode == '2507')
            return "Payee has no valid wallet for this transaction";
        else
            return r.Status.value;
    } else {
        var msg = '';
        switch (errCode) {
        case '1002': msg = "INVALID MSISDN: Indicates that (one of) the specified MSISDN(s) is invalid. MSISDNs always have to specified as +countryCodenetCodenumber"; break;
        case '1003': msg = "UNKNOWN TRANSACTION: Indicates that the (or a) transaction specified in the request does not exist."; break;
        case '1004': msg = "INVALID TRANSACTION: Indicates that the (or a) transaction specified in the request cannot be used/considered in the requested context."; break;
        case '1005': msg = "INVALID TRANSACTION STATUS: Indicates that the (or a) transaction specified in the request cannot be used/considered due to its status."; break;
        case '1006': msg = "INACTIVE CUSTOMER: Indicates that the (or a) customer specified in the request cannot be used/considered because he is inactive"; break;
        case '1008': msg = "BLACKLISTED CUSTOMER"; break;
        case '1050': msg = "The transaction is locked by another process and cannot be handled right now"; break;
        case '1112': msg = "INACTIVE USER: Indicates that the customer's status is inactive - see database CUSTOMER_STATUS.BOL_IS_ACTIVE."; break;
        case '1114': msg = "CUSTOMER BLOCKED: Indicates that the customer is currently blocked due to the number of times wrong credentials have been specified."; break;
        case '1115': msg = "BLACKLISTED USER: Indicates that the customer is blacklisted - see database CUSTOMER.ID_BLACKLISTREASON."; break;
        case '1121': msg = "CREDENTIALS EXPIRED: Indicates that the specified credentials have expired"; break;
        case '1250': msg = "TRANSACTION_EXPIRED: The transaction was pending in initial state too long and invalidated automatically."; break;
        case '1301': msg = "SESSION ACTIVE WARN: Indicates that a login failed because the customer has still an active session - this prevents logging in multiple times with just one customer."; break;
        case '2001': msg = "CREDIT LIMIT EXCEEDED: Indicates that the credit limit has been exceeded."; break;
        case '2002': msg = "DEBIT LIMIT EXCEEDED: Indicates that the debit limit has been exceeded."; break;
        case '201': msg = "MINIMUM CREDENTIAL LENGTH: Indicates that the credential (to create or update, presumably) exceeds the minimum credential length."; break;
        case '2011': msg = "RESERVATION EXPIRED: Indicates that the SVA resveration (to capture/cancel/...) expired."; break;
        case '202': msg = "MAXIMUM CREDENTIAL LENGTH: Indicates that the credential (to create or update, presumably) exceeds the maximum credential length."; break;
        case '203': msg = "CREDENTIAL REPEAT: Indicates that the credential (to create or update, presumably) is the same as any of the n previously used credentials."; break;
        case '204': msg = "CREDENTIAL WEAK ASCENDING: Indicates that the credential (to create or update, presumably) contains a block of ascending characters."; break;
        case '205': msg = "CREDENTIAL WEAK EQUALITY: Indicates that the credential (to create or update, presumably) contains a block of equal characters."; break;
        case '206': msg = "CREDENTIAL WEAK DESCENDING: Indicates that the credential (to create or update, presumably) contains a block of descending characters."; break;
        case '207': msg = "CREDENTIAL EQUALS IDENTIFICATION: Indicates that the specified credential is the same as one of the customers identifications."; break;
        case '208': msg = "CREDENTIAL REGEX MATCH: Indicates that the credential does or does not match one of the security poilicies'' regular expressions and thus is invalid."; break;
        case '2201': msg = "UNKNOWN TARGET: Indicates that the target customer is unknown."; break;
        case '2202': msg = "INVALID TARGET: Indicates that the target customer is invalid, i.e. not allowed/able to participate in the operation."; break;
        case '2214': msg = "FLOATING AMOUNT MISSING"; break;
        case '2215': msg = "FLOATING AMOUNT FALLS BELOW MIN PRICE"; break;
        case '2216': msg = "FLOATING AMOUNT EXCEEDS MAX PRICE"; break;
        case '2222': msg = "IN BUSY: Indicates that the IN is currently busy and cannot handle more requests."; break;
        case '2231': msg = "AIRTIME LIMIT EXCEEDED"; break;
        case '2232': msg = "CO-USER LIMIT EXCEEDED"; break;
        case '2259': msg = "VOUCHER SALE HANDLER FAILURE"; break;
        case '2299': msg = "TRANSACTION FAILED PERMANENTLY"; break;
        case '2405': msg = "NO COMM WITH MSG-GW: Send error, indicates that the Notification Services are not going to send the specified message (for whatever reason)"; break;
        case '2507': msg = "PAYEE PI UNKNOWN"; break;
        case '2511': msg = "UNKNOWN PAYER"; break;
        case '2512': msg = "INVALID PAYER"; break;
        case '2517': msg = "PAYER PI UNKNOWN"; break;
        case '2519': msg = "AUTHORIZATION EXPIRED"; break;
        case '2521': msg = "AUTHENTICATION REQUIRED: Indicates that the participant authentication has been initialized, but the authentication is asychronous"; break;
        case '2522': msg = "AUTHENTIVATION WRONG: Indicates that the supplied authentication was wrong"; break;
        case '2525': msg = "MANUAL DECISION REQUIRED: Indicates that the transaction processing has been stopped and a manual decission is needed"; break;
        case '2535': msg = "ERROR_PAYEE_OPEN_TRANSACTION"; break;
        case '2536': msg = "ERROR_PAYER_OPEN_TRANSACTION"; break;
        case '2537': msg = "ERROR_NO_OPEN_TRANSACTION"; break;
        case '2541': msg = "PAYER DENIED TRANSACTION"; break;
        case '2542': msg = "PAYER NOT REACHABLE"; break;
        case '2561': msg = "PAYEE ABSOLUTE LIMIT EXCEEDED: Indicates that the payee's absolute credit limit has been exceeded."; break;
        case '2562': msg = "PAYER ABSOLUTE LIMIT EXCEEDED: Indicates that the payer's absolute debit limit has been exceeded."; break;
        case '2563': msg = "PAYEE MONTHLY LIMIT EXCEEDED: Indicates that the payee's monthly credit limit has been exceeded."; break;
        case '2564': msg = "PAYER MONTHLY LIMIT EXCEEDED: Indicates that the payer's monthly debit limit has been exceeded."; break;
        case '2565': msg = "PAYEE DAILY LIMIT EXCEEDED: Indicates that the payee's daily credit limit has been exceeded."; break;
        case '2566': msg = "PAYER DAILY LIMIT EXCEEDED: Indicates that the payer's daily debit limit has been exceeded."; break;
        case '2571': msg = "PAYEE WALLET ABSOLUTE LIMIT EXCEEDED: Indicates that the payee's wallet absolute credit limit has been exceeded."; break;
        case '2572': msg = "PAYER WALLET ABSOLUTE LIMIT EXCEEDED: Indicates that the payer's wallet absolute debit limit has been exceeded."; break;
        case '2573': msg = "PAYEE WALLET MONTHLY LIMIT EXCEEDED: Indicates that the payee's wallet monthly credit limit has been exceeded."; break;
        case '2574': msg = "PAYER WALLET MONTHLY LIMIT EXCEEDED: Indicates that the payer's wallet monthly debit limit has been exceeded."; break;
        case '2575': msg = "PAYEE WALLET DAILY LIMIT EXCEEDED: Indicates that the payee's wallet daily credit limit has been exceeded."; break;
        case '2576': msg = "PAYER WALLET DAILY LIMIT EXCEEDED: Indicates that the payer's wallet daily debit limit has been exceeded."; break;
        case '2581': msg = "RESTRICTION PAYEE TRANSACTION AMOUNT: Indicates that a transaction restriction restricts the payee to participate in this transaction because the transaction amount is higher than allowed"; break;
        case '2582': msg = "RESTRICTION PAYER TRANSACTION AMOUNT: Indicates that a transaction restriction restricts the payer to participate in this transaction because the transaction amount is higher than allowed"; break;
        case '2583': msg = "RESTRICTION PAYEE TRANSACTION COUNT: Indicates that a restriction restricts the payee to participate in this transaction because the restricted number of transaction per timeframe is exceeded"; break;
        case '2584': msg = "RESTRICTION PAYER TRANSACTION COUNT: Indicates that a restriction restricts the payer to participate in this transaction because the restricted number of transaction per timeframe is exceeded"; break;
        case '2585': msg = "RESTRICTION PAYEE TRANSACTION SUM: Indicates that an transaction restrictions restricts the payee to participate in this transaction because the restricted transaction sum per timeframe is exceeded"; break;
        case '2586': msg = "RESTRICTION PAYER TRANSACTION SUM: Indicates that an transaction restrictions restricts the payee to participate in this transaction because the restricted transaction sum per timeframe is exceeded"; break;
        case '2587': msg = "RESTRICTION PAYEE TRANSACTION SUM MIN"; break;
        case '2588': msg = "RESTRICTION PAYER TRANSACTION SUM MIN"; break;
        case '2589': msg = "RESTRICTION INDIVIDUAL"; break;
        case '2604': msg = "PAYER PI IN INVALID STATE"; break;
        case '2605': msg = "PAYER PI NOT ALLOWED"; break;
        case '2607': msg = "PAYER PI DAILY LIMIT EXCEEDED: Indicates that the payer's payment instrument daily debit limit has been exceeded."; break;
        case '2608': msg = "PAYER PI MONTHLY LIMIT EXCEEDED: Indicates that the payer's payment instrument monthly debit limit has been exceeded."; break;
        case '2611': msg = "Balance of Payer's account is not enough for this transaction amount!"; break;
        case '2622': msg = "PAYER PI CAPTURE CANCEL FULL AMOUNT: Indicates that the payers payment instrument only allows cancelling the complete capture amount."; break;
        case '2631': msg = "Payer's account is BLOCKED"; break;
        case '2650': msg = "PICKUP CODE NOT FOUND: Indicates that the transaction has no pickup code attached."; break;
        case '2651': msg = "PICKUP MAX TRIES EXCEEDED: Indicates that the maximum number of tries has been exceeded."; break;
        case '2652': msg = "PICKUP CODE INVALID: Indicates that the pickup code is invalid."; break;
        case '2653': msg = "PICKUP ATTRIBUTE NOT UNIQUE: Indicates that the pickup code attribute attached to the transaction is not unique."; break;
        case '2654': msg = "PICKUP INTERNAL VOUCHER NOT FOUND: Indicates that the internal voucher associated with the transaction could not be found."; break;
        case '2655': msg = "PICKUP INTERNAL VOUCHER TXN NOT FOUND: Indicates that the internal voucher transaction associated with the given transaction could not be found."; break;
        case '2661': msg = "WALLET ENTRY INVALID ALIAS: Indicates that a wallet entry exists for the same customer with a different payment instrument."; break;
        case '2662': msg = "WALLET ENTRY INVALID PRIORITY: Indicates that a wallet entry exists for the same customer having the same debit or credit priority"; break;
        case '2704': msg = "PAYEE PI IN INVALID STATE"; break;
        case '2705': msg = "PAYEE PI NOT ALLOWED"; break;
        case '2707': msg = "PAYEE PI DAILY LIMIT EXCEEDED: Indicates that the payee's payment instrument daily credit limit has been exceeded."; break;
        case '2708': msg = "PAYEE PI MONTHLY LIMIT EXCEEDED: Indicates that the payee's payment instrument monthly credit limit has been exceeded."; break;
        case '2709': msg = "PAYEE PI ABSOLUTE LIMIT EXCEEDED: Indicates that the payee's payment instrument absolute credit limit has been exceeded."; break;
        case '2711': msg = "PAYEE PI LIMIT HIT"; break;
        case '2731': msg = "PAYEE PI BLOCKED"; break;
        case '2811': msg = "DISCONNECTED BY CUSTOMER"; break;
        case '2907': msg = "CUSTOMER MOBILE BUSY"; break;
        case '2908': msg = "NO ANSWER FROM CUSTOMER MOBILE"; break;
        case '2916': msg = "COULD NOT REACH CUSTOMERS MOBILE"; break;
        case '2920': msg = "3 TIMES WRONG PIN"; break;
        case '2921': msg = "3 TIMES NO RESPONSE"; break;
        case '2943': msg = "WRONG OR INVALID PIN"; break;
        case '2945': msg = "AUTHENTICATION DECLINED"; break;
        default: msg = "Unknown Error!"; break;
        }
        return msg;
    }
}

function epoch2UTC(epoch) {
    var utcDate = new Date(epoch);
    return utcDate.getFullYear()+'-'+pad2(utcDate.getMonth()+1)+'-'+pad2(utcDate.getDate())+
        'T'+pad2(utcDate.getHours())+':'+pad2(utcDate.getMinutes())+':'+pad2(utcDate.getSeconds());
}

/**
 *@description callback handler for receiving existing alerts
 */
var getExistingAlertsBack = function(r) {
    hideProgress();

    var rCode = getStatusCode(r);
    if (rCode == '0') {
        //Parse
        session.transit_value = parseExistingAlerts(r);
        //Subsequent Server Calls
        fetchActiveAlertNotificationMessage();
    } else {
        MessageBox(Str_alert_failgetexistingalerts + getErrorMessage(r));
    }
    appstate = trans.TRAN_IDLE;
};

/**
 * @description Parsing the Alerts for Alert List
 */
function parseExistingAlerts(r){
    var customerAlerts = new Array();
    if(r.customerAlert != null) {
        for(var i = 0;i < r.customerAlert.length;i++) {
            var ca = new CustomerAlert();
            ca.id = r.customerAlert[i].id;
            ca.customerId = r.customerAlert[i].customerId;
            ca.alertTypeId = r.customerAlert[i].alertTypeId;
            ca.active = r.customerAlert[i].active;
            ca.created = r.customerAlert[i].created;
            ca.alertDataList = [];
            if(r.customerAlert[i].alertDataList != null
                    && r.customerAlert[i].alertDataList != 'undefined'
                        && r.customerAlert[i].alertDataList.alertData != null
                        && r.customerAlert[i].alertDataList.alertData != 'undefined') {
                for(var j = 0;j < r.customerAlert[i].alertDataList.alertData.length;j++) {
                    var ad = new AlertData();
                    ad.id = r.customerAlert[i].alertDataList.alertData[j].id;
                    ad.customerAlertId = r.customerAlert[i].alertDataList.alertData[j].customerAlertId;
                    ad.key = r.customerAlert[i].alertDataList.alertData[j].key;
                    ad.value = r.customerAlert[i].alertDataList.alertData[j].value;
                    ca.alertDataList.push(ad);
                }
            }

            ca.contactPointList = [];

            if(r.customerAlert[i].contactPointList != null && r.customerAlert[i].contactPointList != 'undefined'
                && r.customerAlert[i].contactPointList.contactPoint != null
                && r.customerAlert[i].contactPointList.contactPoint != 'undefined') {
                for(var k = 0;k < r.customerAlert[i].contactPointList.contactPoint.length;k++) {
                    if(r.customerAlert[i].contactPointList.contactPoint[k].otherIdentification) {
                        var oi = new OtherIdentification();
                        oi.id = r.customerAlert[i].contactPointList.contactPoint[k].otherIdentification.id;
                        oi.customerId = r.customerAlert[i].contactPointList.contactPoint[k].otherIdentification.customerId;
                        oi.type = r.customerAlert[i].contactPointList.contactPoint[k].otherIdentification.type;
                        oi.identification = r.customerAlert[i].contactPointList.contactPoint[k].otherIdentification.identification;
                        oi.nickname = r.customerAlert[i].contactPointList.contactPoint[k].otherIdentification.nickname;
                        oi.provider = r.customerAlert[i].contactPointList.contactPoint[k].otherIdentification.provider;
                        oi.status = r.customerAlert[i].contactPointList.contactPoint[k].otherIdentification.status;
                        oi.active = r.customerAlert[i].contactPointList.contactPoint[k].otherIdentification.active;
                        ca.contactPointList.push(oi);
                    } else if (r.customerAlert[i].contactPointList.contactPoint[k].identification) {
                        var iden = new Identification();
                        iden.id = r.customerAlert[i].contactPointList.contactPoint[k].identification.id;
                        iden.customerId = r.customerAlert[i].contactPointList.contactPoint[k].identification.customerId;
                        iden.type = r.customerAlert[i].contactPointList.contactPoint[k].identification.type;
                        iden.identification = r.customerAlert[i].contactPointList.contactPoint[k].identification.identification;
                        ca.contactPointList.push(iden);
                    }
                }
            }
            customerAlerts.push(ca);
        }
    }
    //return customerAlerts.sortBy('created');
    return customerAlerts.sort(dynamicSort('created'));
}

/**
 * @description Call back handler for Deleting customer alert
 */
var deleteCustomerAlertBack = function(r) {
    hideProgress();

    var rCode = getStatusCode(r);
    if (rCode == '0') {
        MessageBox(Str_msg_deletealert);
        $('#managealert').trigger('pageshow');
    } else {
        MessageBox(Str_msg_faildeletealert + getErrorMessage(r));
    }
    appstate = trans.TRAN_IDLE;
};

/**
 * @description This function layout the UI for other identifications
 */
function listOtherIdentifications(oIdentifications, container) {
    $(container).empty();
    var identification = session.identification;
    var checked = checkOtherIdentificationInSelectedAlert(identification.id);
    $(container).append("<input type=\"checkbox\" name=\"aa_devices_"+identification.id+"\" id=\"aa_devices_"+identification.id+"\" class=\"custom check_add_alert\"" +
                " value=\""+identification.id+"\" "+(checked?"checked":"")+" data-theme=\"g\" data-identification='true'>" +
                "<label for=\"aa_devices_"+identification.id+"\">"+identification.identification+"</label>");

    if(oIdentifications) { //Check null or undefined
        for(i = 0;i < oIdentifications.length;i++){
            var oi = oIdentifications[i];
            checked = checkOtherIdentificationInSelectedAlert(oi.id);
            //console.log('Checked: ' + checked);
            $(container).append("<input type=\"checkbox\" name=\"aa_devices_"+oi.id+"\" id=\"aa_devices_"+oi.id+"\" class=\"custom check_add_alert\"" +
                    " value=\""+oi.id+"\" "+(checked?"checked":"")+" data-theme=\"g\">" +
                    "<label for=\"aa_devices_"+oi.id+"\">"+oi.nickname+": "+oi.identification+"</label>");
        }
    }
    $('#aad_otheridentifications_wrap').trigger('create');
    $(container).trigger('create');
    $(container + ' input:checkbox').checkboxradio('refresh');
}

/**
 * @description finds out if this OI is there in the alert
 * @return boolean depicting true if exists else false
 * @param oIId for an contact point
 */
function checkOtherIdentificationInSelectedAlert(oIId) {
    var isExists = false;
    if(session.customerAlert != null) {
        if(session.customerAlert.contactPointList != null && session.customerAlert.contactPointList.length > 0) {
            for(var i = 0;i < session.customerAlert.contactPointList.length;i++) {
                if(session.customerAlert.contactPointList[i].otherIdentification && session.customerAlert.contactPointList[i].otherIdentification.id == oIId) {
                    isExists = true;
                    break;
                } else if (session.customerAlert.contactPointList[i].identification && session.customerAlert.contactPointList[i].identification.id == oIId) {
                    isExists = true;
                    break;
                }
            }
        }
    }
    return isExists;
}

/**
 * @description Callback handler for Adding Alert
 */
function createNewAlertBack(r) {
    hideProgress();

    var rCode = getStatusCode(r);
    if (rCode == '0') {
        $('#aas_title').html(Str_txt_addalert);
        //Get the newly created alertId
        session.transit_value = r.customerAlertId;
        $.mobile.changePage("addAlertSuccess.html", page_opt);
    } else {
        MessageBox(Str_msg_failcreatealert + getErrorMessage(r));
    }
    appstate = trans.TRAN_IDLE;
}

/**
 * @description Callback handler for Get Alert Detail service
 * @param r response data
 */
function getAlertDetailsForEditBack(r) {
    hideProgress();

    var rCode = getStatusCode(r);
    if(rCode == '0') {
        //Parse customer alert
        var ca = parseCustomerAlert(r);

        session.customerAlert = ca;
        $('#addAlertDetails').attr("action", "edit");
        $('#txt_addalertdetail').text(Str_editalert);

        var alertTypeId = ca.alertTypeId;

        if(alertTypeId != null || alertTypeId != undefined) {
            $("#btn_ma_addnewcontinue").attr("alertTypeId", alertTypeId);

            var fieldArr = alerttypefieldsmapping[alertTypeId];
            $('#alertcontent').empty();
            var alertDataList = ca.alertDataList;
            for (i = 0; i < fieldArr.length; i++) {
                var field = fieldArr[i];
                var ad = findAlertDataInDataList(alertDataList, field);
                var val = '';
                if(ad != null) {
                    val = ad.value;
                } else if (field == "frequency") {
                    var cnt = ca.notifMaxCnt;
                    var rec = ca.notifMaxRecur;
                    if(cnt > 0) {
                        val = rec + "_" + cnt;
                    } else {
                        val = cnt;
                    }
                } else if (field == "msgtype") {
                    val = getNotificationTypeIdForAlertNotificationMessageId(ca.alertNotificationMsgId);
                }
                //console.log("Value of field: " + field + " is " + val);
                var contentlist = getFieldLiContent(field, val);
                $('#alertcontent').append(contentlist);
            }
        }
        $('#addalerttitle').html(Str_edit + " " +
            getAlertPageTitle(alertTypeId) + " " + Str_alert);
        $('#addAlertDetails .ui-droplist').trigger('create');

        $('#aa_msgtype_fs_wrap').trigger('create');
        $('#aa_msgtype_fs').trigger('create');
        $('#aa_msgtype_fs' + ' input:checkbox').checkboxradio('refresh');

        $('#addAlertDetails .aa_frequency_field').collapsible();
        $('#aa_frequency_num').textinput();

        $.mobile.changePage("addAlertDetails.html", page_opt);
    } else {
        MessageBox(Str_msg_failgetalertdetail + getErrorMessage(r));
    }
    appstate = trans.TRAN_IDLE;
}

/**
 * @description Iterate and find the key in the list and returns the object.
 * @param alertDataList list of alert data objects
 * @param field fieldName to be searched
 * @return AlertData or null
 */
function findAlertDataInDataList(alertDataList, field) {
    var ad = null;
    if(alertDataList != null && alertDataList.length > 0) {
        for(var i = 0;i < alertDataList.length;i++) {
            //console.log(alertDataList[i].key + " == " + field);
            if(alertDataList[i].key == field) {
                ad = alertDataList[i];
                //console.log('AD Found ' + smartphoneService.toJSON(ad));
                break;
            }
        }
    }
    return ad;
}

/**
 * @description parse customer alert data from the response
 * @param r
 * @returns CustomerAlert object
 */
function parseCustomerAlert(r) {
    var ca = new CustomerAlert();
    ca.id = r.customerAlert.id;
    ca.customerId = r.customerAlert.customerId;
    ca.alertTypeId = r.customerAlert.alertTypeId;
    ca.active = r.customerAlert.active;
    ca.alertNotificationMsgId = r.customerAlert.alertNotificationMsgId;
    ca.notifMaxCnt = r.customerAlert.notifMaxCnt;
    ca.notifMaxRecur = r.customerAlert.notifMaxRecur;
    ca.created = r.customerAlert.created;

    if(r.customerAlert.alertDataList != null && r.customerAlert.alertDataList.alertData != null
                && r.customerAlert.alertDataList.alertData.length > 0) { //Check for null values
        for(var i = 0;i < r.customerAlert.alertDataList.alertData.length;i++) {
            var tmpAd = r.customerAlert.alertDataList.alertData[i];
            var ad = new AlertData();
            ad.id = tmpAd.id;
            ad.customerAlertId = tmpAd.customerAlertId;
            ad.key = tmpAd.key;
            ad.value = tmpAd.value;
            ca.alertDataList.push(ad);
        }
    }

    var contactPointList = r.customerAlert.contactPointList;
    if(r.customerAlert.contactPointList != null && r.customerAlert.contactPointList.contactPoint != null
                && r.customerAlert.contactPointList.contactPoint.length > 0) {
        for(var i = 0;i < r.customerAlert.contactPointList.contactPoint.length;i++) {
            var cp = new ContactPoint();
            cp.id = r.customerAlert.contactPointList.contactPoint[i].id;
            cp.customerAlertId = r.customerAlert.contactPointList.contactPoint[i].customerAlertId;

            if(r.customerAlert.contactPointList.contactPoint[i].otherIdentification) {
                var otherIdentification = r.customerAlert.contactPointList.contactPoint[i].otherIdentification;
                var oi = new OtherIdentification();
                oi.id = otherIdentification.id;
                oi.customerId = otherIdentification.customerId;
                oi.type = otherIdentification.type;
                oi.identification = otherIdentification.identification;
                oi.nickname = otherIdentification.nickname;

                cp.otherIdentification = oi;
                delete cp.identification;
            } else {
                var identification = r.customerAlert.contactPointList.contactPoint[i].identification;
                var oi = new Identification();
                oi.id = identification.id;
                oi.customerId = identification.customerId;
                oi.type = identification.type;
                oi.identification = identification.identification;

                cp.identification = oi;
                delete cp.otherIdentification;
            }

            ca.contactPointList.push(cp);
        }
    }

    //Parsing Blackout should I?
    ca.blackoutList = r.customerAlert.blackoutList;
    return ca;
}

/**
 * @description Callback handler for Updating Alert
 */
function updateExistingAlertBack(r) {
    hideProgress();

    var rCode = getStatusCode(r);
    if (rCode == '0') {
        $('#aas_title').html(Str_txt_editalert);
        $.mobile.changePage("addAlertSuccess.html", page_opt);
        $('#alertcontentSuccess').html(Str_txt_editalert);
        session.customerAlert = null; //Clear the alert data from the session to avoid misuse.
    } else {
        MessageBox(Str_msg_failupdatealert + getErrorMessage(r));
        $('#aas_title').html(Str_txt_titleeditalertfail);
    }
    appstate = trans.TRAN_IDLE;
}

/**
 * @description callback handler of getting the alert notification message id back from server
 * @param r
 */
function getAlertNotificationMsgIdBack(r) {
    hideProgress();

    var rCode = getStatusCode(r);
    if (rCode == '0') {
        var alertNotificationMsgTypeId = parseAlertNotificationMessageTypeId(r);
        //console.log("Got AlertNotificationMessageId from server. it is " + alertNotificationMsgTypeId);

        var alertTypeId = $("#btn_ma_addnewcontinue").attr('alertTypeId');
        var existingAlertId = $("#btn_ma_addnewcontinue").attr('alertId');

        //Check whether we need to add a new alert or we need to update an existing one.
        if($('#addAlertDetails').attr("action") != "edit") {
            submitNewAddAlert(alertTypeId, alertNotificationMsgTypeId);
        } else {
            updateExistingAlert(alertTypeId, alertNotificationMsgTypeId, existingAlertId);
        }
    } else {
        MessageBox(getErrorMessage(r));
    }
    appstate = trans.TRAN_IDLE;
}

/**
 * @description parsing logic for alertNotificationMessageTyepId
 * @param r response data to be parsed.
 * @returns parsed alert notification message type id
 */
function parseAlertNotificationMessageTypeId(r) {
    var alertNotificationMessageId;
    if(r.alertNotificationMessage && r.alertNotificationMessage.length > 0)
            alertNotificationMessageId = r.alertNotificationMessage[0].id;
    return alertNotificationMessageId;
}

/**
 * @description callback handler for the active alert notification message mapping
 * web service call
 * @param r response data
 */
function getActiveAlertNotificationMessagesBack(r) {
    hideProgress();

    var rCode = getStatusCode(r);
    if (rCode == '0') {
        var alertNotificationMessages = parseAlertNotificationMessages(r);
//        if(alertNotificationMessages && alertNotificationMessages.length)
//            console.log(alertNotificationMessages.length + " Alert notifications found.")
        
        $.mobile.changePage("managealert.html", page_opt);
    } else {
        MessageBox(Str_msg_failgetalertnoti + getErrorMessage(r));
        //TODO: Shall we push user back??
    }
    appstate = trans.TRAN_IDLE;
}

/**
 * @description Parser for alert notification messages response
 * @return the array of AlertNotificationMessage objects
 */
function parseAlertNotificationMessages(r) {
    session.alertNotificationMessages = [];    //Remove old entries from the array.
    if(r.alertNotificationMessage != null) {
        for(var i = 0;i < r.alertNotificationMessage.length;i++) {
            var anm = new AlertNotificationMessage();
            //Parsing logic goes here
            anm.id = r.alertNotificationMessage[i].id;
            anm.alertTypeId = r.alertNotificationMessage[i].alertTypeId;
            anm.notificationMsgTypeId = r.alertNotificationMessage[i].notificationMsgTypeId;
            session.alertNotificationMessages.push(anm);
        }
    }
    return session.alertNotificationMessages;
}

var transactiontypefilter = {"Peer 2 Peer":"Send Money", "Standard C2C pull": "Request Money", "Standard Cash-In":"Cash In"
    ,"Standard Cash-Out": "Cash Out","Standard Credit Self":"Add Funds to SVA","Standard Debit Self":"Withdraw Funds from SVA"
    ,"Standard load internal voucher":"Load Internal Voucher","Send voucher to unknown":"Send Voucher",
    "CommissionSettlement":"Commission Settlement","Transfer Money":"Merchant to Merchant", "chequeBook":"Request Cheque Book"
    , "AccountInfo":"Account Info", "chequeStatus":"Cheque Status","chequeStop":"Stop Cheque Payment"};

/**
 * @description Callback handler for getting the transaction types back
 * @param r
 */
function getTransactionTypesBack(r) {
    hideProgress();

    var rCode = getStatusCode(r);
    if (rCode == '0') {
        transactiontypes = parseLookupEntities(r,transactiontypefilter);
        //console.log("Number of transactions found are " + transactiontypes.length);
        if(transactiontypes && transactiontypes.length > 0) {
            loadTransactions(transactiontypes.sort(dynamicSort('name')));
        } else {
            MessageBox(Str_msg_failnotrantype);
            goBack();
        }
    } else {
        MessageBox(Str_msg_failgettrantype + getErrorMessage(r));
        goBack();
    }
    appstate = trans.TRAN_IDLE;
}

/**
 * @description parser for currencies response
 * @param r response data
 * @param filter an optional array which maps a new string for name
 * @returns {Array} of parsed currecy objects with id and name properties
 */
function parseLookupEntities(r, filter) {
    var entities = [];
    if(r.lookupEntities != null) {
        for(var i = 0;i < r.lookupEntities.length;i++) {
            var entity = {};
            entity.id = r.lookupEntities[i].id;
            //Check if filter is provided
            if(filter) {
                //Check if filter contains the key
                entity.name = filter[r.lookupEntities[i].name]?filter[r.lookupEntities[i].name]:r.lookupEntities[i].name;
            } else {
                //No filter store the name as it is returned by service
                entity.name = r.lookupEntities[i].name;
            }
            entities.push(entity);
        }
    }
    return entities;
}

/*
 * @description Call back handler for receiving other identification
 */
function getOtherIdentificationsBack(r) {
    hideProgress();

    var rCode = getStatusCode(r);
    if (rCode == '0') {
        var oIdentifications = parseOtherIdentifications(r);
        listOtherIdentifications(oIdentifications, '#aad_otheridentifications');
        //If this is a transaction types alert than we need one more call to load type of transactions
        var alertTypeId = $('#btn_ma_addnewcontinue').attr("alertTypeId");
        if(alertTypeId == "9" && CACHE_TRANSACTIONS && transactiontypes.length > 0) {
            loadTransactions(transactiontypes.sort(dynamicSort('name')));
        } else {
            mc.getLookups(getTransactionTypesBack, "usecase");
            appstate = trans.TRAN_TRANSACTIONTYPES;
            showProgress();
        }
    } else {
        MessageBox(Str_msg_failgetotheridentmb + getErrorMessage(r));
    }
    appstate = trans.TRAN_IDLE;
}

/**
 * @description Parser for other identification web service
 */
function parseOtherIdentifications(r) {
    session.otherIdentifications = [];    //Remove old entries from the array.
    if(r.otherIdentification != null) {
        for(var i = 0;i < r.otherIdentification.length;i++) {
            var type = r.otherIdentification[i].type;
            //console.log("Type found: " + type + " checking in Array " + ALLOWED_DEVICE_TYPES);
            if($.inArray(type, ALLOWED_DEVICE_TYPES) > -1) { //Collect only Email and Mobile
                var oi = new OtherIdentification();
                //Parsing logic goes here
                oi.id = r.otherIdentification[i].id;
                oi.nickname = r.otherIdentification[i].nickname;
                oi.identification = r.otherIdentification[i].identification;
                oi.type = r.otherIdentification[i].type;
                oi.customerId = r.otherIdentification[i].customerId;
                session.otherIdentifications.push(oi);
            } else {
                    //console.log("Ignoring CP due to unmatched types ");
            }
        }
    }
    return session.otherIdentifications;
}