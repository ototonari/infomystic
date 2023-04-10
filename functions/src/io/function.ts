import * as functions from "firebase-functions";

const runtime = functions.runWith({timeoutSeconds: 540, memory: "128MB"});

const usRegion = runtime.region("us-central1");

const tokyoRegion = runtime.region("asia-northeast1");

// リージョンやインスタンスの設定はこちらで管理する
export const requestHandler = tokyoRegion
  .https
  .onRequest;

export const externalHandler = usRegion.https.onRequest;

export const logger = functions.logger;
