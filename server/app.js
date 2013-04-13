var restify = require('restify'),
	http = require('http'),
	url = require('url'),
	path = require('path'),
	fs = require('fs'),
	events = require('events'),
	redis = require('redis'),
	Sweeper = require('./sweeper');

/*
var sweeper = new Sweeper('ec463834-408e-3558-82dc-6c3c3207a226', //UUID
	'eff0b086-79ad-4aca-7065-db88477f3719', //TICKET
	'4eeb0471-e6f9-43cf-00c8-66ed057e5c0d');  //TOKEN

sweeper.swipe('package.json', function(file, status){
	console.log(status);
});
*/

var createTicket = function(req, res, next) {
	// Attempt to download the File
	var requestedUrl = req.params.url,
		parsedUrl = url.parse(requestedUrl),
		host = parsedUrl.hostname,
		pathname = parsedUrl.pathname,
		filename = pathname.split("/").pop(),
		request,
		redisClient = redis.createClient(),
		oauthToken = req.header('token'),
		oauthTicket = req.header('ticket'),
		oauthUuid = req.header('uuid');

	redisClient.on("error", function(err) {
		console.error("Error " + err);
	});

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
		redisClient.set(requestedUrl, "pending");
		redisClient.lpush("single_user", requestedUrl);

		res.send(202);

		var file = fs.createWriteStream(filename, {'flags': 'a'});
		console.log("File size " + filename + ": " + response.headers['content-length'] + " bytes.");
		response.on('data', function (chunk) {
			file.write(chunk, encoding='binary');
		});

		response.on("end", function() {
			file.end();
			console.log("Finished downloading " + filename);
			// upload to CAN for scanning
			var sweeper = new Sweeper(
					oauthUuid,
					oauthTicket,
					oauthToken
			).sweep(filename, function(file, status){
				fs.unlink(filename, function(err) {
					if (err) console.error("Error " + err);
					console.log("Successfully deleted " + filename);
				});
				if (status[0] != "ok") {
					redisClient.set(requestedUrl, "malicious");
				} else {
					redisClient.set(requestedUrl, "safe");
				}
			});
		});
	});

	request.end();

	// CAN authentication

	return next();
};

var listTickets = function(req, res, next) {
	// get the data from redis
	var redisClient = redis.createClient();

	redisClient.on("error", function(err) {
		console.error("Error " + err);
	});

	redisClient.lrange("single_user", 0, 10, function(err, urls){
		var list = {};
		urls.forEach(function(key, pos){
			redisClient.get(key, function(err, value){
				list[key] = value;
				if (pos == urls.length - 1) {
					res.send(200, list);
				}
			});
		});
	});

	return next();
};

var server = restify.createServer({
	name: "Backflippy"
});
server.use(restify.bodyParser());
server.post('/tickets', createTicket);
server.get('/tickets', listTickets);

server.listen(8080, function() {
	console.log('%s is now running at %s', server.name, server.url);
});