Template.profile.helpers({
	email: function(){
		document.title = "My Profile";
		var user = Meteor.user();
		return user.emails[0].address;
	},
	name : function(){
		return Meteor.user().profile.fullname;
	},
	gender : function(){
		return Meteor.user().profile.gender;
	},
	phone : function(){
		return Meteor.user().profile.phone;
	},
	ethnicity : function(){
		return Meteor.user().profile.ethnicity;
	},
	organization : function(){
		return Meteor.user().profile.organization;
	}
});


Template.profile.events({
    'click .edit-btn' : function(event) {
    	event.preventDefault()
        Session.set('edit', true);
    },
    'submit .profile-form': function(event){
		Meteor.users.update({_id:Meteor.userId()}, { $set: {"profile.fullname": event.target.name.value,"profile.gender": event.target.gender.value,"profile.phone": event.target.phone.value,"profile.ethnicity": event.target.ethnicity.value,"profile.organization": event.target.organization.value} });
	}
});

Template.profile.editme = function () {
    return Session.get('edit');
};


Template.profile.onRendered(function(){
	document.title = "Profile"
	Session.set('currentPage', 'profile')
});