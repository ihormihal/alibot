
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
var container = '<div id="fast-deals-helper"><div class="helper-form-group"><label>Select SKU:</label>'+skuVariants+'</div></div>';
$('body').append($(container));