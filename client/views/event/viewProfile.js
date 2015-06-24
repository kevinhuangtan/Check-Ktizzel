Template.viewProfile.helpers({

	Meteor.call('attendeeList', event_id, function(error, result){
	   	Session.set('attendees', result);
	});

	

})