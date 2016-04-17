var minifier = require('E:/mini/node_modules/minifier/src/minify.js')
var input =[ 'F:/VPBank/view/AccountDetails.controller.js',
'F:/VPBank/view/AccountDetails.view.js',
'F:/VPBank/view/AccountDetailsOnHome.controller.js',
'F:/VPBank/view/AccountDetailsOnHome.view.js',
'F:/VPBank/view/Accounts.controller.js',
'F:/VPBank/view/Accounts.view.js',
'F:/VPBank/view/AddPayeeConfirmPayBill.controller.js',
'F:/VPBank/view/AddPayeeConfirmPayBill.view.js',
'F:/VPBank/view/AddPayeePayBill.controller.js',
'F:/VPBank/view/AddPayeePayBill.view.js',
'F:/VPBank/view/AddPayeeVerifyPayBill.controller.js',
'F:/VPBank/view/AddPayeeVerifyPayBill.view.js',
'F:/VPBank/view/AlertsList.controller.js',
'F:/VPBank/view/AlertsList.view.js',
'F:/VPBank/view/AlertsListDetails.controller.js',
'F:/VPBank/view/AlertsListDetails.view.js',
'F:/VPBank/view/App.controller.js',
'F:/VPBank/view/App.view.js',
'F:/VPBank/view/BankTerms.controller.js',
'F:/VPBank/view/BankTerms.view.js',
'F:/VPBank/view/Beneficiary.controller.js',
'F:/VPBank/view/Beneficiary.view.js',
'F:/VPBank/view/BeneficiaryConfirm.controller.js',
'F:/VPBank/view/BeneficiaryConfirm.view.js',
'F:/VPBank/view/BeneficiaryVerify.controller.js',
'F:/VPBank/view/BeneficiaryVerify.view.js',
'F:/VPBank/view/Calculator.controller.js',
'F:/VPBank/view/Calculator.view.js',
'F:/VPBank/view/CarrierTerms.controller.js',
'F:/VPBank/view/CarrierTerms.view.js',
'F:/VPBank/view/Chat.controller.js',
'F:/VPBank/view/Chat.view.js',
'F:/VPBank/view/ConnectionSetting.js',
'F:/VPBank/view/Feedback.controller.js',
'F:/VPBank/view/Feedback.view.js',
'F:/VPBank/view/Home.controller.js',
'F:/VPBank/view/Home.view.js',
'F:/VPBank/view/Location.controller.js',
'F:/VPBank/view/Location.view.js',
'F:/VPBank/view/Login.controller.js',
'F:/VPBank/view/Login.view.js',
'F:/VPBank/view/MessagesList.controller.js',
'F:/VPBank/view/MessagesList.view.js',
'F:/VPBank/view/MessagesListDetails.controller.js',
'F:/VPBank/view/MessagesListDetails.view.js',
'F:/VPBank/view/MFAController.js',
'F:/VPBank/view/PayBill.controller.js',
'F:/VPBank/view/PayBill.view.js',
'F:/VPBank/view/PayBillSelect.controller.js',
'F:/VPBank/view/PayBillSelect.view.js',
'F:/VPBank/view/PaymentConfirm.controller.js',
'F:/VPBank/view/PaymentConfirm.view.js',
'F:/VPBank/view/PaymentsList.controller.js',
'F:/VPBank/view/PaymentsList.view.js',
'F:/VPBank/view/PaymentsListDetails.controller.js',
'F:/VPBank/view/PaymentsListDetails.view.js',
'F:/VPBank/view/PaymentVerify.controller.js',
'F:/VPBank/view/PaymentVerify.view.js',
'F:/VPBank/view/Preferences.controller.js',
'F:/VPBank/view/Preferences.view.js',
'F:/VPBank/view/ProductItems.controller.js',
'F:/VPBank/view/ProductItems.view.js',
'F:/VPBank/view/ProductItemsDetail.controller.js',
'F:/VPBank/view/ProductItemsDetail.view.js',
'F:/VPBank/view/Products.controller.js',
'F:/VPBank/view/Products.view.js',
'F:/VPBank/view/RemoteDeposit.controller.js',
'F:/VPBank/view/RemoteDeposit.view.js',
'F:/VPBank/view/RemoteDepositComplete.controller.js',
'F:/VPBank/view/RemoteDepositComplete.view.js',
'F:/VPBank/view/RequestCallback.controller.js',
'F:/VPBank/view/RequestCallback.view.js',
'F:/VPBank/view/Signin.controller.js',
'F:/VPBank/view/Signin.view.js',
'F:/VPBank/view/StopPaymentDetails.controller.js',
'F:/VPBank/view/StopPaymentDetails.view.js',
'F:/VPBank/view/StopPaymentList.controller.js',
'F:/VPBank/view/StopPaymentList.view.js',
'F:/VPBank/view/StopPaymentNew_Edit.controller.js',
'F:/VPBank/view/StopPaymentNew_Edit.view.js',
'F:/VPBank/view/StopPayment_Confirm.controller.js',
'F:/VPBank/view/StopPayment_Confirm.view.js',
'F:/VPBank/view/StopPayment_Verify.controller.js',
'F:/VPBank/view/StopPayment_Verify.view.js',
'F:/VPBank/view/Support.controller.js',
'F:/VPBank/view/Support.view.js',
'F:/VPBank/view/TransactionDetail.controller.js',
'F:/VPBank/view/TransactionDetail.view.js',
'F:/VPBank/view/TransactionDetails.controller.js',
'F:/VPBank/view/TransactionDetails.view.js',
'F:/VPBank/view/Transfer.controller.js',
'F:/VPBank/view/Transfer.view.js',
'F:/VPBank/view/TransfersConfirm.controller.js',
'F:/VPBank/view/TransfersConfirm.view.js',
'F:/VPBank/view/TransfersList.controller.js',
'F:/VPBank/view/TransfersList.view.js',
'F:/VPBank/view/TransfersListDetails.controller.js',
'F:/VPBank/view/TransfersListDetails.view.js',
'F:/VPBank/view/TransfersVerify.controller.js',
'F:/VPBank/view/TransfersVerify.view.js',
'F:/VPBank/view/Video.controller.js',
'F:/VPBank/view/Video.view.js',
'F:/VPBank/view/Withdraw.controller.js',
'F:/VPBank/view/Withdraw.view.js'
]
minifier.on('error', function(err) {
	// handle any potential error
})

var outPath='F:/VPBank/Minify/view/'
var i;
var option=null;

for(i=0; i< input.length;i++)
{
 
 option  ={};
 if(i==67 || i==71) {
console.log(input[i] +" Value  indexof" + i);
 	continue;
 }
 option.output =outPath+ input[i].substring(15);
 minifier.minify(input[i], option);
}function :vt()
{
	alert(1);
	}
alert(1);