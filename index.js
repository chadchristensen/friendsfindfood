var express = require('express');
var bodyParser = require('body-parser');
var ejsLayouts = require('express-ejs-layouts');
var db = require('./models');
var app = express();

app.set('view engine', 'ejs');

app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(ejsLayouts);
app.use(express.static(__dirname + '/public/'));


// GET / - display all posts and their authors
app.get('/', function(req, res) {
  db.groups.findAll({
    // include: [db.author]
  })
  .then(function(groups) {
    res.render('main/index', { groups: groups });
  })
  .catch(function(error) {
    res.status(400).render('main/404');
  });
});

// bring in authors and posts controllers
//app.use('/users', require('./controllers/users'));
app.use('/groups', require('./controllers/groups'));
//app.use('/tags', require('./controllers/tags'));

var server = app.listen(process.env.PORT || 3000);

module.exports = server;
