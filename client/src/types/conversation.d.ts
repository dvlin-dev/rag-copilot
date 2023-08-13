import { Message } from './chat';

declare interface Conversation {
  id: number;
  name: string;
  messages: Message[];
  prompt: string;
  folderId: number;
  index: Index;
}

declare interface Index {
  id: number;
  name: string;
  description: string;
  prompt: string;
  questions: string[];
  createdAt: Date;
  updatedAt: Date;
  // documents: Document[];
}
