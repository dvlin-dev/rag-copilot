import {
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UnauthorizedException,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FollowService } from './follow.service';
import { JwtGuard } from 'src/guards/jwt.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TypeormFilter } from 'src/filters/typeorm.filter';
import { TokenExpiredMessage } from 'src/constant';

@ApiTags('用户关注相关')
@UseInterceptors(ClassSerializerInterceptor)
@UseFilters(new TypeormFilter())
@Controller('follow')
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  @ApiOperation({ summary: '关注' })
  @Post('/:followingId')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  async followUser(@Param('followingId') followingId: string, @Req() req) {
    const userId = req.user.userId;
    if (!userId) {
      throw new UnauthorizedException(TokenExpiredMessage);
    }
    return await this.followService.followUser(userId, followingId);
  }

  @ApiOperation({ summary: '取关' })
  @Delete('/:followingId')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  async unfollowUser(@Param('followingId') followingId: string, @Req() req) {
    const userId = req.user.userId;
    if (!userId) {
      throw new UnauthorizedException(TokenExpiredMessage);
    }
    return await this.followService.unfollowUser(userId, followingId);
  }

  @ApiOperation({ summary: '查询用户粉丝列表' })
  @Get('/:userId/followers')
  async getFollowers(@Param('userId') userId: string) {
    return await this.followService.getFollowers(userId);
  }

  @ApiOperation({ summary: '查询关注列表' })
  @Get('/:userId/following')
  async getFolloing(@Param('userId') userId: string) {
    return await this.followService.getFollowing(userId);
  }
}
