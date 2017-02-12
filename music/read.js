var fs=require("fs");   
/**
 * [writeFile 写入最终要生成的文件]
 * @param  {[type]} fileName [文件名]
 * @param  {[type]} data     [内容]
 * @return {[type]}          [void]
 */
function writeFile(fileName,data){ 
	fs.writeFile(fileName,data,'utf-8',complete);
	function complete(){
		console.log("文件生成成功");
	} 
}
/**
 * [readFile 遍历读取文件]
 * @param  {[type]} path [文件夹]
 * @return {[type]}      [void]
 */
function readFile(path){
	files = fs.readdirSync(path);//同步读取
	files.forEach(walk);//遍历path文件夹下文件
	function walk(file){ 
		var da =fs.readFileSync(path+'/'+file,"utf-8");
		var dax= parseLyric(da);
		writeFile(path+'/'+file+".js",'var '+file.replace('.lrc','')+'=['+dax+']');
	}
}
/**
 * [parseLyric 处理.lrc歌词文件]
 * @param  {[type]} text [description]
 * @return {[type]}      [void]
 */
function parseLyric(text){
	//将文本分隔成一行一行，存入数组
	var lines = text.split('\n'),
	    //匹配时间的正则，匹配结果[xx:xx.xx]
	    pattern = /\[\d{2}:\d{2}.\d{2}\]/g,
	    //保存最终结果的数组
	    result = [];
	//循环去掉不含开头时间的行
	while (!pattern.test(lines[0])) {
	    lines = lines.slice(1);
	};
	//用'\n'生成生成数组时，结果中最后一个为空元素，这里去掉
	lines[lines.length - 1].length === 0 && lines.pop();
	lines.forEach(function(v,i) {
	    //提取出时间[xx:xx.xx]
	    var time = v.match(pattern),
	    //提取歌词
	    value = v.replace(pattern, '');
	    if (Object.prototype.toString.call(time)==='[object Array]') {
	    	var t = time[0].split(':');
	    	result.push("["+[parseInt(t[0].replace('[',''), 10)*60+parseFloat(t[1].replace(']','')), '\"'+value.replace(/\r|\"|\'|\-|/g,'')+'\"']+"]");
	    }
	});
	//console.log(result);
	return result;
}

//start
readFile("./lrc");//读文件夹下所有文件，生成js歌词
 
