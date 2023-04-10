import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

import {startUp} from "./models/openAI";
import {externalHandler, requestHandler} from "./io/function";
import {requestConnector} from "./io/requestConnector";
import {simpleQuestion, simpleQuestionOnSlack} from "./usecase/simpleQuestion";
import {helloWorld} from "./usecase/test";
import {requestConnectorOnSlack} from "./io/requestConnectorOnSlack";

admin.initializeApp();

startUp(functions.config().open_ai.api_key);

const defaultConnector = requestConnector(requestHandler);
const slackConnector = requestConnectorOnSlack(externalHandler);

export const askChatGPT = defaultConnector(simpleQuestion);

export const askQuestion = slackConnector(simpleQuestionOnSlack);

export const test = defaultConnector(helloWorld);
