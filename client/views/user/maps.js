if (Meteor.isClient) {
  Meteor.startup(function() {
    GoogleMaps.load();
  });

  Template.mapDemo.helpers({
    exampleMapOptions: function() {
      // Make sure the maps API has loaded
      if (GoogleMaps.loaded()) {
        // Map initialization options
        geoLocation = Session.get('geoLocation') || {lat: 0, lng: 0};

        return {
          // center: new google.maps.LatLng(-37.8136, 144.9631),
          center: new google.maps.LatLng(geoLocation.lat,geoLocation.lng),
          zoom: 15,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          disableDefaultUI: true,
        };
      }
    },
    devGeolocation:function(){
      return Session.get('devGeolocation');
    }
  });
  Template.mapDemo.onRendered(function(){
      var location = Session.get('geoLocation');
      Session.set('devGeolocation', location)
  })

  Template.mapDemo.onCreated(function() {
    // We can use the `ready` callback to interact with the map API once the map is ready.
    GoogleMaps.ready('exampleMap', function(map) {
      // Add a marker to the map once it's ready
      var marker = new google.maps.Marker({
        position: map.options.center,
        map: map.instance
      });
      // Session.set('currentMarker', marker);

      google.maps.event.addListener(map.instance, 'click', function(event) {
        console.log({ lat: event.latLng.lat(), lng: event.latLng.lng() });
        Session.set('createEventLocation', { lat: event.latLng.lat(), lng: event.latLng.lng() })
        marker.setMap(null);
        marker = new google.maps.Marker({
          position: { lat: event.latLng.lat(), lng: event.latLng.lng() },
          map: map.instance
        });
      });
    });
  });
}
