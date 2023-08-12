import { Message } from './chat';

export interface Conversation {
  id: number;
  name: string;
  messages: Message[];
  prompt: string;
  folderId: number;
  index: Index;
}

interface Index {
  id: number;
  name: string;
  description: string;
  prompt: string;
  questions: string[];
  createdAt: Date;
  updatedAt: Date;
  // documents: Document[];
}
