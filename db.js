//数据库操作对象
var localDatabase = {};
var dbName = 'NewsDB';
localDatabase.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

//输出数据库
function dele(){
	var deleteDbRequest = localDatabase.indexedDB.deleteDatabase(dbName);
}
//初始化数据库的方法,fn 回调函数
function initDatabase(schemas,fn){
	//创建或打开数据库
	var openRequest  = localDatabase.indexedDB.open(dbName,1);
	openRequest.onerror = function(e){
		console.log('数据库创建失败'+e.target.errorCode);
	};
	openRequest.onsuccess = function(){
		console.log('数据库创建成功');
		localDatabase.db = openRequest.result;
		fn();

	};
	//创建数据库对象后，创建表
	openRequest.onupgradeneeded = function(evt){
		for(var key in schemas){
			var newsStore = evt.currentTarget.result.createObjectStore(key,{keyPath:"id",autoIncrement:true});
			newsStore.createIndex("urlIndex","url",{unique:true});
			newsStore.createIndex("idIndex","id",{unique:true});
		}
	}
}
function addNews(tablename,data,fn){
	var count = data.length;
	for(var i=0;i<data.length;i++){
		addItem(tablename,data[i],function(){
			count--;
			if(count==0){
				//整体操作完成
				fn();
			}
		});
	}
}
function addItem(tablename,data,fn){
	var transaction= null;
	var store = null;
	transaction = localDatabase.db.transaction(tablename,"readwrite");
	store = transaction.objectStore(tablename);
	var request = store.add(data);
	request.onsuccess = function  (evt) {
	}
	//事物完成
	transaction.oncomplete = function(){
		fn();
	};
	//事物回滚
	transaction.onabort = function(){
		fn();
	}
}
function queryMax(tablename,fn){
	var transaction =null;
	var store = null;
	transaction = localDatabase.db.transaction(tablename,"readwrite");
	store = transaction.objectStore(tablename);
	var request = store.index("idIndex").openCursor(null,"prevunique");
	request.onsuccess = function(evt){
		var cursor = evt.target.result;
		if(cursor){
			fn(cursor.key);
		}
	}
}
//分页
function fetchNew(tablename,begin,pagecount,fn){
	var transaction =null;
	var store = null;
	var result=[];//检索结果
	transaction = localDatabase.db.transaction(tablename,"readwrite");
	store = transaction.objectStore(tablename);
	var ranges =window.IDBKeyRange.bound(begin-pagecount+1,begin,false,false);
	var request = store.index("idIndex").openCursor(ranges,"prevunique");
	request.onsuccess=function(evt){
		var cursor=evt.target.result;
		if(cursor){
			result.push(cursor.value);
			cursor.continue();//游标指向下一条记录
		}
		else{
			fn(result);
		}
	}
}
