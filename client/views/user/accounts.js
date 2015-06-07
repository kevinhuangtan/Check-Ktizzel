checkEmailIsValid = function (aString) {  
  aString = aString || '';
  return aString.length > 1 && aString.indexOf('@') > -1;
}

checkPasswordIsValid = function (aString) {  
  aString = aString || '';
  return aString.length > 7;
}



Template.splash.helpers({
	accounts_error: function(){
		document.title = "Welcome";
		return Session.get('error') || ""
	}
});

Template.splash.events({
	'click .event-li': function(event){
		Session.set("currentEvent", this._id);
		Router.go('event');
	},
	'submit .signin': function(event){
		event.preventDefault()
		var user = {'email':event.target.email.value, 'password' :event.target.password.value}
		Accounts.createUser({
			email: user['email'],
			password: user['password']
		}, function(err) { 
		// only calls back if error
			Session.set('error', err.reason)
		});

		Accounts.onLogin(function(){
			console.log('success')
		})

	},
	'submit .login': function(event){
		event.preventDefault()
		var user = {'email':event.target.email.value, 'password' :event.target.password.value}
		Meteor.loginWithPassword(user['email'], user['password'], 
		function(error){
			Session.set('error', error.reason)

		});
		// Accounts.onLogin(function(){
		// 	console.log('success')
		// })

	},
	'click .signout': function(event){
		Meteor.logout(function(error){
			if(error){
				console.log(error)
				Session.set('error', err.reason)
			} else{
				// Session.set('error', "")
			}
			
		});
	}
});