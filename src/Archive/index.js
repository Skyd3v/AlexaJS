'use strict';

var AlexaSkill = require('./AlexaSkill'),
    answers = require('./answers');

var APP_ID = 'amzn1.ask.skill.a1232b8e-f0be-41fc-839c-8b73fa19e378';

var HowTo = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
HowTo.prototype = Object.create(AlexaSkill.prototype);
HowTo.prototype.constructor = HowTo;

HowTo.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    var speechText = "Welcome to this application.I will try and give you information over people you mention loudly";
    // If the user either does not reply to the welcome message or says something that is not
    // understood, they will be prompted again with this text.
    var repromptText = "For instructions on what you can say, please say help me.";
    response.ask(speechText, repromptText);
};

HowTo.prototype.intentHandlers = {
    "PeopleIntent": function (intent, session, response) {
        var peopleSlot = intent.slots.People,
            peopleName;
        if (peopleSlot && peopleSlot.value){
            peopleName = peopleSlot.value.toLowerCase();
        }

        var cardTitle = "Answer for " + peopleName,
            answer = answers[peopleName],
            speechOutput,
            repromptOutput;
        if (answer) {
            speechOutput = {
                speech: answer,
                type: AlexaSkill.speechOutputType.PLAIN_TEXT
            };
            response.tellWithCard(speechOutput, cardTitle, answer);
        } else {
            var speech;
            if (peopleName) {
                speech = "I'm sorry, I currently do not know about " + peopleName + ". What else can I help with?";
            } else {
                speech = "I'm sorry, I currently do not know about that person. What else can I help with?";
            }
            speechOutput = {
                speech: speech,
                type: AlexaSkill.speechOutputType.PLAIN_TEXT
            };
            repromptOutput = {
                speech: "What else can I help with?",
                type: AlexaSkill.speechOutputType.PLAIN_TEXT
            };
            response.ask(speechOutput, repromptOutput);
        }
    },

    "AMAZON.StopIntent": function (intent, session, response) {
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
    },

    "AMAZON.CancelIntent": function (intent, session, response) {
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
    },

    "AMAZON.HelpIntent": function (intent, session, response) {
        var speechText = "You can ask questions such as, what do you know of Bill Clinton, you can say exit... Now, what can I help you with?";
        var repromptText = "You can say things like, what do you know of Obama, or you can say exit... Now, what can I help you with?";
        var speechOutput = {
            speech: speechText,
            type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };
        var repromptOutput = {
            speech: repromptText,
            type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };
        response.ask(speechOutput, repromptOutput);
    }
};

exports.handler = function (event, context) {
    var howTo = new HowTo();
    howTo.execute(event, context);
};
