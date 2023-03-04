import { Configuration, OpenAIApi } from "openai";
import { createMessageStore, MessageRole } from "./MessageStore";

function getOpenAIApi(apiKey: string) {
  // setup open ai api
  const configuration = new Configuration({
    apiKey: apiKey,
  });
  return new OpenAIApi(configuration);
}

const INITIAL_PROMPT =
  "You are a helpful kitchen assistant. Answer as conciesely and factually accurate as possible within 30 words.";

interface ChatSessionConfig {
  apiKey: string;
}
export async function createChatSession({ apiKey }: ChatSessionConfig) {
  const openai = getOpenAIApi(apiKey);

  // keyv for potentially saving data to database
  const messages = createMessageStore();

  const promptChatGPT = async (
    role: MessageRole = MessageRole.USER,
    prompt: string
  ) => {
    messages.add(role, prompt);

    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: messages.getRecentMessages(),
    });

    if (completion.status !== 200) {
      console.error("Cannot access openai api");
      return;
    }

    const messageContent = completion.data.choices[0].message?.content;
    if (typeof messageContent === "undefined") {
      console.error("cannot read message content");
      console.log(completion.data);
      return;
    }

    messages.add(MessageRole.ASSISTANT, messageContent);

    console.log(messages.getRecentMessages());

    return messageContent;
  };

  const startConversation = async () => {
    await promptChatGPT(MessageRole.SYSTEM, INITIAL_PROMPT);
  };

  // init the conversation right away
  await startConversation();

  const send = async (prompt: string) => {
    return await promptChatGPT(MessageRole.USER, prompt);
  };

  const clearMessages = async () => {
    messages.clear();
    await startConversation();
  };

  return {
    send,
    clearMessages,
  };
}
