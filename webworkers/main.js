$(document).ready(function(){

	app.w0();
	app.w1();
	app.w2();

});

var app = {
	'log' : function(){
		var tmp = $.makeArray(arguments),
			c = $('#console');
		console.log(tmp.length < 2 ? tmp[0] : tmp);
		$.each(tmp, function(undefined, o){
			c.append('<div>' + o + '</div>');
		});
	}
	/*
		simple
	*/
	,'w0' : function(){
		var worker = new Worker('workers/w0.js');
		//	worker.addEventListener('message', function(e) {
		worker.onmessage = function(e){
			app.log('[main.js] [app.w0] worker.onmessage', e, 'e.data='+e.data);
			e.data;
		};
		worker.onerror = function(e){
			app.log('[main.js] [app.w0] error in worker ', e);
		};
		worker.postMessage({'title': 'Hello world!'});
	}
	/*
		usable
	*/
	,'w1' : function(){
		var myWorker = new WorkerProxy('workers/w1.js');
		myWorker.callFunc(
			/*
				сначала вокер должен обменяться сообщениями (__init__)
				с workerproxy.js, а уж потом станет доступной возможность
				работать через псевдометоды worker-a
			*/
			'testFunction',
			{'keyLength': 2048, 'password': '123a'}, // jquery не передать
			function (result){
				app.log(result);
			},
			function(error){
				app.log("error in worker: " + error);
			}
		);
		/*
		myWorker.createKeyBytes(
			{'keyLength': 2048, 'password': '123a'},
			function (result){
				app.log(result);
			},
			function(error){
				app.log("error in worker: " + error);
			}
		);
		*/
	}
	/*
		Blob
	*/
	,'w2' : function(){
		var blob, str = "onmessage = function(e) { console.debug('[w2.worker]'); postMessage('hello wordoword') }";
		try {
			blob = new Blob([str], {type: 'application/javascript'});
		} catch (e) { // Backwards-compatibility
			window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder;
			blob = new BlobBuilder();
			blob.append(str);
			blob = blob.getBlob();
		}

		var worker = new Worker(
			window.URL.createObjectURL(blob)
		);
		worker.postMessage('a');
	}
};
