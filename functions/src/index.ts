import * as functions from "firebase-functions";

import * as admin from "firebase-admin";
import {openAISetup} from "./openai";
import {ChatCompletionRequestMessage, OpenAIApi} from "openai";

admin.initializeApp();

let openai: OpenAIApi;

const startUp = async () => {
  openai = await openAISetup();
};

startUp();

const makeContent = (text: string): string => {
  const t = `
出力フォーマットに従い、以下の質問に答えてください。

出力フォーマット:
1. HTMLタグで構成されている。
2. 見やすいスタイルが適用されている。

質問:
${text}`;
  return t;
};

const askOnlyOnce = async (text: string): Promise<string[]> => {
  const content = makeContent(text);

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

export const askChatGPT = functions
  .region("asia-northeast1")
  .runWith({
    timeoutSeconds: 540,
    memory: "128MB",
  })
  .https
  .onRequest(async (req, res) => {
    const question = req.query["question"];
    const questionStr = JSON.stringify(question);
    const results = await askOnlyOnce(questionStr);
    const resultStr = results.join("");

    res.status(200).send(resultStr);
  });

// // Start writing functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

// export const addMessage = functions.https.onRequest(async (req, res) => {
//   // Grab the text parameter.
//   const original = req.query.text;
//   // Push the new message into Firestore using the Firebase Admin SDK.
//   const writeResult = await admin
//     .firestore()
//     .collection("messages")
//     .add({original: original});
//   // Send back a message that we've successfully written the message
//   res.json({result: `Message with ID: ${writeResult.id} added.`});
// });

// export const makeUppercase = functions.firestore
//   .document("/messages/{documentId}")
//   .onCreate((snap, context) => {
//     // Grab the current value of what was written to Firestore.
//     const original = snap.data().original as string;

//     // Access the parameter `{documentId}` with `context.params`
//     functions.logger.log("Uppercasing", context.params.documentId, original);

//     const uppercase = original.toUpperCase();

//     return snap.ref.set({uppercase}, {merge: true});
//   });
