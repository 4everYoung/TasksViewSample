'use strict';

var app = angular.module('taskViewSampleApp', [
  'ngAnimate',
  'ngCookies',
  'ngResource',
  'ngRoute',
  'ngSanitize',
  'ngTouch',
  'ui.grid.pagination',
  'ngMaterial'
])

app.config(function ($routeProvider, $httpProvider) {
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

app.factory('TaskGroup', ['$resource', function($resource) {
  return $resource('/api/tasks/task_types.json', null, {});
}]);
