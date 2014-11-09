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



var pingStart = new Date();
var helperRequest = new XMLHttpRequest;
helperRequest.open('GET', 'http://activities.aliexpress.com/get_time_api.php', false);
helperRequest.send(null);
if(helperRequest.status == 200) {
  //console.log(helperRequest.responseText);
}
var pingEnd = new Date();
var pingTime = pingEnd-pingStart;

//var dealTime = document.getElementById('fast-deals-helper').getAttribute('data-dealtime');
//console.log(document.getElementById('fast-deals-helper'));

/*document.addEventListener('formLoaded', function (e) {
	console.log('formLoaded');
}, false)*/