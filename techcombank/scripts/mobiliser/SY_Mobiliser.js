/**
 * @fileOverview A thin JavaScript web service client that accesses the Mobiliser platform.
 * It provides an abstraction layer to communicate with the system and returns
 * XML documents as a result.
 *
 * @name SY_Mobiliser.js
 * @author SAP AG
 * @version 1.0
 *
 */

/**
  @class A thin JavaScript web service client that accesses the Mobiliser platform. It provides an abstraction layer to communicate with the system and returns XML documents as a result.

  @constructor

  */
  function MobiliserClient() {
    this.url = setting.protocol + setting.ipaddress;

    if(setting.port)
        this.url += ":" + setting.port;

    // it's used by file upload/download
    smartphoneService.urlWithoutWS = this.url;

    if(typeof setting.wsname !== 'undefined')
        this.url += "/" + setting.wsname;

    smartphoneService.url = this.url;
    this.network_access = true;
}

/*  web service calls  */

/**
 @description Agent login function
 @param responseBack Indicates which function to be called when a response is received.
 @param username The username should normally be the msisdn in addition to its country code i.e. +18881234567
 @param password The user password
 @example
    var loginBack = function(r, xmlResponse) { ... // handle response };
    mc.login(loginBack, "user1", "pass2");
    */
    MobiliserClient.prototype.login = function(responseBack, login) {
    //TODO : optimize and reuse for each call ?
    var pl = new Object();
    pl.origin = setting.origin;
    pl.traceNo = UUIDv4();
    pl.AuditData = setting.appinfo;
    
    pl.identification = login.username;
    pl.credential = login.password;
    pl.identificationType = 0;
    pl.credentialType = 0;

    //adding token to verify push notification
    pl.UnstructuredData = [];
    if (isiOsDevice && setting.token != undefined) {
        console.log("ios device logged in -- token == ", setting.token);
        pl.UnstructuredData[0] = {Key:"DeviceToken",Value:setting.token};
    } else if (isAndroid && setting.regId != undefined) {
        console.log("android device logged in -- regId == ", setting.regId);
        pl.UnstructuredData[0] = {Key:"DeviceToken",Value:setting.regId};
    } else {
        console.log("not a mobile device");
        pl.UnstructuredData[0] = {Key:"DeviceToken",Value:null};
    }

    smartphoneService.post(pl, "loginTcbCustomer", responseBack);
};
MobiliserClient.prototype.createCaptcha = function(responseBack) {
    //TODO : optimize and reuse for each call ?
    var pl = new Object();
    pl.origin = setting.origin;
    pl.traceNo = UUIDv4();
    pl.AuditData = setting.appinfo;
    
    smartphoneService.post(pl, "createCaptcha", responseBack);
};
MobiliserClient.prototype.getSocialUrl = function(responseBack, social, callbackUrl, errorCallbackUrl) {
    //TODO : optimize and reuse for each call ?
    var pl = new Object();
    pl.origin = setting.origin;
    pl.traceNo = UUIDv4();
    pl.AuditData = setting.appinfo;
    pl.wuid = session.customer.id;
    pl.socialID = social;
    pl.callbackUrl = callbackUrl;
    pl.errorUrl = errorCallbackUrl;
    smartphoneService.post(pl, "addSocial", responseBack);
};
MobiliserClient.prototype.removeSocial = function(responseBack, social) {
    //TODO : optimize and reuse for each call ?
    var pl = new Object();
    pl.origin = setting.origin;
    pl.traceNo = UUIDv4();
    pl.AuditData = setting.appinfo;
    pl.wuid = session.customer.id;
    pl.socialID = social;

    smartphoneService.post(pl, "removeSocial", responseBack);
};
MobiliserClient.prototype.getFriends = function(responseBack) {
    //TODO : optimize and reuse for each call ?
    var pl = new Object();
    pl.origin = setting.origin;
    pl.traceNo = UUIDv4();
    pl.AuditData = setting.appinfo;
    pl.wuid = session.customer.id;
    smartphoneService.post(pl, "getFriends", responseBack);
};
MobiliserClient.prototype.getFavoriteFriends = function(responseBack) {
    //TODO : optimize and reuse for each call ?
    var pl = new Object();
    pl.origin = setting.origin;
    pl.traceNo = UUIDv4();
    pl.AuditData = setting.appinfo;
    pl.wuid = session.customer.id;
    pl.type = "recent";
    smartphoneService.post(pl, "getFriends", responseBack);
};
MobiliserClient.prototype.getUserLinks = function(responseBack) {
    //TODO : optimize and reuse for each call ?
    var pl = new Object();
    pl.origin = setting.origin;
    pl.traceNo = UUIDv4();
    pl.AuditData = setting.appinfo;
    pl.wuid = session.customer.id;
    smartphoneService.post(pl, "getUserActivities", responseBack);
};
MobiliserClient.prototype.getUserDetails = function(responseBack) {
    //TODO : optimize and reuse for each call ?
    var pl = new Object();
    pl.origin = setting.origin;
    pl.traceNo = UUIDv4();
    pl.AuditData = setting.appinfo;
    pl.wuid = session.customer.id;
    smartphoneService.post(pl, "getUserDetails", responseBack);
};
MobiliserClient.prototype.getLinkDetails = function(responseBack, linkID) {
    //TODO : optimize and reuse for each call ?
    var pl = new Object();
    pl.origin = setting.origin;
    pl.traceNo = UUIDv4();
    pl.AuditData = setting.appinfo;
    pl.linkCode = linkID;
    smartphoneService.post(pl, "getLinkDetails", responseBack);
};
MobiliserClient.prototype.checkCredentialStrength= function(responseBack, credential) {
    //TODO : optimize and reuse for each call ?
    var pl = new Object();
    pl.origin = setting.origin;
    pl.traceNo = UUIDv4();
    pl.AuditData = setting.appinfo;
    pl.credential = credential;
    pl.customerTypeId = 201;
    pl.credentialType = 0;
    smartphoneService.post(pl, "checkCredentialStrength", responseBack);
};
MobiliserClient.prototype.precheckCreateCustomerAndSendSMSToken = function(responseBack,signupUserDetailsFactory) {

    //TODO : optimize and reuse for each call ?
    var pl = new Object();
    pl.origin = setting.origin;
    pl.traceNo = UUIDv4();
    pl.AuditData = setting.appinfo;
    pl.repeat = false;
    pl.customer = {
        blackListReason:0,
        test:false,
        customerTypeId:5,
        cancellationReasonId: 0,
        txnReceiptModeId:0,
        displayName: signupUserDetailsFactory.getUserName()
    };
    pl.identifications = [{
        type:0,
        identification:signupUserDetailsFactory.getMobileNumber()
    }];
    pl.credentials = [{
        type:0,
        credential:signupUserDetailsFactory.getPassword()
    }];
    var isoDate = (new Date( signupUserDetailsFactory.getIssueDate())).format("yyyy-mm-dd");
    pl.identity = {
        customerId:0,
        identity:signupUserDetailsFactory.getIdentityNumber(),
        identityType:0,
        status:0,
        dateIssued:isoDate
    };
    if (signupUserDetailsFactory.getArcIB() == true) {

        pl.UnstructuredData = signupUserDetailsFactory.getUD();
    }
    pl.otpId = signupUserDetailsFactory.getCapchaId();
    pl.otpStr = signupUserDetailsFactory.getCapchaCode();
    pl.language = "en";
    smartphoneService.post(pl, "preCheckCreateCustomerAndSendSMSToken", responseBack);
};

MobiliserClient.prototype.createTcbKycCustomer = function(responseBack,signupUserDetailsFactory) {

    //TODO : optimize and reuse for each call ?
    var pl = new Object();
    pl.origin = setting.origin;
    pl.traceNo = UUIDv4();
    pl.AuditData = setting.appinfo;
    pl.repeat = false;
    pl.customer = {
        blackListReason:0,
        test:false,
        customerTypeId:5,
        cancellationReasonId: 0,
        txnReceiptModeId:0,
        displayName: signupUserDetailsFactory.getUserName()
    };
    pl.identifications = [{
        type:0,
        identification:signupUserDetailsFactory.getMobileNumber()
    }];

    if (signupUserDetailsFactory.getArcIB() == true) {

        pl.UnstructuredData = signupUserDetailsFactory.getUD();
    }

    pl.credentials = [{
        type:0,
        credential:signupUserDetailsFactory.getPassword()
    }];
    var isoDate = (new Date(signupUserDetailsFactory.getIssueDate())).format("yyyy-mm-dd");

    pl.identity = {
        customerId:0,
        identity:signupUserDetailsFactory.getIdentityNumber(),
        identityType:0,
        status:0,
        dateIssued:isoDate
    };

    pl.smsToken = signupUserDetailsFactory.getSmsToken();
    smartphoneService.post(pl, "createTcbCustomer", responseBack);
};

MobiliserClient.prototype.createTcbCustomer = function(responseBack,signupUserDetailsFactory) {

    //TODO : optimize and reuse for each call ?
    var pl = new Object();
    pl.origin = setting.origin;
    pl.traceNo = UUIDv4();
    pl.AuditData = setting.appinfo;
    pl.repeat = false;


    console.log("signupUserDetailsFactory.getDOB() = ", signupUserDetailsFactory.getDOB());
    var isoDOB = (new Date(signupUserDetailsFactory.getDOB())).format("yyyy-mm-dd");

    pl.customer = {
        blackListReason:0,
        test:false,
        dateOfBirth:isoDOB,
        customerTypeId:201,
        cancellationReasonId: 0,
        txnReceiptModeId:0,
        displayName: signupUserDetailsFactory.getUserName()
    };
    pl.identifications = [{
        type:0,
        identification:signupUserDetailsFactory.getMobileNumber()
    }];

    if (signupUserDetailsFactory.getArcIB() == true) {

        pl.UnstructuredData = signupUserDetailsFactory.getUD();
    }

    pl.credentials = [{
        type:0,
        credential:signupUserDetailsFactory.getPassword()
    }];
    console.log("signupUserDetailsFactory.getIssueDate() = ", signupUserDetailsFactory.getIssueDate());
    var isoDate = (new Date(signupUserDetailsFactory.getIssueDate())).format("yyyy-mm-dd");

    pl.identity = {
        customerId:0,
        identity:signupUserDetailsFactory.getIdentityNumber(),
        identityType:0,
        status:0,
        dateIssued:isoDate
    };

    if (signupUserDetailsFactory.imgData1 != "" &&  signupUserDetailsFactory.imgData1 != undefined) {
        pl.attachments = [
            {
                attachmentType : 3,
                name: 'cmtnd1 - ' + signupUserDetailsFactory.getMobileNumber(),
                contentType:'image/jpeg',
                content:signupUserDetailsFactory.imgData1,
                status:0
            }];
    }
    if ( (signupUserDetailsFactory.imgData1 != "" &&  signupUserDetailsFactory.imgData1 != undefined) &&
         (signupUserDetailsFactory.imgData2 != "" &&  signupUserDetailsFactory.imgData2 != undefined))
    {
        pl.attachments = [
            {
                attachmentType : 3,
                name: 'cmtnd1 - ' + signupUserDetailsFactory.getMobileNumber(),
                contentType:'image/jpeg',
                content:signupUserDetailsFactory.imgData1,
                status:0
            },
            {
                attachmentType : 4,
                name: 'cmtnd2 - ' + signupUserDetailsFactory.getMobileNumber(),
                contentType:'image/jpeg',
                content:signupUserDetailsFactory.imgData2,
                status:0
            }];
    }


    pl.addresses =[
        {
            addressType: 0,
            addressStatus: 0,
            street1: signupUserDetailsFactory.getAddress(),
            city: signupUserDetailsFactory.city,
            email: signupUserDetailsFactory.getEmail()
        }
    ];

    if (signupUserDetailsFactory.getPromotionCode() != "" && signupUserDetailsFactory.getPromotionCode() != undefined) {
        pl.customer.referralCode = signupUserDetailsFactory.getPromotionCode();
    }


    pl.smsToken = signupUserDetailsFactory.getSmsToken();
    smartphoneService.post(pl, "createTcbCustomer", responseBack);
};


