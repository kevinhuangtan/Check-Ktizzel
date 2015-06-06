Template.event.helpers({
	currentEvent : function(){
		var id = Session.get("currentEvent")

		var result = checkEvents.findOne({_id: Session.get("currentEvent")})
		document.title = result.name;
		// console.log(result)
		return result		
	},
	attendees : function(){
		var result = checkEvents.findOne({_id: Session.get("currentEvent")})
		var attendees = []
		var attendee;
		var email;
		var email2;
		for (var i = 0; i < result.attending.length; i++){
			attendee = result.attending[i];
			// attend.ees.push(attendee);   
			email = Meteor.users.findOne({_id: attendee});
			email2 = email.emails[0].address

			attendees.push(email2);
		}
		return attendees
	},
	checkedIn: function(){
		var result = checkEvents.findOne({_id: Session.get("currentEvent")})
		if(result.attending.indexOf(Meteor.userId())!=-1 && Meteor.user()){
			return true
		}
		else{
			return false
		}
	}
});


Template.event.events({
	'click .checkIn':function(){
		var eventId = Session.get("currentEvent")
		checkEvents.update({_id: eventId}, {$push: {attending: Meteor.userId()}});
	}
})

Template.event.onRendered(function(){
	var result = checkEvents.findOne({_id: Session.get("currentEvent")})
	var map;
    var geoLocation = result.geoLocation || { lat: 40.7, lng: -74 };
        var mapCanvas = document.getElementById('map-canvas');
        var mapOptions = {
          center: new google.maps.LatLng(geoLocation.lat,geoLocation.lng),
          zoom: 16,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        }
        map = new google.maps.Map(mapCanvas, mapOptions)
	var marker = new google.maps.Marker({
	  position: geoLocation,
	  map: map,
	  title: result.name
	});
});


