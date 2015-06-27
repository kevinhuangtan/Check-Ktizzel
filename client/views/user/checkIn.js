var colorsCheckIn = ['#003169', '#D0021B', '#F5A623','#50E3C2', '#003169', '#B8E986']
var colorIndexCheckIn = 0;
var timeBufferMilliseconds = 1800000; 

var eventYoureAtDistance = .2 //miles

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

		for (var i = 0; i < events.length; i++ ){
			var locGeolocation = events[i].geoLocation ||  Meteor.user().profile.geoLocation
			events[i].distance = distance(myGeolocation.lng, myGeolocation.lat, locGeolocation.lng, locGeolocation.lat);

			var myEvent = events[i]

			// console.log(myEvent)
			// nearby events
			if(myEvent.distance < eventYoureAtDistance){
				// console.log(myEvent)
				var eventTimes = myEvent['eventTimes']
				var numTimes = eventTimes.length
				var nextStartDate = eventTimes[numTimes - 1][0]
				var nextEndDate = eventTimes[numTimes - 1][1]

				for (var j = 0; j < numTimes; j++) {
					if(j > 0) {
						if((eventTimes[j][0] > currentDate) && (eventTimes[j-1][1] < currentDate)) {
							nextStartDate = eventTimes[j][0];
							nextEndDate = eventTimes[j][1];
						} else if((eventTimes[j][0] < currentDate) && (eventTimes[j][1] > currentDate)) {
							nextStartDate = eventTimes[j][0];
							nextEndDate = eventTimes[j][1];
						}
					} else if(eventTimes[0][1] > currentDate) {
						nextStartDate = eventTimes[0][0];
						nextEndDate = eventTimes[0][1];
					}
				}
				if(events[i].attending.indexOf(Meteor.userId()) > -1 ){
					events[i]['checkedIn'] = true
				}
				else{
					events[i]['checkedIn'] = false
				}

				if((currentDate < nextEndDate) && (nextStartDate - currentDate) < timeBufferMilliseconds){
					nearbyEvents.push(events[i]);
				}
			}
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

