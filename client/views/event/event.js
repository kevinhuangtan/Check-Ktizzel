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
	},
	address : function(){
		var lat = Session.get('eventLocation').lat
		var lng = Session.get('eventLocation').lng
		var js;
		var url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng='+lat+','+lng+'&key=AIzaSyA3IaCGmNfltsyk5fyATz-icw-D5VFhSYw';
		var cityName0;
		var cityName;
		$.ajaxSetup({
		   async: false
		});
		$.getJSON(url, function(data) {
				js = data;
				cityName0 = js.results[0].address_components[0].long_name;
				cityName01 = js.results[0].address_components[1].long_name;
				cityName = js.results[0].address_components[2].long_name;
				cityName1 = js.results[0].address_components[3].long_name;

		});
		var result = cityName0 + ' '+cityName01+', '+cityName + ', ' + cityName1;
		return result
	}
});


Template.event.events({
	'click .checkIn':function(){
		var eventId = Session.get("currentEvent")
		checkEvents.update({_id: eventId}, {$push: {attending: Meteor.userId()}});
	},
	'click .remove-button':function(){
		checkEvents.remove(Session.get("currentEvent"));
		Router.go('splash')
	},
	'click .learn-more' : function(){

	},
	'click #back':function(){
		Router.go('splash')
	}
})

Template.event.onRendered(function(){
	var result = checkEvents.findOne({_id: Session.get("currentEvent")})
	var map;
    var geoLocation = result.geoLocation || { lat: 40.7, lng: -74 };
    Session.set('eventLocation', geoLocation);
    var mapCanvas = document.getElementById('map-canvas');
   
    var mapOptions = {
      center: new google.maps.LatLng(geoLocation.lat,geoLocation.lng),
      zoom: 14,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: true
    }
    map = new google.maps.Map(mapCanvas, mapOptions)
	var marker = new google.maps.Marker({
	  position: geoLocation,
	  map: map,
	  title: result.name
	});
});


