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
  'ui.grid.selection',
  'angularModalService'
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
    .when('/tasks/create', {
      templateUrl:  'views/createTask.html',
      controller:   'TasksCtrl',
      controllerAs: 'tasks',
      label: 'Create Task'
    })
    .otherwise({
      redirectTo: '/'
    });
});

app.factory('Task', ['$resource', function($resource) {
  return $resource('/api/tasks/:id.json', null, {
    query: {
      method: 'get',
      isArray: false
    },
    create: {
      method: 'post',
      url: '/api/tasks/create.json'
    },
    remove: {
      method: 'post',
      url:    '/api/tasks/remove_collection.json'
    }
  }
);
}]);

app.factory('TaskGroup', ['$resource', function($resource) {
  return $resource('/api/tasks/task_types.json', null, {});
}]);

app.factory('User', ['$resource', function($resource) {
  return $resource('/api/tasks/users.json', null, {});
}]);

