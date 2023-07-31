export interface LoginByPasswordParams {
  email: string;
  password: string;
  deviceId: string;
  deviceType: string;
}

export type RegisterByEmail = {
  email: 'string';
  password: 'string';
  code: 'string';
  username: 'string';
};

export interface User {
  id: string;
  githubId: string;
  username: string;
  email: string;
  password: string;
  createdAt: string;
  accountType: AccountType;
  roles: Roles[];
  profile: Profile;
  group: Group[];
  materials: Material[];
  likes: Like[];
  stars: Material[];
  followers: Follow[];
  following: Follow[];
  tags: Tag[];
}

interface Profile {
  id: string;
  gender: Gender;
  avatar: string;
  photo: string;
  address: string;
  githubLogin: string;
  githubName: string;
  description: string;
  refreshToken: string;
  refreshTokenExpiresAt: number;
}

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

export declare enum AccountType {
  EMAIL = 'email',
  GITHUB = 'github',
}

export declare class Group {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  user: User;
  material: Material[];
}

export declare class CollectionGroup {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  user: User;
  material: Material[];
}

export interface Material {
  id: string;
  name: string;
  npmName: string;
  version: string;
  abstract: string;
  description: string;
  installCommand: string;
  startCommand: string;
  ignore: string;
  isPrivate: boolean;
  createdAt: string;
  updatedAt: string;
  user: User;
  tags: Tag[];
  groups: Group[];
  collectedInGroups: CollectionGroup[];
  comments: Comment[];
  likes: Like[];
  stars: User[];
}

export interface Comment {
  id: string;

  content: string;

  emoticon: string;

  createdAt: string;

  updateAt: string;

  material: Material;

  parent: Comment;

  children: Comment[];

  user: User;
}

export interface Tag {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  material: Material[];
  user: User;
}

export interface Like {
  id: string;
  user: User;
  materials: Material;
  likeDate: Date;
}

export interface Follow {
  id: string;
  follower: User;
  following: User;
  followDate: Date;
}
export interface Roles {
  id: number;
  name: string;
}

export interface UpdateUserDto {
  username?: string;

  email?: string;

  gender?: Gender;

  avatar?: string;

  photo?: string;

  address?: string;

  description?: string;
}
