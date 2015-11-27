Sessions = new Mongo.Collection("sessions");
Questions = new Mongo.Collection("questions");

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
            if(location.search.split('sessionId=')[1]) {
                var sessionId = location.search.split('sessionId=')[1];
                return Sessions.find({sessionId : sessionId}).count();
            }
            return (Sessions.find({owner: Meteor.userId()})).count();
        }
    });

    Template.body.events({
        "click .btnCreate": function() {
            Meteor.call("createSession");
        },
        "submit #formJoin": function() {
            var sessionId = event.target.sessionId.value;
            Meteor.call("joinSession", sessionId);
        }
    });

    Template.sessionCreated.helpers({
        session: function() {
            if(location.search.split('sessionId=')[1]) {
                var sessionId = location.search.split('sessionId=')[1];
                return Sessions.find({sessionId : sessionId});
            }
            return Sessions.find({owner: Meteor.userId()})
        },
        isOwner: function() {
            return this.owner === Meteor.userId();
        },
        questions: function() {
            return Questions.find({owner: this.owner})
        }
    });

    Template.sessionCreated.events({
        "click .btnDelete": function() {
            Meteor.call("terminateSession");
        },
        "click .btnLeave": function() {
            Meteor.call("leaveSession");
        },
        "submit #formQuestion": function(event) {
            event.preventDefault();
            var text = event.target.questionTxt.value;
            Meteor.call("addQuestion", text, this.owner);
        }
    });

    Template.questionTemplate.helpers({
        isOwner: function() {
            return this.owner === Meteor.userId();
        }
    });

    Template.questionTemplate.events({
       "click .btnDelQuestion": function() {
           Meteor.call("delQuestion", this._id);
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
}
Meteor.methods({
    joinSession: function(sessionId) {
        return Sessions.find({sessionId : sessionId});
    },
    leaveSession: function() {
        location.href="/";
    },
    addQuestion: function(text, owner) {
        Questions.insert({
            owner: owner,
            type: text,
            question: text
        })
    },
    delQuestion: function(id) {
        Questions.remove({_id : id});
    }
});