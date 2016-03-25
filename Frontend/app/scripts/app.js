'use strict';

var app = angular.module('taskViewSampleApp', [
  'ngAnimate',
  'ngCookies',
  'ngResource',
  'ngRoute',
  'ngSanitize',
  'ngTouch',
  'ui.grid.pagination',
  'ngMaterial',
  'ng-breadcrumbs',
  'ui.grid',
  'ui.grid.selection'
]);

app.config(function ($routeProvider, $httpProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'views/main.html',
      controller: 'MainCtrl',
      controllerAs: 'main',
      label: 'Home page'
    })
    .when('/about', {
      templateUrl: 'views/about.html',
      controller: 'AboutCtrl',
      controllerAs: 'about',
      label: 'About'
    })
    .when('/tasks', {
      templateUrl:  'views/tasks.html',
      controller:   'TasksCtrl',
      controllerAs: 'tasks',
      label: 'Tasks'
    })
    .otherwise({
      redirectTo: '/'
    });
});

app.factory('Task', ['$resource', function($resource) {
  return $resource('/api/tasks/:id.json', null, { query: { method: 'get', isArray: false } }
);
}]);

app.factory('TaskGroup', ['$resource', function($resource) {
  return $resource('/api/tasks/task_types.json', null, {});
}]);
