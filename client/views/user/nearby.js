var colorsNearby = ['#003169', '#D0021B', '#F5A623','#50E3C2', '#003169', '#B8E986']
var colorIndexNearby = 0;

var closeByDistance = 3 //miles
var eventYoureAtDistance = 0.1 //miles
var timeBuffer = 15 //minutes
var timeBufferMillisecs = timeBuffer * 1000 * 60

// set for other views to access location
Template.nearby.helpers({
	myLocation: function () {
		geoLocation = Geolocation.latLng()
		if(geoLocation){
			Session.set('geoLocation', geoLocation);
			Meteor.users.update({_id:Meteor.userId()}, { $set: {"profile.geoLocation": geoLocation}});
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
	borderColor:function(){
		var color = colorsNearby[colorIndexNearby]
		if(colorIndexNearby < colorsNearby.length - 1){
			colorIndexNearby = colorIndexNearby + 1
		}
		else{
			colorIndexNearby = 0
		}
			
		return color
	},
	past: function(){
		colorIndexNearby = 0
		return Session.get('past')
	},
	nearbyEvents : function(){
		var locations = checkEvents.find().fetch(); 
		var myGeolocation = Geolocation.latLng() || Meteor.user().profile.geoLocation;
		var nearbyLocations = []
		var atEvent = false
		var currentDate = new Date();
		for (var i = 0; i < locations.length; i++ ){
			var locGeolocation = locations[i].geoLocation || {'lat':0, 'lng':0}
			locations[i].distance = distance(myGeolocation.lng, myGeolocation.lat, locGeolocation.lng, locGeolocation.lat);
			if(locations[i].distance < 10){
				nearbyLocations.push(locations[i])	
			}
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
		colorIndexNearby = 0
		Session.set('past', false)
	},
	'click .past' : function(event){
		colorIndexNearby = 0
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

