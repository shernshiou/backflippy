var ctx = {};
requirejs.config({
  baseUrl: '../lib/fsecure'
});

var createUploadToken = function(ctx) {
    ctx.fsio.ticket.createUploadToken(ctx.ticket, function(jqXHR) {
        if(jqXHR.status == 200) {
          ctx.token = JSON.parse(jqXHR.responseText).Token;
          console.log(ctx);
        }
    });
}

requirejs(['lib/fsecure/Can.js', 'lib/fsecure/FipCanConfig.js', 'lib/fsecure/Dev.js'], function(
  Can, CONFIG, DEV){
  
  var can = new Can(CONFIG, DEV.api_key, DEV.api_key_secret);
  var post_auth_url = encodeURIComponent("127.0.0.1");
  can.getLoginUrl("https%3A%2F%2Ffip.sp.f-secure.com%2Findex.php&reg=1", function(status, url) {
    if(status == 200) {
      console.log("HERE");
      can.login(function() {
        console.log(can.getUserUuid());
        ctx.fsio = can.createFsioClient();
        can.createFsioUserTicket(ctx.fsio, function(status, ticket) {
          if(status == 200) {
              ctx.ticket = ticket;
              // Get user account info.
              //getFsioUserAccountInfo(ctx);
              // Create upload token.
              createUploadToken(ctx);
          } else {
              $("body").append("<br>Failed to create FSIO ticket: " +
                               status);
          }
        });
      });
      //window.location.replace(decodeURIComponent(url));
    } else {
      console.log(status);
    }
  });
});