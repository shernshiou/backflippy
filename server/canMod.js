var requirejs = require('requirejs');
$ = require('jquery');
var ctx = {};

var uploadBuffer = function(ctx, object_name, arrayBuffer, ctype) {
    // Create a blob from the arraybuffer data.
    var blob = new Blob([arrayBuffer]);
    // Upload the blob.
    ctx.fsio.data.upload(ctx.token, object_name, blob, function(jqXHR) {
      //  $("body").append("<br><br>Uploaded '" + object_name + "': " +
      //                   jqXHR.status);
    }, {}, {"content-type": ctype ? ctype : ""});
}

var uploadFile = function(ctx) {
    var object_name = "MACHIBAI" + "_" + new Date().getTime();
    var data = "Hello World!";
    ctx.fsio.data.upload(ctx.token, object_name, data, function(jqXHR) {
/*        $("body").append("<br><br>Uploaded '" + object_name + "': "+
                         jqXHR.status);*/
        console.log(jqXHR);
        // if(jqXHR.status == 204) {
        //     waitUntilScanned(ctx, object_name);
        // } else {
        //     $("body").append("<br>Failed to upload: " + jqXHR.status);
        // }
    });
}

var toArrayBuffer= function(buffer) {
    var ab = new ArrayBuffer(buffer.length);
    var view = new Uint8Array(ab);
    for (var i = 0; i < buffer.length; ++i) {
        view[i] = buffer[i];
    }
    return ab;
}

requirejs.config({
    nodeRequire: require,
    baseUrl: 'lib'
});

requirejs(['lib/Can.js', 'lib/FipCanConfig.js', 'lib/Dev.js'], function(Can, CONFIG, DEV){
  try {
      can = new Can(CONFIG, DEV.api_key, DEV.api_key_secret);
      can.uuid = 'ec463834-408e-3558-82dc-6c3c3207a226';
      console.log("CAN SDK version: " + can.version());
  } catch(err) {
      $("body").append(err.name + ": " + err.message);
      return;
  }
  ctx.fsio = can.createFsioClient();
  //console.log(ctx);
  // Login.
  try {
    ctx.fsio = can.createFsioClient();
    ctx.ticket = "96984aca-3534-c4f9-d445-c5fb527e04e0";
    ctx.token = "c441c693-f7c8-dd47-f3c3-6cfc40aa21d8";
    console.log(ctx);
    uploadFile(ctx);
  } catch(err) {
      $("body").append("<br>" + err.name + ": " + err.message);
      return;
  }

  /*
  can.login(function(status) {
      $("body").append("<br>User logged in: " + status);
      $("body").append("<br>UUID: " + can.getUserUuid());
      // Create FSIO client.
      
      // Create FSIO ticket.
      can.createFsioUserTicket(ctx.fsio, function(status, ticket) {
          if(status == 200) {
              ctx.ticket = ticket;
              // Get user account info.
              getFsioUserAccountInfo(ctx);
              // Create upload token.
              createUploadToken(ctx);
          } else {
              $("body").append("<br>Failed to create FSIO ticket: " +
                               status);
          }
      });
  });*/
});