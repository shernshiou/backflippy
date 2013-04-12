var ctx = {};
requirejs.config({
  baseUrl: '../lib/fsecure'
});

var createUploadToken = function(ctx) {
    ctx.fsio.ticket.createUploadToken(ctx.ticket, function(jqXHR) {
        if(jqXHR.status == 200) {
          ctx.token = JSON.parse(jqXHR.responseText).Token;
          localStorage.setItem("token", ctx.token);
          localStorage.setItem("ticket", ctx.ticket);
          chrome.tabs.getCurrent(function(tab) {
            chrome.tabs.remove(tab.id, function() { });
          });
        }
    });
}

requirejs(['lib/fsecure/Can.js', 'lib/fsecure/FipCanConfig.js', 'lib/fsecure/Dev.js'], function(
  Can, CONFIG, DEV){
  
  var can = new Can(CONFIG, DEV.api_key, DEV.api_key_secret);
  //var post_auth_url = encodeURIComponent("127.0.0.1");
  can.getLoginUrl("https%3A%2F%2Ffip.sp.f-secure.com%2Findex.php&reg=1", function(status, url) {
    if(status == 200) {
      console.log("HERE");
      can.login(function() {
        localStorage.setItem("uuid", can.getUserUuid());
        ctx.fsio = can.createFsioClient();
        can.createFsioUserTicket(ctx.fsio, function(status, ticket) {
          if(status == 200) {
            ctx.ticket = ticket;
            createUploadToken(ctx);
          }
        });
      });
      //window.location.replace(decodeURIComponent(url));
    } else {
      console.log(status);
    }
  });
});