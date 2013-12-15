var http = require('http'),
    path = require('path'),
    hbs = require ('hbs'),
    express = require('express'),
    slugify = require('./slug'),
    marked = require('marked'),
    _ = require('lodash'),
    fs = require('fs'),
    app = express();

require('datejs');

var data = {},
    locations = require('./data/locations'),
    sessions = require('./data/sessions'),
    sponsors = require('./data/sponsors'),
    workshops = require('./data/workshops'),
    sideview = require('./data/sideview'),
    configFile = './data/config.json',
    config = {};

function updateConfig(blocking) {
  var update = function (err, data) {
    if (err) {
      console.error('failed to read config', err);
      return;
    }

    config = JSON.parse(data);

    console.log('updated config');

    app.set('mode', config.mode);
    app.set('soldout', config.soldout);
    app.set('onsale', config.onsale);
    app.set('videos', config.videos);

    workshops.workshops.forEach(function (workshop) {
      workshop.soldout = config.soldout[workshop.slug];
    });
  };

  if (blocking === true) {
    try {
      update(null, fs.readFileSync(configFile, 'utf8'));
    } catch (e) {
      console.error('failed to read sync config', e);
    }
  } else {
    fs.readFile(configFile, 'utf8', update);
  }
}

// watch the config which sets the mode of the site and soldout state
fs.watch('./data/config.json', updateConfig);
updateConfig(true); // read synchonously on boot

sessions = (function (sessionData) {
  /*
    titles = titles and descriptions only
    speakers = titles, descriptions and available speaker information (name, photo, etc)
    schedule = full schedule with all data and times
  */
  var tempSessions = [],
      sessions = sessionData.sessions,
      startTime = new Date(sessionData.startTime);

  // TODO: This section can probably be made a lot cleaner
  // with some map reduce pluck vooodoo
  if (app.settings.mode === "titles") {
    sessions.forEach(function (session) {
      if (session.break) return;
      tempSessions.push({
        title: session.title,
        description: session.description,
        slug: session.slug,
        background: session.background
      });
    });
  };

  if (app.settings.mode === "speakers") {
    sessions.forEach(function (session) {
      if (session.break) return;
      tempSessions.push(session);
      /*
      tempSessions.push({
        title: session.title,
        description: session.description,
        speaker: session.speaker,
        slug: session.slug,
        background: session.background
      });
      */
    });
  }

  if (app.settings.mode === "schedule") {
    sessions.forEach(function (session) {
      session.date = startTime.getTime();
      if (!session.start) session.start = startTime.clone().toString('HH:mm');
      if (!session.end) session.end = startTime.add({ minutes: session.duration }).clone().toString('HH:mm');
    });
    tempSessions = sessions;
  }

  // slugify all titles
  tempSessions.forEach(function (session) {
    session.slug = slugify(session.title);
  });

  return {
    sessions: tempSessions
  };
})(sessions);


sessions.sessions.forEach(function (session) {
  return;
  if ( (session.speaker && session.speaker.twitter)
    || session.slides
    || session.audio
    || session.video
  ) {
    session.links = true;
  }
});

_.assign(data, locations, sessions, sponsors, workshops);
data.offline = true;

app.configure('production', function () {
  app.set('isproduction', true);
});

// RS: run sass compile from command line to allow for devtools
// sourcemap support: sass --watch --scss --sourcemap public/sass/fullfrontal.scss:public/fullfrontal.css
// NOTE: requires sass 3.x - installed via gem install sass --pre as of July 6, 2013

app.configure(function (){
  app.set('port', process.env.PORT || 3000);
  app.use(express.favicon(path.join(__dirname, 'public/favicon.ico')));
  app.set('views', __dirname + '/views');
  app.set('view engine' ,'hbs');
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

hbs.registerPartials(__dirname + '/views/partials');
hbs.registerHelper('markdown', function (options) {
  return marked(options.fn(this));
});

hbs.registerHelper('noorphan', function (context, options) {
  var i = context.lastIndexOf(' ');
  return new hbs.handlebars.SafeString(context.substr(0, i) + '&nbsp;' + context.substr(i + 1));
});

hbs.registerHelper('log', function (context) {
  console.log(context);
});

hbs.registerHelper('link', function () {
  console.log(this);
  var text = Object.keys(this)[0];
  var url = this[text];
  text = hbs.handlebars.Utils.escapeExpression(text);
  url  = hbs.handlebars.Utils.escapeExpression(url);

  var result = '<a class="button" href="' + url + '">' + text + '</a>';

  return new hbs.handlebars.SafeString(result);

});


app.configure('development', function (){
  app.use(express.errorHandler());
});

app.get('/', function (req, res) {
  res.render('index', data);
});

app.get('/workshop', function (req, res) {
  res.render('workshop-full', workshops);
});


app.get('/sideview', function (req, res) {
  res.render('sideview', sideview);
});

app.get('/workshop/:slug', function (req, res) {
  res.render('workshop-full', {
    workshops: _.filter(workshops.workshops, { 'slug': req.params.slug })
  });
});


/* API? */
app.get('/api/all', function (req, res) {
  res.json(data);
});
app.get('/api/sessions', function (req, res) {
  res.json(sessions);
});
app.get('/api/locations', function (req, res) {
  res.json(locations);
});
app.get('/api/sponsors', function (req, res) {
  res.json(sponsors);
});
app.get('/api/workshops', function (req, res) {
  res.json(workshops);
});

app.get('/details', function (req, res) {
  fs.readFile('public/details.html', 'utf8', function (err, data) {
    res.send(data);
  });
});

app.get('/sponsorship', function (req, res) {
  res.render('sponsorship');
});

http.createServer(app).listen(app.get('port'), function (){
  console.log("Express server listening on http://localhost:" + app.get('port'));
});
