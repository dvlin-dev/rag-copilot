import {
  Entity,
  PrimaryColumn,
  CreateDateColumn,
  OneToMany,
  Column,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Expose } from 'class-transformer';
import { Document } from './documet.entity';

@Entity()
export class Index {
  @PrimaryColumn('uuid')
  id: string = uuidv4();

  @Column({ nullable: true })
  @Expose()
  name: string;

  @Column({ nullable: true })
  @Expose()
  description: string;

  @Column({ nullable: true })
  @Expose()
  prompt: string;

  @Column({ nullable: true })
  @Expose()
  questions: string[];

  @Expose()
  @OneToMany(() => Document, (document) => document.indexId)
  // 关注列表
  documents: Document[];

  @CreateDateColumn()
  @Expose()
  createdAt: Date;

  @CreateDateColumn()
  @Expose()
  updatedAt: Date;
}
