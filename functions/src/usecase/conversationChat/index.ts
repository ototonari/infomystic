import { SlackHistoryDao } from "../../dao/firestore/slackHistoryDao";
import { getFirestoreDB } from "../../io/firestore";
import {logger} from "../../io/function";
import {SlackUsecase} from "../../io/requestConnectorOnSlack";
import { getOpenAI } from "../../models/openAI";
import {MemorizedConversation} from "../../models/openAI/chat";
import { slackMarkdownFormat } from "../../models/openAI/format";
import {getSlackClient} from "../../models/slack";
import {trim} from "../../models/slack/message";

export const conversationChatOnSlack: SlackUsecase = async (req) => {
  const payload = req.body;
  logger.info("payload: ", JSON.stringify(payload));

  if (payload.event.type === "app_mention") {
    const {channelID, user} = payload.event;
    const prompt = slackMarkdownFormat(trim(payload.event.text));

    const slackHistoryDao = new SlackHistoryDao(getFirestoreDB());
    const prevMessages = await slackHistoryDao.FindBySlackChannel(user, channelID)

    const openai = getOpenAI();
    const mllm = new MemorizedConversation(openai, prevMessages);
    const result = await mllm.ask(prompt);

    await slackHistoryDao.StoreBySlackChannel(user, channelID, [
      {role: "user", content: prompt},
      {role: "assistant", content: result},
    ]);

    await getSlackClient().chat.postMessage({
      channel: payload.event.channel,
      blocks: makeBlock([result]),
      thread_ts: payload.event.ts,
    });
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
