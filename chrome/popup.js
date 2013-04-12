for (var i = 0; i < localStorage.length; i++){
  if(localStorage.key(i) == "ticket" || localStorage.key(i) == "token" || localStorage.key(i) == "uuid"){
  	continue;
  }
  $('.status').append(localStorage.key(i));
  $('.status').append(localStorage.getItem(localStorage.key(i)));
}
