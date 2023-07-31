import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Follow } from 'src/entity/follow.entity';
import { User } from 'src/entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FollowService {
  constructor(
    @InjectRepository(Follow)
    private followRepository: Repository<Follow>,
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async followUser(followerId: string, followingId: string) {
    const follower = await this.userRepository.findOne({
      where: {
        id: followerId,
      },
    });
    const following = await this.userRepository.findOne({
      where: {
        id: followingId,
      },
    });

    if (!following) {
      throw new NotFoundException('用户不存在');
    }

    const follow = this.followRepository.create({ follower, following });
    await this.followRepository.save(follow);
    return {
      data: follow,
    };
  }

  async unfollowUser(followerId: string, followingId: string): Promise<void> {
    const follow = await this.followRepository.findOne({
      where: {
        follower: {
          id: followerId,
        },
        following: {
          id: followingId,
        },
      },
    });

    console.log('follow', follow, followerId, followingId);

    if (!follow) {
      throw new NotFoundException('用户不存在');
    }

    await this.followRepository.remove(follow);
  }

  async getFollowers(userId: string) {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
      relations: {
        followers: {
          follower: true,
          following: true,
        },
        following: {
          follower: true,
          following: true,
        },
      },
    });

    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    const followers = user.followers.map((follow) => follow.follower);

    return {
      data: followers,
    };
  }

  async getFollowing(userId: string) {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
      relations: {
        followers: {
          follower: true,
          following: true,
        },
        following: {
          follower: true,
          following: true,
        },
      },
    });

    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    const following = user.following.map((follow) => follow.following);

    return {
      data: following,
    };
  }
}
