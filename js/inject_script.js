//http://m.aliexpress.com/group/255963063-2052686069-detail.html?fromApp=true&promotionType=GagaGroup&lang=ru;
var noscript = document.getElementsByTagName('noscript')[0];
var imgStr = noscript.innerHTML;
var timeStr = imgStr.substring(imgStr.indexOf('time=')+5,imgStr.indexOf('time=')+15);
var currentTime = parseInt(timeStr);

var helperPID = runParams.productId;
var helperCID = runParams.companyId;
var helperSKU = skuProducts;
var helperSTART = pDatas;
var helperRemain = pDatas['p'+helperPID].remain;
var startafter = helperRemain.h*3600+helperRemain.m*60+helperRemain.s;

var dealTime = currentTime + startafter;

var skuVariants = '<div class="helper-form-group"><label>Select SKU:</label><select onchange="skuChanged(this);" name="skuAttr">';
for (var i = 0; i < helperSKU.length; i++) {
	skuVariants+='<option value="'+helperSKU[i].skuAttr+'">'+helperSKU[i].skuAttr+'</option>';
}
skuVariants += '</select></div>';

var helperFormB = '<button id="helper-buy-button">Buy!</button>';

var helperParams = {
	'dealTime' : dealTime,
	'objectId': helperPID,
	'promotionId': helperCID,
	'quantity': 1,
	'countryCode': 'US',
	'skuAttr': helperSKU[0].skuAttr
};

var formLoaded = new CustomEvent("formLoaded",{
	detail: helperParams
});

function skuChanged(el){
	var skuChanged = new CustomEvent("skuChanged",{
		detail: el.value
	});
	document.body.dispatchEvent(skuChanged);
}


//PC variant
appendHtml(document.body, '<div id="fast-deals-helper">'+skuVariants+helperFormB+'</div>');

function appendHtml(el, str) {
  var div = document.createElement('div');
  div.innerHTML = str;
  while (div.children.length > 0) {
    el.appendChild(div.children[0]);
  }
  document.body.dispatchEvent(formLoaded);
}