import {Request} from 'express'


export enum Reaction {
    love = 'love',
    like = "like",
    dislike = "dislike",
    laugh = "laugh",
    emphasize = 'emphasize',
    question = 'question'
} 

export enum OpenAiModels {
    davinci = "text-davinci-003",
    curie = "text-curie-001",
    babbage = "text-babbage-001",
    ada = "text-ada-001",
    chat = "gpt-3.5-turbo",
    embedding = "text-embedding-ada-002",
  }

  export interface IMessage{
    originalROWID: number;
    guid: string;
    text: string;
    attributedBody: null;
    handle: {
      originalROWID: number;
      address: string;
      service: string;
      uncanonicalizedId: null;
      country: string;
    };
    handleId: number;
    otherHandle: number;
    attachments: any[]; // or you can define a separate interface for attachments
    subject: null;
    error: number;
    dateCreated: number;
    dateRead: null;
    dateDelivered: null;
    isFromMe: boolean;
    hasDdResults: boolean;
    isArchived: boolean;
    itemType: number;
    groupTitle: null;
    groupActionType: number;
    balloonBundleId: null;
    associatedMessageGuid: string;
    associatedMessageType: Reaction;
    expressiveSendStyleId: null;
    threadOriginatorGuid: null;
    hasPayloadData: boolean;
    country: null;
    isDelayed: boolean;
    isAutoReply: boolean;
    isSystemMessage: boolean;
    isServiceMessage: boolean;
    isForward: boolean;
    threadOriginatorPart: null;
    isCorrupt: boolean;
    datePlayed: null;
    cacheRoomnames: null;
    isSpam: boolean;
    isExpired: boolean;
    timeExpressiveSendStyleId: null;
    isAudioMessage: boolean;
    replyToGuid: string;
    wasDeliveredQuietly: boolean;
    didNotifyRecipient: boolean;
    chats: {
        originalROWID: number,
        guid:  string,
        style: number,
        chatIdentifier: string,
        isArchived: boolean,
        displayName: string
      }[]; 
    messageSummaryInfo: null;
    payloadData: null;
    dateEdited: null;
    dateRetracted: null;
    partCount: number;
    tokenCount?:number
  };

  // export interface iMessageExt extends IMessage {
  // }

  export interface IWebhookBody {
    type: 'new-message' | 'typing' | string,
    data:IMessage
  }


  export interface iMessageWebhookRequest extends Request<any, any, IWebhookBody> {
    data: {

      userId:string,
      chatId:string,
      message: {
        id:string,
        content:string
      }
      associateMessage: {
        type:string,
        id:string,
      }
    }
  }