angular.module('bookService', []).factory('Books', ['$http',function($http) {
		return {
			get : function() {
				return $http.get('/api/books');
			},
			create : function(bookData) {
				return $http.post('/api/books', bookData);
			},
			delete : function(id) {
				return $http.delete('/api/books/' + id);
			}
		}
	}]);
