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
    // didn't add touch because it made scrolling suddenly open the sessions
  }

  var session = $(window.location.hash)[0];
  if (session && session.id === window.location.hash.substring(1)) {
    session.classList.toggle('open');
  }

  var joe = $('#mobile-is-not-a-thing-it-is-everything .mugshot')[0];
  if (joe) { // is on the page, then let's play
    joe.addEventListener('click', function () {
      window.location = '/images/speakers/am-i-wearing-a-dress.gif';
    }, true);
  }

  var today = moment(),
      best = null,
      isConfDay = moment().startOf('day').isSame('2013-11-08');

  if (isConfDay) {
    // find the current session
    var sessions = $('.session'),
        i = 0,
        length = sessions.length,
        best = sessions[0];

    for (; i < length; i++) {
      if (moment(sessions[i].getAttribute('data-date') * 1 - (5 * 1000 * 60)).isBefore(today, 'minute')) {
        best = sessions[i];
      }
    }

    best.className += ' now open';
  }

  // if today is conference day, then scroll the current session in to view
  if (isConfDay && best && !window.location.hash) {
    setTimeout(function () {
      best.scrollIntoView(true);
    }, 750);
  } else {
    // only scroll the front page
    location.pathname === '/' && /mobi/i.test(navigator.userAgent) && !location.hash && setTimeout(function () {
      if (!pageYOffset) window.scrollTo(0, 290);
    }, 750);
  }

})();