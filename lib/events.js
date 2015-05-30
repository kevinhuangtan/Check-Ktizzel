checkEvents = new Mongo.Collection('events');

if (Meteor.isServer) {
	Meteor.publish("allUserData", function () {
        return Meteor.users.find({}, {fields: {"emails.address": 1}});
    });

  Meteor.startup(function() {

    return Meteor.methods({

      removeAllEvents: function() {

        return checkEvents.remove({});

      }

    });

  });

}