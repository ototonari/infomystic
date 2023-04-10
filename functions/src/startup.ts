import * as admin from "firebase-admin";

import {startUp} from "./models/openAI";
import {Config} from "./io/firebaseConfig";
import {initSlackWebClient} from "./models/slack";

export const startup = () => {
  admin.initializeApp();
  startUp(Config.OpenAIKey);
  initSlackWebClient(Config.SlackBotToken);
};
