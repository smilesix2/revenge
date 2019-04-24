"use strict";
;(function(){
    //显示wifi条款
    var floatClause = $('.m-float-clause');
    var floatBtnClose = floatClause.find('.btn-close');
    
    var itemCheck = $('.item-check label');
    
    floatBtnClose.on('click',function(e){
        floatClause.hide();
    });
    
    itemCheck.on('click',function(e){
        floatClause.show();
    });
})();

function lettersFloor(){
    var letters="ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    var str="";
    $("#floorTip").css({
        "top":134+"px",
        "height":$(window).height()-134+"px"
    });
    var unitHeight=parseInt(parseInt($("#floorTip").css("height"))/(letters.length));
    $.each(letters,function(i,v){
        str=str+"<li style='height:"+unitHeight+"px;line-height:"+unitHeight+"px'>"     
        +"<a href='javascript:;'>"+v+"</a>"
        +"</li>";
    });
    $("#floorTip").html(str);
}
$("#floorTip").on("click","a",function(){
    var  offsetId="#"+$(this).text();
    $("#mobileFloor").scrollTop($(offsetId).position().top);
});


function initH(){
    $("#mobileFloor").css({
        top:$(window).height()+"px"
    });
    $("#mobileFloor .tit").css({
        top:$(window).height()+"px"
    });
    $("#mobileFloor .searchWrap").css({
        top:$(window).height()+54+"px"
    });    
    $("#floorTip").hide();        
}

function upPage(){
    $("#mobileFloor").css("display","block").animate({
        top:"0px"
    },function(){
        $("#floorTip").show();    
        $("#mobileFloor").scrollTop($("#A").position().top);    
    });   
    $("#mobileFloor .tit").css("display","block").animate({
        top:"0px"
    });  
    $("#mobileFloor .searchWrap").css("display","block").animate({
        top:"54px"
    });                
}

function downPage(){
    $("#floorTip").hide();
    $("#mobileFloor").css("display","block").animate({
        top:$(window).height()+"px"
    },function(){
        $("#mobileFloor").css("display","none");
        $("#search input").val("");  
        $("#search span").click(); 
    });
    $("#mobileFloor .tit").animate({
        top:$(window).height()+"px"
    });
    $("#mobileFloor .searchWrap").animate({
        top:$(window).height()+54+"px"
    });               
}