checkEvents = new Mongo.Collection('events');

if (Meteor.isServer) {

  Meteor.startup(function() {

    return Meteor.methods({

      removeAllEvents: function() {

        return checkEvents.remove({});

      }

    });

  });

}