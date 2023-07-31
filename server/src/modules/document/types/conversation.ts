import { Index } from 'src/entity/index.entity';
import { Message } from './chat';

export interface Conversation {
  id: number;
  name: string;
  messages: Message[];
  prompt: string;
  folderId: number;
  index: Index;
}
