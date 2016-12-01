'use strict';

angular.module('mapContainer')
  .component('mapContainer',
  {
    templateUrl:
      'components/map-container/map-container.template.html',
    controller:
      ('mapContainerController',
      ['$scope', 'EVENTS',
      function ($scope, EVENTS)
      {
        
        //
        // -- FUNCTIONS --
        //
        
        function addUserMarker(userLocation, userFullName)
        {
          var marker = new google.maps.Marker(
          {
            position: new google.maps.LatLng(userLocation[0],userLocation[1]),
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
        
        //
        // -- MAP INITIALIZATION --
        //
        
        var mapOptions =
        {
          zoom: 11,
          center: new google.maps.LatLng(46.214276, 6.154324)
        };
        var map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
        var infoWindows = [];
        var markers = [];
        
        //
        // -- EVENTS --
        //
        
        // Fully loaded event
        google.maps.event.addListenerOnce(map, 'idle', function()
        {
          $scope.$emit(EVENTS.MAPLOADED); // Send signal to parent
        });
        
        // Called from parent
        $scope.$on(EVENTS.SETUSERS, function(event, args)
        {
          args.forEach(function(user)
          {
            addUserMarker(user.location, user.surname + " " + user.name);
          });
        });
      }])
  });