var getClickHandler = function(info, tab) {
  console.log(info);
  chrome.browserAction.setBadgeText({text: "Up"});
}

// Default Badge Colour
chrome.browserAction.setBadgeBackgroundColor({color:[0, 200, 0, 100]});

// Context Menu
chrome.contextMenus.create({
  "title": "Check link",
  "type": "normal",
  "contexts": ["link"],
  "onclick": getClickHandler
});