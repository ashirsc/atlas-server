import { Configuration, OpenAIApi } from "openai";
import { IMessage, OpenAiModels } from "../models";
import { get_encoding, encoding_for_model } from "@dqbd/tiktoken";


const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export const getEmbedding = async (text: string): Promise<number[]> => {

  const response = await openai.createEmbedding({
    model: OpenAiModels.embedding,
    input: text,
  });

  // console.log(response.data.data.length);

  return response.data.data[0].embedding;
};



export const chat = async (messages: IMessage[]) => {



  const completion = await openai.createChatCompletion({
    model: OpenAiModels.chat,
    messages: [{ role: "user", content: messages[0].text }],
  });
  console.log(completion.data.choices[0].message);
  return completion.data.choices[0].message?.content


}

export function getTokenCount(text:string):number {
  console.time("load encoder");
  const enc = encoding_for_model(OpenAiModels.chat);
  console.timeEnd("load encoder")
  const tokens = enc.encode(text).length
  enc.free()
  return tokens
}


