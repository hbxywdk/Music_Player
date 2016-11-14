function getElementLeft(element){
　　var actualLeft = element.offsetLeft;
　　var current = element.offsetParent;
　　while (current !== null){
　　　　actualLeft += current.offsetLeft;
　　　　current = current.offsetParent;
　　}
　　return actualLeft;
}
function getElementTop(element){
　　var actualTop = element.offsetTop;
　　var current = element.offsetParent;
　　while (current !== null){
　　　　actualTop += current.offsetTop;
　　　　current = current.offsetParent;
　　}
　　return actualTop;
}
function getDOM(dom){
	return document.querySelector(dom);
}
function formatTime(t){
	var arg;
	if (t<0) return;
	if (t<10) {
		arg='0:0'+t;
	}
	else if (t<60) {
		arg='0:'+t;
	}
	else if(t>=60){
		var fen=parseInt(t/60),
		miao=t%60;
		if (miao<10) miao='0'+miao;
		arg=fen+':'+miao
	}
	return arg;
}
var audioPlayer={
	mainAudia:getDOM('#mainAudia'),
	listsbt:getDOM('#listsbt'),
	lists:getDOM('.side'),
	bg:getDOM('.main_bg'),
	music_name:getDOM('.music_info1'),
	time_now:getDOM('.time_now'),
	time_all:getDOM('.time_all'),
	prev_b:getDOM('.prev'),
	next_b:getDOM('.next'),
	stop_b:getDOM('.stop'),
	play_type_b:getDOM('.play_type'),
	jd_col_bar:getDOM('.jd_col_bar'),
	jd_info:getDOM('.jd_info'),
	jd_now_bar:getDOM('.jd_now_bar'),
	sound:getDOM('.sound'),
	sound_bar:getDOM('.sound_bar'),
	sound_now_bar:getDOM('.now_bar'),
	col_bar:getDOM('.col_bar'),
	text:getDOM('.text'),
	myword:getDOM('#myword'),
	change_line:getDOM('.change_line'),
	myword_top:0,
	inDrag:false,
	data:'',
	is_mute:false,
	serial:0,
	stop_key:false,
	play_type:1,
	lines:0,
	is_drag_progress:false,
	init:function(da){
		this.data=da;
		this.listshow();
		this.addMisic();
		this.change(this.serial);
		this.addButtonFuc();
		this.winChange();
	},
	winChange:function(){
		var This=this,TO,yeye;
		This.change_line.style.width=This.text.offsetWidth+'px';
		yeye=Math.ceil( This.text.offsetHeight/2 );
		This.change_line.style.top=yeye+'px';
		window.onresize=function(){
			clearTimeout(TO);
			TO=setTimeout(function(){
				This.change_line.style.width=This.text.offsetWidth+'px';
				yeye=Math.ceil( This.text.offsetHeight/2 );
				This.change_line.style.top=yeye+'px';
			},100)
		}
	},
	listshow:function(){
		var This=this;
		This.listsbt.onchange=function(){
			if (this.checked==true) {
				This.lists.style.cssText='left:0;';
				This.text.style.cssText = 'width:60%;left:40%;';
			}else{
				This.lists.style.cssText='left:-50%;';
				This.text.style.cssText = 'width:100%;left:0;';
			}
			setTimeout(function(){
				This.change_line.style.width=This.text.offsetWidth+'px';
			},300)
		}
	},
	js_jump:function(jxd){
		var This=this;
		var miao=Math.ceil(This.mainAudia.duration*jxd);
		This.mainAudia.currentTime=miao;
	},
	addMisic:function(){
		var This=this,docF='';
		This.data.forEach(function(e,i){
			var img=new Image();img.src=e.pic;
			docF+='<li ind='+i+'>\
					<div class="tit">\
						<div class="w70 fl ell">\
							'+e.name+'\
							<span class="fr icon_play">\
								<div class="three_line">\
									<div class="three_line_all three_line_1"></div>\
									<div class="three_line_all three_line_2"></div>\
									<div class="three_line_all three_line_3"></div>\
								</div>\
							</span>\
						</div>\
						<div class="w30 fl ell">\
							'+e.singer+'\
						</div>\
					</div>\
				   </li>';
		});
		This.lists.getElementsByTagName('ul')[0].innerHTML=docF;
		This.lists.ondblclick=function(e){
			var e=e||event,target = e.target||e.srcElement,dom_=target.parentNode.parentNode,ind;
			if(dom_.nodeName.toUpperCase()==='LI'){
				ind=Number(dom_.getAttribute('ind'));
				if (This.serial!==ind) This.change(ind);
			}
		}
	},
	change:function(par){
		var This=this,
		mus=This.data[par],
		icon=This.lists.querySelectorAll('.icon_play');
		Array.prototype.forEach.call(icon,function(e,i){
			e.classList.remove('icon_play_now');
		})
		Array.prototype.forEach.call(icon,function(e,i){
			if(i===par){
				e.classList.add('icon_play_now');
			}
		})
		This.serial=par;
		This.myword_top=This.myword.style.marginTop=0;
		This.creatText(mus.text);
		This.stop_key=false;
		This.stop_b.classList.remove('stop2');
		This.music_name.innerHTML=mus.name+' - '+mus.singer;
		This.bg.style.background='url('+mus.pic+') no-repeat center';
		This.bg.style.backgroundSize='cover';
		This.mainAudia.src=mus.src_;
        This.mainAudia.addEventListener('error', function(e){
        	throw new Error('错误');
        }, false);
        var check=setInterval(function(){
        	if (This.mainAudia.readyState===4) {
        		clearInterval(check);
        		This.mainAudia.play();
		        This.time_all.innerHTML=formatTime( parseInt(This.mainAudia.duration) );
        		This.listen(mus.text);
        	}
        },50)
	},
	creatText:function(text){
		var This=this,word='';
		//alert(text)
		text.forEach(function(e,i){
			word+='<li>'+e[1]+'</li>';
		})
		This.myword.innerHTML=word;
		This.drag_word();
	},
	jd_col:function(){
		var This=this;
		This.jd_col_bar.onmousedown=function(e){
			var e=e || event,
			x=e.pageX-getElementLeft(This.jd_info);
			This.is_drag_progress=true;
			document.onmousemove=function(e){
				x=e.pageX-getElementLeft(This.jd_info);
				if (x<0) x=0;
				if (x>This.jd_info.offsetWidth) x=This.jd_info.offsetWidth;
				This.jd_col_bar.style.left=x+'px';
				This.jd_now_bar.style.width=x+"px";
			}
			document.onmouseup=function(e){
				document.onmousemove=null;
				if(This.is_drag_progress){
					var tuodong_per=(x/This.jd_info.offsetWidth).toFixed(3);
					This.js_jump(tuodong_per);
					This.is_drag_progress=false;
				}
			}
		}
		This.jd_info.onclick=function(e){
			var e=e || event,
			x=e.pageX-getElementLeft(This.jd_info);
			var tuodong_per=(x/This.jd_info.offsetWidth).toFixed(3);
			This.js_jump(tuodong_per);
		}
	},
	listen:function(text){
		var This=this,jd_nowx;
		This.mainAudia.ontimeupdate = function(e) {
			This.time_now.innerHTML=formatTime( parseInt(This.mainAudia.currentTime) );
			if (!This.is_drag_progress) {
				jd_nowx=(This.mainAudia.currentTime/This.mainAudia.duration).toFixed(3);
				var left_jd_b=Math.ceil(This.jd_info.offsetWidth*jd_nowx);
				This.jd_col_bar.style.left=left_jd_b+"px";
				This.jd_now_bar.style.width=left_jd_b+"px";
			}
			if (!This.inDrag) {
				var mywordli=This.myword.querySelectorAll('li');
				for (var i = 0; i < mywordli.length-1; i++) {
					mywordli[i].classList.remove('active');
				}
				var yeye=Math.round(Math.floor( This.text.offsetHeight/mywordli[0].offsetHeight )/2);
				text.forEach(function(e,i){
					if(text[i+1]==null)return;
					if(This.mainAudia.currentTime>e[0]&&This.mainAudia.currentTime<=text[i+1][0]){
						mywordli[i].classList.add('active');
						if (i<yeye) {
							This.myword_top=0;
						}else{
							This.myword_top=(mywordli[0].offsetHeight*(yeye-i))+'px';
						}
						This.myword.style.marginTop=This.myword_top;
					}
				})
			}
		}
        This.mainAudia.addEventListener('ended',zhong,false);
        function zhong(){     
            This.endJudge();
            This.mainAudia.removeEventListener('ended',zhong,false);
        }
	},
	drag_word:function(){
		var This=this;
		This.myword.onmousedown=function(e){
			var e=e||event,t,t2,result;
			This.inDrag=!This.inDrag;
			t=e.pageY;
			t2=parseInt( getComputedStyle(This.myword, null).marginTop );
			This.myword.classList.remove('c3m');
			This.change_line.style.display='block';
			document.onmousemove=function(e){
				var e=e||event,
				cha=e.pageY-t;
				result=t2+cha;
				if ( result>(This.text.offsetHeight/2) ) {
					result=This.text.offsetHeight/2;
				}
				if ( result<(This.text.offsetHeight/2-This.myword.offsetHeight) ) {
					result=This.text.offsetHeight/2-This.myword.offsetHeight;
				}
				This.myword.style.marginTop=result+'px';
			}
			document.onmouseup=function(){
				document.onmousemove=null;
				This.inDrag=!This.inDrag;
				This.myword.classList.add('c3m');
				This.change_line.style.display='none';
				//计算百分比
				var percent=(-(result-(This.text.offsetHeight/2)+34)/This.myword.offsetHeight).toFixed(3);
				if (isNaN(percent)) return;
				console.log(result-This.text.offsetHeight)
				if (percent<0) percent=0;
				console.log(percent)
				This.js_jump(percent);
				document.onmouseup=null;
			}
		}
	},
	endJudge:function(){
		var This=this;
		if (This.play_type===1) {
			This.serial++;
			if ( This.serial>(This.data.length-1) ) {
				This.serial=0;
			}
			This.change(This.serial);
		}
		else if(This.play_type===3) {
			function ram(){
				var dra=Math.floor( ( Math.random()*This.data.length ) );
				return This.data.length===1 ? 0 : dra===This.serial ? ram() : dra;
			}
			var myRam=ram();
			This.change(myRam);
		}
	},
	addButtonFuc:function(){
		var This=this;
		This.prev_b.onclick=function(){
			This.prev();
		}
		This.next_b.onclick=function(){
			This.next();
		}
		This.stop_b.onclick=function(){
			if (!This.stop_key) {
				This.mainAudia.pause();
				This.stop_key=!This.stop_key;
				This.stop_b.classList.add('stop2');  
			}else{
				This.mainAudia.play();
				This.stop_key=!This.stop_key;
				This.stop_b.classList.remove('stop2');  
			}
		}
		This.play_type_b.onclick=function(){
			This.change_play_type();
		}
		This.jd_col();
		This.sound_col();
	},
	sound_col:function(){
		var This=this,x=100,s=1,key=false,key2=false;
		This.col_bar.onmousedown=function(e){
			var e=e || event;
			x=e.pageX-getElementLeft(This.jd_info);
			key2=!key2;
			document.onmousemove=function(e){
				var e=e || event;
				x=e.pageX-getElementLeft(This.sound_bar);
				if (x<0) x=0;
				if(x>100) x=100;
				if (x>This.sound_bar.offsetWidth) x=This.sound_bar.offsetWidth;
				if(This.mainAudia.volume===0 && x===0 && !key && key2){This.sound.click();} 
				if (x>0 && key && key2) {This.sound.click();}
				if (x>This.sound_bar.offsetWidth) x=This.sound_bar.offsetWidth;
				This.col_bar.style.left=x+'px';
				This.mainAudia.volume=s=x/This.sound_bar.offsetWidth;
				This.sound_now_bar.style.width=x+'px';
			}
			document.onmouseup=function(e){
				key2=!key2;
				document.onmousemove=null;
				document.onmouseup=null;
			}
		}
		This.sound_bar.onclick=function(e){
			if (key2) return;
			x=e.pageX-getElementLeft(This.sound_bar);
			if (x<0) {x=0;key2=!key2; };if (x>100) {x=100;};
			This.col_bar.style.left=x+'px';
			This.mainAudia.volume=s=x/This.sound_bar.offsetWidth;
			This.sound_now_bar.style.width=x+'px';
			if(This.mainAudia.volume===0 && !key){This.sound.click();} 
			if (x>0 && key) {This.sound.click();}
		}
		This.sound.onclick=function(){
			if(!This.is_mute){
				This.mainAudia.volume=0;
				This.sound_now_bar.style.width='0px';
				This.col_bar.style.left='0px';
				This.sound.classList.add('jingyin');
			}else{
				if(s===0 && key){s=0.5;x=50;}
				This.mainAudia.volume=s;
				This.sound_now_bar.style.width=x+'px';
				This.col_bar.style.left=x+'px';
				This.sound.classList.remove('jingyin');	
			}
			key=!key;
			This.is_mute=!This.is_mute;
		}
	},
	prev:function(){
		var This=this;
		if(This.play_type===3){
			This.endJudge();
			return;
		}else{
			This.serial--;
			if (This.serial<0) This.serial=This.data.length-1;
			This.change(This.serial);
		}
	},
	next:function(){
		var This=this;
		if(This.play_type===3){
			This.endJudge();
			return;
		}else{
			This.serial++;
			if (This.serial>(This.data.length-1)) This.serial=0;
			This.change(This.serial);
		}
	},
	change_play_type:function(){
		var This=this;
		This.play_type++;
		if (This.play_type<1) This.play_type=3;
		if (This.play_type>3) This.play_type=1;
		if (This.play_type===1) {
			This.play_type_b.classList.add('shunxu');
			This.play_type_b.classList.remove('suiji');
			This.play_type_b.classList.remove('danqu');
			This.mainAudia.loop=false;
		}else if (This.play_type===2) {
			This.play_type_b.classList.add('danqu');
			This.play_type_b.classList.remove('suiji');
			This.play_type_b.classList.remove('shunxu');
			This.mainAudia.loop=true;
		}else if (This.play_type===3) {
			This.play_type_b.classList.add('suiji');
			This.play_type_b.classList.remove('danqu');
			This.play_type_b.classList.remove('shunxu');
			This.mainAudia.loop=false;
		}
	},
};