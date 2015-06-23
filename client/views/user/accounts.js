checkEmailIsValid = function (aString) {  
  aString = aString || '';
  return aString.length > 1 && aString.indexOf('@') > -1;
}

checkPasswordIsValid = function (aString) {  
  aString = aString || '';
  return aString.length > 7;
}



Template.signin.helpers({
	accounts_error: function(){
		document.title = "Welcome";
		return Session.get('error') || ""
	}
});
Template.signin.events({
	'submit .signin': function(event){
		event.preventDefault()
		geoLocation = Geolocation.latLng()
		if(!geoLocation){
			geoLocation = {'lat':0, 'lng':0}
		}
		var user = {'email':event.target.email.value, 'password' :event.target.password.value}
		var id = Accounts.createUser({
			email: user['email'],
			password: user['password'],
			profile: {
          		geoLocation: geoLocation
        	}
		}, function(err) { 
		// only calls back if error
			Session.set('error', err)
		});
		Meteor.subscribe("events");
		Accounts.onLogin(function(){
			console.log('success')
		})

	},
	'submit .login': function(event){
		event.preventDefault()
		var user = {'email':event.target.email.value, 'password' :event.target.password.value}
		Meteor.loginWithPassword(user['email'], user['password'], 
		function(error){
			Session.set('error', error)

		});

	}
})

