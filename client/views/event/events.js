var colors = ['#003169', '#D0021B', '#F5A623','#50E3C2', '#003169', '#B8E986']
var colorIndex = 0;

Template.events.onRendered(function(){
	Session.set('userMode', 'host')
})

Template.events.helpers({
	myLocation: function () {
		geoLocation = Geolocation.latLng()
		if(geoLocation){
			if(Math.abs(geoLocation.lat + geoLocation.lng - Meteor.user().profile.geoLocation.lat - Meteor.user().profile.geoLocation.lng) > .00001){
				console.log(Meteor.user().profile)
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
		for (var i = 0; i < events.length; i++ ){
			if(events[i].host == Meteor.userId()){
				hostedEvents.push(events[i]);
			}
		}
		return hostedEvents
	},
	today : function(){
		return new Date();
	},
	myCheckedInEvents : function(){
		var events = checkEvents.find().fetch(); 
		var checkedInEvents = []
		for (var i = 0; i < events.length; i++ ){
			if(events[i].attending.indexOf(Meteor.userId())> -1 && events[i].host != Meteor.userId()){
				checkedInEvents.push(events[i]);
			}
		}
		return checkedInEvents
	}
});

Template.events.events({
	'click .panel-user': function(event){
		Session.set("currentEvent", this._id);
		Router.go('event');
	}
})

