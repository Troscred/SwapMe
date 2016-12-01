'use strict';

angular.
  module('core.dbAccess').
  factory('dbAccess', ['$resource',
    function($resource)
    {
      return { // "{" Not at the next line because of ASI (;) !
        users: $resource('http://localhost:3000/db/users'),
//        services: $resource('http://localhost:8001/db/services.json')
        categories: $resource('http://localhost:3000/db/categories')
      };
    }
  ]);
