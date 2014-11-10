//http://m.aliexpress.com/group/255963063-2052686069-detail.html?fromApp=true&promotionType=GagaGroup&lang=ru
var s = document.createElement('script');
s.src = chrome.extension.getURL('js/inject_script.js');
s.onload = function() {
    this.parentNode.removeChild(this);
};
(document.head||document.documentElement).appendChild(s);

document.formLoaded = function(){
	console.log('formLoaded');
}






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


document.body.addEventListener('formLoaded', function(e) {
    var dealTime = document.getElementById('fast-deals-helper').getAttribute('data-dealtime');
    var server = pingTime();
	var timeToDeal = dealTime - server.time;
	var timeInterval = timeToDeal;

	//Пингуем в течении N(5) секунд (до начала за timeInterval секунд)
	var synchroTimePre = 0;
	var tempPre = 0;
	var lastPingTime = 0;
	while(timeToDeal <= timeInterval && timeToDeal > (timeInterval-5)){
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

	console.log(timeToDeal); //
});