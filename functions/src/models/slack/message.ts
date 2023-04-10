

const botRegex = /<@.+>/;
export const trim = (text: string): string => {
  return text.replace(botRegex, "");
};

export const trimAndSplit = (text: string): string[] => {
  return trim(text).split("\n");
};