/**
@description Agent security login function
@param responseBack Indicates which function to be called when a response is received.
*/
MobiliserClient.prototype.fbssoLogin = function(responseBack, accessToken) {
 var pl = new Object();
 pl.origin = setting.origin;
 pl.traceNo = UUIDv4();
 pl.AuditData = setting.appinfo;

 smartphoneService.post(pl, "whoami" + "?create_mobiliser_remember_me=yes&facebook_code="+accessToken, responseBack);
};

/**
@description Agent request RSA public key from end point
@param responseBack Indicates which function to be called when a response is received.
@param type Specifies account type ("bank" or "card")
*/
MobiliserClient.prototype.getRsaPublicKey = function(responseBack, type) {
 var pl = new Object();

 pl.origin = setting.origin;
 pl.traceNo = UUIDv4();
 pl.AuditData = setting.appinfo;
 type = (!type || "card" !== type ? "bank" : "card");
 session.keyType = type;
 pl.keyName = ("bank" === type ? "mobiliser_bank" : "mobiliser_card");

 smartphoneService.post(pl, "getRsaPublicKey", responseBack);
};

/**
 @description Agent logout function
 @param responseBack Indicates which function to be called when a response is received.
 */
 MobiliserClient.prototype.logout = function(responseBack) {
    var pl = new Object();
    pl.origin = setting.origin;
    pl.traceNo = UUIDv4();
    pl.AuditData = setting.appinfo;
    pl.sessionId = session.sessionId;

    smartphoneService.post(pl, "logout", responseBack);
};

/**
 @description Agent create sms token function
 @param responseBack Indicates which function to be called when a response is received.
 */
 MobiliserClient.prototype.createSmsToken = function(responseBack, phoneno) {
    var pl = new Object();
    pl.origin = setting.origin;
    pl.traceNo = UUIDv4();
    pl.AuditData = setting.appinfo;
    pl.msisdn = phoneno;
    pl.language = "en";

    smartphoneService.user = null;
    smartphoneService.pass = null;
    smartphoneService.post(pl, "createSmsToken", responseBack);
};

/**
 @description Agent create full customer function
 @param responseBack Indicates which function to be called when a response is received.
 */
 MobiliserClient.prototype.createFullCustomer = function(responseBack, reginfo, token) {
    var pl_customer = new Object();
    pl_customer.orgUnitId = "0000";
    pl_customer.blackListReason = "0";
    pl_customer.active = "true";
    pl_customer.test = "false";
    pl_customer.displayName = reginfo.FirstName + " " + reginfo.LastName;
    pl_customer.riskCategoryId = "0";
    pl_customer.customerTypeId = reginfo.CustomerType;
    pl_customer.cancellationReasonId = "0";
    pl_customer.txnReceiptModeId = "3";
    pl_customer.language = "en";
    pl_customer.country = "US";

    var pl_ident1 = new Object();
    pl_ident1.type = "0";
    pl_ident1.identification = reginfo.Phoneno;
    if (reginfo.CustomerType == "102")
        pl_ident1.provider = reginfo.Provider;

    var pl_ident2 = new Object();
    pl_ident2.type = "5";
    pl_ident2.identification = reginfo.usrname;

    var pl_cred1 = new Object();
    pl_cred1.type = "0";
    pl_cred1.credential = reginfo.Pin;

    var pl_cred2 = new Object();
    pl_cred2.type = "1";
    pl_cred2.credential = reginfo.Password;

    var pl_addr = new Object();
    pl_addr.addressType = "0";
    pl_addr.addressStatus = "0";
    pl_addr.firstName = reginfo.FirstName;
    pl_addr.lastName = reginfo.LastName;
    pl_addr.email = reginfo.Email;

    var pl = new Object();
    pl.origin = setting.origin;
    pl.traceNo = UUIDv4();
    pl.AuditData = setting.appinfo;
    pl.customer = pl_customer;
    pl.identifications = [ pl_ident1, pl_ident2 ];
    pl.credentials = [ pl_cred1, pl_cred2 ];
    pl.addresses = [ pl_addr ];
    pl.smsToken = token;
    pl.acceptedTncVersionIds = reginfo.acceptedTncVersionIds;

    if (reginfo.CustomerType == "102") {
        var mbankingService = {};
        jQuery.extend(mbankingService, smartphoneService);
        mbankingService.url = mc.mburl();
        mbankingService.post(pl, "createFullCustomer", responseBack);
    } else 
    smartphoneService.post(pl, "createFullCustomer", responseBack);
};


/**
 @description Agent update customer function
 @param responseBack Indicates which function to be called when a response is received.
 */
 MobiliserClient.prototype.updateCustomerNotification = function(responseBack, mode) {
    var pl_customer = new Object();
    pl_customer.id = session.customer.id;
    pl_customer.orgUnitId = session.customer.orgUnitId;
    pl_customer.blackListReason = session.customer.blackListReason;
    pl_customer.active = session.customer.active;
    pl_customer.test = session.customer.test;
    pl_customer.displayName = session.customer.displayName;
    pl_customer.riskCategoryId = session.customer.riskCategoryId;
    pl_customer.customerTypeId = session.customer.customerTypeId;
    pl_customer.cancellationReasonId = session.customer.cancellationReasonId;
    pl_customer.txnReceiptModeId = mode;

    var pl = new Object();
    pl.origin = setting.origin;
    pl.traceNo = UUIDv4();
    pl.AuditData = setting.appinfo;
    pl.customer = pl_customer;

    smartphoneService.post(pl, "updateCustomer", responseBack);
};

/**
 @description Agent update customer function
 @param responseBack Indicates which function to be called when a response is received.
 */
 MobiliserClient.prototype.updateCustomerBlockAccount = function(responseBack) {
    var pl_customer = new Object();
    pl_customer.id = session.customer.id;
    pl_customer.orgUnitId = session.customer.orgUnitId;
    pl_customer.blackListReason = "2";
    pl_customer.active = session.customer.active;
    pl_customer.test = session.customer.test;
    pl_customer.displayName = session.customer.displayName;
    pl_customer.riskCategoryId = session.customer.riskCategoryId;
    pl_customer.customerTypeId = session.customer.customerTypeId;
    pl_customer.cancellationReasonId = session.customer.cancellationReasonId;
    pl_customer.txnReceiptModeId = session.customer.txnReceiptModeId;

    var pl = new Object();
    pl.origin = setting.origin;
    pl.traceNo = UUIDv4();
    pl.AuditData = setting.appinfo;
    pl.customer = pl_customer;

    smartphoneService.post(pl, "updateCustomer", responseBack);
};

/**
 @description Agent create identification function
 @param responseBack Indicates which function to be called when a response is received.
 */
 MobiliserClient.prototype.createIdentification = function(responseBack, customerId, type, identification) {
    var pl_ident = new Object();
    pl_ident.customerId = customerId;
    pl_ident.type = type;
    pl_ident.identification = identification;

    var pl = new Object();
    pl.origin = setting.origin;
    pl.traceNo = UUIDv4();
    pl.AuditData = setting.appinfo;
    pl.identification = pl_ident;

    smartphoneService.post(pl, "createIdentification", responseBack);
};

/**
 @description Agent get identifications function
 @param responseBack Indicates which function to be called when a response is received.
 */
 MobiliserClient.prototype.getIdentifications = function(responseBack, customerId, type) {
    var pl = new Object();
    pl.origin = setting.origin;
    pl.traceNo = UUIDv4();
    pl.AuditData = setting.appinfo;
    pl.customerId = customerId; 
    pl.identificationTypeId = type; //0

    smartphoneService.post(pl, "getIdentifications", responseBack);
};

/**
 @description setCredential function
 @param responseBack Indicates which function to be called when a response is received.
 @param customerId The customer id of the user
 @param Credential The PIN or Password to set
 @param type The type of Credential
 */
 MobiliserClient.prototype.setCredential = function(responseBack, Credential, type) {
    var pl = new Object();
    pl.origin = setting.origin;
    pl.traceNo = UUIDv4();
    pl.AuditData = setting.appinfo;
    pl.customerId = session.customer.id;
    pl.credential = Credential;
    pl.credentialType = type;

    smartphoneService.post(pl, "setCredential", responseBack);
};

/**
 @description Change Credential function
 @param responseBack Indicates which function to be called when a response is received.
 @param customerId The customer id of the user
 @param oldCredential The old Credential
 @param newCredential The new Credential chosen by the user
 */
 MobiliserClient.prototype.changeCredential = function(responseBack, oldCredential, newCredential, type) {
    var pl = new Object();
    pl.origin = setting.origin;
    pl.traceNo = UUIDv4();
    pl.AuditData = setting.appinfo;
    pl.customerId = session.customer.id;
    pl.oldCredential = oldCredential;
    pl.newCredential = newCredential;
    pl.credentialType = type;

    smartphoneService.post(pl, "changeCredential", responseBack);
};

/**
@description checkCredential function
@param responseBack Indicates which function to be called when a response is received.
@param Credential The PIN or Password to set
 @param type The type of Credential
 */
 MobiliserClient.prototype.checkCredential = function(responseBack, Credential, type) {
    var pl = new Object();
    pl.origin = setting.origin;
    pl.traceNo = UUIDv4();
    pl.AuditData = setting.appinfo;
    pl.customerId = session.customer.id;
    pl.credential = Credential;
    pl.credentialType = type;

    smartphoneService.post(pl, "checkCredential", responseBack);
};

/**
 @description A function to query all of the payment instruments in the customer's mobile wallet
 @param responseBack Indicates which function to be called when a response is received.
 @param customerId The customer id of the user
 */
 MobiliserClient.prototype.getWallets = function(responseBack, customerId) {
    var pl = new Object();
    pl.origin = setting.origin;
    pl.traceNo = UUIDv4();
    pl.AuditData = setting.appinfo;
    pl.customerId = customerId;

    smartphoneService.post(pl, "getWalletEntriesByCustomer", responseBack);
};

/**
 @description A function to get balance of SVA
 @param responseBack Indicates which function to be called when a response is received.
 */
 MobiliserClient.prototype.balanceInquiry = function(responseBack, piid) {
    var pl = new Object();
    pl.origin = setting.origin;
    pl.traceNo = UUIDv4();
    pl.AuditData = setting.appinfo;
    pl.paymentInstrumentId = piid;

    smartphoneService.post(pl, "getPaymentInstrumentBalance", responseBack);
};

