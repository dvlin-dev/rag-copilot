import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseFilters,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiProperty, ApiTags } from '@nestjs/swagger';
import { StatusService } from './status.service';
import { TypeormFilter } from 'src/filters/typeorm.filter';
import { JwtGuard } from 'src/guards/jwt.guard';
import { ComponentStatus } from './enum';
import { ConfigService } from '@nestjs/config';
import { ConfigEnum } from 'src/enum/config.enum';
import { getServerConfig } from 'ormconfig';

class ChangeStatusDto {
  @ApiProperty({
    description: '更改的状态',
    enum: ComponentStatus,
  })
  status: ComponentStatus;
}

@ApiTags('状态')
@Controller('status')
@UseFilters(new TypeormFilter())
export class StatusController {
  constructor(
    private readonly rolesService: StatusService,
    private readonly configService: ConfigService
  ) {}

  @Post()
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiBody({ type: ChangeStatusDto })
  change(@Body('status') status: ComponentStatus, @Req() req) {
    const email = req.user.email;
    const config = getServerConfig();
    const adminEmail = config['user'] as string;
    if (email !== adminEmail) {
      return new ForbiddenException('权限不足');
    }
    const componentId = this.configService.get(ConfigEnum.COMPONENT_ID);
    const pageId = this.configService.get(ConfigEnum.PAGE_ID);
    const statusApiKey = this.configService.get(ConfigEnum.STATUSPAGE_API_KEY);
    return this.rolesService.updateComponentStatus(
      componentId,
      status,
      pageId,
      statusApiKey
    );
  }
}
