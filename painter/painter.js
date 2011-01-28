var painter_tool = "pencil";
var painter_fcolor = "#000000";
var painter_bcolor = "#ffffff";
var cover_open = false;
var menu_open = false;
var paper;

function set_color(color,place){
	if(place == "color1"){
		painter_fcolor = color.val();
		$('#color1').css('background-color',color.val());
	}
	if(place == "color2"){
		painter_bcolor = color.val();
		$('#color2').css('background-color',color.val());
	}
	$('.cover').html('');
	$('.cover').css('background-color','transparent');
	cover_open = false;
}
function cancel_color(){
	$('.cover').html('');
	$('.cover').css('background-color','transparent');
	cover_open = false;
}
function close_about(){
	$('.cover').html('');
	$('.cover').css('background-color','transparent');
	cover_open = false;
}

(function($){
	$.fn.painter = function(options){
                var options = jQuery.extend({
                        width: 300,
                        height: 300,
                        bcolor: "ffffff",
                        fcolor: "000000",
                        color: "e5e5e5",
                        padding: 10,
                        tools:{
                                pencil: true,
                                erase: true,
                                line: true,
                                box: true,
                                circle: true
                        },
				finetune:{
					x: -10,
					y: 80
				}
                },options);
			return this.each(function(){
				$('head').prepend('<script type="text/javascript" src="painter/canvas.js"></scr'+'ipt>');
				$('head').prepend('<script type="text/javascript" src="painter/color.js"></scr'+'ipt>');
				$('head').prepend('<link rel="stylesheet" type="text/css" href="painter/painter.css">');
				var obj = $(this);
				var pos = obj.position();
				var x = pos.left;
				var y = pos.top;
				options.finetune.x += x;
				options.finetune.y += y;
				options.finetune.x = -(options.finetune.x);
				options.finetune.y = -(options.finetune.y);

				var ydif = y + options.padding + 2;

				$('<table class="painter_contain" cellspacing="0"><tr><td class="menubar"></td><td class="toolbar" valign="top" rowspan="3"></td></tr><tr><td class="canvas_contain" id="image" valign="top"><div class="canvas"></div></td></tr><tr><td class="statusbar"></td></tr></table>').replaceAll(this);

				var menubar = $('.menubar');
				menubar.css('width',(options.width - 60) + 'px');
				var menus = '<a href="#" class="mitem" id="edit_head">Edit</a><a href="#" class="mitem" id="help_head">Help</a>';
				menubar.append(menus);
				var edit_menu = '<div style="display:none;z-index:1;position:absolute;left:' + (x - 9) + 'px;top:' + (y + 79) + 'px;padding:3px;background:white;border:solid 1px #aaaaaa;width:100px;" id="edit_menu" class="menu"><a href="javascript:;" onclick="paper.clear()" class="mlink">Clear</a></div>';
				menubar.append(edit_menu);
				var help_menu = '<div style="display:none;z-index:1;position:absolute;left:' + (x + 48 - 16) + 'px;top:' + (y + 79) + 'px;padding:3px;background:white;border:solid 1px #aaaaaa;width:100px;" id="help_menu" class="menu"><a href="#" class="mlink" id="about_link">About</a><hr><a href="javascript:;" class="mlink" onclick="window.open(\'http://github.com/huntercoding/painter\',\'git\')">Homepage</a></div>';
				menubar.append(help_menu);
				var toolbar = $('.toolbar');
				toolbar.css('height',options.height + 'px');
				var a = '<table cellspacing="0" height="100%"><tr><td valign="top" class="tools_contain"></td></tr><tr><td valign="bottom" class="colors_contain" align="center"></td></tr></table>';
				toolbar.append(a);

				var tools = '<table cellspacing="3"><tr>';
				var tcount = 0;
				if(options.tools.pencil == true){tools += '<td class="tool" style="background:url(painter/images/pencil.png) no-repeat;border:solid 1px #c0c0c0;" onclick="painter_tool=\'pencil\';$(\'.tool\').css(\'border\',\'none\');$(this).css(\'border\',\'solid 1px #c0c0c0\')"></td>';tcount++;}
				if(tcount == 2){tcount = 0;tools += '</tr><tr>';}
				if(options.tools.erase == true){tools += '<td class="tool" style="background:url(painter/images/erase.png) no-repeat;" onclick="painter_tool=\'erase\';$(\'.tool\').css(\'border\',\'none\');$(this).css(\'border\',\'solid 1px #c0c0c0\')"></td>';tcount++;}
				if(tcount == 2){tcount = 0;tools += '</tr><tr>';}
				if(options.tools.line == true){tools += '<td class="tool" style="background:url(painter/images/line.png) no-repeat;" onclick="painter_tool=\'line\';$(\'.tool\').css(\'border\',\'none\');$(this).css(\'border\',\'solid 1px #c0c0c0\')"></td>';tcount++;}
				if(tcount == 2){tcount = 0;tools += '</tr><tr>';}
				if(options.tools.box == true){tools += '<td class="tool" style="background:url(painter/images/box.png) no-repeat;" onclick="painter_tool=\'rect\';$(\'.tool\').css(\'border\',\'none\');$(this).css(\'border\',\'solid 1px #c0c0c0\')"></td>';tcount++;}
				if(tcount == 2){tcount = 0;tools += '</tr><tr>';}
				if(options.tools.circle == true){tools += '<td class="tool" style="background:url(painter/images/circle.png) no-repeat;" onclick="painter_tool=\'circle\';$(\'.tool\').css(\'border\',\'none\');$(this).css(\'border\',\'solid 1px #c0c0c0\')"></td>';tcount++;}
				tools += '</tr></table>';
				$('.tools_contain').append(tools);

				var colors = '<table cellspacing="0"><tr><td><div id="color1"><div class="colorf"></div></div><div id="color2"><div class="colorf"></div></div><div class="swap"></div><div class="default"></div></td></tr></table>';
				$('.colors_contain').append(colors);
				$('.colors_contain').css('padding-bottom','5px');
				$('#color1').css('background',painter_fcolor);
				$('#color2').css('background',painter_bcolor);

				var canvasc = $('.canvas_contain');
				canvasc.css('width',(options.width - 50) + "px");
				canvasc.css('height',(options.height - 64) + "px");

				var cover = '<div class="cover"></div>';
				canvasc.append(cover);
				cover = $('.cover');
				cover.css('position','absolute');
				cover.css('z-index',0);
				cover.css('left',x - 8);
				cover.css('top',y + 81);
				cover.css('width',(options.width - 50) + "px");
				cover.css('height',(options.height - 64) + "px");

				paper = Raphael(document.getElementById('image'),(options.width - 50),(options.height - 64));

				var status = $('.statusbar');
				status.css('width',(options.width - 60) + 'px');
				var xy = '<span class="xy">x: 0px, y:0px</span>';
				status.append(xy);

				var draw = false;
				var shape;
				var len;
				var dstring = "";
				var stat;
				var baseX;
				var baseY;
				var moveX;
				var moveY;

				$('.cover').mousedown(function(e){
					if(cover_open==false){
                        		if(painter_tool == "pencil"){
							draw = true;
							dstring = "M" + (e.pageX + options.finetune.x) + " " + (e.pageY + options.finetune.y - .5) + " L" + (e.pageX + options.finetune.x - .5) + " " + (e.pageY + options.finetune.y);
							shape = paper.path(dstring);
							shape.attr("fill","none");
							shape.attr("stroke",painter_fcolor);
							shape.attr("stroke-width","1");
						}
						if(painter_tool == "erase"){
							draw = true;
							dstring = "M" + (e.pageX + options.finetune.x - .5) + " " + (e.pageY + options.finetune.y - .5) + " L" + (e.pageX + options.finetune.x) + " " + (e.pageY + options.finetune.y);
							shape = paper.path(dstring);
							shape.attr("fill","none");
							shape.attr("stroke",painter_bcolor);
							shape.attr("stroke-width","4");
						}
						if(painter_tool == "circle"){
							draw = true;
							shape = paper.circle((e.pageX + options.finetune.x),(e.pageY + options.finetune.y),0);
							shape.attr("fill","none");
							shape.attr("stroke",painter_fcolor);
							shape.attr("stroke-width",1);
						}
						if(painter_tool == "rect"){
							draw = true;
							shape = paper.rect((e.pageX + options.finetune.x),(e.pageY + options.finetune.y),(e.pageX + options.finetune.x),(e.pageY + options.finetune.y));
							shape.attr("fill","none");
							shape.attr("stroke",painter_fcolor);
							shape.attr("stroke-width",1);
						}
						if(painter_tool == "line"){
							draw = true;
							baseX = (e.pageX + options.finetune.x);
							baseY = (e.pageY + options.finetune.y);
							shape = paper.path("M" + baseX + " " + baseY + " L" + baseX + " " + baseY);
							shape.attr({fill:"none",stroke:painter_fcolor});
						}
					}
				}).mouseup(function(e){
                        	if(painter_tool == "pencil"){
						draw = false;
					}
					if(painter_tool == "erase"){
						draw = false;
					}
					if(painter_tool == "circle"){
						draw = false;
						len.remove();
					}
					if(painter_tool == "rect"){
						draw = false;
					}
					if(painter_tool == "line"){
						draw = false;
					}
				}).mousemove(function(e){
                        	if(painter_tool == "pencil"){
						if(draw == true){
							e.preventDefault();
							dstring += " L" + (e.pageX + options.finetune.x) + " " + (e.pageY + options.finetune.y);
							shape.attr("path",dstring);
						}
					}
					if(painter_tool == "erase"){
						if(draw == true){
							e.preventDefault();
							dstring += " L" + (e.pageX + options.finetune.x) + " " + (e.pageY + options.finetune.y);
							shape.attr("path",dstring);
						}
					}
					if(painter_tool == "circle"){
						if(draw == true){
							e.preventDefault();
							if(len){
								len.remove();
							}
							len = paper.path("M" + shape.attr("cx") + " " + shape.attr("cy") + " L" + (e.pageX + options.finetune.x) + " " + (e.pageY + options.finetune.y));
							shape.attr("r",len.getTotalLength());
						}
					}
					if(painter_tool == "rect"){
						if(draw == true){
							e.preventDefault();
							shape.attr("width",((e.pageX + options.finetune.x) - shape.attr("x")));
							shape.attr("height",((e.pageY + options.finetune.y) - shape.attr("y")));
						}
					}
					if(painter_tool == "line"){
						if(draw == true){
							e.preventDefault();
							moveX = (e.pageX + options.finetune.x);
							moveY = (e.pageY + options.finetune.y);
							shape.attr("path","M" + baseX + " " + baseY + " L" + moveX + " " + moveY);
						}
					}
					$('.xy').html("x:" + (e.pageX + options.finetune.x) + "px, y:" + (e.pageY + options.finetune.y) + "px");
				});

				$('#color1').click(function(e){
					if(cover_open == false){
						cover_open = true;
						$('.cover').css('background-color','#f0f0f0');
						$('.cover').append('<div id="picker"></div><input type="hidden" id="return" value="color1"><input type="hidden" id="color" value="" onchange="$(\'#color1\').css(\'background-color\',$(this).val())">');
						var a = $.farbtastic('#picker',function(color){$('#color').val(color);}).setColor(painter_fcolor);
						$('.cover').append('<input type="button" value="&nbsp;&nbsp;Set&nbsp;&nbsp;" onclick="set_color($(\'#color\'),\'color1\')"> <input type="button" value="Cancel" onclick="cancel_color()">');
					}
				});
				$('#color2').click(function(e){
					if(cover_open == false){
						cover_open = true;
						$('.cover').css('background-color','#f0f0f0');
						$('.cover').append('<div id="picker"></div><input type="hidden" id="return" value="color2"><input type="hidden" id="color" value="" onchange="$(\'#color2\').css(\'background-color\',this.value)">');
						var a = $.farbtastic('#picker',function(color){$('#color').val(color);}).setColor(painter_bcolor);
						$('.cover').append('<input type="button" value="&nbsp;&nbsp;Set&nbsp;&nbsp;" onclick="set_color($(\'#color\'),\'color2\')"> <input type="button" value="Cancel" onclick="cancel_color()">');
					}
				});
				$('.swap').click(function(e){
					if(cover_open == false){
						var a = painter_fcolor;
						var b = painter_bcolor;
						painter_fcolor = b;
						painter_bcolor = a;
						$('#color1').css('background-color',b);
						$('#color2').css('background-color',a);
					}
				});
				$('.default').click(function(e){
					if(cover_open == false){
						painter_fcolor = "#000000";
						painter_bcolor = "#ffffff";
						$('#color1').css('background-color','#000000');
						$('#color2').css('background-color','#ffffff');
					}
				});
				$('#edit_head').mouseenter(function(e){
					menu_open = true;
					$('#edit_menu').show();
					$('#help_menu').hide();
				});
				$('#help_head').mouseenter(function(e){
					menu_open = true;
					$('#help_menu').show();
					$('#edit_menu').hide();
				});
				$('.toolbar').mouseenter(function(e){
					menu_open = false;
					$('#help_menu').hide();
					$('#edit_menu').hide();
				});
				$('.cover').mouseenter(function(e){
					menu_open = false;
					$('#help_menu').hide();
					$('#edit_menu').hide();
				});
				$('.cover').mouseleave(function(e){
					if(shape){
						shape = "";
						draw = false;
					}
				});
				$(document).keypress(function(e){
					if((painter_tool == "circle" || painter_tool == "rect" || painter_tool == "line") && draw == true && e.which == 13){
						shape = "";
						draw = false;
					}
				});
				$('#about_link').click(function(){
					if(cover_open == false){
						cover_open = true;
						$('.cover').css('background-color','#f0f0f0');
						$('.cover').css('padding','5px');
						$('.cover').append('<h2>About</h2><b>Version:</b> 1.0<br>');
						$('.cover').append('<b>Creator:</b> Hunter Parmley<br>');
						$('.cover').append('<b>Author Page:</b> <a href="http://huntercoding.com">HunterCoding</a><br>');
						$('.cover').append('<b>Dev Page:</b> <a href="http://github.com/huntercoding/painter">Painter</a><br><br>');
						$('.cover').append('<input type="button" value="Close" onclick="close_about()">');
					}
				});
			});
	};
})(jQuery);
