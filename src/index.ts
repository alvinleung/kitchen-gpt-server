import { ChatGPTAPI, ChatGPTUnofficialProxyAPI } from "chatgpt";
import express, { Request, Response } from "express";
import inquirer from "inquirer";
import * as dotenv from "dotenv";
import Keyv from "keyv";
import { oraPromise } from "ora";
import { createChatSession } from "./chatapi/ChatSession";

//https://chat.openai.com/api/auth/session
dotenv.config();

interface PromptMessage {
  content: string;
}

const CHAT_MODE = true;

async function main() {
  const chatSession = await createChatSession({
    apiKey: process.env.OPENAI_API_KEY as string,
  });

  const app = express();
  const port = 1234;

  app.use(express.json());
  app.post("/prompt", async (req: Request, res: Response) => {
    const message = req.body as PromptMessage;
    console.log("message received");
    console.log(message);
    const chatGPTResponse = await oraPromise(chatSession.send(message.content));
    console.log("\n" + chatGPTResponse + "\n");
    res.json({ content: chatGPTResponse });
  });

  app.listen(port, () => {
    console.log(`🚀 server started at http://localhost:${port}`);
  });

  // server side interface
  // while (true) {
  //   const { prompt } = await inquirer.prompt([
  //     { type: "input", name: "prompt", message: "ask gpt:" },
  //   ]);
  //   const chatResponse = await oraPromise(chatSession.send(prompt));
  //   console.log("\n" + chatResponse + "\n");
  // }
}

main();
