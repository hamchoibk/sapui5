'use strict';
/* To store signup details*/

tcbmwApp.factory('signupUserDetailsFactory', function(){

var username = "";
var mobileNumber = "";
var password = "";
var confirmPassword = "";
var identityNumber = "";
var dob = "";
var dobFormated = "";
var dobPickedDate=undefined;
var address = "";
var email = "";
var identifierScan1 = "";
var identifierScan2 = "";
var IssuePickedDate=undefined;
var issueDate = "";
var issueFormatedDate = "";
var capchaCode = "";
var capchaId = "";
var ud;
var smsToken;
var hasArcIb = false;
var promotionCode = "";

return {
    getUserName: function(){
        return username;
    },
    setUserName: function(value){
        username = value;
    },
    getMobileNumber: function(){
        return mobileNumber;
    },
    setMobileNumber: function(value){
        mobileNumber = value;
    },
    getPassword: function(){
        return password;
    },
    setPassword: function(value){
        password = value;
    },
    getConfirmPassword: function(){
        return confirmPassword;
    },
    setConfirmPassword: function(value){
        confirmPassword = value;
    },
    getIdentityNumber: function(){
        return identityNumber;
    },
    setIdentityNumber: function(value){
        identityNumber = value;
    },
    getIssuePickedDate: function(){
        return IssuePickedDate;
    },
    setIssuePickedDate: function(value){
        IssuePickedDate = value;
    },
    getIssueDate: function(){
        return issueDate;
    },
    setIssueDate: function(value){
        issueDate = value;
    },
    getFormatedIssueDate: function(){
        return issueFormatedDate;
    },
    setFormatedIssueDate: function(value){
        issueFormatedDate = value;
    },
    getCapchaCode: function(){
        return capchaCode;
    },
    setCapchaCode: function(value){
        capchaCode = value;
    },
    getCapchaId: function(){
        return capchaId;
    },
    setCapchaId: function(value){
        capchaId = value;
    },
    getUD: function(){
        return ud;
    },
    setUD: function(value){
        ud = value;
    }
    ,
    getSmsToken: function(){
        return smsToken;
    },
    setSmsToken: function(value){
        smsToken = value;
    },
    getArcIB: function(){
        return hasArcIb;
    },
    setArcIB: function(value){
        hasArcIb = value;
    },
    getDOB: function() {
        return dob;
    },
    setDOB: function(value) {
        dob = value;
    },
    getFormatedDOB: function(){
        return dobFormated;
    },
    setFormatedDOB: function(value){
        dobFormated = value;
    },
    getDOBPickedDate: function() {
        return dobPickedDate;
    },
    setDOBPickedDate: function (value) {
        dobPickedDate = value;
    },
    getAddress: function() {
        return address;
    },
    setAddress: function(value) {
        address = value;
    },
    getEmail: function() {
        return email;
    },
    setEmail: function(value) {
        email = value;
        console.log("set email = ", email);
    },
    getIdentifierScan1: function() {
        return identifierScan1;
    },
    setIdentifierScan1: function(value) {
        identifierScan1 = value;
    },
    getIdentifierScan2: function() {
        return identifierScan2;
    },
    setIdentifierScan2: function(value) {
        identifierScan2 = value;
    },
    getPromotionCode: function() {
        return promotionCode;
    },
    setPromotionCode: function(value) {
        promotionCode = value;
    },
    clear: function() {
        username = "";
        mobileNumber = "";
        password = "";
        confirmPassword = "";
        identityNumber = "";
        issueFormatedDate = "";
        IssuePickedDate=undefined;
        issueDate = "";
        capchaCode = "";
        capchaId = "";
        ud = "";
        smsToken = "";
        hasArcIb = false;
        dob = "";
        dobFormated = "";
        dobPickedDate = undefined;
        address = "";
        email = "";
        identifierScan1 = "";
        identifierScan2 = "";
        promotionCode = "";
    }
}
});