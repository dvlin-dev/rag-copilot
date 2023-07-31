import { Exclude, Expose } from 'class-transformer';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { User } from './user.entity';

@Entity()
export class Device {
  @PrimaryColumn('uuid')
  @Expose()
  id: string = uuidv4();

  @Column()
  @Expose()
  deviceId: string;

  @Column()
  @Expose()
  deviceType: string;

  @Column()
  @Expose()
  clientIp: string;

  @Column()
  lastLoginAt: Date;

  @Column({ type: 'text', nullable: true })
  @Exclude()
  refreshToken: string;

  @Column({ type: 'bigint', nullable: true })
  @Exclude()
  refreshTokenExpiresAt: number;

  @ManyToOne(() => User, (user) => user.devices, { onDelete: 'CASCADE' })
  user: User;
}
