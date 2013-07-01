var http = require('http'),
    path = require('path'),
    hbs = require ('hbs'),
    sass = require('node-sass'),
    express = require('express'),
    _ = require('lodash');

var data = {},
    locations = require('./data/locations'),
    sessions = require('./data/sessions'),
    sponsors = require('./data/sponsors'),
    workshops = require('./data/workshops');

var sessionMode = "speakers", // titles|speakers|schedule

sessions = (function (sessions, sessionMode) {
  /*
    titles = titles and descriptions only
    speakers = titles, descriptions and available speaker information (name, photo, etc)
    schedule = full schedule with all data and times
  */
  var tempSessions = [];

  // TODO: This section can probably be made a lot cleaner
  // with some map reduce pluck vooodoo
  if (sessionMode === "titles") {
    _.each(sessions.sessions, function (session) {
      if (session.break) return;
      tempSessions.push({
        title: session.title,
        description: session.description
      });
    });
  };

  if (sessionMode === "speakers") {
    _.each(sessions.sessions, function (session) {
      if (session.break) return;
      tempSessions.push({
        title: session.title,
        description: session.description,
        speaker: session.speaker
      });
    });
  };

  if (sessionMode === "schedule") {
    tempSessions = sessions.sessions;
  }

  return {
    sessions: tempSessions
  }
})(sessions, sessionMode);


_.each(sessions.sessions, function (session) {
  if ( (session.speaker && session.speaker.twitter)
    || session.slides
    || session.audio
    || session.video
  ) {
    session.links = true;
  }
});

// TODO When full schdule order session array according to 'startTime'
// so that order in sessions.json is not important

_.assign(data, locations, sessions, sponsors, workshops);
data.sessionMode = sessionMode;

var app = express();

app.configure('production', function () {
  app.set('isproduction', true);
});

app.configure(function (){
  app.set('port', process.env.PORT || 3000);
  app.use(express.favicon(path.join(__dirname, 'public/favicon.ico')));
  app.set('views', __dirname + '/views');
  app.set('view engine' ,'hbs');
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(sass.middleware({
     src: __dirname + '/public/sass',
     dest: __dirname + '/public',
     debug: true
  }));
  app.use(express.static(path.join(__dirname, 'public')));
});

hbs.registerPartials(__dirname + '/views/partials');

app.configure('development', function (){
  app.use(express.errorHandler());
});

app.get('/', function (req, res) {
  res.render('index', data);
});

app.get('/workshop', function (req, res) {
  res.render('pullout', workshops);
});

app.get('/workshop/:slug', function (req, res) {
  var workshopData = {};

  _.assign(workshopData, _.filter(workshops.workshops, { 'slug': req.params.slug }));

  res.render('pullout', {
    workshops: workshopData
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


app.get('/sponsorship', function (req, res) {
  res.render('sponsorship');
});

http.createServer(app).listen(app.get('port'), function (){
  console.log("Express server listening on http://localhost:" + app.get('port'));
});
