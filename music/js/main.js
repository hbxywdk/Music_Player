//获取元素left
function getElementLeft(element){
　　var actualLeft = element.offsetLeft;
　　var current = element.offsetParent;
　　while (current !== null){
　　　　actualLeft += current.offsetLeft;
　　　　current = current.offsetParent;
　　}
　　return actualLeft;
}
//获取元素top
function getElementTop(element){
　　var actualTop = element.offsetTop;
　　var current = element.offsetParent;
　　while (current !== null){
　　　　actualTop += current.offsetTop;
　　　　current = current.offsetParent;
　　}
　　return actualTop;
}

var audioPlayer={
	d:document.documentElement || document.body,
	listsbt:document.querySelector('#listsbt'),
	lists:document.querySelector('.side'),
	text:document.querySelector('.text'),
	jd_col_bar:document.querySelector('.jd_col_bar'),//进度控制点
	jd_info:document.querySelector('.jd_info'),//进度条背景
	jd_now_bar:document.querySelector('.jd_now_bar'),//进度条进度
	init:function(){
		this.listshow();
		this.jd_col();
	},
	//歌曲列表显示
	listshow:function(){
		var This=this;
		This.listsbt.onchange=function(){
			if (this.checked==true) {
				This.lists.style.left='0';
				This.text.style.width='60%';
				This.text.style.left='40%';
			}else{
				This.lists.style.left='-50%';
				This.text.style.width='100%';
				This.text.style.left='0';
			}
			
		}
	},
	jd_col:function(){
		var This=this;
		This.jd_col_bar.onmousedown=function(e){
			var e=e || event,
			x=e.pageX-getElementLeft(This.jd_info);
			console.log(x);
			This.d.onmousemove=function(e){
				x=e.pageX-getElementLeft(This.jd_info);
				This.jd_col_bar.style.left=x+'px';
				console.log(x)
			}
			This.d.onmouseup=function(e){
				This.d.onmousemove=null;

			}

		}
	},
	//创建列表
	//创建默认歌曲歌词
};
audioPlayer.init();