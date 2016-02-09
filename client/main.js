Template.body.helpers({
    sessionExist: function () {
        if (location.search.split('sessionId=')[1]) {
            var sessionId = location.search.split('sessionId=')[1];
            return Sessions.find({sessionId: sessionId}).count();
        }
        return (Sessions.find({owner: Meteor.userId()})).count();
    }
});

Template.body.events({
    "click .btnCreate": function () {
        Meteor.call("createSession");
    },
    "submit #formJoin": function () {
        var sessionId = event.target.sessionId.value;
        Meteor.call("joinSession", sessionId);
    }
});