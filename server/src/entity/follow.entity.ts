import { Entity, ManyToOne, PrimaryColumn, CreateDateColumn } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { User } from './user.entity';
import { Expose } from 'class-transformer';

@Entity()
export class Follow {
  @PrimaryColumn('uuid')
  id: string = uuidv4();

  @Expose()
  @ManyToOne(() => User, (user) => user.following)
  // 粉丝
  follower: User;

  @Expose()
  @ManyToOne(() => User, (user) => user.followers)
  // 关注列表
  following: User;

  @Expose()
  @CreateDateColumn()
  followDate: Date;
}
