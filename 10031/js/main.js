(function () {
	'use strict';
	
	var url = window.location.href;
	var lang = url.indexOf("_en.html") != -1? "en" : "cn";
	var isMobile = url.indexOf("/mobile") != -1 ? true : false;
	var isPhoneLogin = url.indexOf("phone_login") != -1? true : false;
	var MESSAGES = {
		en:{
			PHONE_NO_CANNOT_BE_EMPTY: 'Phone Number cannot be empty',
			PHONE_NO_IS_INVALID: 'Phone Number is invalid, Only support the mainland mobile phone number',
			PWD_CANNOT_BE_EMPTY: 'Password cannot be empty',
			PWD_IS_INVALID: 'Password is invalid',
			SERVICE_TERMS_MUST_BE_CHECKED: 'Please accept the terms and conditions',
			AUTH_SUCCESS: 'Authentication is successful',
			AUTHING: 'Authenticating...',
			SENDING: 'Sending...',
			SECONDS_MESSAGE: 'Resend({0})',
			SEND_ERROR: 'Failure sent',
			NETWORK_EXCEPTION: 'Network exception, please try again later',
			SEAT_NO_CANNOT_BE_EMPTY: 'Seat Number cannot be empty',
			SEAT_NO_IS_INVALID:'Seat Number is invalid',
			FLIGHT_NO_CANNOT_BE_EMPTY: 'Flight Number cannot be empty',
			FLIGHT_NO_IS_INVALID:'Flight Number is invalid',
			PASSPORT_NO_CANNOT_BE_EMPTY: 'Passport Number cannot be empty',
			PASSPORT_NO_IS_INVALID:'Passport Number is invalid', 
			BOARDING_PASS_INFO_IS_INVALID:'Boarding pass must be used after security',
			BOARDING_PASS_TIP:'Only for domestic airlines, who use ID cards to buy tickets, passengers who have passed security inspection, and other passengers recommend the use of SMS or WeChat certification',
			OPEN_WECHAT: 'Open Wechat...',
			WECHAT_AUTH: 'WECHAT AUTH',
			WECHAT_AUTH_FAILED:'Wechat auth may be temporarily unavailable, please select the other auth methods',
			SMS_AUTH: 'PHONE AUTH',
			OK: 'OK',
			CANCEL: 'CANCEL',
			CONTINUE_USE_BOARDING_PASS: 'Continue to use boarding pass auth',
			TRY_AGAIN: 'Try again'
		},
		cn:{
			PHONE_NO_CANNOT_BE_EMPTY: '手机号码不能为空',
			PHONE_NO_IS_INVALID: '手机号码格式有误，仅支持大陆手机号',
			PWD_CANNOT_BE_EMPTY: '密码不能为空',
			PWD_IS_INVALID: '密码格式有误',
			SERVICE_TERMS_MUST_BE_CHECKED: '请选中使用条款',
			AUTH_SUCCESS: '认证成功',
			AUTHING: '正在认证...',
			SENDING: '正在发送...',
			SECONDS_MESSAGE: '重新发送({0})',
			SEND_ERROR: '密码发送失败',
			NETWORK_EXCEPTION: '网络异常请稍后再试',
			SEAT_NO_CANNOT_BE_EMPTY: '座位号不能为空',
			SEAT_NO_IS_INVALID:'座位号格式有误',
			FLIGHT_NO_CANNOT_BE_EMPTY: '航班号不能为空',
			FLIGHT_NO_IS_INVALID:'航班号格式有误',
			PASSPORT_NO_CANNOT_BE_EMPTY: '证件号不能为空',
			PASSPORT_NO_IS_INVALID:'证件号格式有误',
			BOARDING_PASS_INFO_IS_INVALID:'登机牌认证请务必在安检后使用',
			BOARDING_PASS_TIP:"仅用于国内航空公司的、使用身份证购票的、已过安检的旅客，其他旅客建议使用短信或微信认证",
			WECHAT_AUTH: '微信认证',
			OPEN_WECHAT: '正在打开微信...',
			WECHAT_AUTH_FAILED:'微信认证可能暂时不可用，请选择其它认证方式',
			SMS_AUTH: '短信认证',
			OK: '确定',
			CANCEL: '取消',
			CONTINUE_USE_BOARDING_PASS: '继续使用登机牌认证',
			TRY_AGAIN: '继续尝试'
		}
	}

	function getMessage(key) {
		var message = MESSAGES[lang][key];
		if (!message) {
			message = key;
		}

		if (arguments.length > 1) {
			for (var i = 0; i < arguments.length; i++) {
				message = message.replace("{"+ i +"}", arguments[(i+1)]);
			}
		}
		return message;
	}

	function createXalert(message) {
		var title = lang == "en" ? "Hint from page" : "提示";
		var html = "<div class='alert'>"
		html += "<div class='fog'></div>";
		html += "<div class='alert-contain'>";
		html += "<div class='alert-box'>";
		html += "<div class='alert-title'>"+title+"</div>";
		html += "<div class='content'>"+message+"</div>";
		html += "<div class='button-contain'></div>";
		html += "<a class='btn-close' href='javascript:;'></a>";
		html += "</div></div></div>";
		var $alert = $(html).appendTo("body");
		$alert.on("click", "a", function() {
			$alert.hide();
			$alert.find(".btn-cancel").css("display", "none");
			var $this = $(this);
			var buttons = $alert.data("buttons");
			if (buttons) {
				var index = parseInt($this.attr("data-index"));
				var callback = buttons[index].callback;
				if (callback) {
					callback();
				}
			}
		});
		return $alert;
	}

	function xalert(key, params) {
		var buttons;
		if (key.key) {
			params = key.params;
			buttons = key.buttons;
			key = key.key;
		} else {
			buttons = [{text:'OK', className:'btn-ok'}];
		}

		var message = getMessage(key, params);
		var $alert = $(".alert");
		if ($alert.length == 0) {
			$alert = createXalert(message);
		} else {
			$alert.find(".content").html(message);
		}

		var html = "";
		for (var i = 0; i < buttons.length; i++) {
			var button = buttons[i];
			var text = getMessage(button.text);
			var buttonType = isMobile ? "btn-b" : "btn-a"
			var style = "";
			if ((button.text == "OK" || button.text == "CONTINUE_USE_BOARDING_PASS") && buttons.length > 1) {
				style = " style='font-weight: bold";
				if (!isMobile && button.text == "CONTINUE_USE_BOARDING_PASS") {
					style += ";width:"
					if (lang == "en") {
						style += "240px;"
					} else {
						style += "140px;"
					}
				}
				style += "'"
			}
			html += "<a class='"+buttonType+" "+button.className+"' data-index='"+i+"'"+style+" href='javascript:;'>"+text+"</a>";
		}
		$alert.find(".button-contain").html(html);

		if (isMobile) {
			var marginTop = ((117 + (buttons.length * 38)) / 2) * -1;
			$alert.find(".alert-contain").css({marginTop:marginTop});
		}
		$alert.data("buttons", buttons);
		$alert.show();
	}

	var authenticator = new Authenticator({
		success: function(portal) {
			setTimeout(function() {
				window.location.href = portal.success;
			}, 1000);
		},
		error: function(error) {
			var btn = $("#login_btn, #one-click-login-btn");
			btn.removeClass("btn-disabled");
			var temp = btn.attr("data-temp");
			btn.html(temp);

			if (error && error.description) {
				var message;
				if (error.description.length > 5) {
					message = error.description.substring(0, 5);
				}

				if (message == "Sorry" || message == "抱歉未找到" || message == "Board" || message == "登机牌认证") {
					var buttons = [{
						text:"TRY_AGAIN",
						className:"btn-other"
					}];
					if (isMobile) {
						buttons.splice(1, 0, {
							text:"SMS_AUTH",
							className:"btn-other",
							callback: function() {
								jump("phone_login");
							}
						},{
							text:"WECHAT_AUTH",
							className:"btn-other",
							callback: function() {
								jump("index", "wechatAuth=true");
							}
						});
					} else {
						buttons.splice(1, 0, {
							text:"SMS_AUTH",
							className:"btn-other",
							callback: function() {
								jump("phone_login");
							}
						});
					}
			
					xalert({
						key: error.description,
						buttons: buttons
					});
				} else {
					xalert(error.description);
				}
			} else {
				xalert("NETWORK_EXCEPTION");
			}
		}
	});

	function getRegion() {
		var $region = $("#region");
		var region = $.trim($region.html());
		if (region != "+86") {
			region = region.substring(1);
			region = "00" + region;
		} else {
			region = "";
		}
		return region;
	}

	function validate(isMobileOnly) {
		var data = null;
		if (isPhoneLogin) {
			var mobile = $.trim($("#mobile").val());
			if (!mobile) {
				xalert("PHONE_NO_CANNOT_BE_EMPTY");
				return null;
			}

			var region = getRegion();
			if (!mobile || isNaN(mobile) || (region == "" && mobile.length != 11)) {
				xalert("PHONE_NO_IS_INVALID");
				return null;
			}

			data = [region + mobile];
			if (!isMobileOnly) {
				var code = $.trim($("#code").val());
				if (!code) {
					xalert("PWD_CANNOT_BE_EMPTY");
					return null;
				}

				var codeRegex = $.cookie('codeRegex');
				if (codeRegex && code.match(eval("/^"+codeRegex+"$/")) == null) {
					xalert("PWD_IS_INVALID");
					return null;
				}
				data.push(code);
			}
		} else {
			var seatno = $.trim($("#seatno").val());
			if (!seatno) {
				xalert("SEAT_NO_CANNOT_BE_EMPTY");
				return null;
			}

			var regex = /^(\d)+[A-Za-z]$/;
			if (!regex.test(seatno)) {
				xalert("SEAT_NO_IS_INVALID");
				return null;
			}

			var fitno = $.trim($("#fitno").val());
			if (!fitno) {
				xalert("FLIGHT_NO_CANNOT_BE_EMPTY");
				return null;
			}

			regex = /^([A-Za-z0-9]){5,7}$/;
			if (!regex.test(fitno)) {
				xalert("FLIGHT_NO_IS_INVALID");
				return null;
			}
			
			var passengerno = $.trim($("#passengerno").val()); 
			if (!passengerno) {
				xalert("PASSPORT_NO_CANNOT_BE_EMPTY");
				return null;
			}
			
			regex = /^(\d){3}(\d|[A-Za-z]){1}$/;
			if (!regex.test(passengerno)) {
				xalert("PASSPORT_NO_IS_INVALID");
				return null;
			}

			data = [seatno, fitno, passengerno];
		}

		if (!isMobileOnly && !$("#terms_box").prop("checked")) {
			xalert("SERVICE_TERMS_MUST_BE_CHECKED");
			return null;
		}
		return data;
	}

	function disable(second) {
		var $getPwdBtn = $("#get_pwd_btn");
		var message = getMessage("SECONDS_MESSAGE", second)
		$getPwdBtn.html(message);
		second--;
		setTimeout(function() {
			if (second != 0) {
				disable(second);
			} else {
				$getPwdBtn.removeClass("btn-disabled");
				var temp = $getPwdBtn.attr("data-temp");
				$getPwdBtn.html(temp);
			}
		}, 1000);
	}
	
	function jump(name, params) {
		if (lang == "en") {
			name += "_en";
		}
		name += ".html";
		if (params) {
			name += "?";
			name += params;
		}
		window.location.href = name;
	}
	
	function hideLoader() {
		$(".loader").hide();
		$("#wechat_btn").removeClass("btn-disabled");
	}

	$("#login_btn").click(function() {
		var $this = $(this);
		if (!$this.hasClass("btn-disabled")) {
			$this.addClass("btn-disabled");

			var data = validate();
			if (data == null) {
				$this.removeClass("btn-disabled");
				return;
			}

			var value = $this.html();
			$this.attr("data-temp", value);
			$this.html(getMessage("AUTHING"));

			if (data.length == 2) {
				//短信认证
				authenticator.sms(data[0], data[1]);
			} else {
				//登机牌认证
				authenticator.boardingPass(data[0], data[1], data[2]);
			}
		}
	});

	$("#get_pwd_btn").click(function() {
		var $this = $(this);
		if (!$this.hasClass("btn-disabled")) {
			$this.addClass("btn-disabled");

			var data = validate(true);
			if (data == null) {
				$this.removeClass("btn-disabled");
				return;
			}

			var value = $this.html();
			$this.attr("data-temp", value);
			$this.html(getMessage("SENDING"));

			authenticator.sendCode(data[0], function() {
				disable(60);
			}, function (error) {
				$this.removeClass("btn-disabled");
				var temp = $this.attr("data-temp");
				$this.html(temp);
				if (error && error.description) {
					xalert(error.description);
				} else {
					xalert("SEND_ERROR");
				}
			});
		}
	});
	
	$("#boarding_pass_btn").click(function() {
		var buttons = [{
			text:"CONTINUE_USE_BOARDING_PASS",
			className:"btn-ok",
			callback: function() {
				jump("boarding_pass_login");
			}
		}];

		if (isMobile) {
			buttons.splice(1, 0, {
				text:"SMS_AUTH",
				className:"btn-other",
				callback: function() {
					jump("phone_login");
				}
			},{
				text:"WECHAT_AUTH",
				className:"btn-other",
				callback: function() {
					$("#wechat_btn").trigger("click");
				}
			});
		} else {
			buttons.splice(0, 0, {
				text:"CANCEL",
				className:"btn-other"
			});
		}

		xalert({
			key: "BOARDING_PASS_TIP",
			buttons: buttons
		});
	});
	
	var count = 0;
	$("#wechat_btn").click(function() {
		var $this = $(this);
		if (!$this.hasClass("btn-disabled")) {
			$this.addClass("btn-disabled");

			var loader = $(".loader");
			loader.find(".inner .txt").html(getMessage("OPEN_WECHAT"));
			loader.show();
			authenticator.wechat(hideLoader);
			setTimeout(hideLoader, 6000);
			count++;
			if (count == 3) {
				xalert("WECHAT_AUTH_FAILED");
				count = 0;
			}
		}
	});

	$("#one-click-login-btn").click(function() {
		var $this = $(this);
		if (!$this.hasClass("btn-disabled")) {
			$this.addClass("btn-disabled");
			var value = $this.html();
			$this.attr("data-temp", value);
			$this.html(getMessage("AUTHING"));
			authenticator.mac();
		}
	});

	var codeRegex = $.cookie('codeRegex');
	if (codeRegex && codeRegex.indexOf("\\d") != -1 && window.location.href.indexOf("_desktop") == -1) {
		$("#code").attr("type", "number");
	}

	$(function() {
		var isIndex = url.indexOf("index") != -1;
		if (isIndex && url.indexOf("wechatAuth=true") != -1) {
			$("#wechat_btn").trigger("click");
		}
	});
})();