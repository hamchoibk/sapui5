$(document).one("pagebeforechange", function() {
    var animationSpeed = 200;
    function animateCollapsibleSet(elm) {
        elm.one("expand", function() {
            $(this).parent().find(".ui-collapsible-content").not(".ui-collapsible-content-collapsed").trigger("collapse");
            $(this).find(".ui-collapsible-content").slideDown(animationSpeed, function() {
                animateCollapsibleSet($(this).parent().trigger("expand"));
            });
            return false;
        }).one("collapse", function() {
            $(this).find(".ui-collapsible-content").slideUp(animationSpeed, function() {
                $(this).parent().trigger("collapse");
            });
            return false;
        });
    }
    animateCollapsibleSet($("[data-role='collapsible-set'] > [data-role='collapsible']"));
});

$(function() {
$( window ).hashchange(function() {
	$(".test").hide(0);
	$(".lotusIcon").removeClass("btnActive");
});
});
$(document).one("pagebeforechange", function() {
	
	


var $menuTrigger = $(".header .lotusIcon"),
$menuWrapper = $(".test"),
$navpanel =$("#navpanel"),
$navbutton = $(".menuIcon"),
$conHeight = $(".ui-panel-content-wrap");
if($menuTrigger.length != 0){
	$menuTrigger.on('click', function(){
		$(".ui-body-c").animate({scrollTop: 0},600);
		$navpanel.panel( "close" );
		if ($menuWrapper.is(':visible') ){
			$menuWrapper.slideUp(300);
			$(".lotusIcon").removeClass("btnActive");
		}
		else{
			$menuWrapper.slideDown(300);
			$(".lotusIcon").addClass("btnActive");
		}
	});
	$navbutton.on('click', function(){
		$(".ui-body-c").animate({scrollTop: 0},600);
		
		if ($navpanel.is(':visible') ){
		var $windowHeight = $(window).height();
		
		$(".ui-panel-inner").css('height', $windowHeight);
		}
		$(".ui-panel-dismiss").css('height', $conHeight);
		if($menuWrapper.is(':visible')){
			$menuWrapper.slideUp(300);
			$menuTrigger.removeClass("btnActive");	
		}
	});
}


$('#accountPage').click(function(){
	$navpanel.panel( "close" );
});




	

$(".testnew").click(function(){
	setTimeout(function(){
		$.mobile.loading('show',{
		text:'Saving your Password',
	});
	setTimeout(function () {
		$.mobile.changePage('#login');
		$("#passwordConfirmation").popup("open",{
			x:0,
			y:120,
		});
	}, 1000);
	},1);
});
$(".renameAccount").click(function(){
	setTimeout(function(){
		$.mobile.loading('show',{
		text:'Updating Account Name',
	});
	setTimeout(function () {
		$.mobile.changePage('#renameAccount');
		$("#accnameupdatedConfirm").popup("open",{
			x:0,
			y:120,
		}); 
	}, 1000);
	},1);
});

$(".saveEmail").click(function(){
	setTimeout(function(){
		$.mobile.loading('show',{
		text:'Updating your Email Address',
	});
	setTimeout(function () {
		$.mobile.changePage('#preferences');
		$("#changeEmailConfirmmsg").popup("open",{
			x:0,
			y:120,
		}); 
	}, 1000);
	},1);
});

$(".savePassword").click(function(){
	setTimeout(function(){
		$.mobile.loading('show',{
		text:'Saving your Password',
	});
	setTimeout(function () {
		$.mobile.changePage('#preferences');
		$("#changepasswordConfirmmsg").popup("open",{
			x:0,
			y:120,
		}); 
	}, 1000);
	},1);
});


$(".saveSchedule").click(function(){
	setTimeout(function(){
		$.mobile.loading('show',{
		text:'Updating Schedule',
	});
	setTimeout(function () {
		$.mobile.changePage('#scheduledTransactions');
		$("#scheduleupdatemsg").popup("open",{
			x:0,
			y:120,
		}); 
	}, 1000);
	},1);
});


$(".saveFavourites").click(function(){
	setTimeout(function(){
		$.mobile.loading('show',{
		text:'Adding favourite',
	});
	setTimeout(function () {
		$.mobile.changePage('#favouritesList');
		$("#addfavouriteConfirmmsg").popup("open",{
			x:0,
			y:120,
		});
	}, 1000);
	},1);
});


$(".addBillpayee").click(function(){
	setTimeout(function(){
		$.mobile.loading('show',{
		text:'Adding Payee',
	});
	setTimeout(function () {
		$.mobile.changePage('#billPayee');
		$("#addpayeeConfirmmsg").popup("open",{
			x:0,
			y:120,
		});
	}, 1000);
	},1);
});

$(".addnewBeneficiary").click(function(){
	setTimeout(function(){
		$.mobile.loading('show',{
		text:'Adding Beneficiary',
	});
	setTimeout(function () {
		$.mobile.changePage('#beficiaryList');
		$("#addnewbeneficiaryConfirmmsg").popup("open",{
			x:0,
			y:120,
		});
	}, 1000);
	},1);
});


$(".beneficiaryAdd").click(function(){
	setTimeout(function(){
		$.mobile.loading('show',{
		text:'Adding Beneficiary',
	});
	setTimeout(function () {
		$.mobile.changePage('#selectBeneficiary');
		$("#addbeneficiaryConfirmmsg").popup("open",{
			x:0,
			y:120,
		});
	}, 1000);
	},1);
});

$(".savePayee").click(function(){
	setTimeout(function(){
		$.mobile.loading('show',{
		text:'Updating Payee name ',
	});
	setTimeout(function () {
		$.mobile.changePage('#billPaymenteditlist');
		$("#updatepayeeConfirmmsg").popup("open",{
			x:0,
			y:120,
		});
	}, 1000);
	},1);
});



});


