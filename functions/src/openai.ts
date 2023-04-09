import {Configuration, OpenAIApi} from "openai";

export const openAISetup = async (apiKey: string) => {
  if (apiKey == null) throw new Error("must set api key.");

  const configuration = new Configuration({
    apiKey: apiKey,
  });
  const openai = new OpenAIApi(configuration);

  return openai;
};
