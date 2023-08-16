// Enums
declare enum ProfileGenderEnum {
  male = 'male',
  female = 'female',
  other = 'other',
}

declare enum UserAccountTypeEnum {
  email = 'email',
  github = 'github',
}

declare enum MessageRole {
  system = 'system',
  ai = 'ai',
  hunman = 'hunman',
}

declare interface User {
  id: string;
  githubId?: string | null;
  username: string;
  email?: string | null;
  password?: string | null;
  accountType: UserAccountTypeEnum;
  createdAt: Date;
  device: Device[];
  logs: Log[];
  profile?: Profile | null;
  roles: UsersRole[];
  Project: Project[];
}

declare interface Profile {
  id: string;
  gender: ProfileGenderEnum;
  avatar?: string | null;
  photo?: string | null;
  address?: string | null;
  description?: string | null;
  githubLogin?: string | null;
  githubName?: string | null;
  userId?: string | null;
}

declare interface Device {
  id: string;
  deviceId: string;
  deviceType: string;
  clientIp: string;
  lastLoginAt: Date;
  refreshToken?: string | null;
  refreshTokenExpiresAt?: bigint | null;
  userId?: string | null;
}

declare interface Log {
  id: string;
  createdAt: Date;
  path: string;
  data: string;
  result: number;
  userId?: string | null;
}

declare interface Role {
  id: number;
  name: string;
  roles: UsersRole[];
}

declare interface UsersRole {
  userId: string;
  roleId: number;
}

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
  docsId: string;
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