/**
 @description A function to create a wallet entry with paymentInstrument in the customer's mobile wallet
 @param responseBack Indicates which function to be called when a response is received.
 */
 MobiliserClient.prototype.createWalletEntry = function(responseBack, paymentInstrument,
    paymentInstrumentType, nickname) {
    var pl_pI = new Object();
    pl_pI.pseudo_type = paymentInstrumentType == "bankAccount" ? "BankAccount" : "CreditCard";
    pl_pI.customerId = session.customer.id;
    pl_pI.active = "true";
    pl_pI.status = "0";
    pl_pI.currency = "EUR";
    pl_pI.multiCurrency = "false";
    for(var p in paymentInstrument)
        pl_pI[p] = paymentInstrument[p];

    var pl_entry = new Object();
    pl_entry.customerId = session.customer.id;
    pl_entry.debitPriority = "1";
    pl_entry.creditPriority = "1";
    pl_entry.alias = nickname;
    pl_entry[paymentInstrumentType] = pl_pI;

    var pl = new Object();
    pl.origin = setting.origin;
    pl.traceNo = UUIDv4();
    pl.AuditData = setting.appinfo;
    pl.walletEntry = pl_entry;
    pl.primaryDebit = "true";
    pl.primaryCredit = "true";

    smartphoneService.post(pl, "createWalletEntry", responseBack);
};

/**
 @description A function to update a wallet entry in the customer's mobile wallet
 @param responseBack Indicates which function to be called when a response is received.
 */
 MobiliserClient.prototype.updateWalletEntry = function(responseBack, nickname, acctid) {
    var pl_entry = new Object();
    pl_entry.id = session.accounts[acctid].walletId;
    pl_entry.customerId = session.customer.id;
    pl_entry.paymentInstrumentId = session.accounts[acctid].pIId;
    pl_entry.alias = nickname;

    var pl = new Object();
    pl.origin = setting.origin;
    pl.traceNo = UUIDv4();
    pl.AuditData = setting.appinfo;
    pl.walletEntry = pl_entry;

    smartphoneService.post(pl, "updateWalletEntry", responseBack);
};

/**
 @description A function to set primary wallet in the customer's mobile wallet
 @param responseBack Indicates which function to be called when a response is received.
 */
 MobiliserClient.prototype.setPrimary = function(responseBack, acctid) {
    var pl_entry = new Object();
    pl_entry.id = session.accounts[acctid].walletId;
    pl_entry.customerId = session.customer.id;
    pl_entry.paymentInstrumentId = session.accounts[acctid].pIId;
    pl_entry.alias = session.accounts[acctid].info;

    var pl = new Object();
    pl.origin = setting.origin;
    pl.traceNo = UUIDv4();
    pl.AuditData = setting.appinfo;
    pl.walletEntry = pl_entry;
    pl.primaryDebit = "true";
    pl.primaryCredit = "true";

    smartphoneService.post(pl, "updateWalletEntry", responseBack);
};

/**
@description A function to update a paymentInstrument of a wallet entry in the customer's mobile wallet
@param responseBack Indicates which function to be called when a response is received.
*/
MobiliserClient.prototype.updatePaymentInstrument = function(responseBack, paymentInstrument,
    paymentInstrumentType, acctid) {
    var pl_pI = new Object();
    pl_pI.pseudo_type = paymentInstrumentType;
    pl_pI.id = session.accounts[acctid].pIId;
    pl_pI.customerId = session.customer.id;
    pl_pI.active = "true";
    pl_pI.status = "0";
    pl_pI.currency = "EUR";
    pl_pI.multiCurrency = "false";
    for(var p in paymentInstrument)
        pl_pI[p] = paymentInstrument[p];

    var pl = new Object();
    pl.origin = setting.origin;
    pl.traceNo = UUIDv4();
    pl.AuditData = setting.appinfo;
    pl.PaymentInstrument = pl_pI;

    smartphoneService.post(pl, "updatePaymentInstrument", responseBack);
};

/**
 @description A function to create a wallet entry with paymentInstrument in the customer's mobile wallet
 @param responseBack Indicates which function to be called when a response is received.
 */
 MobiliserClient.prototype.deleteWalletEntry = function(responseBack, acctid) {
    var pl = new Object();
    pl.origin = setting.origin;
    pl.traceNo = UUIDv4();
    pl.AuditData = setting.appinfo;
    pl.walletEntryId = session.accounts[acctid].walletId;

    session.accountPiIdForDeletion = session.accounts[acctid].pIId;
    smartphoneService.post(pl, "deleteWalletEntry", responseBack);
};

/**
 @description Get transaction history for a customer
 @param responseBack Indicates which function to be called when a response is received.
 @param customerId The customer id of the user
 @param maxRecords The max number of transactions to return
 @param paymentInstrumentId The id of the payment instrument
 */
 MobiliserClient.prototype.findTransactions = function(responseBack, customerId, maxRecords,paymentInstrumentId) {
    var pl = new Object();
    pl.origin = setting.origin;
    pl.traceNo = UUIDv4();
    pl.AuditData = setting.appinfo;
    pl.customerId = customerId;
    pl.statusFilter = "30";
    pl.maxRecords = maxRecords;
    if (paymentInstrumentId !== undefined) {
        pl.paymentInstrumentId = paymentInstrumentId;
    }
    smartphoneService.post(pl, "findTransactions", responseBack);
};
MobiliserClient.prototype.findTcbTransactions = function(responseBack,paymentInstrumentId, maxRecords, fromDate, toDate) {
    var pl = new Object();
    pl.origin = setting.origin;
    pl.traceNo = UUIDv4();
    pl.AuditData = setting.appinfo;
    pl.maxRecords = maxRecords;
    if (fromDate !== undefined) {
        pl.fromDate = fromDate;
        pl.toDate = toDate;
    }
    
    if (paymentInstrumentId !== undefined) {
        pl.paymentInstrumentId = paymentInstrumentId;
    }
    smartphoneService.post(pl, "findTcbTransactions", responseBack);
};
MobiliserClient.prototype.findSocialTransactions = function(responseBack, maxRecords, fromDate, toDate) {
    session.fetchingSocialTransactions = true;
    var pl = new Object();
    pl.origin = setting.origin;
    pl.traceNo = UUIDv4();
    pl.AuditData = setting.appinfo;
    pl.maxRecords = maxRecords;
    if (fromDate !== undefined) {
        pl.fromDate = fromDate;
        pl.toDate = toDate;
    }
    pl.customerId = session.customer.id;
    smartphoneService.post(pl, "findSocialTransactions", responseBack);
};
MobiliserClient.prototype.findSocialTransactionsWithStatus = function(responseBack, maxRecords, status, fromDate, toDate) {
    var pl = new Object();
    pl.origin = setting.origin;
    pl.traceNo = UUIDv4();
    pl.AuditData = setting.appinfo;
    pl.maxRecords = maxRecords;
    if (fromDate !== undefined) {
        pl.fromDate = fromDate;
        pl.toDate = toDate;
    }
    pl.customerId = session.customer.id;
    pl.status = status;
    smartphoneService.post(pl, "findSocialTransactions", responseBack);
};

/**
@description Get details of a transaction
@param responseBack Indicates which function to be called when a response is received.
@param customerId The customer id of the user
@param maxRecords The max number of transactions to return
@param paymentInstrumentId The id of the payment instrument
*/
MobiliserClient.prototype.getTxnDetails = function(responseBack, id) {
    var pl = new Object();
    pl.origin = setting.origin;
    pl.traceNo = UUIDv4();
    pl.AuditData = setting.appinfo;
    pl.txnId = id;

    smartphoneService.post(pl, "getTransactionDetails", responseBack);
};

/**
 @description Get types of invoices by group in the system
 @param responseBack Indicates which function to be called when a response is received.
 */
 MobiliserClient.prototype.getInvoiceTypesByGroup = function(responseBack) {
    var pl = new Object();
    pl.origin = setting.origin;
    pl.traceNo = UUIDv4();
    pl.AuditData = setting.appinfo;
    pl.groupId = "2";
    pl.onlyActive = "true";

    smartphoneService.post(pl, "getInvoiceTypesByGroup", responseBack);
};

/**
 @description Get types of invoices by group in the system
 @param responseBack Indicates which function to be called when a response is received.
 */
 MobiliserClient.prototype.createInvoiceForInvoiceType = function(responseBack, invoiceTypeId,
    reference, amount ) {
    var pl = new Object();
    pl.origin = setting.origin;
    pl.traceNo = UUIDv4();
    pl.AuditData = setting.appinfo;
    pl.invoiceTypeId = invoiceTypeId;
    pl.customerId = session.customer.id;
    pl.reference = reference;
    pl.amount = amount;
    pl.currency = "EUR";

    smartphoneService.post(pl, "createInvoiceForInvoiceType", responseBack);
};

/**
 @description Get all types of invoices in the system
 @param responseBack Indicates which function to be called when a response is received.
 */
 MobiliserClient.prototype.getBillTypes = function(responseBack) {
    var pl = new Object();
    pl.origin = setting.origin;
    pl.traceNo = UUIDv4();
    pl.AuditData = setting.appinfo;
    pl.onlyActive = "true";

    smartphoneService.post(pl, "getAllInvoiceTypes", responseBack);
};

/**
 @description Get all configured invoices for a customer
 @param responseBack Indicates which function to be called when a response is received.
 @param customerId The customer id of the user
 */
 MobiliserClient.prototype.getRegisteredBills = function(responseBack, customerId) {
    var pl = new Object();
    pl.origin = setting.origin;
    pl.traceNo = UUIDv4();
    pl.AuditData = setting.appinfo;
    pl.customerId = customerId;
    pl.onlyActive = "true";

    smartphoneService.post(pl, "getInvoiceConfigurationsByCustomer", responseBack);
};

/**
 @description Configure an invoice for some merchant bill type for a customer
 @param responseBack Indicates which function to be called when a response is received.
 @param customerId The customer id of the user
 @param alias The name the customer gives for this invoice configuration
 @param typeId The id of the invoice type
 */
 MobiliserClient.prototype.registerSimpleBill = function(responseBack, customerId, typeId, ref, alias) {
    var pl_invconfig = new Object();
    pl_invconfig.invoiceTypeId = typeId;
    pl_invconfig.customerId = customerId;
    pl_invconfig.reference = ref;
    pl_invconfig.status = "0";
    pl_invconfig.active = "true";
    pl_invconfig.alias = alias;


    var pl = new Object();
    pl.origin = setting.origin;
    pl.traceNo = UUIDv4();
    pl.AuditData = setting.appinfo;
    pl.invoiceConfiguration = pl_invconfig;

    smartphoneService.post(pl, "createInvoiceConfiguration", responseBack);
};

/**
 @description Remove a configured invoice for a customer
 @param responseBack Indicates which function to be called when a response is received.
 @param invoiceConfigurationId The id of an invoice configuration for a customer
 */
 MobiliserClient.prototype.unregisterBill = function(responseBack, invoiceConfigurationId) {
    var pl = new Object();
    pl.origin = setting.origin;
    pl.traceNo = UUIDv4();
    pl.AuditData = setting.appinfo;
    pl.invoiceConfigurationId = invoiceConfigurationId;

    smartphoneService.post(pl, "deleteInvoiceConfiguration", responseBack);
};

