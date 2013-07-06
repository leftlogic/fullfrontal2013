var sessions = $('.session-header');

function toggle(e) {
  var session = this.parentNode.parentNode;
  session.classList.toggle('open');
  if (session.classList.contains('open')) {
    location = '#' + session.id;
  }
}

sessions.on('click', toggle).on('touchstart', toggle);

window.onhashchange = function () {
  console.log('ok');
  $('#flat-city').className = 'session open bg-' + location.hash.substring(1);
  return false;
}