'use strict';

angular.module('clientApp', [])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      })
      .when('/twitter', {
        templateUrl: 'views/twitter.html',
        controller: 'TwitterCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
