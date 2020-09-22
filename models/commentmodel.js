const mongoose= require("mongoose");


const commentSchema = mongoose.Schema({
    text:String,
    createdAt:{type:Date,default:Date.now},
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username:{
				type:String	
		} 
    }								
});

module.exports = mongoose.model("Comment", commentSchema);