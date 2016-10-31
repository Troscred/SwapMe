'use strict';

angular.module('usersList')
  .component('usersList',
  {
    templateUrl:
      'components/users-list/users-list.template.html',
    controller:
      ('usersListController',
      ['$scope', 'dbAccess',
      function ($scope, dbAccess)
      {
      }])
  });