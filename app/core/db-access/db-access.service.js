'use strict';

angular.
  module('core.dbAccess').
  factory('dbAccess', ['$resource',
    function($resource)
    {
      return $resource('http://localhost:3000/db', {}, 
      {
        query: 
        {
          method: 'GET',
          // params: {phoneId: 'phones'},
          // isArray: true
        }
      });
    }
  ]);