/**
 @description Get all active invoices for a customer
 @param responseBack Indicates which function to be called when a response is received.
 @param customerId The customer id of the user
 */
 MobiliserClient.prototype.getOpenInvoices = function(responseBack, customerId) {
    var pl = new Object();
    pl.origin = setting.origin;
    pl.traceNo = UUIDv4();
    pl.AuditData = setting.appinfo;
    pl.customerId = customerId;
    pl.invoiceStatus = "1";

    smartphoneService.post(pl, "getInvoicesByCustomer", responseBack);
};

/**
 @description Create an invoice for a customer for a specific type of merchant bill
 @param responseBack Indicates which function to be called when a response is received.
 @param invoiceConfigurationId The id of an invoice configuration for a customer
 @param ref The reference number of an invoice
 @param amount The amount of money to pay in cents
 @param date
 */
 MobiliserClient.prototype.createInvoice = function(responseBack, invoiceConfigurationId, amount, date) {
    var inv = new Object();
    inv.invoiceConfigurationId = invoiceConfigurationId;
    inv.status = "1";
    inv.amount = amount;
    inv.currency = "EUR";
    inv.date = date+"T00:00:00.000Z";

    var pl = new Object();
    pl.origin = setting.origin;
    pl.traceNo = UUIDv4();
    pl.AuditData = setting.appinfo;;
    pl.invoice = inv;

    smartphoneService.post(pl, "createInvoice", responseBack);
};

/**
 @description transfer function
 @param responseBack Indicates which function to be called when a response is received.
 @param payercustomerId The customerId of payer
 @param payerpI The paymentInstrumentId of payer
 @param payeemsisdn The msisdn of payee receiving the payment
 @param txn The TxnData object that contains txn details
 */
 MobiliserClient.prototype.transfer = function(responseBack, payer, payee, txn) {
    var pl_amount = new Object();
    pl_amount.currency = "VND";
    pl_amount.vat = "0";
    pl_amount.value = txn.amount;

    var pl = new Object();
    pl.origin = setting.origin;
    pl.traceNo = UUIDv4();
    pl.AuditData = setting.appinfo;
    pl.autoCapture = "true";
    pl.orderChannel = "0";
    pl.usecase = txn.usecase;
    pl.Payer = payer;
    pl.Payee = payee;
    pl.Amount = pl_amount;
    pl.Text = txn.text;

    smartphoneService.post(pl, "preAuthorisation", responseBack);
};

/**
 @description preAuthorisationContinue function
 @param responseBack Indicates which function to be called when a response is received.
 @param id The systemId of previous PreAuthorisation
 @param ref The Reference of previous PreAuthorisation
 */
 MobiliserClient.prototype.preAuthorisationContinue = function(responseBack, id) {
    var pl_ref = new Object();
    pl_ref.systemId = id;

    var pl = new Object();
    pl.origin = setting.origin;
    pl.traceNo = UUIDv4();
    pl.AuditData = setting.appinfo;
    pl.ReferenceTransaction = pl_ref;

    smartphoneService.post(pl, "preAuthorisationContinue", responseBack);
};
MobiliserClient.prototype.authenticationContinue = function(responseBack, id, otp, pin) {
    var pl_ref = new Object();
    pl_ref.systemId = id;

    var pl = new Object();
    pl.origin = setting.origin;
    pl.traceNo = UUIDv4();
    pl.AuditData = setting.appinfo;
    pl.Credential = {payer:"" + pin + otp};
    pl.ReferenceTransaction = pl_ref;
    /*pl.UnstructuredData = [{
        Key: "PinCode",
        Value: pin
    }];*/

    smartphoneService.post(pl, "authenticationContinue", responseBack);
};
/* Meta data */
MobiliserClient.prototype.getUploadUrl = function(responseBack, type, callbackUrl) {
    var pl = new Object();
    pl.origin = setting.origin;
    pl.traceNo = UUIDv4();
    pl.AuditData = setting.appinfo;
    pl.type = type;
    pl.callbackUrl = callbackUrl;

    smartphoneService.post(pl, "getUploadUrl", responseBack);
};
MobiliserClient.prototype.completeUpload = function(responseBack, type, metadataId) {
    var pl = new Object();
    pl.origin = setting.origin;
    pl.traceNo = UUIDv4();
    pl.AuditData = setting.appinfo;
    pl.type = type;
    pl.metadataId = metadataId;

    smartphoneService.post(pl, "completeUpload", responseBack);
};
MobiliserClient.prototype.attachMetadata = function(responseBack, type, metadataId, linkCode) {
    var pl = new Object();
    pl.origin = setting.origin;
    pl.traceNo = UUIDv4();
    pl.AuditData = setting.appinfo;
    pl.type = type;
    pl.metadataId = metadataId;
    pl.linkCode = linkCode;
    smartphoneService.post(pl, "attachMetadata", responseBack);
};
MobiliserClient.prototype.getDownloadUrl = function(responseBack, metadataId) {
    var pl = new Object();
    pl.origin = setting.origin;
    pl.traceNo = UUIDv4();
    pl.AuditData = setting.appinfo;
    pl.metadataId = metadataId;
    smartphoneService.post(pl, "getDownloadUr", responseBack);
};

/**
@description request function
@param responseBack Indicates which function to be called when a response is received.
@param payermsisdn The Customer msisdn that will receive the request
@param txn The TxnData object that contains txn details
*/
MobiliserClient.prototype.request = function(responseBack, payermsisdn, txn) {
    var payerident = new Object();
    payerident.type = "0";
    payerident.value = payermsisdn;

    var pl_payer = new Object();
    pl_payer.identifier = payerident;

    var payeeident = new Object();
    payeeident.type = "1";
    payeeident.value = session.customer.id;

    var pl_payee = new Object();
    pl_payee.identifier = payeeident;

    var pl_amount = new Object();
    pl_amount.currency = "EUR";
    pl_amount.vat = "0";
    pl_amount.value = txn.amount;

    var pl = new Object();
    pl.origin = setting.origin;
    pl.traceNo = UUIDv4();
    pl.AuditData = setting.appinfo;
    pl.autoCapture = "true";
    pl.orderChannel = "0";
    pl.usecase = txn.usecase;
    pl.Payer = pl_payer;
    pl.Payee = pl_payee;
    pl.Amount = pl_amount;
    pl.Text = txn.text;

    smartphoneService.post(pl, "preAuthorisation", responseBack);
};

/**
@description startVoucher function
@param responseBack Indicates which function to be called when a response is received.
@param payercustomerId The Customer customerId which will make the payment
@param payerpI The paymentInstrument Id of the Customer which will use to make the payment
@param payeemsisdn The Customer msisdn that will receive the payment
@param txn The TxnData object that contains txn details
*/
MobiliserClient.prototype.startVoucher = function(responseBack, payercustomerId, payeemsisdn, txn) {
    var payerident = new Object();
    payerident.type = "1";
    payerident.value = payercustomerId;

    var pl_payer = new Object();
    pl_payer.identifier = payerident;

    var payeeident = new Object();
    payeeident.type = "0";
    payeeident.value = payeemsisdn;

    var pl_payee = new Object();
    pl_payee.identifier = payeeident;

    var pl_amount = new Object();
    pl_amount.currency = "EUR";
    pl_amount.vat = "0";
    pl_amount.value = txn.amount;

    var pl = new Object();
    pl.origin = setting.origin;
    pl.traceNo = UUIDv4();
    pl.AuditData = setting.appinfo;
    pl.autoCapture = "true";
    pl.orderChannel = "0";
    pl.usecase = txn.usecase;
    pl.Payer = pl_payer;
    pl.Payee = pl_payee;
    pl.Amount = pl_amount;
    pl.Text = txn.text;

    smartphoneService.post(pl, "startVoucher", responseBack);
};

/**
@description confirmVoucher function
@param responseBack Indicates which function to be called when a response is received.
 @param id The systemId of previous StartVoucher
 @param ref The Reference of previous StartVoucher
 */
 MobiliserClient.prototype.confirmVoucher = function(responseBack, id, ref) {
    var pl_ref = new Object();
    pl_ref.systemId = id;
    pl_ref.value = ref;

    var pl = new Object();
    pl.origin = setting.origin;
    pl.traceNo = UUIDv4();
    pl.AuditData = setting.appinfo;
    pl.ReferenceTransaction = pl_ref;

    smartphoneService.post(pl, "confirmvoucher", responseBack);
};

/**
 @description DemandOnPayment function
 @param responseBack Indicates which function to be called when a response is received.
 @param username The username should normally be the msisdn in addition to its country code i.e. +18881234567
 @param password The user password
 @param payer The Customer object which will be making the payment
 @param payee The Customer object that will be receiving the payment
 @param txn The TxnData object that contains txn details
 */
 MobiliserClient.prototype.demandForPayment = function(responseBack, payermsisdn, payeecustomerId, amount, msg) {
    var payerident = new Object();
    payerident.type = "0";
    payerident.value = payermsisdn;

    var pl_payer = new Object();
    pl_payer.identifier = payerident;

    var payeeident = new Object();
    payeeident.type = "1";
    payeeident.value = payeecustomerId;

    var pl_payee = new Object();
    pl_payee.identifier = payeeident;

    var pl_amount = new Object();
    pl_amount.currency = "VND";
    pl_amount.vat = "0";
    pl_amount.value = amount;

    var pl = new Object();
    pl.origin = setting.origin;
    pl.traceNo = UUIDv4();
    pl.AuditData = setting.appinfo;
    pl.Payer = pl_payer;
    pl.Payee = pl_payee;
    pl.Amount = pl_amount;
    pl.Text = msg;

    smartphoneService.post(pl, "demandForPayment", responseBack);
};
MobiliserClient.prototype.demandForPaymentSocial = function(responseBack, payerInfo , payeecustomerId, amount, msg) {
    var payerident = new Object();
    payerident.type = "5";
    payerident.value = "fastacash";

    var pl_payer = new Object();
    pl_payer.identifier = payerident;
    var payeeident = new Object();
    payeeident.type = "1";
    payeeident.value = payeecustomerId;

    var pl_payee = new Object();
    pl_payee.identifier = payeeident;

    var pl_amount = new Object();
    pl_amount.currency = "VND";
    pl_amount.vat = "0";
    pl_amount.value = amount;

    var pl = new Object();
    pl.origin = setting.origin;
    pl.traceNo = UUIDv4();
    pl.AuditData = setting.appinfo;
    pl.UnstructuredData = payerInfo;
    pl.Payee = pl_payee;
    pl.Payer = pl_payer;
    pl.Amount = pl_amount;
    pl.Text = msg;

    smartphoneService.post(pl, "demandForPayment", responseBack);
};

/**
 @description load function
 @param responseBack Indicates which function to be called when a response is received.
 @param payerpI The paymentInstrument Id of the Customer which will use to load fund to SVA
 @param txn The TxnData object that contains txn details
 */
 MobiliserClient.prototype.load = function(responseBack, payer, payee, txn) {
    var pl_amount = new Object();
    pl_amount.currency = "VND";
    pl_amount.vat = "0";
    pl_amount.value = txn.amount;

    var pl = new Object();
    pl.origin = setting.origin;
    pl.traceNo = UUIDv4();
    pl.AuditData = setting.appinfo;
    pl.autoCapture = "true";
    pl.orderChannel = "0";
    pl.usecase = txn.usecase;
    pl.Payer = payer;
    pl.Payee = payee;
    pl.Amount = pl_amount;
    pl.Text = txn.text;

    smartphoneService.post(pl, "preAuthorisation", responseBack);
};

