export interface IncomingMessage {
  userId: string;
  message: string;
  type: string;
  images: string[];
}

export interface IRecipient {
  name: string;
  phone: string;
}

// interface ISendMessage<T = string> {
//   recipient: string;
//   messageBody: T;
//   // ...
// }

export interface ISendMessage {
  recipient: IRecipient;
  messageBody: Record<string, any>;
  messageKey: string;
  replacementText?: string;
  mediaurl?: string[];
  msgType?: string;
  listModel?: Record<string, unknown>;
  mediaName?: string;
  mediaPlaceHolder?: string;
}

export interface IWarehouse {
  latitude: number;
  longitude: number;
  address: string;
}
