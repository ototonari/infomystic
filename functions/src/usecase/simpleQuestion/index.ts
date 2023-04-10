import {logger} from "../../io/function";
import {Usecase} from "../../io/requestConnector";
import {askOnlyOnce} from "../../models/openAI";


export const simpleQuestion: Usecase = async (req) => {
  const question = req.query["question"];
  const questionStr = JSON.stringify(question);
  const results = await askOnlyOnce(questionStr);
  const resultStr = results.join("");

  return resultStr;
};

export const simpleQuestionOnSlack: Usecase = async (req) => {
  const payload = req.body;

  logger.info("payload: ", payload);

  return payload;
};
