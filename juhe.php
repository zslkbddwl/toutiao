
<?php
header("Content-Type:application/json;charset=utf-8");
if ($_SERVER["REQUEST_METHOD"] == "GET"){
search();
}
else{
	echo "参数错误";
}  
function search(){
$key="df3e53b3c7d20c8b251979a86c5ea3ce";
$type=$_GET["type"];
$ch = curl_init();  
$timeout = 5;  
curl_setopt ($ch, CURLOPT_URL, 'http://v.juhe.cn/toutiao/index?key=df3e53b3c7d20c8b251979a86c5ea3ce&type='.$type);  
curl_setopt ($ch, CURLOPT_RETURNTRANSFER, 1);  
curl_setopt ($ch, CURLOPT_CONNECTTIMEOUT, $timeout);  
$file_contents = curl_exec($ch);  
curl_close($ch);  
echo $file_contents;
}

?>
