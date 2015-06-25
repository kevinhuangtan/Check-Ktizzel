
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
		// var userLocation = user.profile.geoLocation
		// var hostEvents = checkEvents.find({ host: this.userId });
		// var attendingEvents = checkEvents.find({attending: this.userId})
		// var nearbyEvents = checkEvents.find(
		//       { geoLocation: {
	 //            $geoWithin: {$centerSphere : [userLocation, 10]}
	 //    	    }
	 //    	  }
	 //    )
		// hostEvents.concat(attendingEvents)
		// hostEvents.concat(nearbyEvents)
	    return checkEvents.find()

		// return checkEvents.find(
		// 	{$or: [
		//       { host: this.userId },
		//       { geoLocation: {
	 //            $geoWithin: {$centerSphere : [userLocation, 10]}
	 //    	    }
	 //    	  }
	 //    	  {attending: this.userId}
	 //    	]}
  //   	)
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
	  	var users = Meteor.users.find().fetch();
	  	var currentEvent = checkEvents.findOne(event_id); //debug
	  	var attending = currentEvent.attending
	  	var attendeeList = []
	  	for (var i = 0; i < attending.length; i++){
	  		var attendee = Meteor.users.findOne(attending[i])
	  		var add_attendee = {'fullname': attendee.profile.fullname,'organization':attendee.profile.fullname,'email': attendee.emails[0].address}
	  		attendeeList.push(add_attendee)
	  	}
	  	return attendeeList;
	  },
	  eventHost : function(event_id){
	  	
	  	var currentEvent = checkEvents.findOne(event_id);
	  	var hostId = currentEvent['host']
	  	var host = Meteor.users.findOne(hostId);
	  	var hostInfo = {'name': host.profile.fullname, 'organization': host.profile.organization}
	  	return hostInfo
	  }


	});




}
