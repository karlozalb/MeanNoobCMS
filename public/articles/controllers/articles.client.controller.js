// Invoke 'strict' JavaScript mode
'use strict';

// Create the 'articles' controller
angular.module('articles').controller('ArticlesController', ['$scope','$routeParams','$location','Authentication','Articles','Comments','vcRecaptchaService',
    function($scope, $routeParams, $location, Authentication, Articles,Comments,vcRecaptchaService) {
    	// Expose the Authentication service
        $scope.authentication = Authentication;

        this.publicKey = "6LcegA8TAAAAAC0uDjhcbrUkx_ReH-UeCfFaBrrq";

        // Create a new controller method for creating new articles
        $scope.create = function() {
        	// Use the form fields to create a new article $resource object
            var article = new Articles({
                title: this.title,
                category: this.category,
                content: this.content
            });

            // Use the article '$save' method to send an appropriate POST request
            article.$save(function(response) {
            	// If an article was created successfully, redirect the user to the article's page 
                $location.path('articles/' + response._id);
            }, function(errorResponse) {
            	// Otherwise, present the user with the error message
                $scope.error = errorResponse.data.message;
            });
        };

        //Create a new comment (internally in the server, we add this comment to its associated article, in order to avoid permission problems)
        $scope.createComment = function() {

           var comment = new Comments({
                author: this.author,
                content: this.content,
                articleId: $scope.article._id
            });

            if(vcRecaptchaService.getResponse() === ""){ //if string is empty
                alert("Please resolve the captcha and submit!")
            }else {
                comment.captcharesponse = vcRecaptchaService.getResponse();

                comment.$save(function(response) {
                // If an article was created successfully, redirect the user to the article's page 
                    $scope.article.comments = response.comments;
                    $scope.commentsCount = $scope.article.comments.length;                

                    $scope.submitCommentForm.$setPristine();
                    $scope.author="";
                    $scope.content="";
                }, function(errorResponse) {
                    // Otherwise, present the user with the error message
                    $scope.error = errorResponse.data.message;
                });                
            }            
        };

        $scope.approveComment = function(){
                var comment = Comments.get({
                commentId: this.comment._id
            },function(){
                comment.approved = true;

                //$location.path('comments/' + comment._id);

                comment.$update({commentId:comment._id},function(response) {
                // If an article was updated successfully, redirect the user to the article's page 
                    $location.path('articles/' + $scope.article._id);
                }, function(errorResponse) {
                    // Otherwise, present the user with the error message
                    $scope.error = errorResponse.data.message;
                });
            });
        }

        // Create a new controller method for retrieving a list of articles
        $scope.find = function() {
        	// Use the article 'query' method to send an appropriate GET request
            $scope.articles = Articles.query();
        };

        // Create a new controller method for retrieving a single article
        $scope.findOne = function() {
        	// Use the article 'get' method to send an appropriate GET request

            $scope.article = Articles.get({
                articleId: $routeParams.articleId
            },function(){
                $scope.commentsCount = $scope.article.comments.length;                
            });            
        };

        // Create a new controller method for updating a single article
        $scope.update = function() {
        	// Use the article '$update' method to send an appropriate PUT request
            $scope.article.$update(function() {
            	// If an article was updated successfully, redirect the user to the article's page 
                $location.path('articles/' + $scope.article._id);
            }, function(errorResponse) {
            	// Otherwise, present the user with the error message
                $scope.error = errorResponse.data.message;
            });
        };

        // Create a new controller method for deleting a single article
        $scope.delete = function(article) {
        	// If an article was sent to the method, delete it
            if (article) {
            	// Use the article '$remove' method to delete the article
                article.$remove(function() {
                	// Remove the article from the articles list
                    for (var i in $scope.articles) {
                        if ($scope.articles[i] === article) {
                            $scope.articles.splice(i, 1);
                        }
                    }
                });
            } else {
            	// Otherwise, use the article '$remove' method to delete the article
                $scope.article.$remove(function() {
                    $location.path('articles');
                });
            }
        };

        $scope.deleteComment = function(pcommentId){

            var comment = Comments.get({commentId: pcommentId},function(){
                comment.$remove(function(response) {
                    $scope.article.comments = response.comments;
                    // If an article was updated successfully, redirect the user to the article's page 
                    $location.path('articles/adminpanel/' + $scope.article._id);
                }, function(errorResponse) {
                    // Otherwise, present the user with the error message
                    $scope.error = errorResponse.data.message;
                });
            });
        }

        $scope.tinymceOptions = {
            onChange: function(e) {
              // put logic here for keypress and cut/paste changes
            },
            inline: false,
            plugins : 'advlist autolink lists link image charmap print preview anchor searchreplace visualblocks code fullscreen insertdatetime media table contextmenu paste',
            skin: 'lightgray',
            theme : 'modern'            
        };
    }
]);