/**
 @description unload function
 @param responseBack Indicates which function to be called when a response is received.
 @param payeepI The paymentInstrument Id of the Customer which will use to receive fund from SVA
 @param txn The TxnData object that contains txn details
 */
 MobiliserClient.prototype.unload = function(responseBack, payer, payee, txn, autocap) {
    var pl_amount = new Object();
    pl_amount.currency = "VND";
    pl_amount.vat = "0";
    pl_amount.value = txn.amount;

    var pl = new Object();
    pl.origin = setting.origin;
    pl.traceNo = UUIDv4();
    pl.AuditData = setting.appinfo;
    pl.autoCapture = autocap;
    pl.orderChannel = "0";
    pl.usecase = txn.usecase;
    pl.Payer = payer;
    pl.Payee = payee;
    pl.Amount = pl_amount;
    pl.Text = txn.text;


    smartphoneService.post(pl, "preAuthorisation", responseBack);
};
MobiliserClient.prototype.getPaymentInstrument = function(responseBack, acct,type) {


    var pl = new Object();
    pl.origin = setting.origin;
    pl.repeat = false;
    pl.traceNo = UUIDv4();
    pl.AuditData = setting.appinfo;
    pl.UnstructuredData = [];
    if (type == 1)
        pl.UnstructuredData[0] = {Key:"Msidn",Value:acct};
    else 
        pl.UnstructuredData[0] = {Key:"TcbBankAccount",Value:acct};
    pl.paymentInstrumentId = 0;
    pl.includeInactive = false;

    smartphoneService.post(pl, "getPaymentInstrument", responseBack);
}
MobiliserClient.prototype.authorisation = function(responseBack, payer, payee, attribute, txn, autocap) {
    var pl_amount = new Object();
    pl_amount.currency = "VND";
    pl_amount.vat = "0";
    pl_amount.value = txn.amount;

    var pl = new Object();
    pl.origin = setting.origin;
    pl.traceNo = UUIDv4();
    pl.AuditData = setting.appinfo;
    pl.autoCapture = autocap;
    pl.orderChannel = "0";
    pl.usecase = txn.usecase;
    pl.Payer = payer;
    pl.Payee = payee;
    pl.Amount = pl_amount;
    pl.attribute = attribute;
    pl.Text = txn.text;

    smartphoneService.post(pl, "authorisation", responseBack);
};
/**
 * Gets beneficiaries by type
 * @param responseBack callback function
 * @param type 0:wallet, 1:tcb account, 2: other banks account, 3: all
 */
MobiliserClient.prototype.getBeneficiaries = function(responseBack,type) {
    //if (session.customer.customerTypeId != 200) responseBack({Status:{code:0,value:null},benList[]});

    var pl = new Object();
    pl.origin = setting.origin;
    pl.repeat = false;
    pl.traceNo = UUIDv4();
    pl.AuditData = setting.appinfo;
    if(type != undefined) {
      pl.type = type;
    }
    smartphoneService.post(pl, "getBeneficiariesByCustomer", responseBack);
}
MobiliserClient.prototype.spreadLove = function(responseBack,message) {
    
    var pl = new Object();
    pl.origin = setting.origin;
    pl.repeat = false;
    pl.traceNo = UUIDv4();
    pl.AuditData = setting.appinfo;
    pl.wuid = session.customer.id;
    //pl.message = message;
    pl.social = "fb";
    smartphoneService.post(pl, "spread", responseBack);
}
MobiliserClient.prototype.getAtmLocation = function(responseBack) {
    //if (session.customer.customerTypeId != 200) responseBack({Status:{code:0,value:null},benList[]});

    var pl = new Object();
    pl.origin = setting.origin;
    pl.repeat = false;
    pl.traceNo = UUIDv4();
    pl.AuditData = setting.appinfo;
    pl.dateUpdate = "20120101";
    
    smartphoneService.post(pl, "getAtmLocation", responseBack);
}

MobiliserClient.prototype.createBeneficiary = function(responseBack, ben) {
    var pl = new Object();
    pl.origin = setting.origin;
    pl.repeat = false;
    pl.traceNo = UUIDv4();
    pl.AuditData = setting.appinfo;
    pl.beneficiary = ben;
    smartphoneService.post(pl, "createBeneficiary", responseBack);
}
MobiliserClient.prototype.registerPushNotification = function(responseBack, token) {
    var pl = new Object();
    pl.origin = setting.origin;
    pl.repeat = false;
    pl.traceNo = UUIDv4();
    pl.AuditData = setting.appinfo;
    pl.deviceId = setting.appinfo.deviceId;
    if (isiOsDevice) {
        pl.pushToken = "[ios]"+token;
    } else if (isAndroid) {
        pl.pushToken = "[adr]"+token;
    } else {
        pl.pushToken = "[ukn]"+token;
    }

    smartphoneService.post(pl, "registerPushNotification", responseBack);
}
MobiliserClient.prototype.updateBeneficiary = function(responseBack, beneficiaryId, benName, benAccount, type) {
    var pl = new Object();
    pl.origin = setting.origin;
    pl.repeat = false;
    pl.traceNo = UUIDv4();
    pl.AuditData = setting.appinfo;
    var ben = {beneficiaryId:beneficiaryId,benName: benName, accountNumber: benAccount, active:true, type:type};
    pl.beneficiary = ben;
    smartphoneService.post(pl, "updateBeneficiary", responseBack);
}
MobiliserClient.prototype.deleteBeneficiary = function(responseBack, beneficiaryId) {
    var pl = new Object();
    pl.origin = setting.origin;
    pl.repeat = false;
    pl.traceNo = UUIDv4();
    pl.AuditData = setting.appinfo;
    pl.beneficiaryId = beneficiaryId;
    smartphoneService.post(pl, "deleteBeneficiary", responseBack);
}
MobiliserClient.prototype.getCustomerProfile = function(responseBack) {
    var pl = new Object();
    pl.origin = setting.origin;
    pl.repeat = false;
    pl.traceNo = UUIDv4();
    pl.AuditData = setting.appinfo;
    pl.customerId = session.customer.id;
    smartphoneService.post(pl, "getCustomerProfile", responseBack);
}
MobiliserClient.prototype.updateCustomerProfile = function(responseBack,profile) {
    var pl = new Object();
    pl.origin = setting.origin;
    pl.repeat = false;
    pl.traceNo = UUIDv4();
    pl.AuditData = setting.appinfo;
    pl.profile = profile;
    smartphoneService.post(pl, "updateCustomerProfile", responseBack);
}
MobiliserClient.prototype.cashout = function(responseBack, payer, payee, attribute, txn, autocap) {
    var pl_amount = new Object();
    pl_amount.currency = "VND";
    pl_amount.vat = "0";
    pl_amount.value = txn.amount;

    var pl = new Object();
    pl.origin = setting.origin;
    pl.traceNo = UUIDv4();
    pl.AuditData = setting.appinfo;
    pl.autoCapture = autocap;
    pl.orderChannel = "0";
    pl.usecase = txn.usecase;
    pl.Payer = payer;
    pl.Payee = payee;
    pl.Amount = pl_amount;
    pl.Text = txn.text;
    pl.attribute = attribute;
    

    smartphoneService.post(pl, "preAuthorisation", responseBack);
};

/**
@description createBalanceAlert function
@param responseBack Indicates which function to be called when a response is received.
*/
MobiliserClient.prototype.createBalanceAlert = function(responseBack, threshold, onlyTransition) {
    var pl_alert = new Object();
    pl_alert.paymentInstrumentId = session.accounts[0].pIId;
    pl_alert.threshold = threshold;
    pl_alert.active = "true";
    pl_alert.onlyTransition = onlyTransition;
    pl_alert.templateName = "sva balance alert";

    var pl = new Object();
    pl.origin = setting.origin;
    pl.traceNo = UUIDv4();
    pl.AuditData = setting.appinfo;
    pl.BalanceAlert = pl_alert;

    smartphoneService.post(pl, "createBalanceAlert", responseBack);
};

/**
@description getBalanceAlert function
@param responseBack Indicates which function to be called when a response is received.
*/
MobiliserClient.prototype.getBalanceAlert = function(responseBack) {
    var pl = new Object();
    pl.origin = setting.origin;
    pl.traceNo = UUIDv4();
    pl.AuditData = setting.appinfo;
    pl.paymentInstrumentId = session.accounts[0].pIId;
    pl.includeInactive = "false";

    smartphoneService.post(pl, "getBalanceAlertByPaymentInstrument", responseBack);
};

/**
@description updateBalanceAlert function
@param responseBack Indicates which function to be called when a response is received.
*/
MobiliserClient.prototype.updateBalanceAlert = function(responseBack, threshold, onlyTransition, alertid) {
    var pl_alert = new Object();
    pl_alert.id = session.svaalert[alertid].id;
    pl_alert.paymentInstrumentId = session.accounts[0].pIId;
    pl_alert.threshold = threshold;
    pl_alert.active = "true";
    pl_alert.onlyTransition = onlyTransition;
    pl_alert.templateName = "sva balance alert";

    var pl = new Object();
    pl.origin = setting.origin;
    pl.traceNo = UUIDv4();
    pl.AuditData = setting.appinfo;
    pl.BalanceAlert = pl_alert;

    smartphoneService.post(pl, "updateBalanceAlert", responseBack);
};

/**
@description deleteBalanceAlert function
@param responseBack Indicates which function to be called when a response is received.
*/
MobiliserClient.prototype.deleteBalanceAlert = function(responseBack, alertid) {
    var pl = new Object();
    pl.origin = setting.origin;
    pl.traceNo = UUIDv4();
    pl.AuditData = setting.appinfo;
    pl.balanceAlertId = session.svaalert[alertid].id;

    smartphoneService.post(pl, "deleteBalanceAlert", responseBack);
};

/**
 @description Top up function
 @param responseBack Indicates which function to be called when a response is received.
 @param invoiceId The id of an invoice
 @param payerPaymentInstrumentId The payment instrument id for the payer
 */
 MobiliserClient.prototype.topUp = function(responseBack, invoiceId) {
    var pl = new Object();
    pl.origin = setting.origin;
    pl.traceNo = UUIDv4();
    pl.AuditData = setting.appinfo;
    pl.invoiceId = invoiceId;

    smartphoneService.post(pl, "checkInvoice", responseBack);
};

/**
 @description Pay bill function
 @param responseBack Indicates which function to be called when a response is received.
 @param invoiceId The id of an invoice
 @param payerPaymentInstrumentId The payment instrument id for the payer
 */
 MobiliserClient.prototype.payBill = function(responseBack, invoiceId, payerPaymentInstrumentId) {
    var pl = new Object();
    pl.origin = setting.origin;
    pl.traceNo = UUIDv4();
    pl.AuditData = setting.appinfo;
    pl.invoiceId = invoiceId;
    pl.payerPaymentInstrumentId = payerPaymentInstrumentId;

    smartphoneService.post(pl, "checkInvoice", responseBack);
};
MobiliserClient.prototype.payBillLink = function(responseBack, linkId, payerPaymentInstrumentId) {
    var pl = new Object();
    pl.origin = setting.origin;
    pl.traceNo = UUIDv4();
    pl.AuditData = setting.appinfo;
    pl.invoiceId = 0;
    pl.UnstructuredData = [
        {
            Key:"LinkCode",
            Value:linkId
        }
    ];
    pl.payerPaymentInstrumentId = payerPaymentInstrumentId;

    smartphoneService.post(pl, "checkInvoice", responseBack);
};

