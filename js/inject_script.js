//http://m.aliexpress.com/group/255963063-2052686069-detail.html?fromApp=true&promotionType=GagaGroup&lang=ru;
var noscript = document.getElementsByTagName('noscript')[0];
var imgStr = noscript.innerHTML;
var timeStr = imgStr.substring(imgStr.indexOf('time=')+5,imgStr.indexOf('time=')+15);
var currentTime = parseInt(timeStr);

var helperPID = runParams['productId'];
var helperCID = window['promotionId'];
var helperSKU = skuProducts;
var helperSTART = pDatas;
var helperRemain = pDatas['p'+helperPID].remain;
var startafter = helperRemain.h*3600+helperRemain.m*60+helperRemain.s;

var dealTime = currentTime + startafter;

var attrFirst;
if(helperSKU[0].hasOwnProperty('skuAttr')){
	attrFirst = helperSKU[0]['skuAttr'];
}else{
	attrFirst = '';
}

var formLoaded = new CustomEvent('formLoaded',{
	detail: {
		'dealTime' : dealTime,
		'objectId': helperPID,
		'promotionId': helperCID,
		'quantity': '1',
		'countryCode': 'US',
		'skuAttr': attrFirst
	}
});


var skuVariants = '<div class="helper-form-group"><label>Select SKU:</label><select onchange="skuChanged(this);" name="skuAttr">';
for (var i = 0; i < helperSKU.length; i++) {
	var attr = 'skuAttr' in helperSKU[i] ? helperSKU[i].skuAttr : '';
	skuVariants+='<option value="'+attr+'">'+attr+'</option>';
}
skuVariants += '</select></div>';

var helperFormB = '<button id="helper-buy-button">Buy!</button>';

function skuChanged(el){
	var skuChanged = new CustomEvent("skuChanged",{
		detail: el.value
	});
	document.body.dispatchEvent(skuChanged);
}

var gotoMobile = '';
var thisUrl = document.URL;
if(thisUrl.indexOf('m.aliexpress.com') == -1){
	var mobileUrl = 'http://m.aliexpress.com/group/'+thisUrl.substring(thisUrl.lastIndexOf('.com/')+5,thisUrl.lastIndexOf('-detail.html'))+'-detail.html';
	gotoMobile = '<a href="'+mobileUrl+'">Mobile Site</a>';
}

//PC variant
appendHtml(document.body, '<div id="fast-deals-helper">'+gotoMobile+skuVariants+helperFormB+'</div>');

function appendHtml(el, str) {
  var div = document.createElement('div');
  div.innerHTML = str;
  while (div.children.length > 0) {
    el.appendChild(div.children[0]);
  }
  document.body.dispatchEvent(formLoaded);
}