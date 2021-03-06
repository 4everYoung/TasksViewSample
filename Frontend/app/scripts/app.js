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
  'angularModalService',
  'angucomplete-alt'
]);

app.config(function ($routeProvider, $httpProvider) {
  $routeProvider
    .when('/', {
      templateUrl:  'views/main.html',
      controller:   'MainCtrl',
      label:        'Home page'
    })
    .when('/about', {
      templateUrl:  'views/about.html',
      controller:   'AboutCtrl',
      label:        'About'
    })
    .when('/tasks', {
      templateUrl:  'views/tasks.html',
      controller:   'TasksCtrl',
      label:        'Tasks'
    })
    .when('/tasks/create', {
      templateUrl:  'views/createTask.html',
      controller:   'CreateTasksCtrl',
      label:        'Create Task'
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
    },
    unassign: {
      method: 'post', 
      url:    '/api/tasks/unassign.json'    
    },  
    assign: {
      method: 'post', 
      url:    '/api/tasks/assign.json'    
    }
  }
);
}]);

app.factory('TaskGroup', ['$resource', function($resource) {
  return $resource('/api/task_groups/:id.json', null, {
    query: { 
      method: 'get', 
      isArray: false 
    },  
    search: {
      method: 'post', 
      url:    '/api/task_groups/search_by_type/:type.json'       
    }    
  });
}]);

app.factory('User', ['$resource', function($resource) {
  return $resource('/api/users/:id.json', null, {
    query: { 
      method: 'get', 
      isArray: false 
    },  
    search: {
      method: 'post', 
      url:    '/api/businesses/search_by_name/:name.json'       
    }  
  });
}]);

app.factory('Business', ['$resource', function($resource) {
  return $resource('/api/businesses/:id.json', null, {
    search: {
      method: 'post', 
      url:    '/api/businesses/search_by_name/:name.json'       
    }  
  });
}]);

app.factory('Device', ['$resource', function($resource) {
  return $resource('/api/devices/:id.json', null, {
    query: {
      method: 'get', 
      isArray: false      
    }  
  });
}]);