const express = require('express'),
  router = express.Router({ mergeParams: true }),
  passport = require('passport'),
  User = require('../models/usermodel'),
  Post = require('../models/postmodel');
const middleware = require('../middleware/middleware');
const { isLoggedIn, checkUserPost, checkUserComment, isAdmin, isSafe } =
  middleware;
//enter page
router.get('/', (req, res) => {
  res.render('landing');
});

// PROFILE

router.get('/profiles/:id', isLoggedIn, (req, res) => {
  User.findById(req.params.id, (err, foundUser) => {
    if (err) {
      res.redirect('/posts');
      console.log(err);
    }
    Post.find()
      .where('author.id')
      .equals(foundUser._id)
      .exec((err, posts) => {
        if (err) {
          req.flash('error', 'something went wrong');
          res.redirect('/posts');
        }
        res.render('auth/profile', { user: foundUser, posts: posts });
      });
  });
});

//===========AUTH ROUTES==================

// new user registration       SIGN IN
router.get('/register', (req, res) => {
  res.render('auth/register');
});
router.post('/register', (req, res) => {
  var newUser = new User({
    username: req.body.username,
    email: req.body.email,
  });
  if (req.body.adminCode === process.env.CODE) {
    newUser.isAdmin = true;
  }
  User.register(newUser, req.body.password, (err, user) => {
    if (err) {
      console.log(err);
      req.flash('error', 'try again');
      res.render('auth/register');
    }
    passport.authenticate('local')(req, res, () => {
      req.flash(
        'success',
        'Successfully Signed Up! Welcome on board ' + req.body.username
      );
      res.redirect('/posts');
    });
  });
});

//login ana sayfa    		LOGIN
router.get('/login', (req, res) => {
  res.render('auth/login');
});

router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/posts',
    failureRedirect: '/login',
    failureFlash: true,
    successFlash: 'Welcome to Configtheworld!',
  }),
  (req, res) => {
    res.render('postpage');
  }
);

//logout

router.get('/logout', isLoggedIn, (req, res) => {
  req.logout();
  req.flash('success', 'Safe logout completed ,See you later!');
  res.redirect('/posts');
});

module.exports = router;
