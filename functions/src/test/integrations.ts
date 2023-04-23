import { getOpenAI } from "../models/openAI";
import { MemorizedConversation } from "../models/openAI/chat";
import { getSlackClient } from "../models/slack";
import { startup } from "../startup";

const SlackOptions = {
  channel: "C052L6CCB2Q"
}

const texts = {
  simple: "",
  markDown: "```\nthis is markup\n```"
}

const integrationTest = async () => {
  await postMessage();
  await askGPT();
}

const postMessage = () => {
  return getSlackClient().chat.postMessage({
    channel: SlackOptions.channel,
    text: texts.markDown
  });
}

const askGPT = async () => {
  const openai = getOpenAI();
  const mllm = new MemorizedConversation(openai);
  const msg = await mllm.ask("hello, world!");
  console.log(msg);
}

// const FirestoreOptions = {
//   user: "TEST_USER",
//   channel: "TEST_CHANNEL"
// }

// const saveAndLoad = async () => {
//   const start = new Date();
//   console.log("saveAndLoad");
//   const slackHistoryDao = new SlackHistoryDao(getFirestoreDB());
//   await slackHistoryDao.StoreBySlackChannel(FirestoreOptions.user, FirestoreOptions.channel, [
//     { role: "user", content: "hi!" },
//     { role: "assistant", content: "Hi! There!" },
//   ]);
//   const milestone = new Date();
//   let elapsedSec = Math.floor(start.getTime() - milestone.getTime() / 1000);
//   console.log("start~mile: ", elapsedSec, " [sec]");

//   await slackHistoryDao.FindBySlackChannel(FirestoreOptions.user, FirestoreOptions.channel);
//   const end = new Date();
//   elapsedSec = Math.floor(milestone.getTime() - end.getTime() / 1000);
//   console.log("mile~end: ", elapsedSec, " [sec]");
//   elapsedSec = Math.floor(start.getTime() - end.getTime() / 1000);
//   console.log("start~end: ", elapsedSec, " [sec]");
// }

startup(integrationTest);
