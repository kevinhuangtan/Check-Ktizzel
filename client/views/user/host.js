var colors = ['#003169', '#D0021B', '#F5A623','#50E3C2', '#003169', '#B8E986']
var colorIndex = 0;

Template.host.onRendered(function(){
	Session.set('userMode', 'host')
})

Template.host.helpers({
	myLocation: function () {
		if(Geolocation.latLng()){
			if(Geolocation.latLng() != Meteor.user().profile.geoLocation){
				Meteor.subscribe("events");
				geoLocation = Geolocation.latLng()
				Session.set('geoLocation', geoLocation);
				Meteor.users.update({_id:Meteor.userId()}, { $set: {"profile.geoLocation": geoLocation}});
			}
		}
		return Geolocation.latLng() || { lat: 0, lng: 0 };
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
	}
});

Template.host.events({
	'click .panel-user': function(event){
		Session.set("currentEvent", this._id);
		Router.go('event');
	},
	'click .methods':function(){
		Meteor.call("setChecked", function(error, result){
			console.log(result)
		});	
	}

})

