(function () {

  var sessions = $('.session-header');

  function toggle() {
    var session = this.parentNode.parentNode;
    session.classList.toggle('open');
    if (session.classList.contains('open')) {
      window.location = '#' + session.id;
    }
  }

  sessions.on('click', toggle).on('touchstart', toggle);
  var session = $(window.location.hash);
  if (session.id === window.location.hash.substring(1)) {
    session.classList.toggle('open');
  }

})();