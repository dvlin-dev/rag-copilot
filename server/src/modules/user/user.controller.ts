import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  LoggerService,
  Inject,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
  UseFilters,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '../../entity/user.entity';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { getUserDto } from './dto/get-user.dto';
import { CreateUserPipe } from './pipes/create-user.pipe';
import { JwtGuard } from 'src/guards/jwt.guard';
import { TypeormFilter } from 'src/filters/typeorm.filter';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { TokenExpiredMessage } from 'src/constant';

@ApiTags('用户')
@UseInterceptors(ClassSerializerInterceptor)
@UseFilters(new TypeormFilter())
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService
  ) {}

  @ApiOperation({ summary: '获取用户资料' })
  @ApiResponse({ status: 200, description: '成功获取用户资料' })
  @Get('profile')
  getUserProfile(@Query('id') id: string) {
    return this.userService.findProfile(id);
  }

  @ApiOperation({ summary: '查询自己的信息' })
  @Get('userinfo')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  getUserInfo(@Req() req) {
    return this.userService.findProfile(req.user.userId);
  }

  @ApiOperation({ summary: '添加用户（后台用）' })
  @Post('adduser')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  addUser(@Body(CreateUserPipe) dto: CreateUserDto, @Req() req) {
    // 判断权限
    const user = dto as User;
    return this.userService.create(user);
  }

  @ApiOperation({ summary: '查询所有用户' })
  @Get('findall')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  getUsers(@Query() query: getUserDto) {
    // 判断角色权限，只有管理员才能查询所有用户
    return this.userService.findAll(query);
  }

  @ApiOperation({ summary: '更新自己的信息' })
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @Patch('update')
  async updateUser(
    @Body() updateUserDto: UpdateUserDto,
    @Req() req
  ): Promise<User> {
    if (!req.user.userId) {
      throw new UnauthorizedException(TokenExpiredMessage);
    }

    return this.userService.update(req.user.userId, updateUserDto);
  }

  @ApiOperation({ summary: '更改/找回 密码' })
  @Post('updatePassword')
  async updatePassword(@Body() password: UpdatePasswordDto): Promise<User> {
    return this.userService.updatePassword(password);
  }

  @ApiOperation({ summary: '删除用户' })
  @Delete(':id')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  removeUser(@Param('id') id: string, @Req() req) {
    if (!req.user.userId) {
      throw new UnauthorizedException(TokenExpiredMessage);
    }
    //TODO: 判断是否是管理员
    return this.userService.remove(id);
  }
}
