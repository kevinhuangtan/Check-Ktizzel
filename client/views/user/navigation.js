
Template.checkNavigation.helpers({
	createEvent : function(){
		return (Session.get('currentPage')=='createEvent')
	},
	splash : function(){
		return (Session.get('currentPage')=='splash')
	},
	profile: function(){
		return (Session.get('currentPage')=='profile')
	}

})

Template.checkNavigation.events({
	'click .signout': function(event){
		// event.preventDefault();
		Meteor.logout(function(error){
			if(error){
				console.log(error)
				Session.set('error', err.reason)
			} else{
				// Session.set('error', "")
			}
			
		});
	}
})