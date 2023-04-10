import {requestHandler} from "./io/function";
import {requestConnector} from "./io/requestConnector";
import {simpleQuestion, simpleQuestionOnSlack} from "./usecase/simpleQuestion";
import {helloWorld} from "./usecase/test";
import {requestConnectorOnSlack} from "./io/requestConnectorOnSlack";
import {startup} from "./startup";

startup();

const defaultConnector = requestConnector(requestHandler);
export const askChatGPT = defaultConnector(simpleQuestion);
export const test = defaultConnector(helloWorld);

const slackConnector = requestConnectorOnSlack(requestHandler);
export const askQuestion = slackConnector(simpleQuestionOnSlack);
