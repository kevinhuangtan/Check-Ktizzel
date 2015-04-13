checkEvents = new Mongo.Collection('events');


// Meteor.call('removeAllEvents') will erase all events 

if (Meteor.isServer) {

  Meteor.startup(function() {

    return Meteor.methods({

      removeAllEvents: function() {

        return checkEvents.remove({});

      }

    });

  });

}