        $(function(){  
            // letters
            lettersFloor();
            initH();
            $("#region").click(function(){
                upPage();      
            });
            $("#mobileFloor .tit a").click(function(){
                downPage();
            });

            function setRegionContent($container, data) {
                var prev = null;
                var initial = null;
                var regions = data.all;
                var isEn = $("body").hasClass("en");
                var sections = $("ul li:gt(1)", $container.prev());
                html = "";
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

                        html += "<div><span id='"+initial+"'>"+initial+"</span><ul>";
                        prev = initial;
                    }
                    html += "<li title='"+region.name+"'><span class='name'>"+region.name+"</span><span>"+"+"+region.code+"</span></li>";
                }
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
                    setRegionContent($("#mobileCon"), data);
                    $("#mobileCon li").click(function(){
                        $("#region").text("+"+$(this).text().split("+")[1]);
                        downPage();                        
                    });
                    var ddCons=$("#mobileFloor li");
                    function filterText(){                        
                        var val=$("#search input").val();                   
                        if(val!==''){
                            ddCons.each(function(i,v){
                                $(v).parent().parent().css("display","none"); 
                                $(v).css("display","none"); 
                            });           
                            ddCons.each(function(i,v){
                                var arrVal=$(v).text().split("+");
                                if(/\d/g.test(val)){
                                    if(arrVal[1]){
                                        if(arrVal[1].indexOf(val)>=0){
                                            $(v).parent().parent().css("display","block");
                                            $(v).css("display","block");
                                        }
                                    }             
                                }else{                                    
                                    if(arrVal[0]){
                                        if(arrVal[0].length>=2 && arrVal[0].indexOf(val)>=0){                                            
                                            $(v).parent().parent().css("display","block");
                                            $(v).css("display","block");
                                        }
                                    }
                                };
                            }); 
                        }else{
                            ddCons.each(function(i,v){
                                $(v).parent().parent().css("display","block"); 
                                $(v).css("display","block"); 
                            });                      
                        }; 
                        $("#mobileFloor").css("display","block");
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
                    $("#search input").focus(function(){
                        $("#floorTip").hide();
                    });
                }
            });
        });