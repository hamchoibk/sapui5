'use strict';
tcbmwApp.controller('HomeController', ['$rootScope', '$scope', '$state', '$filter', 'SocialFactory', 'friendFactory', 'sendMoneyTransferFactory', 'askMoneyFactory', 'AccountSelectorFactory', 'interBankFactory', 'TopUpFactory', 'TransactionsFactory', 'AccountCashoutMobileParticularsFactory', 'ProfileFactory',
    function ($rootScope, $scope, $state, $filter, SocialFactory, friendFactory, sendMoneyTransferFactory, askMoneyFactory, AccountSelectorFactory, interBankFactory, TopUpFactory, TransactionsFactory, AccountCashoutMobileParticularsFactory, ProfileFactory) {
        var loadingProgress = 0;

        sendMoneyTransferFactory.resetSendMoneyUserInputs();

        mc.getCustomerProfile(getCustomerProfileBack);


        function getCustomerProfileBack(r) {
            if (r.Status.code == "0") {
                if (r.profile.identifications) {
                    for (var idx in r.profile.identifications) {
                        if (r.profile.identifications[idx].type == 100) {
                            session.isKYC = true;
                        } else {
                            session.isKYC = false;
                        }

                    }
                }

            } else {
                ErrorBox(r.Status);
            }
        }


        if (session.accounts === undefined || session.accounts == null || session.accounts.length == 0) {
            if (session.customer !== undefined && session.customer != null && session.customer != "") {
                $scope.loading = true;
                loadingProgress++;
                mc.getWallets(walletBack, session.customer.id, 0);
            }
        }

        if (session.user === undefined || session.user == null) {
            if (session.customer !== undefined && session.customer != null && session.customer != "") {
                var profileImage = angular.element("#profileImage");
                profileImage.css("background-image", "url(images/profile-placeholder.png)");
                var bg = "images/fbcover.jpg";
                if (localStorage.getItem(Sha256.hash("" + session.customer.id) + "profileBackground")) {
                    bg = "data:image/jpeg;base64," + localStorage.getItem(Sha256.hash("" + session.customer.id) + "profileBackground");
                }
                if (localStorage.getItem(Sha256.hash("" + session.customer.id) + "profilePicture")) {
                    session.user = {
                        profile: {
                            name: session.customer.displayName,
                            photo: "data:image/jpeg;base64," + localStorage.getItem(Sha256.hash("" + session.customer.id) + "profilePicture"),
                            background: bg
                        }
                    };
                } else {
                    session.user = {
                        profile: {
                            name: session.customer.displayName,
                            photo: "images/profile-placeholder.png",
                            background: bg
                        }
                    };
                }
                $scope.profile = session.user.profile;

                $scope.loading = true;
                mc.getUserDetails(getUserDetailBack);
                mc.getFavoriteFriends(getFavoriteFriendBack);
            }
        } else {
            if (session.user.profile != null) {
                $scope.profile = session.user.profile;
                //$scope.profile = {name:session.customer.displayName,photo:"images/profile-placeholder.png"};
                //$rootScope.$$phase || $rootScope.$apply();
            } else {
                var bg = "images/fbcover.jpg";
                if (localStorage.profileBackground) {
                    bg = "data:image/jpeg;base64," + localStorage.profileBackground;
                }
                var profileImage = angular.element("#profileImage");
                profileImage.css("background-image", "url(images/profile-placeholder.png)");
                session.user = {
                    profile: {
                        name: session.customer.displayName,
                        photo: "images/profile-placeholder.png",
                        background: bg
                    }
                };
                $scope.profile = session.user.profile;
            }
        }
        // set this session object in factory.
        $scope.value = "Welcome to HomeController";
        $scope.account = {displayName: "", currency: "", balance: ""};

        if ($scope.profile !== undefined && $scope.profile.name !== undefined && $scope.profile.name.length >= 25 && $scope.profile.name.length < 35) {
            console.log("Check IF + $scope.profile.name", $scope.profile.name);
            $('.profile-name').addClass("small");
        } else if ($scope.profile.name != undefined && $scope.profile.name.length >= 35) {
            console.log("Check ELSE + $scope.profile.name", $scope.profile.name);
            $('.profile-name').addClass("extra-small");
        }
        var ca = getCurrentAccount();
        var notices = 0;

        if (ca != null) {
            $scope.account = ca;
            if (ca.balance.length < 10) {
                $('.amount').removeClass('small');
            } else {
                $('.amount').addClass('small');
            }
        }

        var transactions = TransactionsFactory.findByStatus("Pending");
        if (transactions) {
            notices = transactions.length;
        }
        if (!session.cachedSocialTrasactions) {
            if (!session.fetchingSocialTransactions)
                mc.findSocialTransactions(findSocialTransactionBack, 100);
        }


        $scope.notices = notices;
        //$scope.profile = {name:"", photo:""};

        var ca = getCurrentAccount();
        if (ca != null) {
            $scope.account = ca;
            if (ca.balance.length < 10) {
                $('.amount').removeClass('small');
            } else {
                $('.amount').addClass('small');
            }
        }
        $scope.showmenu = false;
        $scope.navTitle = "HOME_NAVBAR_TITTLE";
        var baseStatus = {
            toggleMenu: true,
            onToggleMenu: function () {
                $scope.showmenu = ($scope.showmenu) ? false : true;
                var newIndex = statuses.indexOf($scope.status) - 1;
                if (newIndex > -1) {
                    $scope.status = statuses[newIndex];
                    $scope.status.move = 'ltr';
                    $scope.navigationBarStatus = $scope.status;
                }
            },
            isLogoutRequired: true,
            onLogout: function () {
                $rootScope.suppressDialog = false;
                Confirm('DASHBOARD_LOGOUT_CONFIRM_TEXT', doLogout);
            }
        };

        function doLogout() {
            logout();
            $state.go('main');
            var newIndex = statuses.indexOf($scope.status) - 1;
            if (newIndex > -1) {
                $scope.status = statuses[newIndex];
                $scope.status.move = 'ltr';
                $scope.navigationBarStatus = $scope.status;
            }
        };
        $scope.swapAccountValue = function () {
            //$('#currentAccount').toggleClass("hide");
            //$('#eWalletAccount').toggleClass("hide");
            var ca = getNextAccount();
            if (ca != null) {
                $scope.account = ca;
                $rootScope.safetyApply(function(){});
            }
        };
        $scope.clickMenu = function () {
            $scope.showmenu = ($scope.showmenu) ? false : true;
        };

        $scope.clickMore = function () {
            $scope.showmenu = ($scope.showmenu) ? false : true;
        }

        $scope.clickMessage = function () {
            if (isiOsDevice && setting.token != undefined) {
                console.log("ios device logged in -- token == ", setting.token);
                $state.go('pushnotification');
            } else if (isAndroid && setting.regId != undefined) {
                console.log("android device logged in -- regId == ", setting.regId);
                $state.go('pushnotification');
            } else {
                console.log("not a mobile device");
                MessageBox("", "PUSH_NOTIFICATION_PERMISSION_ALERT_CONTENT");
                $scope.showmenu = ($scope.showmenu) ? false : true;
            }
        }

        $scope.clickContactUs = function () {
            $state.go('contactus');
        }

        $scope.clickHelp = function () {
            $state.go('help');
        }

        $scope.clickPromotionAndLocation = function () {
            window.open("https://techcombank.com.vn/khach-hang-ca-nhan/chuong-trinh-uu-dai/khuyen-mai-cho-san-pham", '_blank', 'location=yes');
        }

        $scope.clickATMLocator = function () {
            $state.go("locateindex");
            $scope.showmenu = ($scope.showmenu) ? false : true;
        }

        $scope.clickProductAndServices = function () {
            window.open("https://www.techcombank.com.vn/san-pham-dich-vu-tai-chinh-ca-nhan", '_blank', 'location=yes');
        }

        $scope.clickPromotions = function () {
            $state.go('promotion');
        }

        $scope.clickProfile = function () {
            if (session.isKYC == true) {
                $state.go('profile');
            } else {
                $state.go('profilenonkyc');
            }
        }

        $scope.clickSettings = function () {
            $state.go('settings');
        }

        $scope.clickDeposit = function () {
            session.savingAccounts = undefined;
            $state.go('depositindex');
        }

        $scope.clickCredit = function () {
            $state.go('creditindex');
        }

        function logout() {
            SocialFactory.resetParticulars();
            friendFactory.resetFriendUser();
            sendMoneyTransferFactory.resetAccountDetail();
            sendMoneyTransferFactory.resetVideoMetaData();
            sendMoneyTransferFactory.resetAudioMetaData();
            sendMoneyTransferFactory.resetImageMetaData();
            askMoneyFactory.resetImageMetaData();
            askMoneyFactory.resetVideoMetaData();
            askMoneyFactory.resetAudioMetaData();

            AccountSelectorFactory.resetAccount();
            TransactionsFactory.resetTransaction();
            interBankFactory.resetTxnInfo();
            TopUpFactory.reset();
            ProfileFactory.clear();

            //clear user data
            stopSessionTimer();
            mc.logout(function () {
            });
            session = new LoginSession();
            TransactionsFactory.resetSocialTransactionsList();
        };

        var statuses = [
            angular.extend({title: 'NAVBAR_DASHBOARD_WELCOME'}, baseStatus)
        ];

        $scope.status = statuses[0];

        $scope.clickAccounts = function () {
            $state.go('accounts');
        };

        $scope.clickTransfer = function () {
            $state.go('dashboard.transferhome');
        };

        $scope.clickCashout = function () {
            if (session.customer.customerTypeId == 200) {
                session.forOwner = true;
                AccountCashoutMobileParticularsFactory.setSource('dashboard.home');
                $state.go('cashoutmobile');
            } else {
                $state.go('dashboard.cashoutindex');
            }
        };

        $scope.clickPayments = function () {
            session.paymentPreviousState = undefined;
            session.l2Payments = undefined;
            session.l3Payments = undefined;
            session.paymentTypes = undefined;
            $state.go('paymentindex');
        };

        $scope.clickTransactions = function () {
            TransactionsFactory.resetSocialTransactionsListIsOpen();
            $state.go('transactionsindex');
        };

        $scope.clickCard = function () {
            TransactionsFactory.resetSocialTransactionsListIsOpen();
            session.cards = undefined;
            $state.go('cardpaymentindex');
        };

        $scope.clickSocial = function () {
            $state.go('dashboard.socialindex');
        };

        $scope.clickNotifications = function () {
            session.pendingTransactionParentPage = "dashboard.home";
            TransactionsFactory.setSelectedStatusFilter("Pending");
            $state.go('transactionsstatusresult');
        }
        function getFriendBack(r) {
            if (r.Status.code == "0") {
                var data = JSON.parse(r.jsonString);
                if (data != null && data.friend != null && data.friend.length === undefined)
                    data.friend = [data.friend];
                session.friends = data.friend;
                for (var i in session.friends) {
                    var underscorePos = session.friends[i].id.indexOf("_");
                    var type = session.friends[i].id.substr(0, underscorePos);
                    if (type == "google")
                        type = "gplus";
                    session.friends[i].type = type;
                }
            }
        };
        function walletBack(data) {
            loadingProgress--;
            if (loadingProgress == 0) {
                showNewLink();
                $scope.loading = false;
                $rootScope.safetyApply(function(){});
            }
            if (data.Status.code == "0") {
                session.accounts = data.walletEntries;
                if (session.accounts.length == 0) {
                    MessageBox(getMessage("SYSTEM_IS_MAINTAINING"));
                    session = new LoginSession();
                    mc.logout(function () {
                    });
                    TransactionsFactory.resetSocialTransactionsList();
                    $state.go("login");
                    if (window.cookies)
                        window.cookies.clear(function () {
                            console.log('Cookies cleared!');
                        });
                }
                mc.getIdentifications(function (data) {
                    if (data.Status.code == "0") {
                        //
                        var msisdn;

                        for (var idx in data.identifications) {
                            console.log(data.identifications[idx].type, data.identifications[idx].identification);
                            if (data.identifications[idx].type == 0) {
                                msisdn = data.identifications[idx].identification;
                                break;
                            }
                        }
                        msisdn = formatLocal("vn", msisdn).replace(/ /g, "");
                        session.msisdn = msisdn;
                        for (var i in session.accounts) {
                            if (session.accounts[i].sva != null) {
                                session.accounts[i].msisdn = msisdn;
                                session.accounts[i].currency = session.accounts[i].sva.currency;

                            } else if (session.accounts[i].bankAccount != null) {
                                //
                                session.accounts[i].msisdn = session.accounts[i].bankAccount.accountNumber;
                                session.accounts[i].currency = session.accounts[i].bankAccount.currency;

                            }
                        }
                        $scope.account = getCurrentAccount();
                        $rootScope.safetyApply(function(){});
                    }
                }, session.customer.id);
                if (session.updateDevice == true) {
                    Confirm("ASK_UPDATE_DEVICE_TO_PUSH_MESSAGE", updateDeviceIdToPushNotification);
                }
            } else {
                ErrorBox(data.Status);
                session = new LoginSession();
                mc.logout(function () {
                });
                $state.go("login");
            }
        };

        function updateDeviceIdToPushNotification() {
            $scope.loading = true;
            mc.updateDeviceToPushNotification(updateDeviceToPushNotificationBack);
        }

        function updateDeviceToPushNotificationBack(r) {
            $scope.loading = false;
            if (r.Status.code == '0') {
//                MessageBox("", "UPDATE_DEVICE_TO_PUSH_SUCCESSFULLY");
                $state.go('pushnotification');
            } else {
                ErrorBox(r.Status);
            }
            $rootScope.safetyApply(function(){});
        }

        function getUserDetailBack(r) {

            if (r.Status.code == "0") {
                var userSocials = JSON.parse(r.jsonString);

                if (userSocials.user !== undefined && userSocials.user != null) {
                    if(session.user.profile !== undefined) {
                        var previousProfile = session.user.profile;
                    } else {var previousProfile = '';}

                    var socialProfile = userSocials.user.profile;
                    session.user = userSocials.user;
                    session.user.profile = previousProfile;
                    if (!localStorage.getItem(Sha256.hash("" + session.customer.id) + "profilePicture") && socialProfile !== undefined && socialProfile != null) {
                        /*var bg = "images/fbcover.jpg";

                         session.user.profile.background = bg;*/
                        if (socialProfile.photo && socialProfile.photo.includes("?type=") == true) {
                            session.user.profile.photo = socialProfile.photo;
                        } else if (socialProfile.photo && socialProfile.photo.includes("?type=") == false) {
                            session.user.profile.photo = socialProfile.photo + "?type=normal";
                        }
                    }
                    $scope.profile = session.user.profile;
                }
                if (session.user.socials) {
                    //already registed with a social network
                    //get friend
                    mc.getFriends(getFriendBack);
                    for (var idx in session.user.socials.social) {
                        if (session.user.socials.social[idx].invalid == true) {
                            Confirm("YOUR_SOCIAL_CHANNEL_IS_EXPIRED", function () {
                                var particulars = SocialFactory.getParticulars();
                                particulars.prevState = "dashboard.home";
                                SocialFactory.setParticulars(particulars);
                                $state.go("dashboard.socialconnect");
                            });
                            break;
                        }
                    }
                }

            }
            $rootScope.safetyApply(function () {
            });
        }

        function getFavoriteFriendBack(r) {

            if (r.Status.code == "0") {
                var data = JSON.parse(r.jsonString);
                if (data != null && data.friend != null && data.friend.length === undefined) {
                    data.friend = [data.friend];
                }
                //session.favoriteFriends = data.friend;


                for (var ii = data.friend.length - 1; ii >= 0; ii--) {
                    //console.log(ii);
                    if (data.friend[ii] === undefined) {
                        data.friend.splice(ii, 1);
                        continue;
                    }
                    //var underscorePos = data.friend[ii].id.indexOf("_");
//                var type = data.friend[ii].id.substr(0,underscorePos);
                    var type = data.friend[ii].recentChannel;
                    if (type == "google")
                        type = "gplus";
                    data.friend[ii].type = type;
                    if (data.friend[ii].profile == null && type != "mobile") {
                        data.friend.splice(ii, 1);
                        continue;
                    }

                }
                session.favoriteFriends = data.friend;
                for (var idx in session.favoriteFriends) {
                    if (session.favoriteFriends[idx].socials != null) {

                        if (session.favoriteFriends[idx].type == "mobile") {

                            var mobileNo;
                            for (var i1 in session.favoriteFriends[idx].socials.social) {
                                if (session.favoriteFriends[idx].socials.social[i1]["$"] === undefined) {
                                    if (session.favoriteFriends[idx].socials.social["$"] == "mobile") {
                                        mobileNo = session.favoriteFriends[idx].socials.social["@id"];
                                        break;
                                    }
                                } else if (session.favoriteFriends[idx].socials.social[i1]["$"] == "mobile") {
                                    mobileNo = session.favoriteFriends[idx].socials.social[i1]["@id"];
                                    break;
                                }
                            }

                            if (!session.favoriteFriends[idx].profile) {
                                session.favoriteFriends[idx].profile = {name: mobileNo, photo: "images/icon-sms.png"};
                            }
                            else if (session.favoriteFriends[idx].profile.name.indexOf(mobileNo) != -1) {
                                session.favoriteFriends[idx].profile = {
                                    name: session.favoriteFriends[idx].profile.name,
                                    photo: "images/icon-sms.png"
                                };
                            } else {
                                session.favoriteFriends[idx].profile = {
                                    name: session.favoriteFriends[idx].profile.name + " " + mobileNo,
                                    photo: "images/icon-sms.png"
                                };
                            }
                        }
                    }
                }
                //console.log(data);
            }
        };
        function findContactSuccess(contactList) {
            //console.log(contactList);
            var contactNames = [];
            for (var idx2 in contactList) {
                //console.log(contactList[idx2]);
                if (contactList[idx2].phoneNumbers != null) {
                    for (var idx3 in contactList[idx2].phoneNumbers) {
                        console.log(contactList[idx2].phoneNumbers);
                        var contact = {
                            name: contactList[idx2].name.formatted,
                            mobile: formatE164("vn", contactList[idx2].phoneNumbers[idx3].value)
                        };
                        contactNames.push(contact);
                    }
                }
            }
            //console.log(contactNames);
            for (var idx in session.favoriteFriends) {
                var friend = session.favoriteFriends[idx];
                if (friend.socials.social["$"] == "mobile") {
                    //var isOK = false;
                    var mobileNumber = formatE164("vn", friend.socials.social["@id"]);
                    var filteredNumber = contactNames.filter(filterNumber, mobileNumber);
                    if (filteredNumber.length > 0) {
                        friend.profile = {name: filteredNumber[0].name, photo: "images/contact_detail_sms.png"};
                        session.favoriteFriends[idx] = friend;
                    }
                }
            }
        }

        function filterNumber(e) {
            console.log(e, this);
            return e.mobile == this;
        }

        function findSocialTransactionBack(r) {
            console.log("findSocialTransactionBack = ", r);
            session.fetchingSocialTransactions = false;
            if (r.Status.code == "0") {
                //isClicked = true;
                var trans = r.transactions;
                for (var idx = 0; idx < trans.length; idx++) {
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
                            t.expiredDate = (addDate(new Date(t.additionalInfos.expire.sent_time), parseInt(t.additionalInfos.expire.days))).format("dd/mm/yyyy");
                        else
                            t.expiredDate = (addDate(new Date(t.additionalInfos.expire.sent_time), 3)).format("dd/mm/yyyy");
                    }
                    if (t.socialTxnType == "ask-link" || t.socialTxnType == "ask-wallet") {
                        t.Linktype = "request";
                    } else if (t.socialTxnType == "send-link") {
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
                            if (t.txnAmount > 0) {
                                t.name = t.payer.accountName;
                            } else {
                                t.name = t.payee.accountName;
                            }
                        } else {
                            //social
                            if (t.additionalInfos) {
                                var displayer;
                                if (t.txnAmount > 0) {
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
                                            || (t.socialTxnType == "send-link" && t.txnAmount < 0)
                                            || (t.socialTxnType == "ask-link" && t.txnAmount > 0)
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
                                            for (var i in displayer.socials.social) {
                                                if (displayer.socials.social[i]["$"] === undefined) {
                                                    if (displayer.socials.social["$"] == "mobile") {
                                                        t.name = displayerName + displayer.socials.social["@id"];
                                                        t.photo = "images/icon-sms.png";
                                                        break;
                                                    }
                                                } else if (displayer.socials.social[i]["$"] == "mobile") {
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
                                if (t.txnAmount > 0) {
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
                if (pendingTransactions) {
                    $scope.notices = pendingTransactions.length;
                }
                $rootScope.safetyApply(function(){});
                cacheSocialTransations();
            } else {
                if (session.alerted != true) {
                    ErrorBox(r.Status);
                    session.alerted = true;
                } else return;

            }
        }

        $scope.swipeShow = function($event) {
            console.log($event);
            $scope.showmenu = ($scope.showmenu) ? false : true;
        };

        $scope.swipeHide = function($event) {
            console.log($event);
            if ($scope.showmenu == true) {
                $scope.showmenu = false;
            } else {
                return;
            }
        };
    }]);
