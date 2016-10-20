'use strict';

angular.
  module('mapContainer').
  component('mapContainer',
  {
    templateUrl: 'components/map-container/map-container.template.html',
    controller:('mapContainerController',
      ['$scope','dbAccess',
      function ($scope, dbAccess)//, NgMap)
      {
        var geocoder = new google.maps.Geocoder();
        $scope.usersLocation = [];
        
        dbAccess.getUsers(function(users) // DB Success
        {
          users.forEach(function(user) // Instead of for loop to get dinstinct closure for every iteration
          {
            geocoder.geocode({"address": user.Adresse + ", Suisse"},function(results, status) // -> Specify options to limit to CH? or zone
            {
              if (status == google.maps.GeocoderStatus.OK && results.length > 0) // Geocoding success
              {
                var loc = results[0].geometry.location;
                $scope.usersLocation.push({"id" : user.ID, "pos" : [loc.lat(), loc.lng()]});
              }
              else // Geocoding failure
              {
                console.err("Geocoding process failed for " + user.Name);
              }
            });
          });
          
          $scope.users = users;
        },
        function (err) // DB Failure
        {
          console.err("Error while fetching users from db !");
        });
        console.log($scope.usersLocation);
      }])
  });