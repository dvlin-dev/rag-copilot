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
  github_id?: string | null;
  username: string;
  email?: string | null;
  password?: string | null;
  account_type: UserAccountTypeEnum;
  created_at: Date;
  device: Device[];
  logs: Log[];
  profile?: Profile | null;
  users_roles: UsersRole[];
  Project: Project[];
}

declare interface Profile {
  id: string;
  gender: ProfileGenderEnum;
  avatar?: string | null;
  photo?: string | null;
  address?: string | null;
  description?: string | null;
  github_login?: string | null;
  github_name?: string | null;
  userId?: string | null;
}

declare interface Device {
  id: string;
  device_id: string;
  device_type: string;
  client_ip: string;
  last_login_at: Date;
  refresh_token?: string | null;
  refresh_token_expires_at?: bigint | null;
  user_id?: string | null;
}

declare interface Log {
  id: string;
  created_at: Date;
  path: string;
  data: string;
  result: number;
  user_id?: string | null;
}

declare interface Role {
  id: number;
  name: string;
  users_roles: UsersRole[];
}

declare interface UsersRole {
  user_id: string;
  role_id: number;
}

declare interface Project {
  id: string;
  name: string;
  project_detail_id: string;
  user_id: string;
  documents: Document[];
  conversations: Conversation[];
}

declare interface ProjectDetail {
  id: string;
  description?: string | null;
  prompt?: string | null;
  questions: string[];
  created_at: Date;
  updated_at: Date;
  white_list: string[];
  ip_limit?: number | null;
}

declare interface Docs {
  id: string;
  name?: string | null;
  description?: string | null;
  indexs: Index[];
  created_at: Date;
  updated_at: Date;
  project_id: string;
}

declare interface Index {
  id: string;
  content: string;
  vector?: any; // Unsupported type, using 'any' for now.
  source?: string | null;
  namespace?: string | null;
  metadata?: any; // Assuming JSON, using 'any' for now.
  document_id: string;
}

declare interface Conversation {
  id: string;
  projectId?: string | null;
  messages: Message[];
  created_at: Date;
  updated_at: Date;
}

declare interface Message {
  id: string;
  content: string;
  role: MessageRole;
  rating_value?: number | null;
  created_at: Date;
  conversationId?: string | null;
}
