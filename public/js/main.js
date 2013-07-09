(function () {
  var $ = function (s) {
    try {
      return document.querySelectorAll(s);
    } catch (e) {
      return [];
    }
  };

  var sessions = $('.session-header');

  function toggle() {
    var session = this.parentNode.parentNode;

    var c = session.className;

    if (c.indexOf('open') === -1) {
      window.location = '#' + session.id;
      session.className += ' open';
    } else {
      session.className = c.replace(/\s*open/, '');
    }
  }

  for (var i = 0; i < sessions.length; i++) {
    sessions[i].onclick=toggle; // yeah, what?
    sessions[i].ontouchstart=toggle;
  }

  var session = $(window.location.hash)[0];
  if (session && session.id === window.location.hash.substring(1)) {
    session.classList.toggle('open');
  }

})();