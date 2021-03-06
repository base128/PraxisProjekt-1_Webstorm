//region Collections
Sessions = new Mongo.Collection("sessions");
Questions = new Mongo.Collection("questions");
//endregion

//region Client Code
if (Meteor.isClient) {
    //region Handlebars
    Handlebars.registerHelper("log", function (object) {
        return console.log(object);
    });
    //endregion

    //region Template Body
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
    //endregion

    //region Template sessionCreated
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
    //endregion

    //region Template questionTemplate
    Template.questionTemplate.helpers({
        isOwner: function () {
            return this.owner === Meteor.userId();
        },
        answersYes: function() {
            var answersCursor = Questions.find({_id:this._id});
            var answers = [];

            answersCursor.forEach(function(bla) {
               answers.push(bla.answers);
            });

            if(answers.length > 0) {
                var yesCount = 0;

                for(var j = 0; j < answers[0].length; j++) {
                    if(answers[0][j][0] == "yes") {
                        yesCount = yesCount + 1;
                    }
                }
                return yesCount;
            }
            return answers;
        },
        answersNo: function() {
            var answersCursor = Questions.find({_id:this._id});
            var answers = [];

            answersCursor.forEach(function(bla) {
                answers.push(bla.answers);
            });

            if(answers.length > 0) {
                var noCount = 0;

                for(var j = 0; j < answers[0].length; j++) {
                    if(answers[0][j][0] == "no") {
                        noCount = noCount + 1;
                    }
                }
                return noCount;
            }
            return answers;
        },
        isYesNo: function() {
            var typeC = Questions.find({_id:this._id}, {_id:0, type:1});
            var type = null;
            typeC.forEach(function(bla) {type = bla.type});

            return type==="YesNo";
        },
        isMulti: function() {
            var typeC = Questions.find({_id:this._id}, {_id:0, type:1});
            var type = null;
            typeC.forEach(function(bla) {type = bla.type});

            return type==="multi";
        },
        choice1:function() {
            var choicesC = Questions.find({_id:this._id}, {_id:0, choices:1});
            var choices = [];

            choicesC.forEach(function(bla) {choices = bla.choices});

            if(choices.length == 4) {
                return choices[0];
            } else {
                return null;
            }
        },
        choice2:function() {
            var choicesC = Questions.find({_id:this._id}, {_id:0, choices:1});
            var choices = [];

            choicesC.forEach(function(bla) {choices = bla.choices});

            if(choices.length == 4) {
                return choices[1];
            } else {
                return null;
            }
        },
        choice3:function() {
            var choicesC = Questions.find({_id:this._id}, {_id:0, choices:1});
            var choices = [];

            choicesC.forEach(function(bla) {choices = bla.choices});

            if(choices.length == 4) {
                return choices[2];
            } else {
                return null;
            }
        },
        choice4:function() {
            var choicesC = Questions.find({_id:this._id}, {_id:0, choices:1});
            var choices = [];

            choicesC.forEach(function(bla) {choices = bla.choices});

            if(choices.length == 4) {
                return choices[3];
            } else {
                return null;
            }
        },
        answersChoice1:function() {
            var answersCursor = Questions.find({_id:this._id});
            var answers = [];

            answersCursor.forEach(function (bla) {answers.push(bla.answers)});

            if(answers.length > 0) {
                var choice1Count = 0;

                for(var i = 0; i < answers[0].length; i++) {
                    if(answers[0][i][0] == "choice1") {
                        choice1Count = choice1Count + 1;
                    }
                }
                return choice1Count;
            }
            return answers;
        },
        answersChoice2:function() {
            var answersCursor = Questions.find({_id:this._id});
            var answers = [];

            answersCursor.forEach(function (bla) {answers.push(bla.answers)});

            if(answers.length > 0) {
                var choice1Count = 0;

                for(var i = 0; i < answers[0].length; i++) {
                    if(answers[0][i][0] == "choice2") {
                        choice1Count = choice1Count + 1;
                    }
                }
                return choice1Count;
            }
            return answers;
        },
        answersChoice3:function() {
            var answersCursor = Questions.find({_id:this._id});
            var answers = [];

            answersCursor.forEach(function (bla) {answers.push(bla.answers)});

            if(answers.length > 0) {
                var choice1Count = 0;

                for(var i = 0; i < answers[0].length; i++) {
                    if(answers[0][i][0] == "choice3") {
                        choice1Count = choice1Count + 1;
                    }
                }
                return choice1Count;
            }
            return answers;
        },
        answersChoice4:function() {
            var answersCursor = Questions.find({_id:this._id});
            var answers = [];

            answersCursor.forEach(function (bla) {answers.push(bla.answers)});

            if(answers.length > 0) {
                var choice1Count = 0;

                for(var i = 0; i < answers[0].length; i++) {
                    if(answers[0][i][0] == "choice4") {
                        choice1Count = choice1Count + 1;
                    }
                }
                return choice1Count;
            }
            return answers;
        }
    });

    Template.questionTemplate.events({
        "click .btnDelQuestion": function () {
            Meteor.call("delQuestion", this._id);
        }
    });
    //endregion

    //region Account Config
    Accounts.ui.config({
        passwordSignupFields: "USERNAME_ONLY"
    });
    //endregion

    Meteor.methods({

    });
}
//endregion

