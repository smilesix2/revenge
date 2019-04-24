$(function(){
    var letterArr="ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    var objLetters={};
    $.each(letterArr,function(i,v){
        objLetters[v]=[];
    });
    function getArr(arr,str){
        var arr0=[];
        for(var i=0,j=arr.length;i<j;i++){
            if(str===arr[i]){
                arr0.push(arr[i]);
            }
        }
        return arr0;
    }  
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
    function unitAtrByLetter(str,obj){
        var arr1=str.split("");
        var str='<div class="conOth conUnit">';
        $.each(arr1,function(i,v){                        
            if(obj[v].length>0){
                str=str+'<div><span>'+v+'</span><ul>';
                for(var i=0,j=obj[v].length;i<j;i++){
                    str=str+'<li title="'+obj[v][i]["name"]+'">'+
                    '<span>'+subString(obj[v][i]["name"],8,'...')+'</span>'
                    +'<span>'+obj[v][i]["code"]+'</span>'
                    +'</li>';
                }
                str=str+'</ul></div>';
            }
        });
        str=str+"</div>";
        return str;
    }   

    $.ajax({
        url: "../regions_en.json",
        dataType:"json",
        cache: false,
        success: function (regions) {
            debugger;
            var jsonHot=regions.hot; 
            var hotStr="";
            for(var i=0,j=jsonHot.length;i<j;i++){
                hotStr=hotStr+'<div title="'+jsonHot[i]["name"]+'">'+subString(jsonHot[i]["name"],8,'...')
                +'<span>'+jsonHot[i]["code"]+'</span>'
                +'</div>';
            }
            $(".conWrap .con").append(hotStr);
            var json=regions.all; 
            for(var i=0,j=letterArr.length;i<j;i++){
                $.each(json,function(index,val){
                    if(val.name.charAt()===letterArr[i]){
                        objLetters[letterArr[i]].push(val);                 
                    }               
                });
            }

            var titLis=$("#floor .tit li");
            var letters=[titLis.eq(1).text(),
                titLis.eq(2).text(),
                titLis.eq(3).text(),
                titLis.eq(4).text(),
                titLis.eq(5).text()
            ];
            var strLetters="";
            $.each(letters,function(i,v){
                strLetters=strLetters+unitAtrByLetter(v,objLetters);
            });
            $('.conWrap').append(strLetters);
            $(".conWrap li").click(function(){
                $("#region").text("+"+$(this).text().split("+")[1]);
                $("#floor").css("display","none");
            });

            $("#floor .tit li").click(function(){
                $(this).addClass("act").siblings().removeClass("act");
                $("#floor .conUnit").eq($(this).index()).css("display","block")
                .siblings().css("display","none");
            });
            $("#floor .close").click(function(){
                $("#floor").hide();
            });   
                
            $("#floor .con div").click(function(){
                $("#region").text("+"+$(this).find("span").eq(0).text());
                $("#floor").css("display","none");
            });
            $("#floor .conOth li").click(function(){
                $("#region").text("+"+$(this).find("span").eq(1).text());
                $("#floor").css("display","none");
            });

        }
    });
    $("#region").click(function(){
        $("#floor").css("display","block");            
    });

});