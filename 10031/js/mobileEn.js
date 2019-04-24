        // $.main.lang = "en";
//      $.main.jump = false;
//      $.main.macAuth = true;
//      $.authenticator.onAuthSuccess = function(data) {
//          var url = data.spUrl;
//          if (window.location.href.indexOf("_en.html") != -1) {
//              url = url.replace(".html", "_en.html");
//          }
//          window.location.href = url;
//      }
       $("#username").val("");
       $("#password").val("");

       // add
       $(function(){
            // letters
            lettersFloor();
            initH();
            var letterArr="ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
            var objLetters={};
            $.each(letterArr,function(i,v){
                objLetters[v]=[];
            });

            $.ajax({
                url: "../regions_en.json",
                dataType:"json",
                cache: false,
                success: function (regions) { 
                    var json=regions.all;
                    for(var i=0,j=letterArr.length;i<j;i++){
                        $.each(json,function(index,val){
                            if(val.name.charAt()===letterArr[i]){
                                objLetters[letterArr[i]].push(val);                 
                            }               
                        });
                    }  
                    var strWrap="";   
                    $.each(letterArr,function(i,v){
                        if(objLetters[v].length>0){
                            var str="<dl>"
                                +'<dt id="'+v+'">'+v+'</dt>';
                            for(var i=0,j=objLetters[v].length;i<j;i++){
                               str=str+'<dd>'+objLetters[v][i]["name"]+'<span>'+"+"+objLetters[v][i]["code"]+'</span></dd>';
                            }                        
                            str=str+"</dl>";
                            strWrap=strWrap+str;  
                        }
                    });
                    $("#mobileCon").append(strWrap);
                    var ddCons=$("#mobileFloor dd");
                    function filterText(){
                        var val=$("#search input").val();                        
                        if(val!==''){
                            ddCons.each(function(i,v){
                                $(v).parent().css("display","none"); 
                                $(v).css("display","none"); 
                            });     
                            ddCons.each(function(i,v){ 
                                var arrVal=$(v).text().split("+");                      
                                if(/\d/g.test(val)){  
                                    if(arrVal[1]){
                                        if(arrVal[1].indexOf(val)>=0){                                    
                                            $(v).parent().css("display","block");
                                            $(v).css("display","block");
                                        }
                                    }  
                                }else{
                                    if(arrVal[0]){
                                        if(arrVal[0].length>=2 && arrVal[0].toUpperCase().indexOf(val.toUpperCase())>=0){                                            
                                            $(v).parent().css("display","block");
                                            $(v).css("display","block");
                                        }
                                    }
                                };
                            }); 
                        }else{
                            ddCons.each(function(i,v){
                                $(v).parent().css("display","block"); 
                                $(v).css("display","block"); 
                            });               
                        };  
                        $("#floorTip").hide();                      
                    }
                    $("#search span").click(function(){
                        filterText();
                    });
                    $("#search input").on('keypress',function(e) {  
                        var e = event || window.event; 
                        var k = e.keyCode || e.which || e.charCode;
                        var searchName = $(this).val();  
                        if(k=='13') {  
                            e.preventDefault(); 
                            filterText();
                        }         
                    }); 
                }
            });
            $("#mobileFloor .tit a").click(function(){
                downPage(); 
            });
            $("#mobileFloor").on("click","dd",function(){
                $("#region").text($(this).find("span").eq(0).text());
                downPage(); 
            });

            $("#region").click(function(){
                upPage();             
            });
            $("#search input").focus(function(){
                $("#floorTip").hide();
            });
       });