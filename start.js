Sessions = new Mongo.Collection("sessions");

if (Meteor.isClient) {
    // counter starts at 0
    Session.setDefault('counter', 0);

    Handlebars.registerHelper("isNull", function(value) {
        return value === null;
    });
    Handlebars.registerHelper("isEmpty", function(object) {
        return jQuery.isEmptyObject(object);
    });
    Handlebars.registerHelper("log", function(object) {
        return console.log(object);
    });

    Template.body.helpers({
        sessionExist: function() {
            return (Sessions.find({owner: Meteor.userId()})).count();
        }
    });

    Template.body.events({
        "click .btnCreate": function() {
            Meteor.call("createSession");
        },
        "form #formJoin": function() {
            var sessionId = event.target.sessionId.value;
            Meteor.call("joinSession", sessionId);
        }
    });

    Template.sessionCreated.helpers({
        session: function() {
            return Sessions.find({owner: Meteor.userId()})
        }
    });
    Template.sessionCreated.events({
       "click .btnDelete": function() {
           Meteor.call("terminateSession");
       }
    });
    Accounts.ui.config({
        passwordSignupFields: "USERNAME_ONLY"
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
        Meteor.call("terminateSession");
        var sessionId = Meteor.call("getRandomId");

     Sessions.insert({
            sessionId: sessionId,
            createdAt: new Date(),
            owner: Meteor.userId(),
            username: Meteor.user().username
        });
    },
    terminateSession: function() {
        Sessions.remove({owner : Meteor.userId()})
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