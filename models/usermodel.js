const mongoose= require("mongoose");
const passportLocalMong= require("passport-local-mongoose");
const Post	= require("../models/postmodel");
const Comment = require("../models/commentmodel");

let UserSchema = new mongoose.Schema({
	username : String ,
	email 	 : String ,
	password : String ,
	isAdmin:{type:Boolean,default:false},
	posts: [{type:mongoose.Schema.Types.ObjectId , ref:"Post"}],
	comments: [{type:mongoose.Schema.Types.ObjectId , ref:"Comment"}]
})

UserSchema.plugin(passportLocalMong);

module.exports = mongoose.model ("User",UserSchema);