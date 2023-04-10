import {WebClient} from "@slack/web-api";

let client: WebClient;

export const initSlackWebClient = (token: string) => {
  client = new WebClient(token);
};

export const getSlackClient = () => client;
