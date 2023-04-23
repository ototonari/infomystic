import { WebUsecase } from "../../io/requestConnector";
import { askToHtml } from "../../models/openAI/chat";

export const simpleQuestion: WebUsecase = async (req) => {
  const question = req.query["question"];
  const questionStr = JSON.stringify(question);
  const results = await askToHtml(questionStr);
  const resultStr = results.join("");

  return resultStr;
};

// export const simpleQuestionOnSlack: SlackUsecase = async (req) => {
//   const payload = req.body;
//   logger.info("payload: ", JSON.stringify(payload));

//   if (payload.event.type === "app_mention") {
//     logger.info("event.type is app_mention");

//     const message = trim(payload.event.text);

//     const results = await askToSlack(message);

//     await getSlackClient().chat.postMessage({
//       channel: payload.event.channel,
//       blocks: makeBlock(results),
//       thread_ts: payload.event.ts,
//     });
//   }

//   if (payload.event.type === "message") {
//     logger.info("event.type is message");
//   }
// };
