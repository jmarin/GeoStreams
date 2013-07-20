'use strict';

angular.module('clientApp')
  .controller('LoginCtrl', function ($scope, UserService) {
	$scope.credentials = {
        user: UserService.name,
        password: UserService.password
   	 };

   	 $scope.login = function() {
   	 	console.log($scope.credentials.user + ", " + $scope.credentials.password);
   	 };


  });
