'use strict';

angular.
  module('app').
  config(['$locationProvider' ,'$routeProvider',
    function config($locationProvider, $routeProvider)
    {
      $locationProvider.hashPrefix('!');

      $routeProvider.
        when('/Home',
        {
          template: '<search-engine></search-engine>'
        }).
        when('/Connection',
        {
          template: "CONNECTION"
        }).
        when('/HowItWorks',
        {
          template: "HOW IT WORKS"
        }).
        when('/Contact',
        {
          template: "CONTACT"
        }).
        otherwise('/Home');
    }
  ]);
