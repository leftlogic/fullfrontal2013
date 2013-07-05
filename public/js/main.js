var sessions = $('.session-header');

function toggle(e) {
  var session = this.parentNode;
  session.classList.toggle('open');
  if (session.classList.contains('open')) {
    location = '#' + session.id;
  }
}

sessions.on('click', toggle).on('touchstart', toggle);

/*! matchMedia() polyfill - Test a CSS media type/query in JS. Authors & copyright (c) 2012: Scott Jehl, Paul Irish, Nicholas Zakas. Dual MIT/BSD license */
window.matchMedia = window.matchMedia || (function(doc, undefined){

  var bool,
      docElem  = doc.documentElement,
      refNode  = docElem.firstElementChild || docElem.firstChild,
      // fakeBody required for <FF4 when executed in <head>
      fakeBody = doc.createElement('body'),
      div      = doc.createElement('div');

  div.id = 'mq-test-1';
  div.style.cssText = "position:absolute;top:-100em";
  fakeBody.style.background = "none";
  fakeBody.appendChild(div);

  return function(q){

    div.innerHTML = '&shy;<style media="'+q+'"> #mq-test-1 { width: 42px; }</style>';

    docElem.insertBefore(fakeBody, refNode);
    bool = div.offsetWidth === 42;
    docElem.removeChild(fakeBody);

    return { matches: bool, media: q };
  };

}(document));

var tint = jQuery('#tint').on('click', function (e) {
      e.preventDefault();
      closePullout();
    }),
    body = jQuery('body'),
    re = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi

function closePullout(e) {
  var oldPullout = document.getElementById('workshop-full');
  if (oldPullout) {
    oldPullout.remove();
  }
  tint.hide();
}

$('.workshop .buy').on('click', function (e) {
  if (window.innerWidth < 640 || e.metaKey || e.ctrlKey || e.shiftKey) {
    return true;
  } else {
    e.preventDefault();
    closePullout();

    // var workshop = get(this.href, function (err, status) {
    //     if (err) {
    //         // something went wrong
    //         return;
    //     }

    //     console.log('The current status is: ' + status);
    // });
    // console.log(workshop);

    jQuery.get(this.href, function (data) {
      var div = jQuery('<div>').append(data.replace(re, '')),
          pullout = div.find('.workshop-pullout').wrapAll('<div id="workshop-full">').parent();
      tint.show();
      body.append(pullout);

      pullout.css({
        top: jQuery(window).scrollTop() + 50
      });
    });
    return false;
  }
});

/// https://github.com/remy/min.js/commit/799d49bf5c016b315c6300074d8d5c41a23045fa
//$(document).delegate('.close', 'click', function (e) {
jQuery(document).delegate('.close', 'click', function (e) {
  e.preventDefault();
  closePullout();
});