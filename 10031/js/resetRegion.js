$(function(){
	$("#floor .tit li").click(function(){
        $(this).addClass("act").siblings().removeClass("act");
        $("#floor .conUnit").eq($(this).index()).css("display","block")
        .siblings().css("display","none");
    });
    $("#floor .close").click(function(){
        $("#floor").hide();
    });  
    $(".region-btn").click(function(e) {
        e.stopPropagation();
        $("#floor").css("display","block");
    });
    function subString(str, len, replaceStr) {
        if (str == null || str == "") { return };
        var newLength = 0,
            newStr = "",
            chineseRegex = /[\u4e00-\u9fa5]/g,
            singleChar = "",
            strLength = str.replace(chineseRegex, "**").length;
        for (var i = 0; i <= strLength; i++) {
            singleChar = str.charAt(i).toString();
            if (singleChar.match(chineseRegex) != null) {
                newLength += 2;
            } else {
                newLength++;
            };
            if (newLength > len) {
                break;
            };
            newStr += singleChar;
        };
        if (strLength > len) {
            if (newStr.charAt(newStr.length - 1).match(chineseRegex) == null) {
                newStr = newStr.substring(0, newStr.length - 1);
            };
            newStr += replaceStr;
        };
        return newStr;
    }	
    function setRegionContent($container, data) {
        var html = "<div class='con conUnit' style='display:block;'><ul>";
        var hot = data.hot;
        for (var i = 0; i < hot.length; i++) {
            var region = hot[i];
            html += "<li title='"+region.name+"'><span class='name'>"
            +subString(region.name,8,"...")+"</span><span>"+region.code+"</span></li>";
        }
        html += "</ul></div>"
        $container.append(html);

        var prev = null;
        var initial = null;
        var regions = data.all;
        var isEn = $("body").hasClass("en");
        var sections = $("ul li:gt(1)", $container.prev());
        html = "<div class='conOth conUnit'>";
        for (var i = 0; i < regions.length; i++) {
            var region = regions[i];
            initial = isEn ? region.name.charAt(0) : region.initial;
            if (initial && initial != prev) {
                if (prev != null) {
                    html += "</ul></div>";
                }
                
                if (isNewSection(sections, initial)) {
                    html += "</div><div class='conOth conUnit'>"
                    prev = null;
                }

                html += "<div><span>"+initial+"</span><ul>";
                prev = initial;
            }
            html += "<li title='"+region.name+"'><span class='name'>"
            +subString(region.name,8,"...")+"</span><span>"+region.code+"</span></li>";
        }
        html += "</div>";
        $container.append(html);
    }

    function isNewSection(sections, initial) {
        for (var i = 0; i < sections.length; i++) {
            var $section = $(sections[i]);
            if ($section.html().charAt(0) == initial) {
                return true;
            }
        }
        return false;
    }	    
    $.ajax({
        url: "../regions.json",
        dataType:"json",
        cache: false,
        success: function (data) {
        	setRegionContent($("#floor .conWrap"), data);
		    $("#floor .conWrap li").click(function(){
		        $("#region").text("+"+$(this).find("span").eq(1).text());
		        $("#floor").css("display","none");
		    });
        }
    });

});