if (Meteor.isClient) {
	Meteor.subscribe("events");
	Meteor.subscribe("allUserData")
}

checkEvents = new Mongo.Collection('events');

if (Meteor.isServer) {

	radius = 10

	Meteor.publish("allUserData", function () {
        return Meteor.users.find({}, {fields: {"emails.address": 1, "profile":1}});
	});
	Meteor.publish("events", function(){
		var user = Meteor.users.findOne(this.userId);
		userLocation = user.profile.geoLocation
		return checkEvents.find(
			{$or: [
		      { host: this.userId },
		      // { geoLocation: {
	       //      $geoWithin: {$centerSphere : [[userLocation.lng, userLocation.lat], radius]}
	    	  //   }
	    	  // },
	    	  {attending: this.userId}
	    	]}
    	)
	})

	// Meteor.publish("tasks", function () {
	//   return Tasks.find({
	//     $or: [
	//       { name: "intro" },
	//       { owner: this.userId }
	//     ]
	//   });
	// });

	Meteor.methods({
	  setChecked: function () {
	    // Tasks.update(taskId, { $set: { checked: setChecked} });
	    return "server"
	  },
	  attendeeList: function(event_id) {
	  	users = Meteor.users.find().fetch();
	  	var currentEvent = checkEvents.findOne(event_id); //debug
	  	var attending = currentEvent.attending
	  	var attendeeList = []
	  	for (var i = 0; i < attending.length; i++){
	  		var attendee = Meteor.users.findOne(attending[i])
	  		var add_attendee = {'fullname': attendee.profile.fullname,'organization':attendee.profile.fullname,'email': attendee.emails[0].address}
	  		attendeeList.push(add_attendee)
	  	}
	  	return attendeeList;
	  }

	});




}