//region Server Code
if (Meteor.isServer) {
    Meteor.startup(function () {
        // code to run on server at startup
    });

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
        incParticipants: function(sessionId) {
            Sessions.update({sessionId: sessionId}, {$inc : { participants : 1 }});
        },
        decParticipants: function(sessionId) {
            Sessions.update({sessionId: sessionId}, {$inc : { participants : -1 }});
        },
        incAnswers: function(questId) {
            Questions.update({_id: questId}, {$inc : { answersReceived : 1 }});
        },
        insertAnswer: function(answer, sessionId, userId) {
            // Get the question Ids the user already answered to
            var answeredQuestionsIdsCursor = Questions.find({"answers":{$elemMatch:{$elemMatch:{$in:[userId]}}}}, {_id:1});
            var answeredQuestionIds = [];

            answeredQuestionsIdsCursor.forEach(function(bla) {answeredQuestionIds.push(bla._id)});

            // Get the question Ids the user is trying to answer
            var questionIdsCursor = Questions.find({sessionId:sessionId}, {_id:1});
            var questionIds = [];

            questionIdsCursor.forEach(function(post) { questionIds.push(post._id) });

            // Reduce the questions the user is trying to answer with the questions he already answered
            // The result is an array of question Ids the user is allowed to answer (or an empty array)
            var a = [], diff = [];
            for (var i1 = 0; i1 < answeredQuestionIds.length; i1++) {
                a[answeredQuestionIds[i1]] = true;
            }

            for (var i2 = 0; i2 < questionIds.length; i2++) {
                if (a[questionIds[i2]]) {
                    delete a[questionIds[i2]];
                } else {
                    a[questionIds[i2]] = true;
                }
            }

            for (var i3 in a) {
                diff.push(i3);
            }

            if(diff.length != 0) {
                for(var i = 0; i < answer.length; i++) {
                    for(var j = 0; j < diff.length; j++) {
                        if(answer[i][1] == diff[j]) {
                            var toInsert = [answer[i][0], userId];
                            Questions.update({_id: diff[j]}, {$push : { answers: toInsert}});
                            Meteor.call("incAnswers", diff[j]);
                            break;
                        }
                    }
                }
            }
        },
        terminateSession: function (sessionId) {
            Meteor.call("terminateQuestions", sessionId);
            Sessions.remove({owner: Meteor.userId()});
        },
        terminateQuestions: function (sessionId) {
            Questions.remove({sessionId: sessionId});
        },
        getRandomId: function () {
            if (!Meteor.userId()) {
                throw new Meteor.Error("not-authorized");
            }

            var text = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

            for (var i = 0; i < 5; i++)
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            return text;
        },
        addQuestion: function (sessionId, text, owner, type, choices) {
            Questions.insert({
                sessionId: sessionId,
                owner: owner,
                type: type,
                question: text,
                answers: [],
                answersReceived: 0,
                choices: choices
            });
        }
    });
}
//endregion

//region Methods
Meteor.methods({
    joinSession: function (sessionId) {
        Meteor.call("incParticipants", sessionId);
        return Sessions.find({sessionId: sessionId});
    },
    leaveSession: function (sessionId) {
        Meteor.call("decParticipants", sessionId);
        location.href = "/";
    },
    delQuestion: function (id) {
        Questions.remove({_id: id});
    }
});
//endregion