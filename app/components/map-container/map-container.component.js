'use strict';

angular.module('mapContainer')
  .component('mapContainer',
  {
    templateUrl:
      'components/map-container/map-container.template.html',
    controller:
      ('mapContainerController',
      ['$scope', 'CST',
      function ($scope, CST)
      {
        var mapCanvas = document.getElementById("map_canvas");
//        mapCanvas.height = mapCanvas.parentNode.clientHeight + "px"; console.log(mapCanvas.height);
        mapCanvas.height = "400px"; // CORRECT WAY TO SET SIZE ???
        var mapOptions =
        {
          zoom: 11,
          center: new google.maps.LatLng(46.214276, 6.154324)
        };
        var map = new google.maps.Map(mapCanvas, mapOptions);
        
        var geocoder = new google.maps.Geocoder();
        
        var infoWindows = [];
        var markers = [];
        
        //
        // -- FUNCTIONS --
        //
        
        function addUserMarker(userLocation, userFullName)
        {
          var marker = new google.maps.Marker(
          {
            position: new google.maps.LatLng(userLocation.lat(),userLocation.lng()),
            title: userFullName,
            map: map
          });
          
          var infoWindow = new google.maps.InfoWindow(
          {
            content: userFullName
          });

          marker.addListener("click", function()
          {
            infoWindows.forEach(function(iw)
            {
              iw.close();
            });
            infoWindow.open(map, marker);
          });
          
          markers.push(marker);
          infoWindows.push(infoWindow);
        }
        
        function clearMarkers()
        {
          markers.forEach(function(marker)
          {
            marker.setMap(null);
          });
          markers = [];
        }
        
        //
        // -- EVENTS --
        //
        
        // Fully loaded event
        google.maps.event.addListenerOnce(map, 'idle', function()
        {
          $scope.$emit(CST.MAPLOADED); // Send signal to parent
        });
        
        // -------!!! GEOCODING SHOULDNT BE DONE DYNAMICALLY -> ON SIGN IN !!!--------
        $scope.$watch('$parent.requestedUsers', function()
        {
          clearMarkers();
          $scope.$parent.requestedUsers.forEach(function(user) // Instead of for loop to get dinstinct closure for every iteration
          {
            // Geocoding
            geocoder.geocode({"address": user.address + ", Suisse", "region": "CH"},function(results, status) // API KEY?
            {
              if (status == google.maps.GeocoderStatus.OK && results.length > 0) // Geocoding success
              {
                addUserMarker(results[0].geometry.location, user.surname + " " + user.name);
              }
              else // Geocoding failure
              {
                console.error("Geocoding process failed for " + user.Name);
              }
            });
          });
        });
      }])
  });