Questions = new Mongo.Collection("questions");

Meteor.methods({
    incAnswers: function (questId) {
        Questions.update({_id: questId}, {$inc: {answersReceived: 1}});
    },
    insertAnswer: function (answer, sessionId, userId) {
        // Get the question Ids the user already answered to
        var answeredQuestionsIdsCursor = Questions.find({"answers": {$elemMatch: {$elemMatch: {$in: [userId]}}}}, {_id: 1});
        var answeredQuestionIds = [];

        answeredQuestionsIdsCursor.forEach(function (bla) {
            answeredQuestionIds.push(bla._id)
        });

        // Get the question Ids the user is trying to answer
        var questionIdsCursor = Questions.find({sessionId: sessionId}, {_id: 1});
        var questionIds = [];

        questionIdsCursor.forEach(function (post) {
            questionIds.push(post._id)
        });

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

        if (diff.length != 0) {
            for (var i = 0; i < answer.length; i++) {
                for (var j = 0; j < diff.length; j++) {
                    if (answer[i][1] == diff[j]) {
                        var toInsert = [answer[i][0], userId];
                        Questions.update({_id: diff[j]}, {$push: {answers: toInsert}});
                        Meteor.call("incAnswers", diff[j]);
                        break;
                    }
                }
            }
        }
    },
    terminateQuestions: function (sessionId) {
        Questions.remove({sessionId: sessionId});
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
    },
    delQuestion: function (id) {
        Questions.remove({_id: id});
    }
});