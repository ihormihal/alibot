//inject script
var s = document.createElement('script');
s.src = chrome.extension.getURL('js/inject_script.js');
s.onload = function() {
    this.parentNode.removeChild(this);
};
(document.head||document.documentElement).appendChild(s);

var buyTimer;
var currentTime;
var baseGet = 'http://group.aliexpress.com/order/confirm_order.htm?';

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
	'skuAttr': '',
	'countryCode': 'US'
};

document.body.addEventListener('formLoaded', function(e) {
	getParams.objectId = e.detail.objectId;
	getParams.promotionId = e.detail.promotionId;
	var skuAttr = e.detail.skuAttr;

	skuAttr = skuAttr.replace(':','%3A');
	skuAttr = skuAttr.replace('#','%23');
	skuAttr = skuAttr.replace(';','%3B');

	getParams.skuAttr = skuAttr;

    var dealTime = e.detail.dealTime;
    currentTime = new Date().getTime();
	var timeToDeal = dealTime - (currentTime/1000);

	var synchroTime = 0;
	var lastPingTime = 0;

	//Включаем таймер, если осталось менее 30 сек
	if(timeToDeal < 30 && timeToDeal > 1){
		console.log('Запускаем обратный отсчет! Начнем пинговать актуальное время через: ' + timeToDeal + ' секунд!');
		var pingTimer = setInterval(pingTimer,1000);
	}
	
	function pingTimer(){
		currentTime = new Date().getTime();
		if((dealTime*1000 - currentTime) <= 10000){
			clearInterval(pingTimer);
			console.log('Получаем актуальное время!');
			server = pingTime();
			timeToDeal = dealTime - server.time;

			//Обновленный, синхронизированный таймер, получаем актуальное время старта относительно локальных часов
			timeToDeal = (dealTime*1000 - new Date().getTime()) - server.ping - 300;
			console.log('Внимание! Старт через: '+timeToDeal+' мс!');

			var getString = '';
			for(i in getParams){
				getString = getString+i+'='+getParams[i]+'&';
			}
			getString = baseGet+getString.slice(0,-1);

			setTimeout(function(){
				buyTimer = setInterval(function(){
					startRequest(getString);
				},250);
			},timeToDeal);
		}
	}
	

	document.body.addEventListener('skuChanged', function(e) {
		getParams.skuAttr = e.detail;
	});
	document.getElementById('helper-buy-button').addEventListener('click', function(e) {
		e.preventDefault;
		var getString = '';
		for(i in getParams){
			getString = getString+i+'='+getParams[i]+'&';
		}
		getString = baseGet+getString.slice(0,-1);
		buyTimer = setInterval(function(){
			startRequest(getString);
		},500);
	});
});

var captchaStyle = '<style>.captcha-box{position: fixed;background: #fff;top: 0;bottom: 0;left: 0;right: 0;padding-left: 40%;}</style>';

var counter = 0;
var orderRequest = new XMLHttpRequest;
function startRequest(url){
	if(counter > 7){
		clearInterval(buyTimer);
	}
	orderRequest.open('GET', url, true);
	counter++;
	orderRequest.onreadystatechange = function() {
		if (orderRequest.readyState == 4) {
			if(orderRequest.status == 200) {
				var response = orderRequest.responseText;
				if(response.indexOf('place-order-form') !== -1){
					clearInterval(buyTimer);
					console.log('Вводи код с капчи!!! Жми Enter!');
					var parser = new DOMParser();
					var doc = parser.parseFromString(response, "text/html");
					var form = doc.getElementById('place-order-form');
					form.style.display = 'block';
					var action = form.getAttribute('action');
					form.action = 'http://group.aliexpress.com'+action;
					document.body.innerHTML = form.outerHTML+captchaStyle;
					document.getElementById('captcha-input').focus();
				}else{
					console.log('Сервер не готов! Повтор:'+counter);
				}
			}
		}
	};
	orderRequest.send(null);
}