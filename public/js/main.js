var sessions = $('.session-header');

function toggle(e) {
  var session = this.parentNode;
  session.classList.toggle('open');
  if (session.classList.contains('open')) {
    location = '#' + session.id;
  }
}

sessions.on('click', toggle).on('touchstart', toggle);