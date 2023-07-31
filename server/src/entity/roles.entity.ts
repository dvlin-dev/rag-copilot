import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Expose } from 'class-transformer';
import { User } from 'src/entity/user.entity';

export enum RolesEnum {
  // super
  super,
  // admin
  admin,
  // user
  user,
}

@Entity()
export class Roles {
  @PrimaryGeneratedColumn()
  @Expose()
  id: number;

  @Column()
  @Expose()
  name: string;

  @ManyToMany(() => User, (user) => user.roles)
  @Expose()
  users: User[];
}
