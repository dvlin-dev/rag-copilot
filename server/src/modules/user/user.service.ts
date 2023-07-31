import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  Put,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '../../entity/user.entity';
import { DeepPartial, Repository } from 'typeorm';
import { Roles, RolesEnum } from 'src/entity/roles.entity';
import * as argon2 from 'argon2';
import { getUserDto } from './dto/get-user.dto';
import { Logs } from 'src/entity/logs.entity';
import { getServerConfig } from 'ormconfig';
import { Gender, Profile } from '../../entity/profile.entity';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { InjectRedis, Redis } from '@nestjs-modules/ioredis';
import { FuzzyQueryDto } from './dto/fuzzy-query.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Logs) private readonly logsRepository: Repository<Logs>,
    @InjectRepository(Roles)
    private readonly rolesRepository: Repository<Roles>,
    @InjectRedis() private readonly redis: Redis,
    private configService: ConfigService
  ) {}

  async create(user: DeepPartial<User>) {
    const { username, email, password } = user;
    const role = await this.rolesRepository.findOne({
      where: { id: RolesEnum.user },
    });
    user.roles = [role];

    // 重名检测
    const userByUsername = await this.userRepository.findOne({
      where: {
        username,
      },
    });

    if (userByUsername) {
      throw new ForbiddenException('用户名已存在');
    }

    if (email) {
      // 邮箱重复检测
      const userByEmail = await this.userRepository.findOne({
        where: {
          email,
        },
      });

      if (userByEmail) {
        throw new ForbiddenException('邮箱已存在，可找回密码');
      }
    }

    const userTmp = await this.userRepository.create(user);
    if (password) {
      userTmp.password = await argon2.hash(userTmp.password);
    }
    const userProfile = {
      ...user.profile,
      gender: Gender.OTHER,
    } as Profile;
    const profile = new Profile(userProfile);
    userTmp.profile = profile;
    const res = await this.userRepository.save(userTmp);
    return res;
  }

  async findAll(query: getUserDto) {
    const { limit, page, username, email, gender, role } = query;
    const take = limit || 10;
    const skip = ((page || 1) - 1) * take;

    const [data, total] = await this.userRepository.findAndCount({
      relations: {
        profile: true,
        roles: true,
      },
      where: {
        username,
        email,
        profile: {
          gender,
        },
        roles: {
          id: role,
        },
      },
      take,
      skip,
    });
    const totalPages = Math.ceil(total / limit);

    return { data, total, totalPages };
  }

  find(username: string) {
    return this.userRepository.findOne({
      where: { username },
      relations: ['roles'],
    });
  }

  findByEmail(email: string) {
    return this.userRepository.findOne({
      where: { email },
      relations: ['roles', 'profile'],
    });
  }

  findByGithubId(githubId: string) {
    return this.userRepository.findOne({
      where: { githubId },
      relations: ['roles', 'profile'],
    });
  }

  findOneById(id: string) {
    return this.userRepository.findOne({ where: { id } });
  }

  // 联合模型更新，需要使用save方法或者queryBuilder，
  // update方法，只适合单模型的更新，不适合有关系的模型更新
  async update(id: string, updateUserDto: UpdateUserDto) {
    const userTemp = await this.findProfile(id);

    const { address, description, gender, avatar, photo } = updateUserDto;

    Object.assign(userTemp.profile, {
      ...(address && { address }),
      ...(description && { description }),
      ...(gender && { gender }),
      ...(avatar && { avatar }),
      ...(photo && { photo }),
    });

    const newUser = this.userRepository.merge(userTemp, updateUserDto);
    return this.userRepository.save(newUser);
  }

  async updatePassword(passwordDto: UpdatePasswordDto) {
    const { email, code, password } = passwordDto;
    const user = await this.userRepository.findOne({
      where: { email },
    });

    const getCode = await this.redis.get(`${email}_code`);
    if (!code || code !== getCode) {
      throw new ForbiddenException('验证码已过期');
    } else {
      this.redis.del(`${email}_code`);
    }

    user.password = await argon2.hash(password);
    return this.userRepository.save(user);
  }

  async remove(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    return this.userRepository.remove(user);
  }

  async findProfile(id: string) {
    const userInfo = await this.userRepository.findOne({
      where: {
        id,
      },
      relations: {
        profile: true,
        followers: true,
        following: true,
      },
    });
    if (!userInfo) {
      throw new NotFoundException('用户不存在');
    }
    return userInfo;
  }

  findLogByGroup(id: number) {
    return this.logsRepository
      .createQueryBuilder('logs')
      .select('logs.result', 'result')
      .addSelect('COUNT("logs.result")', 'count')
      .leftJoinAndSelect('logs.user', 'user')
      .where('user.id = :id', { id })
      .groupBy('logs.result')
      .orderBy('result', 'ASC')
      .addOrderBy('count', 'DESC')
      .limit(1)
      .offset(1)
      .getRawMany();
  }

  async createAdminAccount() {
    const config = getServerConfig();
    const adminEmail = config['user'] as string;
    const adminUserName = 'devlinkroot';
    const adminPassword = config['DB_PASSWORD'] as string;

    const existingAdmin = await this.userRepository.findOne({
      where: { email: adminEmail },
    });
    if (!existingAdmin) {
      // 创建管理员账号
      const adminData: Partial<User> = {
        username: adminUserName,
        email: adminEmail,
        password: adminPassword,
        roles: [RolesEnum.super] as any,
      };

      try {
        await this.create(adminData);
        console.log('Admin account created successfully');
      } catch (error) {
        console.log('Failed to create admin account: ', error.message);
      }
    }
  }
}
