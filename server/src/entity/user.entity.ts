import { Roles } from 'src/entity/roles.entity';
import { Exclude, Expose } from 'class-transformer';
import { v4 as uuidv4 } from 'uuid';

import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { Logs } from 'src/entity/logs.entity';
import { Profile } from 'src/entity/profile.entity';
import { Follow } from './follow.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Device } from './device.entity';

export enum AccountType {
  EMAIL = 'email',
  GITHUB = 'github',
}

@Entity()
export class User {
  @ApiProperty()
  @PrimaryColumn('uuid')
  id: string = uuidv4();

  @ApiProperty()
  @Column({ unique: true, nullable: true })
  githubId: string;

  @ApiProperty()
  @Column({ unique: true })
  username: string;

  @ApiProperty()
  @Column({ unique: true, nullable: true })
  email: string;

  @ApiProperty()
  @Column({ nullable: true })
  @Exclude()
  password: string;

  @Column({ type: 'enum', enum: AccountType })
  accountType: AccountType;

  @Expose()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @OneToMany(() => Logs, (logs) => logs.user, { cascade: true })
  logs: Logs[];

  @ManyToMany(() => Roles, (roles) => roles.users)
  @JoinTable({ name: 'users_roles' })
  roles: Roles[];

  @OneToOne(() => Profile, (profile) => profile.user, { cascade: true })
  profile: Profile;

  @OneToMany(() => Follow, (follow) => follow.following)
  followers: Follow[];

  @OneToMany(() => Follow, (follow) => follow.follower)
  following: Follow[];

  @OneToMany(() => Device, (device) => device.user, { cascade: true })
  devices: Device[];
}
