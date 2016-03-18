'use strict';

/**
 * @ngdoc overview
 * @name taskViewSampleApp
 * @description
 * # taskViewSampleApp
 *
 * Main module of the application.\
 */
var app = angular.module('taskViewSampleApp', [
  'ngAnimate',
  'ngCookies',
  'ngResource',
  'ngRoute',
  'ngSanitize',
  'ngTouch',
  'ui.grid'
])

app.config(function ($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'views/main.html',
      controller: 'MainCtrl',
      controllerAs: 'main'
    })
    .when('/about', {
      templateUrl: 'views/about.html',
      controller: 'AboutCtrl',
      controllerAs: 'about'
    })
    .when('/tasks', {
      templateUrl:  'views/tasks.html',
      controller:   'TasksCtrl',
      controllerAs: 'tasks'
    })
    .otherwise({
      redirectTo: '/'
    });
});

app.factory('Task', ['$resource', function($resource) {
  return $resource('/api/tasks/:id.json', null, {
    'update': { method:'PUT' }
  });
}]);
