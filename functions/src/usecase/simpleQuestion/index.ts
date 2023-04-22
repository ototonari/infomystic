import {logger} from "../../io/function";
import {WebUsecase} from "../../io/requestConnector";
import {SlackUsecase} from "../../io/requestConnectorOnSlack";
import {askToHtml, askToSlack} from "../../models/openAI/chat";
import {getSlackClient} from "../../models/slack";
import {trim} from "../../models/slack/message";


export const simpleQuestion: WebUsecase = async (req) => {
  const question = req.query["question"];
  const questionStr = JSON.stringify(question);
  const results = await askToHtml(questionStr);
  const resultStr = results.join("");

  return resultStr;
};

export const simpleQuestionOnSlack: SlackUsecase = async (req) => {
  const payload = req.body;
  logger.info("payload: ", JSON.stringify(payload));

  if (payload.event.type === "app_mention") {
    logger.info("event.type is app_mention");

    const message = trim(payload.event.text);

    const results = await askToSlack(message);

    await getSlackClient().chat.postMessage({
      channel: payload.event.channel,
      blocks: makeBlock(results),
      thread_ts: payload.event.ts,
    });
  }

  if (payload.event.type === "message") {
    logger.info("event.type is message");
  }
};

const makeBlock = (texts: string[]) => {
  return texts.map((t) => ({
    type: "section",
    text: {
      type: "mrkdwn",
      text: t,
    },
  }));
};
