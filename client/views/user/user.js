
function distance(lon1, lat1, lon2, lat2) {
  var R = 6371; // Radius of the earth in km
  var dLat = (lat2-lat1).toRad();  // Javascript functions in radians
  var dLon = (lon2-lon1).toRad(); 
  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) * 
          Math.sin(dLon/2) * Math.sin(dLon/2); 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  // var d  = 5
  return d.toFixed(1);
}

/** Converts numeric degrees to radians */
if (typeof(Number.prototype.toRad) === "undefined") {
  Number.prototype.toRad = function() {
    return this * Math.PI / 180;
  }
}

checkEmailIsValid = function (aString) {  
  aString = aString || '';
  return aString.length > 1 && aString.indexOf('@') > -1;
}

checkPasswordIsValid = function (aString) {  
  aString = aString || '';
  return aString.length > 7;
}

Meteor.subscribe("allUserData");


Template.splash.helpers({
	myLocation: function () {
		// return 0, 0 if the location isn't ready
		document.title = "Home";
		Session.set('geoLocation', Geolocation.latLng());
		return Geolocation.latLng() || { lat: 0, lng: 0 };
	},
	eventYoureAt : function(){
		return Session.get('eventYoureAt')
	},
	nearbyEvents : function(){
		var locations = checkEvents.find().fetch(); 
		var myGeolocation = Geolocation.latLng() || {'lat':0, 'lng':0};
		var nearbyLocations = []
		var delta_x = 0;
		var delta_y = 0;
		var closeByDistance = 3 //km
		var eventYoureAtDistance = .5 //km
		var atEvent = false
		for (var i = 0; i < locations.length; i++ ){
			var locGeolocation = locations[i].geoLocation || {'lat':0, 'lng':0}
			locations[i].distance = distance(myGeolocation.lng, myGeolocation.lat, locGeolocation.lng, locGeolocation.lat);
			if(locations[i].distance < closeByDistance){
				nearbyLocations.push(locations[i]);
				if(locations[i].distance < .1){
					Session.set('eventYoureAt', locations[i])
					atEvent = true
				}
			}

		}
		if(!atEvent){
			delete Session.keys['eventYoureAt']
		}
		console.log('Nearby Events:')			
		console.log(nearbyLocations)
		return nearbyLocations; 
	},
	myevents: function(){
		console.log('All Events:')
		console.log(checkEvents.find().fetch())
		return checkEvents.find().fetch()
	},
	myCity : function(){
		var js;
		var loc = Geolocation.latLng();
		var url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng='+loc.lat+','+loc.lng+'&key=AIzaSyA3IaCGmNfltsyk5fyATz-icw-D5VFhSYw';
		var cityName0
		var cityName;
		$.ajaxSetup({
		   async: false
		});
		$.getJSON(url, function(data) {
				js = data;
				cityName0 = js.results[0].address_components[2].long_name;
				cityName = js.results[0].address_components[3].long_name;

		});
		var result = cityName0 + ', '+cityName ;
		return result 
	}
});
Template.splash.helpers({
	'click .event-li': function(event){
	Session.set("currentEvent", this._id);
	Router.go('event');
	}
})

