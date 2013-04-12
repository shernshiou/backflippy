var requirejs = require('requirejs');
$ = require('jquery');
var fs = require("fs");
var mime = require('mime');
var path = require('path');

var waitUntilScanned = function(ctx, fileName, complete) {
  ctx.fsio.waitForWorkers(ctx.ticket, fileName,
    ["AV","FileTypeWorkerStatus","MetadataWorkerStatus"],
    10, function(status) {
      if (complete) complete(status);
    });
}

Swiper.prototype.uploadLocalFile = function(file, complete) {
  var type = mime.lookup(file);
  var name = path.basename(file);
  var content;
  fs.readFile(file, 'ascii', function (err, data) {
    if (err) throw err;
    uploadBuffer(this.ctx, name, data, type, function(status) {
      if (complete) complete(status);
    });
  });
}

var uploadBuffer = function(ctx, fileName, buffer, ctype, complete) {
    ctx.fsio.data.upload(ctx.token, fileName, buffer, function(jqXHR) {
        if (jqXHR.status == 204) {
            waitUntilScanned(ctx, fileName, function(status) {
              if (complete) complete(status);
            });
        }
    }, {}, {"content-type": ctype ? ctype : ""});
}

function Swiper(uuid, ticket, token) {
  requirejs.config({
      nodeRequire: require,
      baseUrl: 'lib'
  });

  requirejs(['lib/Can.js', 'lib/FipCanConfig.js', 'lib/Dev.js'], function(Can, CONFIG, DEV) {
    this.ctx = {};

    try {
        can = new Can(CONFIG, DEV.api_key, DEV.api_key_secret);
        can.uuid = uuid;
        console.log("CAN SDK version: " + can.version());
    } catch(err) {
        return;
    }

    this.ctx.fsio = can.createFsioClient();

    try {
      this.ctx.fsio = can.createFsioClient();
      this.ctx.ticket = ticket;
      this.ctx.token = token;
    } catch(err) {
        return;
    }
  });
}

var s = new Swiper("ec463834-408e-3558-82dc-6c3c3207a226", // UUID
  "357358e6-4de1-0b5b-06d0-9ad8ea2677f0", // Ticket
  "edd0d4f5-a0db-68e6-700d-c726a7f2088f"); // Token
s.uploadLocalFile('/home/cngan/Desktop/vilus/eicar.com');
