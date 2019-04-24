(function () {
	'use strict';
	var duration = parseInt($("#duration").val());
	if (duration && (window.top == window.self || window.top == parent)) {
		setTimeout(function() {
			var url = $("#url").val();
			if (url) {
				window.location.href = url;
			}
		}, duration);
	}

	if ($.trim($("#tip").html()) != '') {
   		$(".header").show();
	}
})();