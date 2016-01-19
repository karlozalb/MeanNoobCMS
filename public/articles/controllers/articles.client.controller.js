// Invoke 'strict' JavaScript mode
'use strict';

// Create the 'articles' controller
angular.module('articles').controller('ArticlesController', ['$scope','$rootScope','$route','$routeParams','$location','vcRecaptchaService','Authentication','Articles','PaginatedCategorizedArticles','PaginatedArticles','Comments','SharedArticlesService',
    function($scope,$rootScope,$route,$routeParams,$location,vcRecaptchaService,Authentication,Articles,PaginatedCategorizedArticles,PaginatedArticles,Comments,SharedArticlesService) {
    	// Expose the Authentication service
        $scope.authentication = Authentication;

        var paramValue = $routeParams.param;
        console.log(paramValue); 

        this.publicKey = "6LcegA8TAAAAAC0uDjhcbrUkx_ReH-UeCfFaBrrq";

        /*$scope.$watch('SharedArticlesService.articles',function() {
                 return SharedArticlesService.articles;
        }, function(newData, oldData) {
               if(newData !== oldData) {
                    $scope.articles = newData;
               }
        }); */    

        $scope.$watchCollection(function(){return $rootScope.articles;},function(newVal,oldVal) {
                $scope.articles = $rootScope.articles;
                $scope.numpages = $rootScope.pageCount;
                $scope.currentPageNumber = $rootScope.currentPageNumber;    
        },true);

        // Create a new controller method for creating new articles
        $scope.create = function() {
        	// Use the form fields to create a new article $resource object
            var article = new Articles({
                title: this.title,
                category: this.category,
                summary: this.summary,
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
                alert("Por favor, resuelve el captcha y pulsa enviar");
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
            $rootScope.articles = Articles.query();
            //SharedArticlesService.setProperty(Articles.query());
        };

        $scope.findPaginated = function(){

            if ($routeParams.category != undefined){
                PaginatedCategorizedArticles.get({pageNumber: $routeParams.pageNumber,searchCriteria: $routeParams.category},function(response){
                    $rootScope.articles = response.output;
                    $rootScope.numpages = response.pageCount;
                    if ($routeParams.pageNumber == undefined){
                        $rootScope.currentPageNumber = 1;
                    }else{
                        $rootScope.currentPageNumber = parseInt($routeParams.pageNumber);                 
                    }
                },function(errorResponse) {
                    // Otherwise, present the user with the error message
                    $scope.error = errorResponse.data.message;
                });
            }else{
                PaginatedArticles.get({pageNumber: $routeParams.pageNumber},function(response){
                    $scope.articles = response.output;
                    //$rootScope.articles = response.output;
                    //SharedArticlesService.articles = response.output;
                    $scope.numpages = response.pageCount;
                    $scope.currentPageNumber = parseInt($routeParams.pageNumber);
                },function(errorResponse) {
                    // Otherwise, present the user with the error message
                    $scope.error = errorResponse.data.message;
                });
            }
        }        

        // Create a new controller method for retrieving a single article
        $scope.findOne = function() {
        	// Use the article 'get' method to send an appropriate GET request

            $rootScope.article = Articles.get({
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

        $scope.isWeb = function(category){
            if (category.toUpperCase() == "WEB"){
                return true;
            }else{
                return false;
            }
        }

         $scope.isAndroid = function(category){
            if (category.toUpperCase() == "ANDROID"){
                return true;
            }else{
                return false;
            }
        }

        $scope.isGamedev = function(category){
            if (category.toUpperCase() == "GAMEDEV"){
                return true;
            }else{
                return false;
            }
        }    

        $scope.isMisc = function(category){
            if (category.toUpperCase() == "MISC"){
                return true;
            }else{
                return false;
            }
        }  

        $scope.getCategoryImage = function(category){

            if (category == undefined) return ""; 

            var prefix = "../img/";
            var suffix = "-category.png"
            var main = "";

            var categoryUpper = category.toUpperCase();

            if (categoryUpper == "WEB"){
                main = "web";
            }else if (categoryUpper == "ANDROID"){
                main = "android";
            }else if (categoryUpper == "MISC"){
                main = "misc";
            }else if (categoryUpper == "GAMEDEV"){
                main = "gamedev-small";
            }

            return prefix+main+suffix;
        }      
    }
]);

angular.module('articles').controller('SearchController', ['$scope','$rootScope','$routeParams','PaginatedArticles',
   function($scope,$rootScope,$routeParams,PaginatedArticles) {  

        $scope.searchArticles = function(){
            PaginatedArticles.get({pageNumber: $routeParams.pageNumber,searchCriteria: this.searchCriteria},function(response){
                $rootScope.articles = response.output;
                $rootScope.numpages = response.pageCount;
                $rootScope.currentPageNumber = parseInt($routeParams.pageNumber);             
            },function(errorResponse) {
                // Otherwise, present the user with the error message
                $scope.error = errorResponse.data.message;
            });
        }         
   }
]);
