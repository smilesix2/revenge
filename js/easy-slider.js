(function() {
	function getOptions($slider) {
		var options = null;
		if (window.top != window.self) {
			options = parent.getSliderOptions(window.location.href, $slider[0].id);
		}
		
		if (options == null) {
			var s = $.trim($slider.attr('data-options'));
			if (s){
				if (s.substring(0, 1) != '{'){
					s = '{' + s + '}';
				}
				options = (new Function('return ' + s))();
			}
		}
		return options;
	}
	
	function change(slider) {
		var options = $.data(slider, "options");
		setTimeout(function() {
			change(slider);
		}, options.interval);
		
		var active = $("img:visible", slider);
		var next = active.next();
		var index = $.data(slider, "index") + 1;
		if (next.length == 0) {
			var urlIndex = 0;
			if (options && (options.url || (urlIndex = window.location.href.indexOf('url=')) != -1) && (window.top == window.self || window.top == parent)) {
				window.location.href = options.url || window.location.href.substring(urlIndex + 4);
			} else {
				next = $("img:first", slider);
				index = 0;
			}
		}
		
		$.data(slider, "index", index);
		if (next.length != 0 && active[0] != next[0]) {
			active.hide();
			next.css("display", "block");
		}
		
		if (options.pagination) {
			var pagination = $.data(slider, "pagination");
			if (window.top != window.self) {
				var spans = $("span", pagination);
				var spansLength, exceed = (spansLength = spans.length) - options.images.length;
				if (exceed > 0) {
					for (var s = (spansLength - 1), e = s - exceed; s >= e; s--) {
						$(spans[s]).remove();
					}
				} else if (exceed < 0) {
					for (var c = 0, e = exceed * -1; c < e; c++) {
						$(pagination).append("<span></span>");
					}
				}
			}
			$(".active", pagination).removeClass("active");
			$("span:eq("+index+")", pagination).addClass("active");
		}
		
		var onChange = options.onChange;
		if (onChange) {
			onChange(slider);
		}
	}
	
	$(".easy-slider").each(function(index, slider) {
		var $slider = $(slider);
		var options = getOptions($slider);
		$.data(slider, "options", options);
		var images = options.images;
		var $pagination = options.pagination ? $(options.pagination) : null;
		var imgs = "";
		var spans = "";
		for (var i = 0; i < images.length; i++) {
			imgs += "<img src='"+images[i]+"' style='display:"+(i == 0 ? "block" : "none")+"'/>";
        	if ($pagination) {
        		spans += "<span "+(i == 0 ? "class='active'" : "")+"></span>";
			}
		}
		
		$slider.html(imgs);
		$.data(slider, "index", 0);
		if ($pagination) {
			$.data(slider, "pagination", $pagination[0]);
			var color = $pagination.attr("data-active-color");
			if (color) {
				$("head").append("<style id='active_style'>.pagination .active{background-color:"+color+"}</style>");
			}
			$pagination.html(spans);
		}
		
		setTimeout(function() {
			change(slider);
		}, options.interval);
	});
})();