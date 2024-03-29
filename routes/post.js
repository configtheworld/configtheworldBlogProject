const express = require('express');
const router = express.Router({ mergeParams: true });
const Post = require('../models/postmodel');
const Comment = require('../models/commentmodel');
const middleware = require('../middleware/middleware');
const { isLoggedIn, checkUserPost, checkUserComment, isAdmin, isSafe } =
  middleware;
// INDEX
router.get('/posts', (req, res) => {
  Post.find({}, function (err, posts) {
    if (err) {
      console.log(err);
    } else {
      res.render('postpage', { posts: posts });
    }
  });
});
/* NEW*/
router.get('/posts/new', isLoggedIn, (req, res) => {
  res.render('postviews/newpost');
});

// CREATE
router.post('/posts/new', isLoggedIn, isSafe, (req, res) => {
  var name = req.body.postname;
  var image = req.body.postimage;
  var body = req.body.postbody;
  var author = { id: req.user._id, username: req.user.username };
  var newPost = {
    postname: name,
    postimage: image,
    postbody: body,
    author: author,
  };

  Post.create(newPost, (err, post) => {
    if (err) {
      console.log(err);
      return res.render('postpage');
    } else {
      // yaptığımız şu postu oluşturunca ve error almayınca current olan usere postu pushluyoruz sonrada saveliyoruz
      req.user.posts.push(post);
      //req.post.author.push(req.user);
      req.user.save((err, data) => {
        if (err) {
          console.log(err);
        } else {
          console.log(data);
        }
      });
      return res.redirect('/posts');
    }
  });
});
// SHOW
router.get('/posts/:id', (req, res) => {
  Post.findById(req.params.id, (err, foundPost) => {
    if (err) {
      res.redirect('/posts');
    } else {
      res.render('postviews/postshow', { post: foundPost });
    }
  });
});
// EDIT
router.get('/posts/:id/edit', checkUserPost, isLoggedIn, (req, res) => {
  Post.findById(req.params.id, (err, foundPost) => {
    if (err) {
      res.redirect('/posts');
    } else {
      res.render('postviews/postedit', { post: foundPost });
    }
  });
});

// UPDATE
router.put('/posts/:id', isSafe, checkUserPost, (req, res) => {
  let newPost = {
    postname: req.body.postname,
    postimage: req.body.postimage,
    postbody: req.body.postbody,
  };
  //req.body.post.postbody= req.sanitize(req.body.post.body);
  Post.findByIdAndUpdate(req.params.id, newPost, (err, updatedPost) => {
    if (err) {
      req.flash('error', err.message);
      res.redirect('/posts');
    } else {
      req.post.save(function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log(updatedPost.postname);
          req.flash('success', 'Successfully Updated!');
          res.redirect('/posts/' + req.params.id);
        }
      });
    }
  });
});

// DESTROY
router.delete('/posts/:id', checkUserPost, isLoggedIn, (req, res) => {
  Post.findByIdAndRemove(req.params.id, (err) => {
    if (err) {
      console.log(err);
      req.flash('error', err.message);
      res.redirect('/posts');
    } else {
      req.flash('error', 'Post deleted!');
      res.redirect('/posts');
    }
  });
});

//=================== COMMENT ROUTESS ================
// comments new bizde post show

//new

router.post('/posts/:id', isLoggedIn, (req, res) => {
  const newComment = {
    commentBody: req.body.commentBody,
    commentUser: {
      name: req.user.username,
    },
  };
  Post.findOneAndUpdate(
    {
      _id: req.params.id,
    },
    {
      $push: {
        comments: {
          $each: [newComment],
          $position: 0,
        },
      },
    }
  )
    .then((post) => {
      req.flash('success', 'Comment posted!');
      res.redirect('/posts/' + req.params.id);
    })
    .catch((err) => {
      console.log(`Error: ${err.message}`);
      res.status(500).send();
    });
});

module.exports = router;
