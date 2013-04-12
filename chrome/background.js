var getClickHandler = function(info, tab) {
  console.log(info);
  chrome.browserAction.setBadgeText({text: "Up"});
  $.post("http://10.70.72.124:8080/ticket", { url: info.srcUrl }, function(data){
    console.log(data);
  });
}

// Default Badge Colour
chrome.browserAction.setBadgeBackgroundColor({color: [0, 200, 0, 100]});

// Context Menu
chrome.contextMenus.create({
  "title": "Check link",
  "type": "normal",
  "contexts": ["image"],
  "onclick": getClickHandler
});

chrome.tabs.create({url: "oauth_page.html"});