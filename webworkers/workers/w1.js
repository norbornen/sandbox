onmessage = function (event) {
	if (event.data.functionName === '__init__') {
		var methods = [];
		for (var f in self) {
			methods.push(f);
		}
		postMessage({'__methods__': methods});
		return;
	}

	var requestId = event.data.requestId;
	try {
		var workerFunction = eval(event.data.functionName);
		var params = event.data.params;
		var result = workerFunction(params);
		postMessage({'result': result, 'requestId': requestId});
	} catch(ex) {
		postMessage({error: ex + ", functionName=" + event.data.functionName, requestId: requestId});
	}
};
function testFunction(param){
	console.debug(param);
	return {'ok': 1};
}
