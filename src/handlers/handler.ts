import { fetchChatRecentMessages, fetchMessage, sendMessage } from "../services/iMessageServer"
import { IMessage, IWebhookBody, Reaction, iMessageWebhookRequest } from "../models"
import { chat, getEmbedding, getTokenCount } from "../services/openai"
import { upsert } from "../services/pinecone"
import * as iMessageServer from "../services/iMessageServer"

import { ConversationCache } from '../services/conversationCache'

import * as users from "../services/users"

export const logger = (req, res, next) => {
    console.log(`[${new Date().toLocaleString()}] ${req.body.type} ${req.body.data.handle.address}`);
    next();
}

export const reqTransform = (req: iMessageWebhookRequest, res, next) => {

    const messageData = req.body.data
    req.data = {
        userId: messageData.handle.address,
        chatId: messageData.chats[0].guid,
        associateMessage: {
            id: messageData.associatedMessageGuid,
            type: messageData.associatedMessageType
        },
        message: {
            id: messageData.guid,
            content: messageData.text
        }

    }

    next()
}

export const senderVerification = (req: iMessageWebhookRequest, res, next) => {
    if (req.body.data.isFromMe) {
        res.sendStatus(200)
    } else {
        if (users.isSubscribed(req.data.userId)) {
            next()
        } else {
            iMessageServer.sendMessage(req.data.userId, "You are not signed up yet. Talk to drew :)")
        }

    }
}

export const typingStartHandler = async (req: iMessageWebhookRequest, res, next) => {
    if (req.body.type == 'typing') {

        let recentMessages = await fetchChatRecentMessages(req.data.chatId)
        //foreach message in recent get token lenght
        recentMessages = recentMessages.map((m) => {
            m.tokenCount = getTokenCount(m.text)
            return m
        })
        const convoCache = ConversationCache.getInstance()
        convoCache.set(req.data.chatId, recentMessages)

        res.sendStatus(200)
    } else {
        next()
    }
}


