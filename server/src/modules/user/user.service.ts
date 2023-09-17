import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  Put,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UpdateUserDto } from './dto/update-user.dto';
import * as argon2 from 'argon2';
import { getUserDto } from './dto/get-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { InjectRedis, Redis } from '@nestjs-modules/ioredis';
import { getServerConfig } from 'src/utils';
import { ProfileGenderEnum } from '@prisma/client';
import { RolesEnum, UserInput } from './dto/user.input';
import { PrismaService } from 'src/utils/prisma/prisma.service';
@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    @InjectRedis() private readonly redis: Redis,
    private configService: ConfigService
  ) {}

  async create(user: Partial<UserInput>) {
    const { username, email, password } = user;

    // 重名检测
    const userByUsername = await this.prisma.user.findUnique({
      where: { username },
    });

    if (userByUsername) {
      throw new ForbiddenException('用户名已存在');
    }

    if (email) {
      // 邮箱重复检测
      const userByEmail = await this.prisma.user.findUnique({
        where: { email },
      });

      if (userByEmail) {
        throw new ForbiddenException('邮箱已存在，可找回密码');
      }
    }

    const hashedPassword = password ? await argon2.hash(password) : undefined;
    const profile = {
      ...user.profile,
      gender: ProfileGenderEnum.other,
    };
    const createdUser = await this.prisma.user.create({
      // @ts-ignore
      data: {
        ...user,
        password: hashedPassword,
        profile: {
          create: profile,
        },
      },
      include: {
        profile: true,
      },
    });

    return createdUser;
  }

  async findAll(query: getUserDto) {
    const { limit, page, username, email, gender, role } = query;
    const take = limit || 10;
    const skip = ((page || 1) - 1) * take;

    const users = await this.prisma.user.findMany({
      include: {
        profile: true,
        roles: {
          include: { roles: true },
        },
      },
      where: {
        username,
        email,
        profile: {
          gender,
        },
        roles: {
          some: {
            roleId: role,
          },
        },
      },
      take,
      skip,
    });

    const total = await this.prisma.user.count({
      where: {
        username,
        email,
        profile: {
          gender,
        },
        roles: {
          some: {
            roleId: role,
          },
        },
      },
    });

    const totalPages = Math.ceil(total / limit);
    return { data: users, total, totalPages };
  }

  find(username: string) {
    return this.prisma.user.findUnique({
      where: { username },
      include: { roles: true },
    });
  }

  findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: { roles: true, profile: true },
    });
  }

  findByGithubId(githubId: string) {
    return this.prisma.user.findUnique({
      where: { githubId },
      include: { roles: true, profile: true },
    });
  }

  findOneById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const userTemp = await this.prisma.user.findUnique({
      where: { id },
      include: { profile: true },
    });

    if (!userTemp) {
      throw new NotFoundException('用户不存在');
    }

    const { description, gender, avatar, photo } = updateUserDto;

    return this.prisma.user.update({
      where: { id },
      data: {
        profile: {
          update: {
            ...(description && { description }),
            ...(gender && { gender }),
            ...(avatar && { avatar }),
            ...(photo && { photo }),
          },
        },
      },
      include: { profile: true },
    });
  }

  async updatePassword(passwordDto: UpdatePasswordDto) {
    const { email, code, password } = passwordDto;
    const user = await this.prisma.user.findUnique({ where: { email } });

    const getCode = await this.redis.get(`${email}_code`);
    if (!code || code !== getCode) {
      throw new ForbiddenException('验证码已过期');
    } else {
      this.redis.del(`${email}_code`);
    }

    const hashedPassword = await argon2.hash(password);

    return this.prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });
  }

  async remove(id: string) {
    return this.prisma.user.delete({ where: { id } });
  }

  async findProfile(id: string) {
    const userInfo = await this.prisma.user.findUnique({
      where: { id },
      include: {
        profile: true,
      },
    });

    if (!userInfo) {
      throw new NotFoundException('用户不存在');
    }

    return userInfo;
  }

  async createAdminAccount() {
    const config = getServerConfig(); // 确保这个方法是可用的
    const adminEmail = config['user'] as string;
    const adminUserName = 'docs-copilot-root';
    const adminPassword = config['DB_PASSWORD'] as string;

    const existingAdmin = await this.prisma.user.findUnique({
      where: { email: adminEmail },
    });
    if (!existingAdmin) {
      const adminData = {
        username: adminUserName,
        email: adminEmail,
        password: adminPassword,
        roles: [RolesEnum.super],
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
