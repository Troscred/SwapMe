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
        
        // Get users from DB
        dbAccess.getUsers(function(data) // DB Success
        {
          for (var i=0; i<data.length; i++) // Geocode each user's address
          {
            var user = data[i];
            geocoder.geocode({"address": user.Adresse + ", Suisse"}, function(results, status) // -> Specify options to limit to CH? or zone
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
          }
          
          $scope.users = data;
        },
        function (err) // DB Failure
        {
          console.log("Error while fetching data from db !");
        });
        console.log($scope.usersLocation);
      }])
  });