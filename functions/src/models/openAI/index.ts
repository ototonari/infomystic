import {ChatCompletionRequestMessage, Configuration, OpenAIApi} from "openai";

export const openAISetup = async (apiKey: string) => {
  if (apiKey == null) throw new Error("must set api key.");

  const configuration = new Configuration({
    apiKey: apiKey,
  });
  const openai = new OpenAIApi(configuration);

  return openai;
};

let openai: OpenAIApi;

export const startUp = async (apiKey: string) => {
  openai = await openAISetup(apiKey);
};

export const askOnlyOnce = async (text: string): Promise<string[]> => {
  const content = makeContent(text);

  const assistantMessages: ChatCompletionRequestMessage[] = [
    {role: "system", content: "You are a helpful assistant."},
  ];

  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [...assistantMessages, {role: "user", content: content}],
  });

  const contents = completion.data.choices
    .map((c) => c.message?.content);

  return contents.filter((value) => value !== null) as string[];
};

const makeContent = (text: string): string => {
  const t = `
出力フォーマットに従い、以下の質問に答えてください。

出力フォーマット:
1. HTMLタグで構成されている。
2. 見やすいスタイルが適用されている。

質問:
${text}`;
  return t;
};
