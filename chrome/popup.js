var item, match, url, filename;

for (var i = 0; i < localStorage.length; i++){
  if(localStorage.key(i) == "ticket" || localStorage.key(i) == "token" || localStorage.key(i) == "uuid"){
  	continue;
  }

  match = localStorage.key(i).match(/^\d (.*)$/i);
  url = match[1];

  match = localStorage.key(i).match(/^\d .*\/(.+)$/);
  filename = match[1];

  item = $('<li>');

  switch (localStorage.getItem(localStorage.key(i))) {
    case 'pending':
      item
      	.append($('<div class="status-pending">'))
      	.append($('<div class="url">').text(filename));
    break;
    case 'safe':
      item
      	.append($('<div class="status-safe">'))
      	.append($('<div class="url">').text(filename))
      	.append($('<div class="description">').html("The file is safe. <a href=\"" + url + "\">Download now</a>."));
    break;
    default:
      item
      	.append($('<div class="status-malicious">'))
      	.append($('<div class="url">').text(filename))
      	.append($('<div class="description">').text("The file has been infected by " + localStorage.getItem(localStorage.key(i))));
    break;
  }

  $('#filelist').append(item);
}
