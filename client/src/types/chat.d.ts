declare enum ModelType {
  OPENAI = 'OPENAI',
  AZURE_OPENAI = 'AZURE_OPENAI',
}

declare interface Message {
  role: MessageRole;
  content: string;
  createdAt: string;
  ratingValue?: number;
}

declare interface ChatFolder {
  id: number;
  name: string;
}

declare interface KeyValuePair {
  key: string;
  value: any;
}
