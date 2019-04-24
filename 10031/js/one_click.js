$.main.macAuth = false;

var authenticator = new Authenticator({ 
	success: function(portal) {
		setTimeout(function() {
			window.location.href=portal.success;
		}, 1000);
	},
	error: function(error) {
		var btn = $(".login-btn");
		btn.removeClass("btn-disabled");
		btn.val("登录");
		alert(error.description);
	}
});

$("#one-click-login-btn").click(function() {
	var btn = $(this);
	var data = null;
	var original = btn.html();
	btn.attr("data-original", original);
	var result=true;
	if (btn.hasClass("btn-disabled")) {
		result = false;
	}
	
	btn.html($.main.MESSAGE[$.main.lang].AUTHING);
	btn.addClass("btn-disabled");
	
	if (result) {
	   authenticator.mac(function(portal) {  
			btn.removeClass("btn-disabled");
			var url = portal.success;
			if (window.location.href.indexOf("_en.html") != -1) {
    			url = url.replace(".html", "_en.html");
    		}
    		window.location.href = url;
	   }, function (error) {
		   $.main.alert(error.description); 
	   });
	}
});