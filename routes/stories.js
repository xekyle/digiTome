const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose');

const router = express.Router();

const User = mongoose.model('user');
const Story = mongoose.model('story');

const { ensureAuthenticated } = require('../helpers/auth');

router.get('/index', (req, res) =>{
  Story.find({ status: 'public' })
    .populate('user')
    .then(stories => {
      res.render('stories/index', {
        pageLabel: 'Records index',
        stories: stories
      });
    });
});

router.get('/read/:id', (req, res) => { // <=< Read individual story
  Story.findOne({ _id: req.params.id })
  .populate('user')
  .then(story => {
    res.render('stories/read', {
    story: story
    });
  });
});

router.get('/create', ensureAuthenticated,(req, res) => { // <=< Get to Create stories form
  res.render('stories/create', {
    pageLabel: 'Create Record',
  });
});

router.get('/read', (req, res) =>{
  res.render('stories/read', {
    pageLabel: 'Read Record',
  });
});

router.get('/update', ensureAuthenticated, (req, res) => {
  res.render('stories/update', {
    pageLabel: 'Update Record',
  });
});

router.post('/', ensureAuthenticated, (req, res) => { // <=< Create Story process
  let allowComments;

  if(req.body.allowComments){
    allowComments = true;
  } else {
    allowComments = false;
  }

  const newStory = { // <=< builds new story object
    title: req.body.title,
    body: req.body.body,
    status: req.body.status,
    allowComments: allowComments,
    user: req.user.id
  }

    new Story(newStory) // <=< saves the story object
    .save()
    .then(story => {
      res.redirect(`/stories/show/${story.id}`);
    });
});

module.exports = router;
