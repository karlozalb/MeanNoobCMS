// Invoke 'strict' JavaScript mode
'use strict';

// Load the module dependencies
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

// Define a new 'ArticleSchema'
var ArticleSchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},
	title: {
		type: String,
		default: '',
		trim: true,
		required: 'Title cannot be blank'
	},
	content: {
		type: String,
		default: '',
		trim: true
	},
	summary: {
		type: String,
		default: '',
		trim: true
	},
	creator: {
		type: Schema.ObjectId,
		ref: 'User'
	},	
	category: {
		type: String,
		default: '',
		trim: true
	},
	tags: [{tag: String}],
	comments: [{type: Schema.ObjectId,
				ref: 'Comment'}]
});

// Set the 'fullname' virtual property
ArticleSchema.virtual('excerpt').get(function() {
	return this.content.substring(0,500);
});

// Configure the 'ArticleSchema' to use getters and virtuals when transforming to JSON
ArticleSchema.set('toJSON', {
	getters: true,
	virtuals: true
});

// Create the 'Article' model out of the 'ArticleSchema'
mongoose.model('Article', ArticleSchema);