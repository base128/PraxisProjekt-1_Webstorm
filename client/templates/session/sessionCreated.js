Template.sessionCreated.helpers({
    session: function () {
        if (location.search.split('sessionId=')[1]) {
            var sessionId = location.search.split('sessionId=')[1];
            return Sessions.find({sessionId: sessionId});
        }
        return Sessions.find({owner: Meteor.userId()})
    },
    isOwner: function () {
        return this.owner === Meteor.userId();
    },
    questions: function () {
        return Questions.find({owner: this.owner})
    },
    /**
     * @return {boolean}
     */
    TypeYesNo: function() {
        return Session.get("YesNo");
    },
    /**
     * @return {boolean}
     */
    TypeMulti: function() {
        return Session.get("multi");
    }
});

Template.sessionCreated.events({
    "click .btnTerminate": function () {
        Meteor.call("terminateSession", this.sessionId);
    },
    "click .btnLeave": function () {
        Meteor.call("leaveSession", this.sessionId);
    },
    "submit #formQuestion": function (event) {
        event.preventDefault();
        var text = event.target.questionTxt.value;
        var type = event.target.questionType.value;
        var choices = [];
        if(type == "multi") {
            var fields = document.getElementsByClassName("MultiInput");

            choices[0] = fields[0].value;
            choices[1] = fields[1].value;
            choices[2] = fields[2].value;
            choices[3] = fields[3].value;

            fields[0].value = "";
            fields[1].value = "";
            fields[2].value = "";
            fields[3].value = "";
        }
        event.target.questionTxt.value = "";
        Meteor.call("addQuestion", this.sessionId, text, this.owner, type, choices);
    },
    "click #btnSubmitAnswers": function() {
        var forms = document.getElementsByClassName("formYesNoAnswer");
        if(forms.length > 0) {
            var answer = [];
            for(var i = 0; i < forms.length; i++) {
                var radioButtons = forms[i].getElementsByClassName("YesNoRadioButtons");
                for(var j = 0; j < 2; j++) {
                    if(radioButtons[j].checked) {
                        answer.push([radioButtons[j].value, jQuery(forms[i]).data("questid")]);
                    }
                }
            }
        }

        var forms2 = document.getElementsByClassName("formMultiAnswer");
        if(forms2.length > 0) {
            for(var k = 0; k < forms2.length; k++) {
                var radioButtons2 = forms2[k].getElementsByClassName("MultiRadioButtons");
                for(var l = 0; l < 4; l++) {
                    if(radioButtons2[l].checked) {
                        answer.push([radioButtons2[l].value, jQuery(forms2[k]).data("questid")]);
                    }
                }
            }
        }

        if(answer.length > 0)
            Meteor.call("insertAnswer", answer, this.sessionId, Meteor.userId());
    },
    "change #questionType": function() {
        var type = document.getElementById("questionType").value;
        Session.set("multi", null);
        Session.set("YesNo", null);

        Session.set(type, type);
    }
});



Template.sessionCreated.rendered = function() {

};