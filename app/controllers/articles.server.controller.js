// Invoke 'strict' JavaScript mode
'use strict';

// Load the module dependencies
var mongoose = require('mongoose'),
	Article = mongoose.model('Article'),
	Comment = mongoose.model('Comment'),
	request = require('request'),
	config = require('../../config/config');

// Create a new error handling controller method
var getErrorMessage = function(err) {
	if (err.errors) {
		for (var errName in err.errors) {
			if (err.errors[errName].message) return err.errors[errName].message;
		}
	} else {
		return 'Unknown server error';
	}
};

// Create a new controller method that creates new articles
exports.create = function(req, res) {
	// Create a new article object
	var article = new Article(req.body);

	// Set the article's 'creator' property
	article.creator = req.user;

	// Try saving the article
	article.save(function(err) {
		if (err) {
			// If an error occurs send the error message
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			// Send a JSON representation of the article 
			res.json(article);
		}
	});
};

//Add comments
exports.createComment = function(req,res){
	console.log(req);
	var request = require('request');
	request('https://www.google.com/recaptcha/api/siteverify?secret='+global.recaptcha+'&response='+req.body.captcharesponse, function (error, response, body) {
	  if (!error && response.statusCode == 200) {
	  	saveCommentInDB(req,res);
	  }
	})	
}

var saveCommentInDB = function(req,res){
	//Comment instance
	var comment = new Comment(req.body);

	//Store the comment in the DB
	comment.save(function(err) {
		if (err) {
			// If an error occurs send the error message
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		}else{
			//If success, we get the associated article and update it.
			Article.findById(comment.articleId).populate('comments','author content date approved').exec(function (err, doc) {
	    		if (err) return handleError(err);

		    	console.log(comment);

		    	doc.comments.push(comment);

		    	doc.save(function(err) {
					if (err) {
						// If an error occurs send the error message
						return res.status(400).send({
							message: getErrorMessage(err)
						});
					} else {
						// Send a JSON representation of the article 
						return res.json(doc);
					}
				});
	  		});		
		}
	});	
}

// Create a new controller method that retrieves a list of articles
exports.list = function(req, res) {
	// Use the model 'find' method to get a list of articles
	Article.find().sort('-created').populate('creator', 'firstName lastName fullName').populate('comments','author content date approved').exec(function(err, articles) {
		if (err) {
			// If an error occurs send the error message
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			// Send a JSON representation of the article 
			res.json(articles);
		}
	});
};

// Create a new controller method that returns an existing article
exports.read = function(req, res) {
	res.json(req.article);
};

exports.readComment = function(req, res) {
	res.json(req.comment);
};

// Create a new controller method that updates an existing article
exports.update = function(req, res) {
	// Get the article from the 'request' object
	var article = req.article;

	// Update the article fields
	article.title = req.body.title;
	article.content = req.body.content;

	// Try saving the updated article
	article.save(function(err) {
		if (err) {
			// If an error occurs send the error message
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			// Send a JSON representation of the article 
			res.json(article);
		}
	});
};

exports.approveComment = function(req, res) {
	// Get the article from the 'request' object
	var comment = req.comment;

	console.log("parametro:"+req.body);

	// Update the article fields
	comment.approved = req.body.approved;

	// Try saving the updated article
	comment.save(function(err) {
		if (err) {
			// If an error occurs send the error message
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		}
	});
};

exports.deleteComment = function(req,res){
	var comment = req.comment;

	// Use the model 'remove' method to delete the article
	comment.remove(function(err) {
		if (err) {
			// If an error occurs send the error message
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		}else {
			Article.findById(comment.articleId,function (err, doc) {
	    		if (err) return handleError(err);
		    	doc.save(function(err) {
					if (err) {
						// If an error occurs send the error message
						return res.status(400).send({
							message: getErrorMessage(err)
						});
					} else {
						// Send a JSON representation of the article 
						return res.json(doc);
					}
				});
	  		});		
		}
	});
};

// Create a new controller method that delete an existing article
exports.delete = function(req, res) {
	// Get the article from the 'request' object
	var article = req.article;

	// Use the model 'remove' method to delete the article
	article.remove(function(err) {
		if (err) {
			// If an error occurs send the error message
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			// Send a JSON representation of the article 
			res.json(article);
		}
	});
};

exports.commentsByArticleID = function(req, res, next){
	Comment.find({articleId: req.article._id}).exec(function(err, comments) {
		if (err) return next(err);
		if (!comments){
			return next(new Error('Failed to fetch comments ' + id));
		}else{
			res.json(comments);
		}
	});
}

// Create a new controller middleware that retrieves a single existing article
exports.articleByID = function(req, res, next, id) {
	// Use the model 'findById' method to find a single article 
	Article.findById(id).populate('creator', 'firstName lastName fullName').populate('comments','author content date approved articleId').exec(function(err, article) {
		if (err) return next(err);
		if (!article) return next(new Error('Failed to load article ' + id));

		// If an article is found use the 'request' object to pass it to the next middleware
		req.article = article;

		// Call the next middleware
		next();
	});
};

exports.commentByID = function(req, res, next, id) {
	// Use the model 'findById' method to find a single article 
	Comment.findById(id).exec(function(err, comment) {
		if (err) return next(err);
		if (!comment) return next(new Error('Failed to load comment ' + id));

		// If an article is found use the 'request' object to pass it to the next middleware
		req.comment = comment;

		// Call the next middleware
		next();
	});
};

// Create a new controller middleware that is used to authorize an article operation 
exports.hasAuthorization = function(req, res, next) {
	// If the current user is not the creator of the article send the appropriate error message
	if (req.article.creator.id !== req.user.id) {
		return res.status(403).send({
			message: 'User is not authorized'
		});
	}

	// Call the next middleware
	next();
};