/**
@description ContinuePayInvoice function
@param responseBack Indicates which function to be called when a response is received.
@param id The system id of checkPayInvoice transaction
@param ref The reference of checkPayInvoice transaction
*/
MobiliserClient.prototype.continuePayBill = function(responseBack, id, ref) {
    var pl_ref = new Object();
    pl_ref.systemId = id;
    pl_ref.value = ref;

    var pl = new Object();
    pl.origin = setting.origin;
    pl.traceNo = UUIDv4();
    pl.AuditData = setting.appinfo;
    pl.ReferenceTransaction = pl_ref;

    smartphoneService.post(pl, "continueInvoice", responseBack);
};

/**
@description Cancel bill function
@param responseBack Indicates which function to be called when a response is received.
@param invoiceId The id of an invoice
*/
MobiliserClient.prototype.cancelBill = function(responseBack, invoiceId) {
    var pl = new Object();
    pl.origin = setting.origin;
    pl.traceNo = UUIDv4();
    pl.AuditData = setting.appinfo;
    pl.invoiceId = invoiceId;
    pl.cancelByCustomer = "false";

    smartphoneService.post(pl, "cancelInvoice", responseBack);
};
/**
@description Cancel bill function
@param responseBack Indicates which function to be called when a response is received.
@param invoiceId The id of an invoice
*/
MobiliserClient.prototype.rejectBill = function(responseBack, invoiceId ) {
    var pl = new Object();
    pl.origin = setting.origin;
    pl.traceNo = UUIDv4();
    pl.AuditData = setting.appinfo;
    pl.invoiceId = invoiceId;
    pl.cancelByCustomer = "true";

    smartphoneService.post(pl, "cancelInvoice", responseBack);
};
MobiliserClient.prototype.rejectBillLink = function(responseBack, linkId ) {
    var pl = new Object();
    pl.origin = setting.origin;
    pl.traceNo = UUIDv4();
    pl.AuditData = setting.appinfo;
    pl.invoiceId = 0;
    pl.cancelByCustomer = "true";
    pl.UnstructuredData = [
        {
            Key:"LinkCode",
            Value:linkId
        }
    ];
    smartphoneService.post(pl, "cancelInvoice", responseBack);
};

MobiliserClient.prototype.captureCancel = function(responseBack, refTran, amount) {
    var pl = new Object();
    pl.origin = setting.origin;
    pl.traceNo = UUIDv4();
    pl.AuditData = setting.appinfo;   
    pl.Amount = amount;
    pl.ReferenceTransaction = refTran;
    smartphoneService.post(pl, "captureCancel", responseBack);
};

MobiliserClient.prototype.captureReject = function(responseBack, refTran, amount, ud) {
    var pl = new Object();
    pl.origin = setting.origin;
    pl.traceNo = UUIDv4();
    pl.AuditData = setting.appinfo;   
    pl.Amount = amount;
    pl.UnstructuredData = ud;
    pl.ReferenceTransaction = refTran;
    smartphoneService.post(pl, "captureCancel", responseBack);
};
//Coupon Feature

//Assign Coupon
/**
@description AssignCoupon function
@param responseBack Indicates which function to be called when a response is received.
@param couponTypeId The id of an coupon
*/
MobiliserClient.prototype.assignCoupon = function(responseBack, couponTypeId) {
    var pl = new Object();
    pl.origin = setting.origin;
    pl.traceNo = UUIDv4();
    pl.AuditData = setting.appinfo;
    pl.couponTypeId = couponTypeId;

    smartphoneService.post(pl, "assignCoupon", responseBack);
};

//Find Coupon Types By Tags
/**
@description FindCouponTypesByTags function
@param responseBack Indicates which function to be called when a response is received.
@param tag The tag of the coupon
@param locale The location of the coupon
@param mimeType The mimetype of the coupon
*/
MobiliserClient.prototype.findCouponTypesByTags = function(responseBack, tags) {
    var tagarray = tags.split(" ");
    var pl = new Object();
    pl.origin = setting.origin;
    pl.traceNo = UUIDv4();
    pl.AuditData = setting.appinfo;
    pl.tag = tagarray;
    pl.locale = locale;
    pl.mimeType = mimeType;
    if (geoLocation != null) {
        pl.location = new Object();
        pl.location.latitude = geoLocation.latitude;
        pl.location.longitude = geoLocation.longitude;
    }

    smartphoneService.post(pl, "findCouponTypesByTags", responseBack);
};

//Get Child Categories
/**
@description GetChildCategories function
@param responseBack Indicates which function to be called when a response is received.
@param parentCategoryId The parent id of the coupon
@param locale The location of the coupon
*/
MobiliserClient.prototype.getChildCategories = function(responseBack, parentCategoryId) {
    var pl = new Object();
    pl.origin = setting.origin;
    pl.traceNo = UUIDv4();
    pl.AuditData = setting.appinfo;
    pl.locale = locale;
    pl.parentCategoryId = parentCategoryId;

    smartphoneService.post(pl, "getChildCategories", responseBack);
};

//Get Coupon Types For Category
/**
@description getCouponTypesForCategory function
@param responseBack Indicates which function to be called when a response is received.
@param categoryId The category of the coupon
@param locale The location of the coupon
@param mimeType The mimetype of the coupon
*/
MobiliserClient.prototype.getCouponTypesForCategory = function(responseBack, categoryId) {
    var pl = new Object();
    pl.origin = setting.origin;
    pl.traceNo = UUIDv4();
    pl.AuditData = setting.appinfo;
    pl.categoryId = categoryId;
    pl.locale = locale;
    pl.mimeType = mimeType;
    if (geoLocation != null) {
        pl.location = new Object();
        pl.location.latitude = geoLocation.latitude;
        pl.location.longitude = geoLocation.longitude;
    }

    smartphoneService.post(pl, "getCouponTypesForCategory", responseBack);
};

//Get My Coupons
/**
@description GetMyCoupons function
@param responseBack Indicates which function to be called when a response is received.
@param locale The location of the coupon
@param mimeType The mimetype of the coupon
*/
MobiliserClient.prototype.getMyCoupons = function(responseBack) {
    var pl = new Object();
    pl.origin = setting.origin;
    pl.traceNo = UUIDv4();
    pl.AuditData = setting.appinfo;
    pl.locale = locale;
    pl.mimeType = mimeType;

    smartphoneService.post(pl, "getMyCoupons", responseBack);
};

//Get Root Categories
/**
@description GetRootCategories function
@param responseBack Indicates which function to be called when a response is received.
@param locale The location of the coupon
@param groupId The group id of the coupon
*/
MobiliserClient.prototype.getRootCategories = function(responseBack, groupId) {
    var pl = new Object();
    pl.origin = setting.origin;
    pl.traceNo = UUIDv4();
    pl.AuditData = setting.appinfo;
    pl.groupId = groupId;
    pl.locale = locale;

    smartphoneService.post(pl, "getRootCategories", responseBack);
};

/**
@description GetCategoryTree function
@param responseBack Indicates which function to be called when a response is received.
@param locale The location of the coupon
@param groupId The group id of the coupon
*/
MobiliserClient.prototype.getCategoryTree = function(responseBack, groupId) {
    var pl = new Object();
    pl.origin = setting.origin;
    pl.traceNo = UUIDv4();
    pl.AuditData = setting.appinfo;
    pl.groupId = groupId;
    pl.locale = locale;

    smartphoneService.post(pl, "getCategoryTree", responseBack);
};

/**
@description PurchaseCoupon function
@param responseBack Indicates which function to be called when a response is received.
@param paymentInstrumentId The instrument id of an coupon
*/
MobiliserClient.prototype.purchaseCoupon = function(responseBack, couponInstanceId, paymentInstrumentId) {
    var pl = new Object();
    pl.origin = setting.origin;
    pl.traceNo = UUIDv4();
    pl.AuditData = setting.appinfo;
    pl.couponInstanceId = couponInstanceId;
    pl.paymentInstrumentId = paymentInstrumentId;

    smartphoneService.post(pl, "purchaseCoupon", responseBack);
};

/**
@description DeleteCoupon function
@param responseBack Indicates which function to be called when a response is received.
@param couponId The id of an coupon
*/
MobiliserClient.prototype.deleteCoupon = function(responseBack, couponId) {
    var pl = new Object();
    pl.origin = setting.origin;
    pl.traceNo = UUIDv4();
    pl.AuditData = setting.appinfo;
    pl.couponInstanceId = couponId;

    smartphoneService.post(pl, "deleteCoupon", responseBack);
};

/**
@description get Existing Alerts function
@param responseBack Indicate which function to be called when a response is received.
*/
MobiliserClient.prototype.getExistingAlerts = function(responseBack) {
    var pl = new Object();
    pl.origin = setting.origin;
    pl.customerId = session.customer.id;
    pl.traceNo = UUIDv4();
    pl.AuditData = setting.appinfo;
    smartphoneService.post(pl, "findCustomerAlertByCustomer", responseBack);
};

/**
 * @description create a new alert for customer
 * @param responseBack Indicates which function to be called when a successful response is received.
 * @param alertTypeId Type of alert to be created
 * @param alertDataListItems alert data item objects list
 * @param contactPointsItems contact point objects list
 * @param frequencyVal Value of frequency Everytime or First time
 * @param alertNotificationMsgId text or conv
 */
 MobiliserClient.prototype.createNewAlert = function(responseBack, alertTypeId, alertDataListItems, contactPointsItems, frequencyVal, alertNotificationMsdId) {
    var alertDataListArray = [];
    for(var i = 0;i < alertDataListItems.length;i++) {
        var ad = new Object();
        ad.key = alertDataListItems[i].key;
        ad.value = alertDataListItems[i].value;
        alertDataListArray.push(ad);
    }

    var contactPointsArray = [];
    for(var i = 0;i < contactPointsItems.length;i++) {
        var oi = new Object();
        oi.id = contactPointsItems[i].id;
        oi.customerId = contactPointsItems[i].customerId;
        oi.type = contactPointsItems[i].type;
        oi.identification = contactPointsItems[i].identification;
        var cp = new Object();
        if(contactPointsItems[i] instanceof Identification) {
            cp.identification = oi;
        } else {
            oi.nickname = contactPointsItems[i].nickname;
            cp.otherIdentification = oi;
        }
        contactPointsArray.push(cp);
    }

    var pl = new Object();
    pl.origin = setting.origin;
    var customerAlert = new Object();
    customerAlert.customerId = session.customer.id;
    customerAlert.alertTypeId = alertTypeId;

    //Only add frequency if this alert type supports it else do not add this parameter
    if(frequencyVal.notifMax > -1) {
        customerAlert.notifMaxCnt = frequencyVal.notifMax;
        if(frequencyVal.notifMax != 0) {
            customerAlert.notifMaxRecur = frequencyVal.maxRecur;
        }
    }

    customerAlert.alertNotificationMsgId = alertNotificationMsdId;

    if(alertDataListItems != null && alertDataListItems.length > 0) {
        customerAlert.alertDataList = new Object();
        customerAlert.alertDataList.alertData = alertDataListArray;
    } else {
        delete customerAlert.alertDataList;
    }

    if(contactPointsArray != null && contactPointsArray.length > 0) {
        customerAlert.contactPointList = new Object();
        customerAlert.contactPointList.contactPoint = contactPointsArray;
    }

    pl.customerAlert = customerAlert;
    pl.traceNo = UUIDv4();
    pl.AuditData = setting.appinfo;

    smartphoneService.post(pl, "createCustomerAlert", responseBack);
};

