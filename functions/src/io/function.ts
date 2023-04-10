import * as functions from "firebase-functions";

// リージョンやインスタンスの設定はこちらで管理する
export const requestHandler = functions
  .region("asia-northeast1")
  .runWith({
    timeoutSeconds: 540,
    memory: "128MB",
  })
  .https
  .onRequest;

export const logger = functions.logger;
