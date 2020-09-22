var Post = require ("../models/postmodel");
var User = require ("../models/usermodel");
var Comment = require("../models/commentmodel");

module.exports={
	//1 IS LOGGED IN
	isLoggedIn : function(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error","You must sign in to do that!");
	res.redirect("/login");
},
	//2 CHECK USER
checkUserPost: function(req, res, next){
    Post.findById(req.params.id, function(err, foundPost){
      if(err || !foundPost){
          console.log(err);
          req.flash('error', 'Sorry, that Post does not exist!');
          res.redirect('/posts');
      } else if(foundPost.author.id.equals(req.user._id) || req.user.isAdmin){
          req.post = foundPost;
          next();
      } else {
          req.flash('error', 'You don\'t have permission to do that!');
          res.redirect('/posts/' + req.params.id);
      }
    });
  },
	
	//3 CHECK USER COMMENT
	checkUserComment: function(req, res, next){
    Comment.findById(req.params.commentId, function(err, foundComment){
       if(err || !foundComment){
           console.log(err);
           req.flash('error', 'Sorry, that comment does not exist!');
           res.redirect('/posts');
       } else if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin){
            req.comment = foundComment;
            next();
       } else {
           req.flash('error', 'You don\'t have permission to do that!');
           res.redirect('/posts/' + req.params.id);
       }
    });
  },
	//4 IS ADMIN
	isAdmin: function(req, res, next) {
    if(req.user.isAdmin) {
      next();
    } else {
      req.flash('error', 'Do not have permission');
      res.redirect('back');
    }
  },
	// 5 kotu resimler yukelenmesın sadece unsplash dan yukleme yapılabilir icin function
	isSafe: function(req, res, next) {
    if(req.body.postimage.match(/^https:\/\/images\.unsplash\.com\/.*/)||req.body.postimage.match("")) {
      next();
    }else {
      req.flash('error', 'Only images from images.unsplash.com allowed.\nSee https://youtu.be/Bn3weNRQRDE for how to copy image urls from unsplash.');
      res.redirect('back');
    }
  }
	
}
