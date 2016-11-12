var fs=require("fs");   
//写入文件utf-8
function writeFile(fileName,data)
{ 
	fs.writeFile(fileName,data,'utf-8',complete);
	function complete()
	{
		console.log("文件生成成功");
	} 
}
//遍历读取文件
function readFile(path)
{
	files = fs.readdirSync(path);//需要用到同步读取
	files.forEach(walk);

	var box=[];
	function walk(file)
	{ 
		var da =fs.readFileSync(path+'/'+file,"utf-8");
		//var dax='var '+file+'=['+da.toString().split('\n')+']'
		var dax= parseLyric(da);
		writeFile(path+'/'+file+".js",'var '+file.replace('.lrc','')+'=['+dax+']');
	}
}
readFile("./lrc");//读文件夹下所有文件，生成js歌词

function parseLyric(text) {
	//将文本分隔成一行一行，存入数组
	var lines = text.split('\n'),
	    //匹配时间的正则，匹配结果[xx:xx.xx]
	    pattern = /\[\d{2}:\d{2}.\d{2}\]/g,
	    //保存最终结果的数组
	    result = [];
	//去掉不含时间的行
	while (!pattern.test(lines[0])) {
	    lines = lines.slice(1);
	};
	//上面用'\n'生成生成数组时，结果中最后一个为空元素，这里将去掉
	lines[lines.length - 1].length === 0 && lines.pop();
	lines.forEach(function(v,i) {
	    //提取出时间[xx:xx.xx]
	    var time = v.match(pattern),
	    //提取歌词
	    value = v.replace(pattern, '');
	    if (Object.prototype.toString.call(time)==='[object Array]') {
	    	var t = time[0].split(':');
	    	result.push("["+[parseInt(t[0].replace('[',''), 10)*60+parseFloat(t[1].replace(']','')), '\"'+value.replace('\r','').replace('/\"/g','').replace('/\'/g','').replace('/\W/g','')+'\"']+"]");
	    }
	});
	console.log(result);
	return result;
}
 
