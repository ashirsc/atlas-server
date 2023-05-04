import express from "express"
import { IMessage, IWebhookBody, Reaction, iMessageWebhookRequest } from "../models"
import { ConversationCache } from "../services/conversationCache"
import * as iMessageServer from "../services/iMessageServer"
import * as openai from "../services/openai"
import * as pinecone from '../services/pinecone'


export const messageRouter = express.Router()

//reaction handler
const reactionHandler = async (req: iMessageWebhookRequest, res, next) => {


    // i can use these to handle reactions
    // body.data.associatedMessageGuid
    // body.data.associatedMessageType

    const { body }: { body: IWebhookBody } = req
    const message = body.data.text
    const userId = body.data.handle.address
    const messageId = body.data.guid

    switch (req.body.data.associatedMessageType) {
        case Reaction.emphasize:
            const message = await iMessageServer.fetchMessage(body.data.associatedMessageGuid.replace("p:0/", ""))

            const embedding = await openai.getEmbedding(message?.text ?? "")
            const upsertRes = await pinecone.upsert(messageId, embedding, { nameSpace: userId })
            console.log(upsertRes)
            res.sendStatus(200)
            break;

        case Reaction.dislike:
        case Reaction.like:
        case Reaction.love:
        case Reaction.laugh:
        case Reaction.question:
        default:
            next()
            break;
    }

}
messageRouter.use(reactionHandler)

//
const newMessageHandler = async (req: iMessageWebhookRequest, res) => {




    const { message, userId, chatId } = req.data

    const convoCache = ConversationCache.getInstance()
    let convo: IMessage[] = []

    if (convoCache.has(chatId)) {
        convo = convoCache.get(chatId)
    } else {
        convo = await iMessageServer.fetchChatRecentMessages(chatId)
    }
    req.body.data.tokenCount = openai.getTokenCount(message.content)
    convo.push(req.body.data)

    // convo = convo.filter(message => {
    //     const timeAgo = Date.now() - (15 * 60 * 1000); // 5 minutes ago in milliseconds
    //     return message.dateDelivered.getTime() <= timeAgo;
    // })

    let messages: IMessage[] = []
    let tokenCountSum = 0;
    for (const message of convo) {
        if (tokenCountSum + (message.tokenCount ?? 0) < 1300) {
            messages.push(message);
            tokenCountSum += (message.tokenCount ?? 0);
        } else {
            break;
        }
    }
    const chatres = await openai.chat(convo)
    // console.log("chatres", chatres)

    iMessageServer.sendMessage(chatId, chatres)

    res.sendStatus(200)



}
messageRouter.use(newMessageHandler)


