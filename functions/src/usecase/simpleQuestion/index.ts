import {logger} from "../../io/function";
import {Usecase} from "../../io/requestConnector";
import {Usecase as Usecase2} from "../../io/requestConnectorOnSlack";
import {askOnlyOnce} from "../../models/openAI";


export const simpleQuestion: Usecase = async (req) => {
  const question = req.query["question"];
  const questionStr = JSON.stringify(question);
  const results = await askOnlyOnce(questionStr);
  const resultStr = results.join("");

  return resultStr;
};

export const simpleQuestionOnSlack: Usecase2 = async (req) => {
  const payload = req.body;
  logger.info("payload: ", JSON.stringify(payload));

  if (payload.event.type === "app_mention") {
    logger.info("event.type is app_mention");
    // if (payload.event.text.includes("tell me a joke")) {
    //     // Make call to chat.postMessage using bot's token
    // }
  }

  if (payload.event.type === "message") {
    logger.info("event.type is message");
  }
};
