
/**
 *  @overview
 * A set of data objects utilized by the Mobiliser Smartphone application.
 *
 * @name SY_Data_Objects.js
 * @author SAP AG
 * @version 1.0
 *
 */


// TODO: check document against implementation (see parameters)

/**
  @class Contains basic information about the customer.

  @constructor

  @param customerId
  @param {string} msisdn The msisdn of the customer
  @param blacklist An id for blacklistreason to indicate customer account status.
  @param test test state of customer account.
  @param typeId The id of customerType
  @param cancelId The id of cancellationReason of customer account
  @param modeId The id of mode of txn receipt mode of customer account
 */
function Customer() {
    this.customerId = '';
    this.orgUnitId = '';
    this.blacklist = '';
    this.active = '';
    this.test = '';
    this.displayName = '';
    this.riskCategoryId = '';
    this.typeId = '';
    this.cancelId = '';
    this.modeId = '';
}

/**
  @class TxnData

  @constructor

  @param  usecase The usecase id for a transaction
  @param  amount The amount of a transaction
  @param  orderId The orderId for a transaction. Holds specific information for certain usecases and txns.
  @param  text Any text which reminds the user of the transaction.
 */
function TxnData(usecase, amount, orderId, text) {
    this.usecase = usecase;
    this.amount = amount;
    this.orderId = orderId;
    this.text = text;
}

/**
  @class LoginSession This is the session class which stores all of the user's data throughtout a login session.

  @constructor
  @param sessionId The session id as returned by the server
  @param customerId The id of the customer
  @param displayName The display name of the customer
  @param msisdn The phone number of the customer
  @param transaction Is an array of tranasctions
  @param contacts Is an array of contacts from the address book of the user's smartphone
  @param billTypes Is an array of avaiable invoic types
  @param registeredbill A list of all registered bills for the user
  @param openbill The information of an open bill
  @param openBillArray A list of all open and due bills for the user
  @param openRequestArray A list of all open and due demand for payment for the user
  @param accounts A list of money accounts registered by the user
  @param offlinesvas A list of offline SVA accounts registered by the user
  @param totalaccounts total number of money accounts registered by the user
  @param customer particular information of the user
  @param svaalert A list of balance alerts registered for SVA of the user
  @param coupons A list of coupons available for the user
  @param couponTypes A list of coupon types in system
  @param categories A list of coupon categories in one level of category tree
  @param category_grandparent the category node in up two level of current node
  @param identification A list of identification registered by the user
  @param customerAlert particular information of an alert for a user
  @param alertNotificationMessages A list of alert Notification message 
  @param otherIdentifications A list of additional identification registerd by the user
  @param transit_value A variable to hold the temporary data between pages in navigation
  @param image A handler to hold the image 
  @param uploadUrl The url address in system for uploading a image
  @param downloads A list of handlers of images to download from system
  @param locations A list of locations in system
  @param defaultTermAndConditions A list of default term & conditions in registration
  @param openTermAndConditions A list of open term & conditions after user login
  @param gcmregid The GCM registration ID of this application
 */
function LoginSession() {
    this.sessionId = '';
    this.sessionTimeoutWindow = MAX_SESSION_TIME;
    this.msisdn = '';
    this.transaction = [];
    this.contacts = [];
    this.billTypes = [];
    this.registeredbill = [];
    this.openbill = '';
    this.openBillArray = [];
    this.openRequestArray = [];
    this.accounts = [];
	this.offlinesvas = [];
    this.totalaccounts = '';
    this.customer = '';
    this.svaalert = [];
    this.coupons = [];
    this.couponTypes = [];
    this.categories = [];
    this.category_grandparent = '';
    this.identification = '';
    this.customerAlert = new CustomerAlert();
    this.alertNotificationMessages = [];
    this.otherIdentifications = [];
    this.transit_value = '';
    this.image = '';
    this.uploadUrl = '';
    this.downloads = [];
    this.locations = '';
    this.defaultTermAndConditions = '';
    this.openTermAndConditions = '';
    this.gcmregid = '';
    this.pibalance = '';
}

