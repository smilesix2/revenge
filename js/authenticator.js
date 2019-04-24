(function () {
	'use strict';
	window.Authenticator = function(options) {
		var defaults = {
			env: 'PRD',
			success: function(portal) {
				setTimeout(function() {
					window.location.href = portal.success;
				}, 1000);
			}, 
			error: function(error, status) {
				alert(error.description);
			}
		};

		var a = this;
		a.options = $.extend({}, defaults, options);

		function doAjax(settings) {
			var options = a.options;
			var type = settings.type;
			if (!type) {
				type = "POST";
			}

			var success = settings.success;
			if (!success) {
				success = options.success;
			}

			var error = settings.error;
			if (!error) {
				error = options.error;
			}

			var url = settings.url;
			if (a.options.env == "PRD") {
				$.ajax({
					url: url,
					type: type,
					data: settings.data,
					traditional: true,
					cache: false,
					success: success,
					error: function(xhr, textStatus) {
						var s = xhr.status;
						if (s == 403) {
							window.location.href = "http://m.2345.com/?lm_4";
						} else {
							error(xhr.responseJSON, s);
						}
					}
				});
			} else {
				var data = {
					portal: {success: 'http://2345.com'},
					sms: {id: 15, createDate: '2016-10-13 16:08:00'}
				};

				$.extend(data, options.data);
				
				if (data.error) {
					error(data.error);
				} else {
					if (url == "/authenticator/sms" || url == "/authenticator/mac" 
						|| url == "/authenticator/oneClick" || url == "/authenticator/wechat/status") {
						success(data.portal);
					} else if (url == "/authenticator/wechat/info") {
						var createWechatAuthInfo = function () {
							var timestamp = new Date().getTime();
							return {
								appId:'wxa5a31268fc5b4858', 
								shopId:'5351216', 
								extend:'portal:wechat:auth:wxa5a31268fc5b4858:0C-41-3E-38-68-10', 
								authUrl:'http://portal.cloudwinner.cn/authenticator/wechat',
								ssid: 'CloudWinner',
								mac: '0c:41:3e:38:68:10',
								timestamp: timestamp,
								sign: $.md5('wxa5a31268fc5b4858' + 'portal:wechat:auth:wxa5a31268fc5b4858:0C-41-3E-38-68-10' + timestamp + '5351216' + 'http://portal.cloudwinner.cn/authenticator/wechat' + '0c:41:3e:38:68:10' + 'CloudWinner' + 'c2b6734f39e48b503d61278a933f84bc')
							};
						}

						if (!$.md5) {
							$.getScript("http://portal.cloudwinner.cn/portal/js/jquery.md5.js", function () {
								success(createWechatAuthInfo());
							});
						} else {
							success(createWechatAuthInfo());
						}
					} else if (url == "/authenticator/sms/code") {
						success(data.sms);
					} else {
						success();
					}
				}
			}
		}

		a.sms = function(mobile, code, success, error) {
			doAjax({
				url: '/authenticator/sms',
				data: {mobile: mobile, code: code},
				success: success,
				error: error
			});
		};

		a.sendCode = function(mobile, success, error) {
			if (!success) {
				success = function () {};
			}

			doAjax({
				url: '/authenticator/sms/code',
				data: {mobile: mobile},
				success: success,
				error: error
			});
		};

		a.mac = function(success, error) {
			doAjax({
				url: '/authenticator/mac',
				success: success,
				error: error
			});
		};

		a.oneClick = function(success, error) {
			doAjax({
				url: '/authenticator/one_click',
				success: success,
				error: error
			});
		};
		
		a.boardingPass = function(seatno,fitno,passengerno,success, error) {
			doAjax({
				url: "/authenticator/boardingpass",
				data:{seatno: seatno, fitno: fitno, passengerno: passengerno},
				success: success,
				error: error
			});
		};

		var isActivated = false;
		function checkStatus(count) {
			doAjax({
				type: 'GET',
				url: '/authenticator/wechat/status',
				success: function(portal) {
					if (portal) {
						window.location.href = portal.success;
					} else {
						if (count) {
							count--;
							setTimeout(function() {
								checkStatus(count);
							}, 2000);
						}
					}
				}
			});
		}

		function addVisibilityChangeEvent() {
			var hidden, state, visibilityChange; 
			if (typeof document.hidden !== "undefined") {
				hidden = "hidden";
				visibilityChange = "visibilitychange";
				state = "visibilityState";
			} else if (typeof document.mozHidden !== "undefined") {
				hidden = "mozHidden";
				visibilityChange = "mozvisibilitychange";
				state = "mozVisibilityState";
			} else if (typeof document.msHidden !== "undefined") {
				hidden = "msHidden";
				visibilityChange = "msvisibilitychange";
				state = "msVisibilityState";
			} else if (typeof document.webkitHidden !== "undefined") {
				hidden = "webkitHidden";
				visibilityChange = "webkitvisibilitychange";
				state = "webkitVisibilityState";
			}
			
			document.addEventListener(visibilityChange, function() {
				if (isActivated) {
					if(document[state] != hidden) {
						checkStatus();
					} else {
						if (timeoutId) {
							clearTimeout(timeoutId);
						}
					}
				}
			});
		}

		var hasEvent = false;
		var timeoutId = null;
		function wechatAuth(data, target) {
			if (target) {
				JSAPI.auth({
			    	target: target,
			        appId: data.appId,
			        shopId: data.shopId,
			        extend: data.extend,
			        authUrl: data.authUrl
			    });
			} else {
				isActivated = true; 
				Wechat_GotoRedirect(data.appId, data.extend, data.timestamp, data.sign, data.shopId, data.authUrl, data.mac, data.ssid );
				if (!hasEvent) {
					addVisibilityChangeEvent();
					hasEvent = true;
				}

				timeoutId = setTimeout(function() {
					checkStatus(2);
				}, 5000);
			}
		}

		var initialized = false;
		a.wechat = function(target, error) {
			var isMobile;
			if (target instanceof Function) {
				isMobile = true;
				error = target
			} else {
				isMobile = false;
			}

			doAjax({
				type: 'GET',
				url: '/authenticator/wechat/info',
				success:function(data) {
					if (!initialized) {
						if (isMobile) {
							$.getScript("https://wifi.weixin.qq.com/resources/js/wechatticket/wechatutil.js", function () {
								initialized = true;
								wechatAuth(data);
							});
						} else {
							$.getScript("https://wifi.weixin.qq.com/resources/js/wechatticket/pcauth.js", function () {
								initialized = true;
								wechatAuth(data, target);
							})
						}
					} else {
						wechatAuth(data, target);
					}
				},
				error: error
			});
		}

		if (a.options.env == "PRD") {
			jQuery(function(){
				doAjax({url: '/pageviews', success: function() {}});
			});
		}
		return a;
	}
})(jQuery);