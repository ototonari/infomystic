import * as functions from "firebase-functions";

type ConfigType = {
  OpenAIKey: string
  SlackBotToken: string
}

const setConfig = (): ConfigType => {
  const _conf = functions.config();

  return {
    OpenAIKey: _conf.open_ai.api_key,
    SlackBotToken: _conf.slack_api.bot_user_oauth_token,
  };
};

export const Config = setConfig();
