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