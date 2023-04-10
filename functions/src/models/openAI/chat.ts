import {ChatCompletionRequestMessage} from "openai";
import {getOpenAI} from ".";
import {htmlFormat, slackMarkdownFormat} from "./format";

export const askToHtml = async (text: string): Promise<string[]> => {
  const openai = getOpenAI();
  const content = htmlFormat(text);

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

export const askToSlack = async (text: string): Promise<string[]> => {
  const openai = getOpenAI();
  const content = slackMarkdownFormat(text);

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