$(document).one("pagebeforechange", function() {
/*$(".groupButtonselection a").click(function(){
     $(".groupButtonselection .ui-controlgroup-controls a").removeClass("selected");
	 $(this).addClass("selected");
	 var selectValue = $( this ).text();
	 $(".scheduleTypeBtn .sRight").append(selectValue);
});*/
$(".notificationWhen a").click(function(){
	 $(this).toggleClass("selected");
});
$(".notification4trans a").click(function(){
     $(".notification4trans .ui-controlgroup-controls a").removeClass("selected");
	 $(this).addClass("selected");
});
$(".repeatday a").click(function(){
     $(".repeatday .ui-controlgroup-controls a").removeClass("selected");
	 $(this).addClass("selected");
});
$(".repeatType a").click(function(){
     $(".repeatType .ui-controlgroup-controls a").removeClass("selected");
	 $(this).addClass("selected");
});
$(".scheduleType a").click(function(){
     $(".scheduleType .ui-controlgroup-controls a").removeClass("selected");
	 $(this).addClass("selected");
});
$(".favourselectList .listtype li a").click(function(){
     $(".favourselectList .listtype li a").removeClass("selected");
	 $(this).addClass("selected");
});
$(".accnotification a").click(function(){
     $(".accnotification .ui-controlgroup-controls a").removeClass("selected");
	 $(this).addClass("selected");
});
$(".ccnotification a").click(function(){
     $(".ccnotification .ui-controlgroup-controls a").removeClass("selected");
	 $(this).addClass("selected");
});


$("#chequerequestOption").change(function() {
    $("div.selectValues").hide();
	$(".requestSubmit").show();
    var targetId = $(this).val();
    console.log($(targetId).html());
    $("#"+targetId).show();
});


});


$(function(){
$( ".deleteList li.deleteOption" ).bind( "swipe", tapHandler );
function tapHandler( event ){
$(this).closest('li').animate({left: "0px",position:"absolute"}, 300 ).before("<span class='deleteIcon'><a href='http://www.google.com'>Google</a></span>");
}
});









