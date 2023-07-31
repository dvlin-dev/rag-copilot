import { Expose } from 'class-transformer';
import { User } from 'src/entity/user.entity';
import { Index } from './index.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class Document {
  @PrimaryColumn('uuid')
  @Expose()
  id: string = uuidv4();

  @Column({ nullable: true })
  @Expose()
  pageContent: string;

  @Column({ nullable: true })
  @Expose()
  metadata: string;

  @Column({ nullable: true })
  @Expose()
  embedding: string;

  @ManyToOne(() => Index, (index) => index.documents)
  @Column({ nullable: true })
  @Expose()
  indexId: Index;

  @Column({ nullable: true })
  @Expose()
  namespace: string;

  @CreateDateColumn()
  @Expose()
  createdAt: Date;

  @CreateDateColumn()
  @Expose()
  updatedAt: Date;

  @Expose()
  @ManyToOne(() => User, (user) => user.documents)
  user: User;
}
