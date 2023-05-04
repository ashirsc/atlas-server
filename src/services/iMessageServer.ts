import axios from "axios";
import { IMessage } from "../models";
import { v4 as uuidv4 } from 'uuid';

if (!process.env.IMESSAGE_SERVER_PASSWORD) {
    throw new Error("IMESSAGE_SERVER_PASSWORD is not set");
}

const client = axios.create({
    baseURL: "http://localhost:1234/api/v1",
    headers: {},
    params: {
        password: process.env.IMESSAGE_SERVER_PASSWORD
    }
});


export const fetchMessage = async (id: string): Promise<IMessage | undefined> => {
    try {
        console.log("checking for message ", id)
        const res = await client.get("/message/" + id, {
            params: {
                with: "chats,participants"
            }
        })
        return res.data.data

    } catch (err) {
        console.log(`${(err as any).response.status}  ${(err as any).response.statusText}`)
        return
    }
}

export const fetchChatRecentMessages = async (chatId: string, minutesAgo:number = 5): Promise<IMessage[]> => {
    try {
        var currentDate = new Date();
        var timeAgo = new Date(currentDate.getTime() - minutesAgo * 60000);
        const res = await client.get(`/chat/${chatId}/message`, {
            params: {
                after: timeAgo
            }
        })
        return res.data.data

    } catch (err) {
        console.log(`${(err as any).response.status}  ${(err as any).response.statusText}`)
        return []
    }
}




export const sendMessage = async (userId, message): Promise<void> => {
    try {


        const body = {
            chatGuid: userId,
            "tempGuid": uuidv4(),
            "message": message,
            "method": "apple-script",
            "subject": "",
            "effectId": "",
            "selectedMessageGuid": "",
            "partIndex": 0
        }
        await client.post("/message/text", body)



    } catch (error) {
        console.log((error as any).response.data)
    }


}