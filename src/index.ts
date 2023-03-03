import { ChatGPTAPI, ChatGPTUnofficialProxyAPI } from "chatgpt";
import express, { Request, Response } from "express";
import inquirer from "inquirer";
import * as dotenv from "dotenv";
import Keyv from "keyv";
import { oraPromise } from "ora";

// const app = express();
// const port = 10000;

// app.get("/", (req: Request, res: Response) => {
//   res.json({ greeting: "Hello world!" });
// });

// app.listen(port, () => {
//   console.log(`🚀 server started at http://localhost:${port}`);
// });

//https://chat.openai.com/api/auth/session
dotenv.config();

// const api = new ChatGPTUnofficialProxyAPI({
//   accessToken: process.env.OPENAI_ACCESS_TOKEN as string,
// });

const messageStore = new Keyv();
const api = new ChatGPTAPI({
  apiKey: process.env.OPENAI_API_KEY as string,
  messageStore,
});

(async () => {
  while (true) {
    const { prompt } = await inquirer.prompt([
      { type: "input", name: "prompt", message: "ask gpt:" },
    ]);
    const res = await oraPromise(api.sendMessage(prompt), {
      text: prompt,
    });
    console.log("\n" + res.text + "\n");
  }
})();
