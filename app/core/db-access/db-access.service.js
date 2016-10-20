'use strict';

angular.
  module('core.dbAccess').
  factory('dbAccess', ['$resource',
    function($resource)
    {
      return $resource('http://localhost:3000/db', {}, 
      {
        getUsers: 
        {
          method: 'GET',
          isArray: true
        }
      });
    }
  ]);
