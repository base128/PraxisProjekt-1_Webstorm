Sessions = new Mongo.Collection("sessions");


Meteor.methods({
    createSession: function () {
        if (!Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }
        Meteor.call("terminateSession");
        var sessionId = Meteor.call("getRandomId");

        Sessions.insert({
            sessionId: sessionId,
            createdAt: new Date(),
            owner: Meteor.userId(),
            username: Meteor.user().username,
            participants: 0
        });
    },
    incParticipants: function (sessionId) {
        Sessions.update({sessionId: sessionId}, {$inc: {participants: 1}});
    },
    decParticipants: function (sessionId) {
        Sessions.update({sessionId: sessionId}, {$inc: {participants: -1}});
    },
    joinSession: function (sessionId) {
        Meteor.call("incParticipants", sessionId);
        return Sessions.find({sessionId: sessionId});
    },
    leaveSession: function (sessionId) {
        Meteor.call("decParticipants", sessionId);
        location.href = "/";
    },
    terminateSession: function (sessionId) {
        Meteor.call("terminateQuestions", sessionId);
        Sessions.remove({owner: Meteor.userId()});
    }
});