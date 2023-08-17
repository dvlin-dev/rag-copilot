declare interface LoginByPasswordParams {
  email: string;
  password: string;
  deviceId: string;
  deviceType: string;
}

declare type RegisterByEmail = {
  email: 'string';
  password: 'string';
  code: 'string';
  username: 'string';
};

declare interface User {
  id: string;
  githubId: string;
  username: string;
  email: string;
  password: string;
  createdAt: string;
  accountType: AccountType;
  roles: Roles[];
  profile: Profile;
}

declare interface Profile {
  id: string;
  gender: Gender;
  avatar: string;
  photo: string;
  githubLogin: string;
  githubName: string;
  description: string;
  refreshToken: string;
  refreshTokenExpiresAt: number;
}

declare enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

declare enum AccountType {
  EMAIL = 'email',
  GITHUB = 'github',
}

declare class Group {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  user: User;
  material: Material[];
}

declare class CollectionGroup {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  user: User;
  material: Material[];
}

declare interface Material {
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

declare interface Comment {
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

declare interface Tag {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  material: Material[];
  user: User;
}

declare interface Like {
  id: string;
  user: User;
  materials: Material;
  likeDate: Date;
}

declare interface Follow {
  id: string;
  follower: User;
  following: User;
  followDate: Date;
}
declare interface Roles {
  id: number;
  name: string;
}

declare interface UpdateUserDto {
  username?: string;

  email?: string;

  gender?: Gender;

  avatar?: string;

  photo?: string;

  description?: string;
}
