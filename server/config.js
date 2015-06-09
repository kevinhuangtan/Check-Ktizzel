// Meteor.methods({
//   errorTest: function () {
//   	// throw new Meteor.Error("Username must have at least 3 characters");
//     // return "some return value";
//   }
// });

// // Accounts.validateNewUser(function (user) {
// //   // if (user.email && user.email.length >= 30){
// //   //   return true;
// //   //  }
// //   throw new Meteor.Error(403, "This right here Username must have at least 3 characters");
// // 	// return true
// // });

Meteor.publish("events", function () {
	return checkEvents.find();
});

