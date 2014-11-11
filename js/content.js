//inject script
var s = document.createElement('script');
s.src = chrome.extension.getURL('js/inject_script.js');
s.onload = function() {
    this.parentNode.removeChild(this);
};
(document.head||document.documentElement).appendChild(s);

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
	//console.log(e);
	getParams.objectId = e.detail.objectId;
	getParams.promotionId = e.detail.promotionId;
	var skuAttr = e.detail.skuAttr;

	skuAttr = skuAttr.replace(':','%3A');
	skuAttr = skuAttr.replace('#','%23');
	skuAttr = skuAttr.replace(';','%3B');

	getParams.skuAttr = skuAttr;

    var dealTime = e.detail.dealTime;
    var server = pingTime();
	var timeToDeal = dealTime - server.time;

	//Пингуем в течении N(5) секунд (до начала за timeInterval секунд)
	var synchroTimePre = synchroTime = 0;
	var tempPre = 0;
	var lastPingTime = 0;

	//Включаем таймер, если осталось менее 120 сек
	if(timeToDeal < 60 && timeToDeal > 0){
		console.log('Запускаем обратный отсчет! Начнем пинговать актуальное время через: ' + timeToDeal + ' секунд!');
		var pingTimer = setInterval(pingTimer,1000);
	}
	

	function pingTimer(){
		var currentTime = new Date().getTime();
		if((dealTime*1000 - currentTime) <= 7000){
			clearInterval(pingTimer);
			console.log('Начнем пинговать актуальное время!');
			while(timeToDeal > 3){
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
				//lastPingTime = server.ping;
			}

			//Обновленный, синхронизированный таймер, получаем актуальное время старта относительно локальных часов
			timeToDeal = (dealTime*1000 - new Date().getTime()) - synchroTime;
			console.log('Внимание! Старт через: '+timeToDeal+' мс!');
			setTimeout(startBuy,timeToDeal);
		}
	}
	

	document.body.addEventListener('skuChanged', function(e) {
		getParams.skuAttr = e.detail;
	});
	document.getElementById('helper-buy-button').addEventListener('click', function(e) {
		e.preventDefault;
		startBuy(getParams);
	});
});

var captchaStyle = '<style>.captcha-box{position: fixed;background: #fff;top: 0;bottom: 0;left: 0;right: 0;padding-left: 40%;}</style>';

var repeat_limit = 15;
var repeat_i = 0;
function startBuy (params){
	//Основной запрос для покупки
	console.log('Старт!');

	var prm = '';
	for(i in params){
		prm = prm+i+'='+params[i]+'&';
	}
	prm = prm.slice(0,-1);
	
	var orderRequest = new XMLHttpRequest;
	orderRequest.open('GET', 'http://group.aliexpress.com/order/confirm_order.htm?'+prm, false);
	orderRequest.send(null);
	if(orderRequest.status == 200) {
		console.log('Вводи код с капчи!!! Жми Enter!');
		var response = orderRequest.responseText;
		if(response.indexOf('place-order-form') !== -1){
			var parser = new DOMParser();
			var doc = parser.parseFromString(response, "text/html");
			var form = doc.getElementById('place-order-form');
			form.style.display = 'block';
			var action = form.getAttribute('action');
			form.action = 'http://group.aliexpress.com'+action;
			document.body.innerHTML = form.outerHTML+captchaStyle;
			document.getElementById('captcha-input').focus();
		}else{
			console.log('Сервер не готов! Повтор: '+repeat_i);
			if(repeat_i<=repeat_limit){
				startBuy(getParams);
			}
		}
	}
	repeat_i++;
	
}