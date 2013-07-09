(function () {
  /mobi/i.test(navigator.userAgent) && !location.hash && setTimeout(function () {
    if (!pageYOffset) window.scrollTo(0, 230);
  }, 1000);

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
    // didn't add touch because it made scrolling suddenly open the sessions
  }

  var session = $(window.location.hash)[0];
  if (session && session.id === window.location.hash.substring(1)) {
    session.classList.toggle('open');
  }

})();