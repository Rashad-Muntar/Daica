export interface IncomingMessage {
  userId: string;
  message: string;
  images: string[];
}


export interface ISendMessage {
  recipient:         string;
  messageBody:       string;
  messageKey:        string;
  replacementText?:  string;
  mediaurl?:         string;
  msgType?:          string;
  listModel?:        Record<string, unknown>;
  mediaName?:        string;
  mediaPlaceHolder?: string;
}

export interface IWarehouse {
  latitude:  number;
  longitude: number;
  address:   string;
}