/**
@description delete an existing alert
@param alert_id id of an alert which needs to be deleted
@param responseBack Indicate which function to be called when a response is received.
*/
MobiliserClient.prototype.deleteCustomerAlert = function(alertId, responseBack) {
    var pl = new Object();
    pl.origin = setting.origin;
    pl.customerAlertId = alertId;
    pl.traceNo = UUIDv4();
    pl.AuditData = setting.appinfo;

    smartphoneService.post(pl, "deleteCustomerAlert", responseBack);
};

/**
 * @description delete an alert if the account itself is deleted
 * @param responseBack function to be called in case of success
 * @param pIId payment instrument id of the existing alert data key record
 */
 MobiliserClient.prototype.deleteCustomerAlertByCustomerAndData = function(responseBack, pIId) {
    var pl = new Object();
    pl.origin = setting.origin;
    pl.traceNo = UUIDv4();
    pl.AuditData = setting.appinfo;
    pl.customerId = session.customer.id;
    pl.key = "customerPiId";
    pl.data = session.accountPiIdForDeletion;

    smartphoneService.post(pl, "deleteCustomerAlertByCustomerAndData", responseBack);
};

/**
 * @description get alert details for an existing alert
 * @param responseBack function to be called in case of success
 * @param alert_id id of the existing alert record
 */
 MobiliserClient.prototype.getAlertDetailsForEdit = function(responseBack, alertId) {
    var pl = new Object();
    pl.origin = setting.origin;
    pl.customerAlertId = alertId;
    pl.traceNo = UUIDv4();
    pl.AuditData = setting.appinfo;

    smartphoneService.post(pl, "getCustomerAlert", responseBack);
};

/**
 * @description Updates an existing alert
 * @param responseBack Response Handler
 * @param alertId Id of customer alert
 * @param alertTypeId alert type id
 * @param alertDataList alert data list
 */
 MobiliserClient.prototype.updateExistingAlert = function(responseBack, customerAlert) {
//    var alertData = customerAlert.alertDataList;
//    var alertDataListArray = [];
//    for(var i = 0;i < alertData.length;i++) {
//        var ad = new Object();
//        ad.id = alertData[i].id;
//        ad.customerAlertId = alertData[i].customerAlertId;
//        ad.key = alertData[i].key;
//        ad.value = alertData[i].value;
//        alertDataListArray.push(ad);
//    }
//
//    var contactPoint = customerAlert.contactPointList;
//    var contactPointsArray = [];
//    for(var i = 0;i < contactPoint.length;i++) {
//        var cp = new Object();
//        if(contactPoint[i].id) // It may be a new addition and hence may not have an id
//            cp.id = contactPoint[i].id;
//
//        if(contactPoint[i].customerAlertId) // It may be a new addition and hence may not have an id
//            cp.customerAlertId = contactPoint[i].customerAlertId;
//
//        var oi = new Object();
//        var tmpObj = contactPoint[i].otherIdentification
//        if(!tmpObj) {
//            tmpObj = contactPoint[i].identification;
//        }
//
//        oi.id = tmpObj.id;
//        oi.customerId = tmpObj.customerId;
//        oi.type = tmpObj.type;
//        oi.identification = tmpObj.identification;
//
//        if(contactPoint[i].otherIdentification) {
//            oi.nickname = contactPoint[i].otherIdentification.nickname;
//            cp.otherIdentification = oi
//        } else {
//            cp.identification = oi;
//        }
//
//        contactPointsArray.push(cp);
//    }

var pl = new Object();
pl.origin = setting.origin;
pl.traceNo = UUIDv4();
pl.AuditData = setting.appinfo;
pl.customerAlert = customerAlert;

    //Restructure Alert Data
    var alertData = pl.customerAlert.alertDataList;
    pl.customerAlert.alertDataList = new Object();
    if(alertData != null && alertData.length > 0) {
        pl.customerAlert.alertDataList.alertData = alertData;
    } else {
        delete pl.customerAlert.alertDataList;
    }

    //Restructure Contact Point
    var contactPoint = pl.customerAlert.contactPointList;
    pl.customerAlert.contactPointList = new Object();
    if(contactPoint != null && contactPoint.length > 0) {
        pl.customerAlert.contactPointList.contactPoint = contactPoint;
    } else {
        delete pl.customerAlert.contactPointList.contactPoint;
    }

    smartphoneService.post(pl, "updateCustomerAlert", responseBack);
};

/**
 * @description Service call to fetch the alert notification msg type id based of alert type id and notification msg id
 * @param alertTypeId alert type
 * @param notification type
 */
 MobiliserClient.prototype.getAlertNotificationMsgId = function(responseBack, alertTypeId, notificationMsgTypeId) {
    var pl = new Object();
    pl.origin = setting.origin;
    pl.traceNo = UUIDv4();
    pl.AuditData = setting.appinfo;
    pl.alertTypeId = alertTypeId;
    pl.notificationMsgTypeId = notificationMsgTypeId;
    smartphoneService.post(pl, "getActiveAlertNotifMsgByAlertTypeAndNotifMsgType", responseBack);
};


/**
 * @description Service call to fetch the active alert notification message mapping, to be used in
 * creating and updating alerts
 * @param responseBack callback handler when the results returned.
 */
 MobiliserClient.prototype.getActiveAlertNotificationMessages = function(responseBack) {
    var pl = new Object();
    pl.origin = setting.origin;
    pl.traceNo = UUIDv4();
    pl.AuditData = setting.appinfo;

    smartphoneService.post(pl, "getActiveAlertNotificationMessages", responseBack);
};

/**
 * @description Function to fetch list of supported look up items like currencies
 * networkproviders etc
 * @param responseBack the callback handler
 * @param entity to be looked up on the server
 */
 MobiliserClient.prototype.getLookups = function(responseBack, entity) {
    var pl = new Object();
    pl.origin = setting.origin;
    pl.traceNo = UUIDv4();
    pl.AuditData = setting.appinfo;
    pl.entityName = entity;

    smartphoneService.post(pl, "getLookups", responseBack);
};


/**
 * @description get Customer's other identifications
 * @param responseBack Indicate which function to be called when a response is received.
 */
 MobiliserClient.prototype.getOtherIdentifications = function(responseBack) {
    var pl = new Object();
    pl.origin = setting.origin;
    pl.customerId = session.customer.id;
    pl.traceNo = UUIDv4();
    pl.AuditData = setting.appinfo;

    smartphoneService.post(pl, "getCustomerOtherIdentificationByCustomer", responseBack);
};

/**
 * @description get picture upload URL
 * @param responseBack Indicate which function to be called when a response is received.
 */
 MobiliserClient.prototype.getUploadPictureURL = function(responseBack) {
    var pl = {};
    pl.origin = setting.origin;
    pl.traceNo = UUIDv4();
    pl.AuditData = setting.appinfo;

    smartphoneService.post(pl, "uploadPicture", responseBack);
};

/**
 * @description upload picture
 * @param responseBack Indicate which function to be called when a response is received.
 */
 MobiliserClient.prototype.uploadImage = function(uploadUrl, data, responseBack) {
    smartphoneService.postData(data, uploadUrl, responseBack);
};

/**
 * @description get picture download URL
 * @param responseBack Indicate which function to be called when a response is received.
 */
 MobiliserClient.prototype.getDownloadPictureURL = function(responseBack) {
    var pl = {};
    pl.origin = setting.origin;
    pl.traceNo = UUIDv4();
    pl.AuditData = setting.appinfo;

    smartphoneService.post(pl, "getMyPictures", responseBack);
};

/**
 * @description find next address with location
 * @param responseBack Indicate which function to be called when a response is received.
 * @param lat The latitude of current geolocation.
 * @param lng The longitude of current geolocation.
 */
 MobiliserClient.prototype.findNextAddresses = function(responseBack, lat, lng) {
    var pl_loc = {};
    pl_loc.latitude = lat;
    pl_loc.longitude = lng;
    pl_loc.radius = "300000";

    var pl = {};
    pl.origin = setting.origin;
    pl.traceNo = UUIDv4();
    pl.AuditData = setting.appinfo;
    pl.location = pl_loc;

    smartphoneService.post(pl, "findNextAddresses", responseBack);
};

/**
 * @description get default Terms and Conditions information
 * @param responseBack Indicate which function to be called when a response is received.
 */
 MobiliserClient.prototype.getDefaultTermAndConditions = function(responseBack, customerTypeId) {
    var pl = {};
    pl.origin = setting.origin;
    pl.traceNo = UUIDv4();
    pl.AuditData = setting.appinfo;
    pl.customerTypeId = customerTypeId;
    pl.orgunitId = "0000";

    smartphoneService.post(pl, "getDefaultTermAndConditions", responseBack);
};

/**
 * @description get Terms and Conditions information by service package
 * @param responseBack Indicate which function to be called when a response is received.
 */
 MobiliserClient.prototype.getTermAndConditions = function(responseBack, customerTypeId) {
    var pl = {};
    pl.origin = setting.origin;
    pl.traceNo = UUIDv4();
    pl.AuditData = setting.appinfo;
    //pl.customerTypeId = customerTypeId;
    
    smartphoneService.post(pl, "getTcbTermAndCondition", responseBack);
};

/**
 * @description get open Terms and Conditions information
 * @param responseBack Indicate which function to be called when a response is received.
 */
 MobiliserClient.prototype.getOpenTermAndConditions = function(responseBack) {
    var pl = {};
    pl.origin = setting.origin;
    pl.traceNo = UUIDv4();
    pl.AuditData = setting.appinfo;
    pl.customerId = session.customer.id;

    smartphoneService.post(pl, "getOpenTermAndConditions", responseBack);
};

/**
 * @description accept Terms and Conditions information
 * @param responseBack Indicate which function to be called when a response is received.
 */
 MobiliserClient.prototype.acceptTermAndConditions = function(responseBack, tncs) {
    var pl = {};
    pl.origin = setting.origin;
    pl.traceNo = UUIDv4();
    pl.AuditData = setting.appinfo;
    pl.tncVersionId = tncs;

    smartphoneService.post(pl, "acceptTermAndConditions", responseBack);
};

