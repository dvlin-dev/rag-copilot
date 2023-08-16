import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Inject,
  LoggerService,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ConversationService } from './conversation.service';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { JwtGuard } from 'src/guards/jwt.guard';
import { UpdateConversationDto } from './dto/update-conversation.dto';

@ApiTags('会话')
@UseInterceptors(ClassSerializerInterceptor)
@Controller('conversation')
export class ConversationController {
  constructor(
    private conversationService: ConversationService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService
  ) {}

  @ApiOperation({ summary: '获取会话详情' })
  @ApiResponse({ status: 200, description: '成功获取会话资料' })
  @Get(':id/detail')
  get(@Query('id') id: string) {
    return this.conversationService.get(id);
  }

  @ApiOperation({ summary: '获取会话列表' })
  @ApiResponse({ status: 200, description: '成功获取会话列表' })
  @Get(':projectId/list')
  async getAll(@Query('projectId') projectId: string) {
    const data = await this.conversationService.getAll(projectId);
    return {
      data,
    };
  }

  @ApiOperation({ summary: '创建会话' })
  @Post()
  create(@Body() createConversationDto: CreateConversationDto) {
    return this.conversationService.create(createConversationDto);
  }

  @ApiOperation({ summary: '删除会话' })
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.conversationService.delete(id);
  }
}
