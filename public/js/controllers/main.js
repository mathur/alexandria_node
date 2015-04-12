angular.module('bookController', [])

.controller('mainController', ['$scope','$http','Books', function($scope, $http, Books) {
	$scope.formData = {};
	$scope.loading = true;

	Books.get().success(function(data) {
			$scope.books = data;
			$scope.loading = false;
		});

	$scope.createBook = function() {
		if ($scope.formData.text != undefined) {
			$scope.loading = true;
		Books.create($scope.formData).success(function(data) {
					$scope.loading = false;
					$scope.formData = {};
					$scope.books = data;
				});
		}
	};

	$scope.checkoutBook = function(id) {
		$scope.loading = true;
		Books.delete(id).success(function(data) {
				$scope.loading = false;
				$scope.books = data;
			});
	};
}]);