/**
@class Account A class that stores information pertaining to certain account.

@constructor
@param pIId The paymentInstrument id of an account
@param type The type of an account
@param no The number related to an account, such as card no. account no.
@param info The extra information of an account, alias name of bank account and credit card. balance of SVA
@param acctHolderName The name of bank account/credit card Holder
@param acctNumber Bank account number/credit card number
@param displayNumber The number to be displayed for bank account/credit card.
@param extra1 The code of bank or The type of the credit card, master, visa or etc.
@param extra2 The code of branch that bank account is opened or The security code of the credit card
@param extra3 The name of bank or The year of the expiry date for the card
@param extra4 The country of the bank or The month of the expiry date for the card
*/
function Accounts() {
    this.walletId = '';
    this.creditPriority = '';
    this.debitPriority = '';
    this.pIId = '';
    this.pIClass = '';
    this.type = '';
    this.no = '';
    this.info = '';
    this.acctHolderName = '';
    this.acctNumber = '';
    this.displayNumber = '';
    this.extra1 = '';          //bankCode/cardType
    this.extra2 = '';          //branchCode/securityNumber
    this.extra3 = '';          //bankName/yearExpiry
    this.extra4 = '';          //bankCountry/monthExpiry
}

/**
  @class Transaction A class that stores information pertaining to certain transcation.

  @constructor
  @param transactionId The id of a transaction
  @param transactionDate The date of the transaction
  @param amount The amount of the transaction
  @param usecase The usecase of transaction
 */
function Transaction() {
    this.transactionId = '';
    this.transactionDate = '';
    this.amount = '';
    this.usecase = '';
}

/**
  @class BillTypes is a class that stores information about any invoice that the user has registered for.

  @constructor
  @param billTypeId The type id for the invoice.
  @param billTypeName The name of the invoice/bill registered for.
 */
function BillTypes() {
    this.billTypeId = '';
    this.billTypeName = '';
    this.billTypeGroupId= '';
}

/**
  @class OpenBill A class represnting an open invoice which the user has to pay for a certain merchant.

  @constructor
  @param billId The id of this invoice/bill
  @param billTypeName The name of the bill type for this invoice
  @param dueDate The due date of this bill
  @param amount The amount due for this bill
 */
function OpenBill() {
    this.billId = '';
    this.billTypeName = '';
    this.dueDate = '';
    this.amount = '';
    this.reference = '';
    this.billreference = '';
}

/**
  @class Registeredbill is a class that stores information about any invoice that the user has registered for.

  @constructor
  @param billConfigId The id of the bill configuration
  @param alias The alias name given by the user for this configuration.
  @param billTypeId The type id for the invoice.
  @param billTypeName The name of the invoice/bill registered for.
 */
function Registeredbill() {
    this.billConfigId = '';
    this.alias = '';
    this.billTypeId = '';
    this.reference = '';
    this.billTypeName = '';
    this.billTypeGroupId = '';
}

/**
@class BalanceAlert is a class that stores information about a Balance Alert.

@constructor
@param billConfigId The id of the bill configuration
@param alias The alias name given by the user for this configuration.
@param billTypeId The type id for the invoice.
@param billTypeName The name of the invoice/bill registered for.
*/
function BalanceAlert() {
    this.id = '';
    this.paymentInstrumentId = '';
    this.threshold = '';
    this.active = '';
    this.onlyTransition = '';
    this.templateName = '';
}

/**
@class Contains basic information about a coupon.

@constructor

@param id
@param customerId
@param couponType the type of coupon.
@param status the coupon's statu.s
@param serialNumber The serial number of the coupon
@param validTo valid date of the coupon
@param code The code of coupon
@param views view times of the coupon
@param uses usage times of the coupon
*/
function Coupon() {
  this.id = '';
  this.customerId = '';
  this.couponType = new CouponType();
  this.status = '';
  this.serialNumber = '';
  this.validTo = '';
  this.code = '';
  this.views = '';
  this.uses = '';
}

/**
@class Contains basic information about a coupon type.

@constructor

@param id
@param name
@param purchasePrice
@param purchaseCurrency
@param maxViews
@param maxUses
@param isRestorableByUser
@param description Coupon type description.
*/
function CouponType() {
  this.id = '';
  this.name = '';
  this.purchasePrice = '';
  this.purchaseCurrency = '';
  this.maxViews = '';
  this.maxUses = '';
  this.isRestorableByUser = '';
  this.description = new CouponTypeDescription();
}

