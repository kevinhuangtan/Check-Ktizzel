
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

var colors = ['#003169', '#D0021B', '#F5A623','#50E3C2', '#003169', '#B8E986']
var colorIndex = 0;

var closeByDistance = 3 //miles
var eventYoureAtDistance = .1 //miles
Meteor.subscribe("events");
// set for other views to access location
Template.nearby.helpers({
	myLocation: function () {
		Meteor.subscribe("events");
		// console.log(Meteor.user().profile)
		geoLocation = Geolocation.latLng()
		if(geoLocation && (Math.abs(geoLocation.lat - Meteor.user().profile.geoLocation.lat > .00001))){
			Session.set('geoLocation', geoLocation);
			Meteor.users.update({_id:Meteor.userId()}, { $set: {"profile.geoLocation": geoLocation}});
			Meteor.subscribe("events"); //update events based on user location	
			return Meteor.user().profile.geoLocation
		}
		else{
			return Meteor.user().profile.geoLocation
		}
	}
});

Template.nearby.onRendered(function(){
	document.title = "Home";
	Session.set('past', false);
	Session.set('currentPage', 'nearby')
})

Template.nearby.helpers({
	eventYoureAt : function(){
		return Session.get('eventYoureAt')
	},
	borderColor:function(){
		// console.log(colorIndex)
		var color = colors[colorIndex]
		if(colorIndex < colors.length - 1){
			colorIndex = colorIndex + 1
		}
		else{
			colorIndex = 0
		}
			
		return color
	},
	past: function(){
		colorIndex = 0
		return Session.get('past')
	},
	// MON, MAR 9, 9:00AM - 11:15AM
	nearbyEvents : function(){
		var locations = checkEvents.find().fetch(); 
		var myGeolocation = Geolocation.latLng() || Meteor.user().profile.geoLocation;
		var nearbyLocations = []
		var atEvent = false
		console.log(locations)
		for (var i = 0; i < locations.length; i++ ){
			var locGeolocation = locations[i].geoLocation || {'lat':0, 'lng':0}
			locations[i].distance = distance(myGeolocation.lng, myGeolocation.lat, locGeolocation.lng, locGeolocation.lat);

			// nearby events
			if(locations[i].distance < closeByDistance){
			
				if(locations[i].attending.indexOf(Meteor.userId()) > -1 ){
						locations[i]['checkedIn'] = true
				}
				else{
					locations[i]['checkedIn'] = false
				}

				if(new Date() < locations[i].startDate){
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

Template.nearby.events({
	'click .panel-user': function(event){
		Session.set("currentEvent", this._id);
		Router.go('event');
	},
	'click .upcoming' : function(event){
		colorIndex = 0
		Session.set('past', false)
	},
	'click .past' : function(event){
		colorIndex = 0
		Session.set('past', true)
	},
	'click .checkin-box':function(event){
		var eventId = this._id
		Session.set("currentEvent", eventId);
		var thisEvent = checkEvents.findOne(eventId);
		if(thisEvent.attending.indexOf(Meteor.userId()) > -1){ //in array
			console.log('already in')
		}
		else{
			checkEvents.update({_id: eventId}, {$push: {attending: Meteor.userId()}});
		}
	},

})

