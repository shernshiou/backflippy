var count = 0;
var getClickHandler = function(info, tab) {
  //console.log(info);
  //chrome.browserAction.setBadgeText({text: "Up"});
  ticket = localStorage.getItem("ticket"),
  token = localStorage.getItem("token"),
  uuid = localStorage.getItem("uuid");
  $.ajax({
    type: "POST",
    url: "http://10.70.72.124:8080/tickets",
    data: { url: info.srcUrl },
    headers: { 
      "ticket":  ticket,
      "token": token,
      "uuid": uuid
    },
    statusCode: {

    },
    success: function(data){
    
    }
  });
  //$.post("http://10.70.72.124:8080/tickets", { url: info.srcUrl }, function(data){
  //  console.log(data);
  //});
}

var checkForMaliciousUrl = function(tabId, changeInfo, tab) {
  console.log(tab.url.substr(0,4));
  if (tab.url.substr(0,4) === "http" ) {
    // ... show the page action.
    console.log(changeInfo);
    $.get("http://fsec.it/api/v1/url", { long_url: tab.url }, function(data){
      console.log(data);
    });
  }
};

var retrieve = function() {
  $.get("http://10.70.72.124:8080/tickets", function(data){
    var i = 0,
      match = "",
      prevData = {},
      ticket = localStorage.getItem("ticket"),
      token = localStorage.getItem("token"),
      uuid = localStorage.getItem("uuid");
    for (var i = 0; i < localStorage.length; i++){
      if(localStorage.key(i) == "ticket" || localStorage.key(i) == "token" || localStorage.key(i) == "uuid"){
        continue;
      }
      match = localStorage.key(i).match(/^\d (.*)$/i);
      url = match[1];
      prevData[url] = localStorage.getItem(localStorage.key(i));
    }
    localStorage.clear();
    localStorage.setItem("ticket", ticket);
    localStorage.setItem("token", token);
    localStorage.setItem("uuid", uuid);
    $.each(data, function(key, value){
      if(prevData[key] != value){
        var notification = webkitNotifications.createNotification(
          'images/stack48.png',  // icon url - can be relative
          'You\'ve got backflipped',  // notification title
          'The file ' + value + ' has completed.'  // notification body text
        );
        notification.show();
      }
      localStorage.setItem( i++ + " " + key, value);
    });
  });
}

//setInterval(retrieve, 3000);

// Default Badge Colour
chrome.browserAction.setBadgeBackgroundColor({color: [0, 200, 0, 100]});
//chrome.browserAction.onClicked.addListener(function(){
//  chrome.tabs.create({url: "popup.html"});
//});

// Context Menu
chrome.contextMenus.create({
  "title": "Check link",
  "type": "normal",
  "contexts": ["image"],
  "onclick": getClickHandler
});

chrome.tabs.create({url: "oauth_page.html"});

// Check Malicious
chrome.tabs.onUpdated.addListener(checkForMaliciousUrl);