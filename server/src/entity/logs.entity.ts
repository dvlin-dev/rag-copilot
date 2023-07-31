import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { User } from './user.entity';
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class Logs {
  @PrimaryColumn('uuid')
  id: string = uuidv4();

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  path: string;

  @Column()
  data: string;

  @Column()
  result: number;

  @ManyToOne(() => User, (user) => user.logs)
  @JoinColumn()
  user: User;
}
