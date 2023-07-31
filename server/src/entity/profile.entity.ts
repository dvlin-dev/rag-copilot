import { Exclude, Expose } from 'class-transformer';
import { User } from 'src/entity/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Device } from './device.entity';

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

@Entity()
export class Profile {
  @PrimaryColumn('uuid')
  @Expose()
  id: string = uuidv4();

  @Column({ type: 'enum', enum: Gender })
  gender: Gender;

  @Expose()
  @Column({ nullable: true })
  avatar: string;

  @Expose()
  @Column({ nullable: true })
  photo: string;

  @Column({ nullable: true })
  @Expose()
  address: string;

  @Column({ nullable: true })
  @Expose()
  description: string;

  @Column({ nullable: true })
  @Expose()
  githubLogin: string;

  @Column({ nullable: true })
  @Expose()
  githubName: string;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  @Expose()
  user: User;

  constructor(profile?: Partial<Profile>) {
    this.gender = profile?.gender ?? Gender.OTHER;
    this.address = profile?.address ?? '';
    this.description = profile?.description ?? '';
    Object.assign(this, profile);
  }
}
