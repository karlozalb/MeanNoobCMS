// Invoke 'strict' JavaScript mode
'use strict';

// Load the module dependencies
var users = require('../../app/controllers/users.server.controller'),
	articles = require('../../app/controllers/articles.server.controller');

// Define the routes module' method
module.exports = function(app) {
	// Set up the 'articles' base routes 
	app.route('/api/articles')
	   .get(articles.list)
	   .post(users.requiresLogin, articles.create);
	
	// Set up the 'articles' parameterized routes
	app.route('/api/articles/:articleId')
	   .get(articles.read)
	   .put(users.requiresLogin, articles.hasAuthorization, articles.update)
   	   //.put(articles.updateComments)
	   .delete(users.requiresLogin, articles.hasAuthorization, articles.delete);

	app.route('/api/comments')	  
	   .post(articles.createComment)
	   .put(users.requiresLogin, articles.approveComment);

	app.route('/api/comments/:commentId')
		.get(articles.readComment)
		.put(users.requiresLogin, articles.approveComment)
		.delete(users.requiresLogin, articles.deleteComment);


	/*app.route('/api/comments/:articleId')
	   .get(articles.commentsByArticleID);

	app.route('/api/comments/:articleId/:commentId')
	   .get(articles.readComment);		
   	   .put(users.requiresLogin, articles.hasAuthorization, articles.commentUpdate); */ 	   

	/*app.route('/api/comments/:commentId')	  
	   .post(articles.updateAddComment);*/

	// Set up the 'articleId' parameter middleware   
	app.param('articleId', articles.articleByID);
	app.param('commentId', articles.commentByID);
};