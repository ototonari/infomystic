export const htmlFormat = (text: string): string => {
  const t = `
出力フォーマットに従い、以下の質問に答えてください。

出力フォーマット:
1. HTMLタグで構成されている。
2. 見やすいスタイルが適用されている。

質問:
${text}`;
  return t;
};

export const slackMarkdownFormat = (text: string): string => {
  const t = `
Follow the output format and answer the following questions.

Output format:
1. Output language is Japanese.

Questions:
${text}`;
  return t;
};

export const basePrompt = `
Follow the output format and answer the following questions.
Output format:
1. Use of clear and concise language.
2. Output language is Japanese.

`

export const systemPrompt = "You are a helpful assistant.";