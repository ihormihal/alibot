
//http://m.aliexpress.com/group/255963063-2052686069-detail.html;
var helperSKU = skuProducts;
var helperSTART = pDatas;
for(var prop in pDatas){
	console.log('objectId: '+prop);
	var startafter = pDatas[prop].remain.h*3600+pDatas[prop].remain.m*60+pDatas[prop].remain.s;
	console.log('start after: '+startafter+' seconds');
}

var skuVariants = '<select>';
for (var i = 0; i < helperSKU.length; i++) {
	skuVariants+='<option value="'+helperSKU[i].skuAttr+'">'+helperSKU[i].skuAttr+'</option>';
}
skuVariants += '</select>';

var helperBuyButton = '<a href="" id="helper-buy-button">Buy!</a>';
var helperContainer = '<div id="fast-deals-helper"><div class="helper-form-group"><label>Select SKU:</label>'+skuVariants+'</div>'+helperBuyButton+'</div>';


appendHtml(document.body, helperContainer);

function appendHtml(el, str) {
  var div = document.createElement('div');
  div.innerHTML = str;
  while (div.children.length > 0) {
    el.appendChild(div.children[0]);
  }
}