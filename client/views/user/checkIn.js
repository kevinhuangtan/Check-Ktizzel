
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

var colorsCheckIn = ['#003169', '#D0021B', '#F5A623','#50E3C2', '#003169', '#B8E986']
var colorIndexCheckIn = 0;
var timeBufferMilliseconds = 1800000; 

var eventYoureAtDistance = .1 //miles

Template.checkIn.helpers({
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

Template.checkIn.onRendered(function(){
	document.title = "Home";
	Session.set('past', false);
	Session.set('currentPage', 'checkIn')
})

Template.checkIn.helpers({
	eventYoureAt : function(){
		return Session.get('eventYoureAt')
	},
	borderColor:function(){
		var color = colorsCheckIn[colorIndexCheckIn]
		if(colorIndexCheckIn < colorsCheckIn.length - 1){
			colorIndexCheckIn = colorIndexCheckIn + 1
		}
		else{
			colorIndexCheckIn = 0
		}
			
		return color
	},
	past: function(){
		colorIndexCheckIn = 0
		return Session.get('past')
	},
	eventsYoureAt : function(){
		var events = checkEvents.find().fetch(); 
		var myGeolocation = Geolocation.latLng() || Meteor.user().profile.geoLocation;
		var nearbyEvents = []
		var atEvent = false
		var currentDate = new Date();
		// console.log(locations)
		// for (var i = 0; i < locations.length; i++ ){
		// 	var locGeolocation = locations[i].geoLocation || {'lat':0, 'lng':0}
		// 	locations[i].distance = distance(myGeolocation.lng, myGeolocation.lat, locGeolocation.lng, locGeolocation.lat);
		// console.log(events)
		for (var i = 0; i < events.length; i++ ){
			var locGeolocation = events[i].geoLocation || {'lat':0, 'lng':0}
			events[i].distance = distance(myGeolocation.lng, myGeolocation.lat, locGeolocation.lng, locGeolocation.lat);

			myEvent = events[i]
			// nearby events
			if(myEvent < eventYoureAtDistance){
			
				eventTimes = myEvent['eventTimes']

				for (var j = 0; j < eventTimes.length; j++) {
					if(j > 0) {
						if((eventTimes[j][1] > currentDate) && (eventTimes[j-1][2] < currentDate)) {
							nextStartDate = eventTimes[j][1];
							nextEndDate = eventTimes[j][2];
						}
					}
					else {
						nextStartDate = eventTimes[0][1];
						nextEndDate = eventTimes[0][2];
					}
				}

				if(events[i].attending.indexOf(Meteor.userId()) > -1 ){
					events[i]['checkedIn'] = true
				}
				else{
					events[i]['checkedIn'] = false
				}

				if((currentDate - nextEndDate) > timeBufferMilliseconds && (nextStartDate - currentDate) > timeBufferMilliseconds){
					nearbyEvents.push(events[i]);
					if(events[i].distance < eventYoureAtDistance){
						Session.set('eventYoureAt', events[i])
						atEvent = true
					}
				}
			}
		}
		if(!atEvent){
			delete Session.keys['eventYoureAt']
		}
		return nearbyEvents; 
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

Template.checkIn.events({
	'click .panel-user': function(event){
		Session.set("currentEvent", this._id);
		Router.go('event');
	},
	'click .upcoming' : function(event){
		colorIndexCheckIn = 0
		Session.set('past', false)
	},
	'click .past' : function(event){
		colorIndexCheckIn = 0
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

