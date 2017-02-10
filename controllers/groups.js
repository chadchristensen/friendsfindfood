var express = require('express');
var db = require('../models');
var router = express.Router();
var marked = require('marked');
var async = require('async');
var Yelp = require('yelp');
var yelp = new Yelp({
  consumer_key: 'OzaeqW-1MzZ0UrRq7cvouA',
  consumer_secret: 'i1x50RLlqDsKE7ueg_Z7v6EoJHA',
  token: 'ympYzOtJZ3ouUt3lPJ5MbQChv_llm-Kt',
  token_secret: 'W6BCF6-Bz_YF8e9ccrXgGlGBsc0',
});

// POST /groups- create a new group
router.post('/', function(req, res) {
  db.groups.create({
    title: req.body.title,
    time: req.body.time,
    location: req.body.location
  })
  .then(function(group) {
    res.redirect('/groups/' + group.id);
  })
  .catch(function(error) {
    res.status(400).render('main/404');
  });
});
// GET /groups/new - display form for creating new groups
router.get('/new', function(req, res) {
  res.render('groups/new');
});
// GET /groups/:id - display a specific groups
router.get('/:id', function(req, res) {
  db.groups.find({
    where: { id: req.params.id },
  })
  .then(function(group) {
    if (!group) throw Error();
    yelp.search({ term: 'food', location: group.location, limit: 10 })
    .then(function (restaurants) {
      //console.log(restaurants);
      yelprestaurants=restaurants.businesses;
      //console.log('yelprestaurants',yelprestaurants);
      db.recommendations.findAll({
        where: { groupId: req.params.id },
      }).then(function (suggestrests) {
        console.log('suggestrests',suggestrests);
        res.render('groups/show', { group: group, restaurants:yelprestaurants, suggestrests:suggestrests});
      })
    })
    .catch(function (err) {
      console.error(err);
    });
  })
  .catch(function(error) {
    res.status(400).render('main/404');
  });
});

router.post('/recommendations', function(req, res) {
  //console.log('req.body',req.body);
  db.recommendations.create({
    'groupId':req.body.groupId,
    'restName': req.body.name,
    'url': req.body.url,
    'rate': parseFloat(req.body.rating),
    thumbup:0,
    thumbdown:0
  })
  .then(function(group) {
    res.redirect('/groups/' + group.groupId);
  })
  .catch(function(error) {
    console.log(error);
    res.status(400).render('main/404');
  });
});


router.post('/recommendations/thumbup', function(req, res) {
  console.log('recommendation body:', req.body);
  db.recommendations.findById(req.body.id).then(function(recommendation) {
    console.log('recommendation', recommendation);
    recommendation.thumbup=recommendation.thumbup+1;
    recommendation.save().then(function(){
      res.redirect('/groups/' + recommendation.groupId)
    })

  });
});

router.post('/recommendations/thumbdown', function(req, res) {
  console.log('recommendation body:', req.body);
  db.recommendations.findById(req.body.id).then(function(recommendation) {
    console.log('recommendation', recommendation);
    recommendation.thumbdown=recommendation.thumbdown+1;
    recommendation.save().then(function(){
      res.redirect('/groups/' + recommendation.groupId)
    })

  });
});
module.exports = router;
