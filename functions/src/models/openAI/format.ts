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
Please follow the output format and answer the following questions with example.

Output format:
1. consists of a single block from the Slack Block Kit.
2. the text is organized in an easy-to-read format.
3. The text is written in Japanese.

Example output:
{
  "type": "section",
  "text": {
    "type": "mrkdwn",
    "text": "New Paid Time Off request from <example.com|Fred Enriquez>\n\n<https://example.com|View request>"
  }
}

Questions:
${text}`;
  return t;
};
