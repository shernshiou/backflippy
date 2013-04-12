$(function(){
  for (var i = 0; i < localStorage.length; i++){
    if(localStorage.key(i) !== "ticket" || localStorage.key(i) !== "token" || localStorage.key(i) !== "uuid"){
      $('.status').append(localStorage.key(i));
      $('.status').append(localStorage.getItem(localStorage.key(i)));
    }
  }
  $('a').click(function(e) {
    var href = e.currentTarget.href;
    chrome.tabs.create({url: href});
    chrome.tabs.getSelected(null,function(tab) {
      chrome.tabs.update(tab.id, {url: 'http://www.google.com'});
    });
    window.close(); // To close the popup.
  });
});