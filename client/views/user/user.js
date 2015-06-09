
function distance(lon1, lat1, lon2, lat2) {
  var R = 6371; // Radius of the earth in km
  var dLat = (lat2-lat1).toRad();  // Javascript functions in radians
  var dLon = (lon2-lon1).toRad(); 
  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) * 
          Math.sin(dLon/2) * Math.sin(dLon/2); 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  d = d*.62137 //to miles
  return d.toFixed(1);
}

/** Converts numeric degrees to radians */
if (typeof(Number.prototype.toRad) === "undefined") {
  Number.prototype.toRad = function() {
    return this * Math.PI / 180;
  }
}

var closeByDistance = 3 //miles
var eventYoureAtDistance = .1 //miles
////////

Meteor.subscribe("allUserData");
Meteor.subscribe("events");


// set for other views to access location
Template.splash.helpers({
	myLocation: function () {
		// return 0, 0 if the location isn't ready
		Session.set('geoLocation', Geolocation.latLng());
		return Geolocation.latLng() || { lat: 0, lng: 0 };
	}
})
Template.splash.onRendered(function(){
	document.title = "Home";
	Session.set('past', false);
	Session.set('currentPage', 'splash')
})

Template.splash.helpers({
	eventYoureAt : function(){
		return Session.get('eventYoureAt')
	},
	past: function(){
		return Session.get('past')
	},
	// MON, MAR 9, 9:00AM - 11:15AM
	nearbyEvents : function(){
		var locations = checkEvents.find().fetch(); 
		var myGeolocation = Geolocation.latLng() || {'lat':0, 'lng':0};
		var nearbyLocations = []
		var atEvent = false
		for (var i = 0; i < locations.length; i++ ){
			var locGeolocation = locations[i].geoLocation || {'lat':0, 'lng':0}
			locations[i].distance = distance(myGeolocation.lng, myGeolocation.lat, locGeolocation.lng, locGeolocation.lat);

			// nearby events
			if(locations[i].distance < closeByDistance){

				// get past events
				if(Session.get('past') && (new Date() > locations[i].startDate)){
					nearbyLocations.push(locations[i]);
					if(locations[i].distance < .1){
						Session.set('eventYoureAt', locations[i])
						atEvent = true
					}
				}
				//get future events
				else if(!Session.get('past') && (new Date() < locations[i].startDate)){
					nearbyLocations.push(locations[i]);
					if(locations[i].distance < eventYoureAtDistance){
						Session.set('eventYoureAt', locations[i])
						atEvent = true
					}
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
	},
	today : function(){
		return new Date();
	}
});
// debug
Template.splash.helpers({
	myevents: function(){
		console.log('All Events:')
		console.log(checkEvents.find().fetch())
		return checkEvents.find().fetch()
	}
})
Template.splash.events({
	'click .panel-user': function(event){
		Session.set("currentEvent", this._id);
		Router.go('event');
	},
	'click .upcoming' : function(event){
		Session.set('past', false)
	},
	'click .past' : function(event){
		Session.set('past', true)
	},

})

