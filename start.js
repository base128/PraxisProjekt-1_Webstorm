Sessions = new Mongo.Collection("sessions");

if (Meteor.isClient) {
    // counter starts at 0
    Session.setDefault('counter', 0);

    Template.body.events({
        "click .btnCreate": function() {
            Meteor.call("createSession");
        },
        "click .btnJoin": function() {
            Meteor.call("joinSession", sessionId);
        }
    });

    Accounts.ui.config({
        passwordSignupFields: "USERNAME_ONLY"
    });

    Template.hello.helpers({
            counter: function () {
            return Session.get('counter');
        }
    });

    Template.hello.events({
        'click button': function () {
            // increment the counter when button is clicked
            Session.set('counter', Session.get('counter') + 1);
        }
    });
}

if (Meteor.isServer) {
    Meteor.startup(function () {
        // code to run on server at startup
    });
}

Meteor.methods({
    createSession: function() {
        if(! Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }

        var sessionId = Meteor.call("getRandomId");

        window.alert(sessionId);

        /*Sessions.insert({
            sessionId: sessionId,
            createdAt: new Date(),
            owner: Meteor.userId(),
            username: Meteor.user().username
        });*/
    },
    joinSession: function(sessionId) {

    },
    getRandomId: function() {
        if(! Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }

        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for( var i=0; i < 5; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }
});