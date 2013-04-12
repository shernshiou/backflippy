var restify = require('restify'),
    http = require('http'),
    url = require('url'),
    path = require('path'),
    fs = require('fs'),
    events = require('events');

var createTicket = function(req, res, next) {
	// Attempt to download the File
	var requestedUrl = req.params.url,
		parsedUrl = url.parse(requestedUrl),
	    host = parsedUrl.hostname,
	    pathname = parsedUrl.pathname,
	    filename = pathname.split("/").pop(),
	    request;

	request = http.request({
		hostname: host,
		port: 80,
		path: pathname,
		method: 'GET'
	}, function (response) {
		// the requested file is invalid, return 400
		if (response.statusCode >= 400) {
			res.send(400);
			return;
		}

		// the file is being downloaded - return 202
		res.send(202);

		var file = fs.createWriteStream(filename, {'flags': 'a'});
		console.log("File size " + filename + ": " + response.headers['content-length'] + " bytes.");
		response.on('data', function (chunk) {
			file.write(chunk, encoding='binary');
		});

		response.on("end", function() {
			file.end();
			console.log("Finished downloading " + filename);
		});
	});

	request.end();

	// CAN authentication

	return next();
};

var server = restify.createServer({
	name: "Backflippy"
});
server.use(restify.bodyParser());
server.post('/tickets', createTicket);

server.listen(8080, function() {
	console.log('%s is now running at %s', server.name, server.url);
});