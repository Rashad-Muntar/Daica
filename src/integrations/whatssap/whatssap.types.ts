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
  location?: ILocation;
}

export interface IWarehouse {
  latitude: number;
  longitude: number;
  address: string;
}

export interface IButton {
  title: string;
  id: string;
}

export interface ILocation {
  latitude: number;
  longitude: number;
  address?: string;
  name?: string;
}
