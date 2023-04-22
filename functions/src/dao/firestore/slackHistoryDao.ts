import { Firestore } from "firebase-admin/firestore";
import { ChatCompletionRequestMessage } from "openai";

type DataType = {
  messages: ChatCompletionRequestMessage[]
}

interface ISlackHistoryDao {
  StoreBySlackChannel: (userID: string, channelID: string, partialMessages: ChatCompletionRequestMessage[]) => Promise<void>;
  FindBySlackChannel: (userID: string, channelID: string) => Promise<ChatCompletionRequestMessage[]>;
}

export class SlackHistoryDao implements ISlackHistoryDao {
  client: Firestore
  constructor(client: Firestore) {
    this.client = client;
  }

  StoreBySlackChannel = async (userID: string, channelID: string, partialMessages: ChatCompletionRequestMessage[]) => {
    const ref = this.client.collection(userID).doc(channelID);

    try {
      await this.client.runTransaction(async t => {
        const doc = await t.get(ref);
        const data = doc.data() as DataType;
        let newMessages;
        if (data) {
          newMessages = [
            ...data.messages,
            ...partialMessages,
          ];
        } else {
          newMessages = [
            ...partialMessages,
          ];
        }

        // newMessages の 最新10件を取得する
        const latestMessages = newMessages.slice(-10);
        t.set(ref, { messages: latestMessages });
      })
    } catch (error) {
      console.error(error);
    }
  }

  FindBySlackChannel = async (userID: string, channelID: string) => {
    const ref = this.client.collection(userID).doc(channelID);
    const doc = await ref.get();
    const data = doc.data() as DataType;
    if (data) {
      return data.messages;
    } else {
      return [];
    }
  }

}