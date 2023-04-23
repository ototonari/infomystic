import * as functions from "firebase-functions";

type ConfigType = {
  OpenAIKey: string
  SlackBotToken: string
  SlackSigningSecret: string
}

const setConfig = (): ConfigType => {
  const _conf = functions.config();

  return {
    OpenAIKey: _conf.open_ai.api_key,
    SlackBotToken: _conf.slack_api.bot_user_oauth_token,
    SlackSigningSecret: _conf.slack_api.signing_secret,
  };
};

export const Config = setConfig();
