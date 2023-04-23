import { Firestore } from "firebase-admin/firestore";
import { ChatCompletionRequestMessage } from "openai";
import { logger } from "../../io/function";

const collectionName = "SlackHistory";

type DataType = {
  [channelID: string]: ChatCompletionRequestMessage[]
}

interface ISlackHistoryDao {
  StoreBySlackChannel: (userID: string, channelID: string, partialMessages: ChatCompletionRequestMessage[]) => Promise<void>;
  FindBySlackChannel: (userID: string, channelID: string) => Promise<ChatCompletionRequestMessage[]>;
}

export class SlackHistoryDao implements ISlackHistoryDao {
  private client: Firestore
  constructor(client: Firestore) {
    this.client = client;
  }

  StoreBySlackChannel = async (userID: string, channelID: string, partialMessages: ChatCompletionRequestMessage[]) => {
    const ref = this.client.collection(collectionName).doc(userID);

    try {
      const start = new Date();

      await this.client.runTransaction(async t => {
        const doc = await t.get(ref);
        if (!doc.exists) {
          t.set(ref, { [channelID]: partialMessages });
          return;
        } else {
          const data = doc.data() as DataType;
          if (data[channelID]) {
            const newMessages = [
              ...data[channelID],
              ...partialMessages,
            ];
            // newMessages の 最新10件を取得する
            const latestMessages = newMessages.slice(-10);
            t.set(ref, { [channelID]: latestMessages });
            return;
          } else {
            t.set(ref, { [channelID]: partialMessages });
            return;
          }
        }
      });

      const end = new Date();
      const elapsedSec = Math.floor(start.getTime() - end.getTime() / 1000);
      logger.log("StoreBySlackChannel: ", elapsedSec, " [sec]");
    } catch (error) {
      logger.error(error);
    }
  }

  FindBySlackChannel = async (userID: string, channelID: string) => {
    const start = new Date();

    const ref = this.client.collection(collectionName).doc(userID);
    const doc = await ref.get();

    const end = new Date();
    const elapsedSec = Math.floor(start.getTime() - end.getTime() / 1000);
    logger.log("FindBySlackChannel: ", elapsedSec, " [sec]");

    if (!doc.exists) {
      return [];
    } else {
      const data = doc.data() as DataType;
      if (data[channelID]) {
        return data[channelID];
      } else {
        return [];
      }
    }
  }

}