'use strict';

angular.module('mapContainer')
  .component('mapContainer',
  {
    templateUrl:
      'components/map-container/map-container.template.html',
    controller:
      ('mapContainerController',
      ['$scope', '$timeout', 'dbAccess',
      function ($scope, $timeout, dbAccess)
      {
        var geocoder = new google.maps.Geocoder();
        $scope.usersLocation = [];
        
        //
        // -- DB ACCESS --
        //
        dbAccess.getUsers(function(users) // DB Success
        {
          users.forEach(function(user) // Instead of for loop to get dinstinct closure for every iteration
          {
            //
            // -- GEOCODING --
            //
            geocoder.geocode({"address": user.Adresse + ", Suisse", "region": "CH"},function(results, status) // API KEY?
            {
              if (status == google.maps.GeocoderStatus.OK && results.length > 0) // Geocoding success
              {
                var loc = results[0].geometry.location;
                if ($scope.usersLocation.push({"id" : user.ID, "pos" : [loc.lat(), loc.lng()]}) == users.length) // Push returns new array's length
                {
                  $scope.$apply(); // Preprocessing over. Launch digest
                }
              }
              else // Geocoding failure
              {
                console.err("Geocoding process failed for " + user.Name);
              }
            });
          });
          
          $scope.users = users;
        },
        function(err) // DB Failure
        {
          console.err("Error while fetching users from db !");
        });
        
        console.log($scope.usersLocation);
        
        //
        // -- MAP INITIALIZATION --
        //
        $timeout(function()
        {
          var latlng = new google.maps.LatLng(46.214276, 6.154324);
          var myOptions =
          {
              zoom: 8,
              center: latlng
          };
          $scope.map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
        },
        100);
      }])
  });