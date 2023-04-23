import {ChatCompletionRequestMessage, OpenAIApi} from "openai";
import {getOpenAI} from ".";
import { htmlFormat, slackMarkdownFormat, basePrompt, systemPrompt } from "./format";

const firstUserPrompt = {role: "user", content: basePrompt };

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

export class MemorizedConversation {
  client: OpenAIApi;
  messages: ChatCompletionRequestMessage[];
  constructor(openAI: OpenAIApi, prevMessages: ChatCompletionRequestMessage[] = []) {
    this.client = openAI;
    this.messages = prevMessages;
  }
  private prepareMessages = (prompt: string): ChatCompletionRequestMessage[] => {
    return [
      {role: "system", content: systemPrompt},
      {role: "user", content: basePrompt},
      ...this.messages,
      {role: "user", content: prompt},
    ]
  }
  private saveMessage = (prompt: string, answer: string) => {
    const newMessages: ChatCompletionRequestMessage[] = [
      ...this.messages,
      {role: "user", content: prompt},
      {role: "assistant", content: answer},
    ];

    this.messages = newMessages;
  }

  public ask = async (prompt: string): Promise<string> => {
    const messages = this.prepareMessages(prompt);
    // console.log("debug, pre messages: ", messages);

    const completion = await this.client.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: messages,
    });
    const answer = completion.data.choices
      .map((c) => c.message?.content).join("");

    this.saveMessage(prompt, answer);
    // console.log("debug, suff messages: ", this.messages);
    return answer;
  }
}

export const singleChatCompletion = async (openAI: OpenAIApi, prompt: string): Promise<string> => {
  const completion = await openAI.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {role: "system", content: "You are a helpful assistant."},
      {role: "user", content: prompt}
    ],
  });

  return completion.data.choices
    .map((c) => c.message?.content).join("");
}
