import {externalHandler, requestHandler} from "./io/function";
import {requestConnector} from "./io/requestConnector";
import {simpleQuestion, simpleQuestionOnSlack} from "./usecase/simpleQuestion";
import {helloWorld} from "./usecase/test";
import {requestConnectorOnSlack} from "./io/requestConnectorOnSlack";
import {startup} from "./startup";

startup();

const defaultConnector = requestConnector(requestHandler);
const slackConnector = requestConnectorOnSlack(externalHandler);

export const askChatGPT = defaultConnector(simpleQuestion);

export const askQuestion = slackConnector(simpleQuestionOnSlack);

export const test = defaultConnector(helloWorld);
