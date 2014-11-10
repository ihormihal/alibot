//http://m.aliexpress.com/group/255963063-2052686069-detail.html?fromApp=true&promotionType=GagaGroup&lang=ru;
var formLoaded = new CustomEvent("formLoaded", {});

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

var skuVariants = '<div class="helper-form-group"><label>Select SKU:</label><select name="skuAttr">';
for (var i = 0; i < helperSKU.length; i++) {
	skuVariants+='<option value="'+helperSKU[i].skuAttr+'">'+helperSKU[i].skuAttr+'</option>';
}
skuVariants += '</select></div>';

var helperFormPID = '<input name="objectId" type="hidden" value="'+helperPID+'">';
var helperFormCID = '<input name="promotionId" type="hidden" value="'+helperCID+'">';
var helperFormAPP = '<input name="fromApp" type="hidden" value="true">';
var helperFormQ = '<input name="quantity" type="hidden" value="1">';
var helperFormC = '<input name="countryCode" type="hidden" value="US">';
var helperFormB = '<button type="submit" id="helper-buy-button">Buy!</button>';

//PC variant
//m.aliexpress.com/group/order/confirm_order.htm?objectId=2041880721&promotionId=255963063&quantity=1&countryCode=US&skuAttr=200000828%3A200003982%23X98+Air+3G
appendHtml(document.body, '<div id="fast-deals-helper" data-dealtime="'+dealTime+'"><form method="get" action="http://group.aliexpress.com/order/confirm_order.htm">'+helperFormPID+helperFormCID+helperFormQ+helperFormAPP+helperFormC+skuVariants+helperFormB+'</form></div>');
//APP variant
//gaga.aliexpress.com/order/orderConfirm?q=1&productId=2052686069&skuAttr=200000828:200003982
//appendHtml(document.body, '<div id="fast-deals-helper"><form method="get" action="http://group.aliexpress.com/order/confirm_order.htm">'+helperFormPID+helperFormCID+helperFormQ+helperFormAPP+helperFormC+skuVariants+helperFormB'</form></div>');


function appendHtml(el, str) {
  var div = document.createElement('div');
  div.innerHTML = str;
  while (div.children.length > 0) {
    el.appendChild(div.children[0]);
  }
  document.body.dispatchEvent(formLoaded);
}