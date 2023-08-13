declare enum ModelType {
  OPENAI = 'OPENAI',
  AZURE_OPENAI = 'AZURE_OPENAI',
}

declare interface Message {
  role: Role;
  content: string;
}

declare interface ChatFolder {
  id: number;
  name: string;
}

declare interface ChatBody {
  messages: Message[];
  prompt: string;
}

declare interface KeyValuePair {
  key: string;
  value: any;
}

declare type Role = 'assistant' | 'user';