/**
@class Contains basic information about a coupon type description.

@constructor

@param mimeType
@param caption
@param content
@param thumbnailUrl
@param imageUrl
*/
function CouponTypeDescription() {
  this.mimeType = '';
  this.caption = '';
  this.content = '';
  this.thumbnailUrl = '';
  this.imageUrl = '';
}

/**
@class Contains basic information about a coupon category.

@constructor

@param id
@param internalName
@param caption
@param priority
@param noOfChildCategories
@param parent
*/
function Category() {
  this.id = '';
  this.internalName = '';
  this.caption = '';
  this.priority = '';
  this.noOfChildCategories = '';
  this.parent = '';
  this.valid = '';
}

/**
@class Contains basic information about geoLocation.

@constructor

@param id
@param internalName
*/
function GeoLocation() {
  this.latitude = '';
  this.longitude = '';
}

/**
  @class Timer

  @constructor
 */
function Timer() {
    this.handle = '';
    this.on_flag = 0;
}

/**
  @class Setting is a connection configurations class to connect to the back-end server.
  @constructor
    @param protocol String representing the protocol type. Either "http://" or "https://".
        @param ipaddress The IP address of the money mobiliser server
    @param port The port number of the money mobiliser server
    @param wsname The name of the WS_Core web service;
    */
    function Setting() {
    this.protocol = PROTOCOL;
    this.ipaddress = IP_ADDRESS;
    this.port = PORT;
    this.wsname = 'mobiliser/rest/smartphone';
    this.origin = "MAPP";
    this.appinfo = {};
    this.appinfo.device = '';
    this.appinfo.deviceId = '';
    this.appinfo.otherDeviceId = '';
    this.appinfo.application = "MAPP";  // TODO: change app name and add version number (svn revision ? build number ?)
                                        // Currently, appid used for AuditData expects "MAPP", otherwise user cannot login.
    this.appinfo.applicationVersion = APP_VERSION;
}

/*Alert specific classes*/
/**
 * @class CustomerAlert which contains alert data set for each alert
 * @param customerId to which this alert belongs
 * @param alertTypeId to which this alert belongs
 * @param alertNotificationMsgId to which notification type this alert is tied to
 * @param alertDataList array of AlertData objects
 * @param contactPointList array of ContactPoint objects
 * @param blackoutList array of Blackout objects
 * @param created
 */
function CustomerAlert() {
    this.id = '';
    this.customerId = '';
    this.alertTypeId = '';
    this.active = '';
    this.alertNotificationMsgId = '';
    this.notifMaxCnt = ''; //For frequency - 0 for Every time, 1 for First time
    this.notifMaxRecur = ''; //For frequency - D for Day, W for Week, F - Fortnight, M - Month, Q - Quarter, Y - Year
    this.alertDataList = [];
    this.contactPointList = [];
    this.blackoutList = [];
    this.created = '';
}


/**
 * @class OtherIdentifications this contains other identifications for a
 *        customer
 * @param customerId to which this Other Identification belongs
 * @param type of identification fax, email, phone etc
 */
function OtherIdentification() {
    this.id = '';
    this.customerId = '';
    this.type = '';
    this.identification = '';
    this.identificationType = '';
    this.nickname = '';
    this.provider = '';
    this.status = '';
    this.active = '';
}

/**
 * @class ContactPoint holds many to many mapping record between Customer Alert and Other Identification
 */
function ContactPoint() {
    this.id = '';
    this.customerAlertId = '';
    this.identification = new Identification();
    this.otherIdentification = new OtherIdentification();
}

/**
 * @class AlertData this contains key value pair of alert data
 */
function AlertData() {
    this.id = '';
    this.customerAlertId = '';
    this.key = '';
    this.value = '';
}

/**
 * @description Identification of customer
 * @param id of the Identification record
 * @param customerId to whom this identification belongs
 * @param type of identification
 * @param identification actual value
 */
function Identification() {
    this.id = '';
    this.customerId = '';
    this.type = '';
    this.identification = '';
}

/**
 * @description Alert notification message mapping class
 * @param id of the mapping record
 * @param alertTypeId id of alert type
 * @param notificationMsgTypeId if of notification msg type
 */
function AlertNotificationMessage() {
    this.id = '';
    this.alertTypeId = '';
    this.notificationMsgTypeId = '';
}