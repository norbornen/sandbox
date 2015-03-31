function WorkerProxy(scriptSource) {
	var self = this;

	var worker = new Worker(scriptSource), callbacks = {}, nextRequestId = 0;

	this.perform = function(functionName, params, successCallback, errorCallback) {
		callbacks["request_" + (++nextRequestId)] = {successCallback: successCallback, errorCallback: errorCallback};
		worker.postMessage({functionName: functionName, params: params, requestId: nextRequestId});
	}

	worker.onmessage = function(msg) {
		if (msg.data.__methods__) {   // получили список функций, делаем их методами WorkerProxy
			var methods = self.__methods__ = msg.data.__methods__;
	        for (var i = 0; i < methods.length; i++) {
	        	eval(
					'self["' + methods[i] + '"] = function (params, successCallback, errorCallback) {'
	            	+'self.perform("'+methods[i]+'", params, successCallback, errorCallback);}'
				);
	        }
			self.__ready__ = 1;
	        return;
	    }
        if (msg.data.error) {
        	if (callbacks["request_" + msg.data.requestId].errorCallback) {
        		callbacks["request_" + msg.data.requestId].errorCallback(msg.data.error);
        	} else {
    			alert(msg.data.error);
        	}
        } else {
    		callbacks["request_" + msg.data.requestId].successCallback(msg.data.result);
        }
        delete callbacks["request_" + msg.data.requestId];
	}

	this.callFunc = function(functionName, params, successCallback, errorCallback){
		var interval;
		interval = setInterval(function(){
			if (self.__ready__) {
				clearInterval(interval);
				self[functionName](params, successCallback, errorCallback);
			}
		}, 5);
	};

	this.perform('__init__');
}
