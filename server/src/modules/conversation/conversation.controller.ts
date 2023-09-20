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
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ConversationService } from './conversation.service';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { JwtGuard } from 'src/guards/jwt.guard';
import { ChatDto, CompletionsDto } from './dto/chat.dto';

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
    return this.conversationService.getAll(projectId);
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

  @ApiOperation({ summary: 'chat' })
  @ApiResponse({ status: 200, description: '成功获取' })
  @Post('/chat')
  async chat(@Body() chatDto: ChatDto) {
    return this.conversationService.chat(chatDto);
  }

  @ApiOperation({ summary: 'completions' })
  @ApiResponse({ status: 200, description: '成功获取' })
  @Post('/completions')
  async completions(@Body() completionsDto: CompletionsDto) {
    return this.conversationService.completions(completionsDto);
  }

  @ApiOperation({ summary: '查询' })
  @ApiResponse({ status: 200, description: '成功获取' })
  @Get(':id/search')
  async search(@Query('namespace') namespace: string) {
    return this.conversationService.search(namespace);
  }
}
