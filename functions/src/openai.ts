import {Configuration, OpenAIApi} from "openai";

export const openAISetup = async () => {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  return openai;
};
