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
        var usersInfo = [];
        
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
                if (usersInfo.push({"id" : user.ID, "surname":user.Surname, "name":user.Name, "pos" : [loc.lat(), loc.lng()]}) == users.length) // Push returns new array's length
                {
                  // $scope.$apply(); // Preprocessing over. Launch digest. Only if html needs scope
                }
              }
              else // Geocoding failure
              {
                console.error("Geocoding process failed for " + user.Name);
              }
            });
          });
          
          $scope.users = users;
        },
        function(err) // DB Failure
        {
          console.error("Error while fetching users from db !");
        });
        
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
        300);
        var period = 400; // WATCH IT. MIGHT BE TOO SHORT
        $timeout(function() // Called after <period> ms
        {
          var mapOptions =
          {
              zoom: 11,
              center: new google.maps.LatLng(46.214276, 6.154324)
          };
          var map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
          
          var infoWindows = []; // Initialize markers and info windows
          usersInfo.forEach(function(info)
          {
            var marker = new google.maps.Marker(
            {
              position: new google.maps.LatLng(info.pos[0], info.pos[1]),
              map: map,
            });
            
            var infoWindow = new google.maps.InfoWindow(
            {
              content: info.surname + " " + info.name
            });
            
            infoWindows.push(infoWindow);
            
            marker.addListener('click',function()
            {
              infoWindows.forEach(function(iw)
              {
                iw.close();
              });
              infoWindow.open(map, marker);
            });
          });
        },
        period);
      }])
  });