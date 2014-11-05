var jq = document.createElement('script');
jq.src = "https://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js";
document.getElementsByTagName('head')[0].appendChild(jq);

var ping = new Date;

$.ajax({
    url: "http://group.aliexpress.com/order/confirm_order.htm?objectId=2012342887&promotionId=255963004&quantity=1&skuAttr=14%3A29&countryCode=US",
    cache:false,
    success: function(output){ 
		ping = new Date - ping;
		console.log(ping);
    }
});

//get time
//var pDatas = {"p2052686069":{status:1,remain:{h:140,m:13,s:0},endRemain:{h:141,m:12,s:59}}};
//http://m.aliexpress.com/group/255963063-2052686069-detail.html
var skuProducts=[{"skuAttr":"14:29","skuPropIds":"29","skuVal":{"bulkOrder":3,"inventory":1,"isActivity":false,"skuBulkPrice":"464.54","skuPrice":"488.99"}},{"skuAttr":"14:193","skuPropIds":"193","skuVal":{"bulkOrder":3,"inventory":1,"isActivity":false,"skuBulkPrice":"464.54","skuPrice":"488.99"}}] ;
var code = "<script>console.log(skuProducts);</scr"+"ipt>";
$('body').append($(code)[0]);