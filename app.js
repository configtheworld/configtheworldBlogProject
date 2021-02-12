require('dotenv').config();
const express			= require("express"),
	  app				= express(),
	  bodyParser		=require("body-parser",{useNewUrlParser:true}),
	  expressSanitizer	= require("express-sanitizer"),
	  ecpressSession	= require("express-session"),
	  methodOverride	= require("method-override"),
	  mongoose			= require("mongoose"),
	  passport			= require("passport"),
	  cookieParser      = require("cookie-parser"),
	  flash        		= require("connect-flash"),
	  passportLocal		= require("passport-local"),
	  passportLocalMong = require("passport-local-mongoose"),
	  User 				= require("./models/usermodel"),
	  Post				= require("./models/postmodel");
const userRoutes		= require("./routes/index"),
	  postRoutes		= require("./routes/post");
//	  commentRoutes		= require("./routes/comment")
const path = require('path');

mongoose.Promise = global.Promise;
mongoose.connect("mongodb+srv://" +process.env.LINK+"",{
	useNewUrlParser:true,
	useFindAndModify:false,
	useUnifiedTopology:true,
	useCreateIndex:true
}).then(()=>{
	console.log("DB configed");
}).catch((err)=>{
	console.log("ERROR:",err.message);
});
	  
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(express.static(__dirname + "/public"));
app.use(require("express-session")({
	secret:"/posts",
	resave:false,
	saveUninitialized:false
}));
app.use(cookieParser("secret"));

app.use(flash());
app.set('views',path.join(__dirname,'views'));
app.use(express.static(path.join(__dirname,"public")));
app.use("/public",express.static(path.join(__dirname,"public")));
//alttaki iki satır her şifre bulunduran sitede olmalı
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());

app.locals.moment = require('moment');

//local strategy
passport.use(new passportLocal(User.authenticate()));
//bilgiyi şifreleme ve çözme kodları
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//creates middleware to pass user data (check if logged in) for EVERY route
app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
	next();
});


app.use(userRoutes);
app.use(postRoutes);
//app.use("/posts/:id/comments",commentRoutes);


/*-------------404 PAGE-----------------*/
app.get('*', (req, res) => {
	res.render("404");
});

/*
app.listen(3002,()=>{
	console.log("server is activated!!");
});*/

// heroku style listen

var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("Server Has Started!");
});




