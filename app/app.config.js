'use strict';

angular.
  module('app').
  config(['$locationProvider' ,'$routeProvider',
    function config($locationProvider, $routeProvider)
    {
      $locationProvider.hashPrefix('!');

      $routeProvider.
        when('/main',
        {
          template: 'AngularJS is fucking {{"awesome" | uppercase}} !'
        }).
        when('/map',
        {
          template: '<map-container></map-container>'
        }).
        otherwise('/main');
    }
  ]);