import { Device, Log, Profile, Project, User, UsersRole } from '@prisma/client';

export interface UserInput extends User {
  devices: Device[];
  logs: Log[];
  profile: Profile;
  roles: UsersRole[] | RolesEnum[];
  Project: Project[];
}

export enum RolesEnum {
  super = 0,
  admin = 1,
  user = 2,
}
