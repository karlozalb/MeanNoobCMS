// Invoke 'strict' JavaScript mode
'use strict';

// Load the module dependencies
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

// Define a new 'ArticleSchema'
var CommentSchema = new Schema({	
	author: String,
	content: String, 
	date: {type: Date,default: Date.now},
	approved: {type: Boolean,default: false},
	articleId: String
});

CommentSchema.pre('remove', function(next){
    this.model('Article').update(
        {_id: this.articleId}, 
        {$pull: {comments: this._id}}, 
        {multi: true},
        next
    );
});

// Configure the 'ArticleSchema' to use getters and virtuals when transforming to JSON
CommentSchema.set('toJSON', {
	getters: true,
	virtuals: true
});

mongoose.model('Comment', CommentSchema);