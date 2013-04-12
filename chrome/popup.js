for (var i = 0; i < localStorage.length; i++){
  $('.status').append(localStorage.key(i));
  $('.status').append(localStorage.getItem(localStorage.key(i)));
}
