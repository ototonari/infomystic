import {startup} from "../startup";
import {getOpenAI} from "../models/openAI";
import {createInterface} from "readline/promises";
import {MemorizedConversation} from "../models/openAI/chat";

const startCLI = async () => {
  const openai = getOpenAI();
  const mllm = new MemorizedConversation(openai);

  console.log("Ask for gpt. if you want to quit then enter [n] \n");
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  try {
    let questionByUser = "";
    questionByUser = await rl.question("You: ");
    while (questionByUser != "n") {
      const answer = await mllm.ask(questionByUser);
  
      console.log("AI: ", answer);
      questionByUser = await rl.question("You: ");
    }
    
  } catch (error) {
    console.log("error: ", error);
  } finally {
    rl.close();
  }
};

startup(startCLI);
