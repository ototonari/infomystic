import {PromptTemplate} from "langchain/prompts";

const basicQuestionJaTemplate = `
Follow the output format and answer the following questions.

Output format:
1. Output language is Japanese.

Questions:
{question}
`;

export const basicQuestionJa = (key: string) => new PromptTemplate({
  inputVariables: ["question"],
  template: basicQuestionJaTemplate,
}).format({question: key});
