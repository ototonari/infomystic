import * as admin from "firebase-admin";

import {startUp} from "./models/openAI";
import {Config} from "./io/firebaseConfig";
import {initSlackWebClient} from "./models/slack";

export const startup = async (callback?: () => Promise<void>) => {
  admin.initializeApp();
  initSlackWebClient(Config.SlackBotToken);
  await startUp(Config.OpenAIKey);
  // await startUpByLC(Config.OpenAIKey);
  if (callback) return callback();
};
