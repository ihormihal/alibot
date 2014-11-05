chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	var sku = request.sku;
	console.log(sku);	
});