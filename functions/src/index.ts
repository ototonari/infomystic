import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

import {startUp} from "./models/openAI";
import {requestHandler} from "./io/function";
import {requestConnector} from "./io/requestConnector";
import {simpleQuestion, simpleQuestionOnSlack} from "./usecase/simpleQuestion";
import {helloWorld} from "./usecase/test";

admin.initializeApp();

startUp(functions.config().open_ai.api_key);

const defaultConnector = requestConnector(requestHandler);

export const askChatGPT = defaultConnector(simpleQuestion);

export const askQuestion = defaultConnector(simpleQuestionOnSlack);

export const test = defaultConnector(helloWorld);
