//inject script
var s = document.createElement('script');
s.src = chrome.extension.getURL('js/inject_script.js');
s.onload = function() {
    this.parentNode.removeChild(this);
};
(document.head||document.documentElement).appendChild(s);

//main app
//http://m.aliexpress.com/group/255963063-2052686069-detail.html?fromApp=true&promotionType=GagaGroup&lang=ru
function pingTime() {
	var pingStart = new Date().getTime();
	var helperRequest = new XMLHttpRequest;
	helperRequest.open('GET', 'http://activities.aliexpress.com/get_time_api.php', false);
	helperRequest.send(null);
	if(helperRequest.status == 200) {
		var serverTime = parseInt(helperRequest.responseText)/1000;
		var pingEnd = new Date().getTime();
		return {'ping' : pingEnd-pingStart, 'time' : serverTime};
	}
}

var getParams = {
	'objectId': '',
	'promotionId': '',
	'quantity': 1,
	'countryCode': 'US',
	'skuAttr': ''
};
var params1 = {'fromApp':'true','promotionType':'GagaGroup'};
document.body.addEventListener('formLoaded', function(e) {

	getParams.objectId = e.detail.objectId;
	getParams.promotionId = e.detail.promotionId;
	getParams.skuAttr = e.detail.skuAttr;

    var dealTime = e.detail.dealTime;
    var server = pingTime();
	var timeToDeal = dealTime - server.time;
	var timeInterval = 7;

	//Пингуем в течении N(5) секунд (до начала за timeInterval секунд)
	var synchroTimePre = 0;
	var tempPre = 0;
	var lastPingTime = 0;

	while(timeToDeal <= timeInterval && timeToDeal > (timeInterval-3)){
		server = pingTime();
		timeToDeal = dealTime - server.time;

		//Получаем актуальную секунду
		if(server.time > tempPre){
			synchroTime = (server.time)*1000 - new Date().getTime(); //на сколько локальные часы отстают от серверных
			//Получаем максимальную разницу, которая встретилась
			if(synchroTimePre > synchroTime){
				synchroTime = synchroTimePre;
			}
		}
		tempPre = server.time;
		lastPingTime = server.ping;
	}

	//Обновленный, синхронизированный таймер, получаем актуальное время старта относительно локальных часов
	timeToDeal = (dealTime*1000 - new Date().getTime()) - synchroTime - lastPingTime;

	setTimeout(startBuy,timeToDeal);
	document.body.addEventListener('skuChanged', function(e) {
		getParams.skuAttr = e.detail;
	});
	document.getElementById('helper-buy-button').addEventListener('click', function(e) {
		e.preventDefault;
		startBuy(params1);
	});
});



//var HelperGetUrl = 'http://gaga.aliexpress.com/order/confirm_order.htm?objectId='+helperPID+'&promotionId='+helperCID+'&quantity=1&countryCode=US&skuAttr='+skuAttr;

function startBuy1 (params){
	//Основной запрос для покупки
	var prm = '';
	for(i in params){
		prm = prm+i+'='+params[i]+'&';
	}
	var orderRequest = new XMLHttpRequest;
	orderRequest.open('GET', 'http://m.aliexpress.com/group/255963063-2052686069-detail.html?'+prm, false);
	orderRequest.send(null);
	if(orderRequest.status == 200) {
		var response = orderRequest.responseText;
		if(response.indexOf('sku-dialog') !== -1){
			var parser = new DOMParser();
			var doc = parser.parseFromString(response, "text/html");
			var form = doc.getElementById('sku-dialog');
			form.style.display = 'block';
			document.body.innerHTML = form.outerHTML;
			document.getElementById('captcha-input').focus();
		}else{
			console.log('no form');
		}
	}
}


//childNodes
//lastChild 
//children 
//lastElementChild 

function startBuy (params){
	//Основной запрос для покупки
	var prm = '';
	for(i in params){
		prm = prm+i+'='+params[i]+'&';
	}
	var orderRequest = new XMLHttpRequest;
	orderRequest.open('GET', 'http://gaga.aliexpress.com/order/confirm_order.htm?'+prm, false);
	orderRequest.send(null);
	if(orderRequest.status == 200) {
		var response = orderRequest.responseText;
		if(response.indexOf('place-order-form') !== -1){
			var parser = new DOMParser();
			var doc = parser.parseFromString(response, "text/html");
			var form = doc.getElementById('place-order-form');
			form.style.display = 'block';
			document.body.innerHTML = form.outerHTML;
			document.getElementById('captcha-input').focus();
		}else{
			console.log('no form');
		}
	}
}