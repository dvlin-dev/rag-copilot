declare interface Project {
  id: string;
  name: string;
  userId: string;
  documents: Document[];
  conversations: Conversation[];
}

declare interface ProjectDetail {
  id: string;
  description?: string | null;
  prompt?: string | null;
  questions: string[];
  createdAt: Date;
  updatedAt: Date;
  whiteList: string[];
  ipLimit?: number | null;
}

declare interface Docs {
  id: string;
  name?: string | null;
  description?: string | null;
  indexs: Index[];
  createdAt: Date;
  updatedAt: Date;
  projectId: string;
}

declare interface Index {
  id: string;
  content: string;
  vector?: any;
  source?: string | null;
  namespace?: string | null;
  metadata?: any;
  docId: string;
}

declare interface Conversation {
  id: string;
  projectId?: string | null;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

declare interface Message {
  id: string;
  content: string;
  role: MessageRole;
  ratingValue?: number | null;
  createdAt: Date;
  conversationId?: string | null;
}
