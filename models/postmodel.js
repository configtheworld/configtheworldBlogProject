const mongoose= require("mongoose");
const User 	= require("../models/usermodel");
const Comment =require("../models/commentmodel");

let PostSchema = new mongoose.Schema({
	postname : String ,
	postimage : String ,
	postbody : String,
	author:{id:{type: mongoose.Schema.Types.ObjectId,
				ref: "User"},
    	    username:{type: String , ref:"User"}},
	comments:/*[{type: mongoose.Schema,
			   ref: "Comment"}],*/
	[{
        commentBody: {
            type: String,
            required: true
        },
        createdAt: {
            type: String,
            default: Date.now
        },
        commentUser: {
          name : {
            type: String,
            required: true
          }
        },
    }],
	
	created:{type:Date ,default:Date.now}
});


module.exports = mongoose.model ("Post",PostSchema);