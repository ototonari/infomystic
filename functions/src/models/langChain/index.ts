import {OpenAI} from "langchain/llms/openai";

// いくつか実験的に実装を試みたが、会話チェーンなどのプロンプトがエラーで返されるようで、未実装箇所が見受けられたため、
// しばらくはOpenAIを利用することとする。

export const openAISetup = async (apiKey: string) => {
  if (apiKey == null) throw new Error("must set api key.");

  const openai = new OpenAI({
    openAIApiKey: apiKey,
  });

  return openai;
};

let openAIApiKey: string;

export const getAPIKey = () => openAIApiKey;

export const startUpByLC = async (apiKey: string) => {
  if (apiKey == null) throw new Error("must set api key.");

  openAIApiKey = apiKey;
};
