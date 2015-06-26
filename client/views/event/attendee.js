Template.attendee.onRendered(function(){

	var attendee = Meteor.users.findOne({"emails.address": Session.get("attendeeEmail")})
	


});

Template.attendee.helpers({

	email: function(){
		var attendee = Meteor.users.findOne({"emails.address": Session.get("attendeeEmail")})
		return attendee.emails[0].address;
	},
	name : function(){
		var attendee = Meteor.users.findOne({"emails.address": Session.get("attendeeEmail")})
		return attendee.profile.fullname;
	},
	gender : function(){
		var attendee = Meteor.users.findOne({"emails.address": Session.get("attendeeEmail")})
		return attendee.profile.gender;
	},
	phone : function(){
		var attendee = Meteor.users.findOne({"emails.address": Session.get("attendeeEmail")})
		return attendee.profile.phone;
	},
	organization : function(){
		var attendee = Meteor.users.findOne({"emails.address": Session.get("attendeeEmail")})
		return attendee.profile.organization;
	},
})

Template.attendee.events({
	'click #back': function(){
		Router.go('/attendeeList')
	}
})
