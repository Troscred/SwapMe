'use strict';

angular.
  module('core.dbAccess').
  factory('dbAccess', ['$resource',
    function($resource)
    {
      return { // ! not at the next line because of ASI (;)
        users: $resource('http://localhost:3000/db'),
        services: $resource('http://localhost:8001/db/services.json')
      };
    }
  ]);
