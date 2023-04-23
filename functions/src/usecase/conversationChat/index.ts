import { AppMentionEvent } from "@slack/bolt";
import { SlackHistoryDao } from "../../dao/firestore/slackHistoryDao";
import { getFirestoreDB } from "../../io/firestore";
import { logger } from "../../io/function";
import { SlackUsecase } from "../../io/requestConnectorOnSlack";
import { getOpenAI } from "../../models/openAI";
import { MemorizedConversation } from "../../models/openAI/chat";
import { slackMarkdownFormat } from "../../models/openAI/format";
import { getSlackClient } from "../../models/slack";
import { trim } from "../../models/slack/message";

export const conversationChatOnSlack: SlackUsecase<AppMentionEvent> = async (
  payload
) => {
  const {event} = payload;
  if (!(event && event.type === "app_mention" && event.user)) return;

  logger.info("payload: ", JSON.stringify(payload));
  const { channel, user } = event;

  if (!user) return;

  const prompt = slackMarkdownFormat(trim(payload.event.text));

  const slackHistoryDao = new SlackHistoryDao(getFirestoreDB());
  const prevMessages = await slackHistoryDao.FindBySlackChannel(
    user,
    channel
  );

  const openai = getOpenAI();
  const mllm = new MemorizedConversation(openai, prevMessages);
  const result = await mllm.ask(prompt);

  await getSlackClient().chat.postMessage({
    channel: payload.event.channel,
    blocks: makeBlock([result]),
    thread_ts: payload.event.ts,
    reply_broadcast: true,
  });

  slackHistoryDao.StoreBySlackChannel(user, channel, [
    { role: "user", content: prompt },
    { role: "assistant", content: result },
  ]);
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
