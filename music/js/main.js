//一些工具函数
/**
 * @param DOM
 * @return 距离页面左边距离
 */
function getElementLeft(element){
　　var actualLeft = element.offsetLeft;
　　var current = element.offsetParent;
　　while (current !== null){
　　　　actualLeft += current.offsetLeft;
　　　　current = current.offsetParent;
　　}
　　return actualLeft;
}
/**
 * @param DOM
 * @return 距离页面顶部距离
 */
function getElementTop(element){
　　var actualTop = element.offsetTop;
　　var current = element.offsetParent;
　　while (current !== null){
　　　　actualTop += current.offsetTop;
　　　　current = current.offsetParent;
　　}
　　return actualTop;
}
/**
 * 简易选择器
 * @param {String} 
 * @return 选到的元素
 */
function getDOM(dom){
	return document.querySelector(dom);
}
/**
 * 格式化时间 (不考虑大于1h的)
 * @param {number} 
 * @return x:xx
 */
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
var audioPlayer={//主体
	d:document.documentElement || document.body,
	//相关元素获取
	mainAudia:getDOM('#mainAudia'),//audio
	listsbt:getDOM('#listsbt'),
	lists:getDOM('.side'),//列表
	text:getDOM('.text'),//歌词父元素
	bg:getDOM('.main_bg'),//大背景
	music_name:getDOM('.music_info1'),//歌曲名
	time_now:getDOM('.time_now'),//当前播放时间
	time_all:getDOM('.time_all'),//总时间
	prev_b:getDOM('.prev'),//上
	next_b:getDOM('.next'),//下
	stop_b:getDOM('.stop'),//暂停
	play_type_b:getDOM('.play_type'),//播放模式按钮

	jd_col_bar:getDOM('.jd_col_bar'),//进度控制点
	jd_info:getDOM('.jd_info'),//进度条背景
	jd_now_bar:getDOM('.jd_now_bar'),//进度条进度

	sound:getDOM('.sound'),//喇叭按钮
	sound_bar:getDOM('.sound_bar'),//声音父元素
	sound_now_bar:getDOM('.now_bar'),//声进度条进度
	col_bar:getDOM('.col_bar'),//音控制点


	//相关变量设置
	data:'',
	is_mute:false,//是否静音
	serial:0,//第几首
	stop_key:false,//是否在暂停
	play_type:1,//1顺序循环 2单曲循环 3 随机播放

	lines:0,//当前歌曲的歌词行数
	is_drag_progress:false,//是否在拖动进度条
	init:function(da){
		this.data=da;
		this.listshow();//展示歌曲列表
		this.addMisic();//填充歌曲列表
		this.change(this.serial);//切歌函数 切到第一首
		this.addButtonFuc();//按钮功能
	},
	listshow:function(){//歌曲列表显示按钮
		var This=this;
		This.listsbt.onchange=function(){
			if (this.checked==true) {
				This.lists.style.cssText='left:0;';
				This.text.style.cssText = 'width:60%;left:40%;';
			}else{
				This.lists.style.cssText='left:-50%;';
				This.text.style.cssText = 'width:100%;left:0;';
			}
			
		}
	},
	jd_col:function(){//进度条拖动
		var This=this;
		This.jd_col_bar.onmousedown=function(e){//拖动方式
			var e=e || event,
			x=e.pageX-getElementLeft(This.jd_info);
			This.is_drag_progress=true;
			console.log(x);
			This.d.onmousemove=function(e){
				x=e.pageX-getElementLeft(This.jd_info);
				if (x<0) x=0;
				if (x>This.jd_info.offsetWidth) x=This.jd_info.offsetWidth;
				This.jd_col_bar.style.left=x+'px';
				This.jd_now_bar.style.width=x+"px";
				console.log(x)
			}
			This.d.onmouseup=function(e){
				This.d.onmousemove=null;
				This.is_drag_progress=false;
				var tuodong_per=(x/This.jd_info.offsetWidth).toFixed(3);//算拖动百分比
				//alert(tuodong_per)
				This.js_jump(tuodong_per);//进度跳转函数
			}

		}
		This.jd_info.onclick=function(e){
			var e=e || event,
			x=e.pageX-getElementLeft(This.jd_info);
			var tuodong_per=(x/This.jd_info.offsetWidth).toFixed(3);//算拖动百分比
			//alert(tuodong_per)
			This.js_jump(tuodong_per);//进度跳转函数
		}
	},
	js_jump:function(jxd){//进度跳转
		var This=this;
		var miao=Math.ceil(This.mainAudia.duration*jxd);
		This.mainAudia.currentTime=miao;
	},
	addMisic:function(){//填充歌曲列表
		var This=this,docF='';
		This.data.forEach(function(e,i){		
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
		This.lists.ondblclick=function(e){//事件委托
			var e=e||event,target = e.target||e.srcElement,dom_=target.parentNode.parentNode,ind;
			if(dom_.nodeName.toUpperCase()==='LI'){
				ind=Number(dom_.getAttribute('ind'));
				if (This.serial!==ind) This.change(ind);
			}
		}
	},
	change:function(par){//切歌
		console.log(par);
		var This=this,
		mus=This.data[par],//取到要播放的
		icon=This.lists.querySelectorAll('.icon_play');//给正在播放的加上动效
		Array.prototype.forEach.call(icon,function(e,i){
			e.classList.remove('icon_play_now');
		})
		Array.prototype.forEach.call(icon,function(e,i){
			if(i===par){
				e.classList.add('icon_play_now');
			}
		})
		This.serial=par;//改变当前曲目num
		This.stop_key=false;//初始化暂停状态为false
		This.stop_b.classList.remove('stop2'); //初始化暂停按钮状态
		This.music_name.innerHTML=mus.name+' - '+mus.singer;//改歌名
		This.bg.style.background='url('+mus.pic+') no-repeat center';//改背景
		This.bg.style.backgroundSize='cover';
		This.mainAudia.src=mus.src_;//地址
        This.mainAudia.addEventListener('error', function(e){
        	throw new Error('错误');
        }, false);
        var check=setInterval(function(){
        	if (This.mainAudia.readyState===4) {//检测到播放状态为4的时候 开启各类监听 并取消定时器
        		clearInterval(check);
        		This.mainAudia.play();//播放
		        This.time_all.innerHTML=formatTime( parseInt(This.mainAudia.duration) );//设置总时间
        		This.listen();//开启监听
        	}
        },50)
	},
	listen:function(){//播放监听
		var This=this,jd_nowx;
		This.mainAudia.ontimeupdate = function(e) {//播放时间更新监听
			This.time_now.innerHTML=formatTime( parseInt(This.mainAudia.currentTime) );//更新时间

			if (!This.is_drag_progress) {//是否拖动了进度条
				jd_nowx=(This.mainAudia.currentTime/This.mainAudia.duration).toFixed(3);//播放百分比
				//console.log(jd_nowx);
				var left_jd_b=Math.ceil(This.jd_info.offsetWidth*jd_nowx);//算left
				This.jd_col_bar.style.left=left_jd_b+"px";
				This.jd_now_bar.style.width=left_jd_b+"px";
			}
		}
		//This.mainAudia.currentTime=198; //播放时间跳转
        This.mainAudia.addEventListener('ended',zhong,false);  //播放结束
        function zhong(){     
            This.endJudge();//结束判断函数 根据播放模式来决定 下一首放什么
            //执行下一曲判断之后 取消监听事件 不然ended事件会翻倍执行 巨坑！！！
            This.mainAudia.removeEventListener('ended',zhong,false);
        }
	},
	endJudge:function(){
		var This=this;
		if (This.play_type===1) {//顺序  直接下一曲
			This.serial++;
			if ( This.serial>(This.data.length-1) ) {
				This.serial=0;
			}
			This.change(This.serial);
		}
		else if (This.play_type===3) {//随机 随机一首出来  但不能是当前这首
			console.error(This.serial);
			
			function ram(){//根据长度递归随机出歌曲编号
				var dra=Math.floor( ( Math.random()*This.data.length ) );
				//只有一首歌 返回0 、大于一首 返回除当前这首的随机曲目
				return This.data.length===1 ? 0 : dra===This.serial ? ram() : dra;
			}
			var myRam=ram();
			This.change(myRam);
		}
	},
	creatText:function(){//创建歌词

	},
	addButtonFuc:function(){//添加按钮功能
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
		This.jd_col();//进度拖动
		This.sound_col();//声音拖动
	},
	sound_col:function(){//声音控制 （还有bug 拖到静音 再点喇叭 没声音）
		var This=this,x=100,s=1,key=false;
		This.col_bar.onmousedown=function(e){
			var e=e || event;
			x=e.pageX-getElementLeft(This.jd_info);
			This.d.onmousemove=function(e){
				var e=e || event;
				x=e.pageX-getElementLeft(This.sound_bar);
				if (x<0) x=0;
				if (x>This.sound_bar.offsetWidth) x=This.sound_bar.offsetWidth;
				//console.log(x);
				if(This.mainAudia.volume===0 && x===0 && !key){This.sound.click();key=!key;} 
				if (x>0 && key) {This.sound.click();key=!key;}
				if (x>This.sound_bar.offsetWidth) x=This.sound_bar.offsetWidth;
				This.col_bar.style.left=x+'px';
				This.mainAudia.volume=s=x/This.sound_bar.offsetWidth;
				This.sound_now_bar.style.width=x+'px';
			}
			This.d.onmouseup=function(e){
				This.d.onmousemove=null;
			}
		}
		This.sound_bar.onclick=function(e){//直接点击的+-方式
			x=e.pageX-getElementLeft(This.sound_bar);
			if (x<0) x=0;
			This.col_bar.style.left=x+'px';
			This.mainAudia.volume=s=x/This.sound_bar.offsetWidth;
			This.sound_now_bar.style.width=x+'px';
			if(This.mainAudia.volume===0 && !key){This.sound.click();key=!key;} 
			if (x>0 && key) {This.sound.click();key=!key;}
		}
		This.sound.onclick=function(){
			if(!This.is_mute){
				This.mainAudia.volume=0;
				This.sound_now_bar.style.width='0px';
				This.col_bar.style.left='0px';
				This.sound.classList.add('jingyin');
			}else{
				This.mainAudia.volume=s;
				This.sound_now_bar.style.width=x+'px';
				This.col_bar.style.left=x+'px';
				This.sound.classList.remove('jingyin');
			}
			This.is_mute=!This.is_mute;
		}
	},
	prev:function(){//上一首
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
	next:function(){//下一首
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
	change_play_type:function(){//播放模式切换
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
/*autoplay	设置或返回是否在就绪（加载完成）后随即播放音频。
currentTime	设置或返回音频中的当前播放位置（以秒计）。
defaultMuted	设置或返回音频默认是否静音。
duration	返回音频的长度（以秒计）。
ended	返回音频的播放是否已结束。
error	返回表示音频错误状态的 MediaError 对象。
loop	设置或返回音频是否应在结束时再次播放。
muted	设置或返回是否关闭声音。
paused	设置或返回音频是否暂停。
readyState	返回音频当前的就绪状态。
src	设置或返回音频的 src 属性的值。
volume	设置或返回音频的音量。*/
/*方法	描述
play()	开始播放音频。
pause()	暂停当前播放的音频。*/
var MusicData=[
	{
		'name':'威风堂堂',
		'singer':'祈Inory',
		'pic':'./images/weifengtangtang.jpg',
		'src_':'./audio/威风堂堂.mp3',
		'text':''
	},
	{
		'name':'极乐净土',
		'singer':'未知',
		'pic':'./images/jilejingtu.jpg',
		'src_':'./audio/极乐净土.mp3',
		'text':''
	},
	{
		'name':'演员',
		'singer':'李荣浩',
		'pic':'./images/yanyuan.jpg',
		'src_':'./audio/yanyuan.mp3',
		'text':''
	},
	{
		'name':'Moves Like Jagger',
		'singer':'Maroon 5',
		'pic':'./images/MovesLikeJagger.jpg',
		'src_':'./audio/Moves Like Jagger.mp3',
		'text':''
	},
	{
		'name':'Firework',
		'singer':'Katy Perry',
		'pic':'./images/firework.jpg',
		'src_':'./audio/firework.mp3',
		'text':''
	},
	{
		'name':'威风堂堂',
		'singer':'祈Inory',
		'pic':'./images/weifengtangtang.jpg',
		'src_':'./audio/威风堂堂.mp3',
		'text':''
	},
	{
		'name':'极乐净土',
		'singer':'未知',
		'pic':'./images/jilejingtu.jpg',
		'src_':'./audio/极乐净土.mp3',
		'text':''
	},
	{
		'name':'演员',
		'singer':'李荣浩',
		'pic':'./images/yanyuan.jpg',
		'src_':'./audio/yanyuan.mp3',
		'text':''
	},
	{
		'name':'Moves Like Jagger',
		'singer':'Maroon 5',
		'pic':'./images/MovesLikeJagger.jpg',
		'src_':'./audio/Moves Like Jagger.mp3',
		'text':''
	},
	{
		'name':'Firework',
		'singer':'Katy Perry',
		'pic':'./images/firework.jpg',
		'src_':'./audio/firework.mp3',
		'text':''
	},
	{
		'name':'威风堂堂',
		'singer':'祈Inory',
		'pic':'./images/weifengtangtang.jpg',
		'src_':'./audio/威风堂堂.mp3',
		'text':''
	},
	{
		'name':'极乐净土',
		'singer':'未知',
		'pic':'./images/jilejingtu.jpg',
		'src_':'./audio/极乐净土.mp3',
		'text':''
	},
	{
		'name':'演员',
		'singer':'李荣浩',
		'pic':'./images/yanyuan.jpg',
		'src_':'./audio/yanyuan.mp3',
		'text':''
	},
	{
		'name':'演员',
		'singer':'李荣浩',
		'pic':'./images/yanyuan.jpg',
		'src_':'./audio/yanyuan.mp3',
		'text':''
	},
	{
		'name':'演员',
		'singer':'李荣浩',
		'pic':'./images/yanyuan.jpg',
		'src_':'./audio/yanyuan.mp3',
		'text':''
	},


]
audioPlayer.init(MusicData);