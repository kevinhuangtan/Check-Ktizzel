var colors = ['#003169', '#D0021B', '#F5A623','#50E3C2', '#003169', '#B8E986']
var colorIndex = 0;

Template.events.onRendered(function(){
	Session.set('userMode', 'host');
	Session.set('currentPage', 'events')
	Session.set('haveCheckedIn', false)
	Session.set('haveHosted', false)
})

Template.events.helpers({

	myLocation: function () {
		geoLocation = Geolocation.latLng()
		if(geoLocation){
			if(Math.abs(geoLocation.lat + geoLocation.lng - Meteor.user().profile.geoLocation.lat - Meteor.user().profile.geoLocation.lng) > .00001){
				Session.set('geoLocation', geoLocation);
				Meteor.users.update({_id:Meteor.userId()}, { $set: {"profile.geoLocation": geoLocation}});
				Meteor.subscribe("events"); //update events based on user location	
			}
			return Meteor.user().profile.geoLocation
		}
		else{
			return {'lat':0,"lng":0}
		}
	},
	borderColor:function(){
		var color = colors[colorIndex]
		if(colorIndex < colors.length - 1){
			colorIndex = colorIndex + 1
		}
		else{
			colorIndex = 0
		}
			
		return color
	},

	myHostedEvents : function(){
		var events = checkEvents.find().fetch(); 
		var hostedEvents = []
		console.log(events)
		for (var i = 0; i < events.length; i++ ){
			console.log(events[i])
			var nextDates = nextStartEndDates(events[i]['eventTimes'])
			if(events[i].host == Meteor.userId()){
				events[i]['dateParsed'] = parseDate(nextDates[0], nextDates[1])
				hostedEvents.push(events[i]);
			}
		}
		Session.set('haveHosted', (hostedEvents.length > 0))
		return hostedEvents
	},
	today : function(){
		return new Date();
	},
	myCheckedInEvents : function(){
		var events = checkEvents.find().fetch(); 
		var checkedInEvents = []
		for (var i = 0; i < events.length; i++ ){
			var eventTimes = events[i]['eventTimes']
			var nextDates = nextStartEndDates(eventTimes)
			if(events[i].attending.indexOf(Meteor.userId())> -1 && events[i].host != Meteor.userId()){
				events[i]['dateParsed'] = parseDate(nextDates[0], nextDates[1])
				checkedInEvents.push(events[i]);
			}
		}
		Session.set('haveCheckedIn', (checkedInEvents.length > 0))
		return checkedInEvents
	},
	noHostedEvents : function() {
		return !Session.get('haveHosted')
	},
	noCheckedInEvents : function() {
		return !Session.get('haveCheckedIn')
	}
});

Template.events.events({
	'click .panel-user': function(event){
		Session.set("currentEvent", this._id);
		Router.go('event');
	}
})