/**
@description FindNextCouponTypesByTags function
@param responseBack Indicates which function to be called when a response is received.
@param tag The tag of the coupon
@param locale The location of the coupon
@param mimeType The mimetype of the coupon
*/
MobiliserClient.prototype.findNextCouponTypesByTags = function(responseBack, tags) {
    var tagarray = tags.split(" ");
    var pl = new Object();
    pl.origin = setting.origin;
    pl.traceNo = UUIDv4();
    pl.AuditData = setting.appinfo;
    pl.tag = tagarray;
    pl.locale = locale;
    pl.mimeType = mimeType;
    pl.location = new Object();
    pl.location.latitude = geoLocation.latitude;
    pl.location.longitude = geoLocation.longitude;
    pl.location.radius = "3000";

    smartphoneService.post(pl, "findNextCouponTypes", responseBack);
};

/**
@description findNextCouponTypesForCategory function
@param responseBack Indicates which function to be called when a response is received.
@param categoryId The category of the coupon
@param locale The location of the coupon
@param mimeType The mimetype of the coupon
*/
MobiliserClient.prototype.findNextCouponTypesForCategory = function(responseBack, categoryId) {
    var pl = new Object();
    pl.origin = setting.origin;
    pl.traceNo = UUIDv4();
    pl.AuditData = setting.appinfo;
    pl.categoryId = categoryId;
    pl.locale = locale;
    pl.mimeType = mimeType;
    pl.location = new Object();
    pl.location.latitude = geoLocation.latitude;
    pl.location.longitude = geoLocation.longitude;
    pl.location.radius = "3000";

    smartphoneService.post(pl, "findNextCouponTypes", responseBack);
};

/*
 * Methods for Citad
 */

MobiliserClient.prototype.getBanks = function(responseBack) {
  var pl = new Object();
  pl.origin = setting.origin;
  pl.traceNo = UUIDv4();
  pl.AuditData = setting.appinfo;
  smartphoneService.post(pl,"getCitadBanks",responseBack);
}

MobiliserClient.prototype.getProvincesByBank = function(bankId,responseBack) {
  var pl = new Object();
  pl.origin = setting.origin;
  pl.traceNo = UUIDv4();
  pl.AuditData = setting.appinfo;
  pl.bankId = bankId;
  smartphoneService.post(pl,"getProvincesByBank",responseBack);
}

MobiliserClient.prototype.getAllProvinces = function(responseBack) {
    var pl = new Object();
    pl.origin = setting.origin;
    pl.traceNo = UUIDv4();
    pl.AuditData = setting.appinfo;
    smartphoneService.post(pl,"getAllProvinces",responseBack);
}

MobiliserClient.prototype.getBranches = function(bankId,provinceId,responseBack) {
  var pl = new Object();
  pl.origin = setting.origin;
  pl.traceNo = UUIDv4();
  pl.AuditData = setting.appinfo;
  pl.bankId = bankId;
  pl.provinceId = provinceId;
  smartphoneService.post(pl,"getBranches",responseBack);
}

MobiliserClient.prototype.preAuthorize = function(responseBack, txn, autocap) {
  var amount = {};
  amount.currency = "VND";
  amount.vat = "0";
  amount.value = txn.amount;

  var pl = {};
  pl.origin = setting.origin;
  pl.traceNo = UUIDv4();
  pl.AuditData = setting.appinfo;
  pl.autoCapture = autocap;
  pl.orderChannel = "0";
  pl.usecase = txn.usecase;
  pl.Payer = txn.payer;
  pl.Payee = txn.payee;
  pl.Amount = amount;
  pl.Text = txn.message;
  pl.attribute = txn.attribute;


  smartphoneService.post(pl, "preAuthorisation", responseBack);
};

MobiliserClient.prototype.queryMobileBill = function(responseBack,phoneNumber) {
  var pl = {};
  pl.origin = setting.origin;
  pl.traceNo = UUIDv4();
  pl.AuditData = setting.appinfo;
  pl.mobileNo = phoneNumber;
  
  smartphoneService.post(pl, "getMobileBill", responseBack);
}

MobiliserClient.prototype.getUpLoadIdentifierScanUrl = function(responseBack) {
    var pl = {};
    pl.origin = setting.origin;
    pl.traceNo = UUIDv4();
    pl.AuditData = setting.appinfo;

    smartphoneService.post(pl, "getUploadPictureUrl", responseBack);
}
//service for topup vtc game function
MobiliserClient.prototype.getPaymentsByGroup = function(responseBack, group) {
    var pl = {};
    pl.origin = setting.origin;
    pl.traceNo = UUIDv4();
    pl.AuditData = setting.appinfo;
    pl.group = group;

    smartphoneService.post(pl, "getPaymentsByGroup", responseBack);
}

MobiliserClient.prototype.getAmountList = function(responseBack, paymentTypeId) {
    var pl = {};
    pl.origin = setting.origin;
    pl.traceNo = UUIDv4();
    pl.AuditData = setting.appinfo;
    pl.paymentTypeId = paymentTypeId;

    smartphoneService.post(pl, "getAmountList", responseBack);
}

MobiliserClient.prototype.getCustomerOrders = function(responseBack, paymentTypeId, customerId) {
    var pl = {};
    pl.origin = setting.origin;
    pl.traceNo = UUIDv4();
    pl.AuditData = setting.appinfo;
    pl.paymentTypeId = paymentTypeId;
    pl.customerId = customerId;

    smartphoneService.post(pl, "getCustomerOrders", responseBack);
}

MobiliserClient.prototype.getTcbBill = function(responseBack, paymentTypeId, order) {
    var pl = {};
    pl.origin = setting.origin;
    pl.traceNo = UUIDv4();
    pl.AuditData = setting.appinfo;
    pl.paymentTypeId = paymentTypeId;
    pl.order = order;

    smartphoneService.post(pl, "getTcbBills", responseBack);
}


//credit card payment service

MobiliserClient.prototype.getTcbCreditCards = function(responseBack, customerId) {
    var pl = {};
    pl.origin = setting.origin;
    pl.traceNo = UUIDv4();
    pl.AuditData = setting.appinfo;
    pl.customerId = customerId;

    smartphoneService.post(pl, "getTcbCreditCards", responseBack);
}

MobiliserClient.prototype.getCreditCardBalance = function(responseBack, cardAccountNumber) {
    var pl = {};
    pl.origin = setting.origin;
    pl.traceNo = UUIDv4();
    pl.AuditData = setting.appinfo;
    pl.cardAccountNumber = cardAccountNumber;

    smartphoneService.post(pl, "getCreditCardBalance", responseBack);
}


MobiliserClient.prototype.getCardStatementCycles = function(responseBack, cardAccountNumber) {
    var pl = {};
    pl.origin = setting.origin;
    pl.traceNo = UUIDv4();
    pl.AuditData = setting.appinfo;
    pl.cardAccountNumber = cardAccountNumber;

    smartphoneService.post(pl, "getCreditCardStatementCycles", responseBack);
}

MobiliserClient.prototype.getCardStatementByCycle = function(responseBack, cardAccountNumber, cycleId) {
    var pl = {};
    pl.origin = setting.origin;
    pl.traceNo = UUIDv4();
    pl.AuditData = setting.appinfo;
    pl.cardAccountNumber = cardAccountNumber;
    pl.cycleId = cycleId;

    smartphoneService.post(pl, "getCreditCardStatementByCycle", responseBack);
}

MobiliserClient.prototype.getCardStatementByDate = function(responseBack, cardAccountNumber, fromDate, toDate) {
    var pl = {};
    pl.origin = setting.origin;
    pl.traceNo = UUIDv4();
    pl.AuditData = setting.appinfo;
    pl.cardAccountNumber = cardAccountNumber;
    pl.fromDate = fromDate;
    pl.toDate = toDate;

    smartphoneService.post(pl, "getCreditCardStatementByDate", responseBack);
}

MobiliserClient.prototype.savePushNotificationAccount = function(responseBack, accountPush) {
    var pl = {};
    pl.origin = setting.origin;
    pl.traceNo = UUIDv4();
    pl.AuditData = setting.appinfo;
    pl.accountPush = accountPush;

    //adding token to verify push notification
    pl.UnstructuredData = [];
    if (isiOsDevice && setting.token != undefined) {
        console.log("ios device logged in -- token == ", setting.token);
        pl.UnstructuredData[0] = {Key:"DeviceToken",Value:setting.token};
    } else if (isAndroid && setting.regId != undefined) {
        console.log("android device logged in -- regId == ", setting.regId);
        pl.UnstructuredData[0] = {Key:"DeviceToken",Value:setting.regId};
    } else {
        console.log("not a mobile device");
        pl.UnstructuredData[0] = {Key:"DeviceToken",Value:null};
    }

    smartphoneService.post(pl, "saveNotificationAccount", responseBack);
}

MobiliserClient.prototype.getPushStatusOfAccounts = function(responseBack, accountList) {
    var pl = {};
    pl.origin = setting.origin;
    pl.traceNo = UUIDv4();
    pl.AuditData = setting.appinfo;
    pl.accountList = accountList;

    smartphoneService.post(pl, "getPushStatusOfAcct", responseBack);
}

MobiliserClient.prototype.updateDeviceToPushNotification = function(responseBack) {
    var pl = {};
    pl.origin = setting.origin;
    pl.traceNo = UUIDv4();
    pl.AuditData = setting.appinfo;

    //adding token to verify push notification
    pl.UnstructuredData = [];
    if (isiOsDevice && setting.token != undefined) {
        console.log("ios device logged in -- token == ", setting.token);
        pl.UnstructuredData[0] = {Key:"DeviceToken",Value:setting.token};
    } else if (isAndroid && setting.regId != undefined) {
        console.log("android device logged in -- regId == ", setting.regId);
        pl.UnstructuredData[0] = {Key:"DeviceToken",Value:setting.regId};
    } else {
        console.log("not a mobile device");
        pl.UnstructuredData[0] = {Key:"DeviceToken",Value:null};
    }

    smartphoneService.post(pl, "confirmChangeDevice", responseBack);
}

MobiliserClient.prototype.getSavingAccount = function(responseBack) {
    var pl = {};
    pl.origin = setting.origin;
    pl.traceNo = UUIDv4();
    pl.AuditData = setting.appinfo;
    smartphoneService.post(pl, "getSavingAccount", responseBack);
}

MobiliserClient.prototype.getLoanAccount = function(responseBack) {
    var pl = {};
    pl.origin = setting.origin;
    pl.traceNo = UUIDv4();
    pl.AuditData = setting.appinfo;
    smartphoneService.post(pl, "getLoanAccount", responseBack);
}

MobiliserClient.prototype.getBankList247 = function(responseBack) {
    var pl = {};
    pl.origin = setting.origin;
    pl.traceNo = UUIDv4();
    pl.AuditData = setting.appinfo;
    smartphoneService.post(pl, "getBankList247", responseBack);
}

MobiliserClient.prototype.cardInquiry247 = function(responseBack, CardNumber) {
    var pl = {};
    pl.origin = setting.origin;
    pl.traceNo = UUIDv4();
    pl.AuditData = setting.appinfo;
    pl.CardNumber = CardNumber;
    smartphoneService.post(pl, "cardInquiry247", responseBack);
}

MobiliserClient.prototype.acctInquiry247 = function(responseBack, AccountNumber, BankID) {
    var pl = {};
    pl.origin = setting.origin;
    pl.traceNo = UUIDv4();
    pl.AuditData = setting.appinfo;
    pl.AccountNumber = AccountNumber;
    pl.BankID = BankID;
    smartphoneService.post(pl, "acctInquiry247", responseBack);
}