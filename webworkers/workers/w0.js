onmessage = function(e){
	console.log('[w0.worker]', e, 'e.data=', e.data);
	/*
		do something and call "postMessage"
		for send some data to parent page/script
	*/
	postMessage('[w0.worker] ok, ' + (new Date()).toString());

	var urls = [
		'http://headers.jsontest.com/',
		'http://date.jsontest.com/',
		'http://ip.jsontest.com/'
	];
	for (var i = 0; i < urls.length; i++) {
		var u = urls[i];
		load(u, function(r){
			var result = {'url': r.responseURL, 'json': JSON.parse(r.responseText)};
			console.debug('[w0.worker]', result);
			postMessage(result);
		});
	}
};
function load(url, callback) {
	var xhr;

	if (typeof XMLHttpRequest !== 'undefined') {
		xhr = new XMLHttpRequest();
	} else {
		var versions = [
			"MSXML2.XmlHttp.5.0",
			"MSXML2.XmlHttp.4.0",
			"MSXML2.XmlHttp.3.0",
			"MSXML2.XmlHttp.2.0",
			"Microsoft.XmlHttp"
		];
		for (var i = 0, len = versions.length; i < len; i++) {
			try {
				xhr = new ActiveXObject(versions[i]);
				break;
			}catch(e){}
		}
	}

	xhr.onreadystatechange = ensureReadiness;

	function ensureReadiness() {
		if (xhr.readyState < 4) {
			return;
		}
		if (xhr.status !== 200) {
			return;
		}
		if (xhr.readyState === 4) {
			callback(xhr);
		}
	}
	xhr.open('GET', url, true);
	xhr.send('');
}
