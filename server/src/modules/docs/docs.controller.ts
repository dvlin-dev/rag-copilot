import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Inject,
  LoggerService,
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
import { DocsService } from './docs.service';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { CreateDocsDto } from './dto/create-vector.dto';
import { JwtGuard } from 'src/guards/jwt.guard';

@ApiTags('知识库')
@UseInterceptors(ClassSerializerInterceptor)
@Controller('docs')
export class DocsController {
  constructor(
    private docsService: DocsService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService
  ) {}

  @ApiOperation({ summary: '获取知识库详情' })
  @ApiResponse({ status: 200, description: '成功获取知识库资料' })
  @Get(':id')
  get(@Query('id') id: string) {
    return this.docsService.get(id);
  }

  @ApiOperation({ summary: '获取知识库列表' })
  @ApiResponse({ status: 200, description: '成功获取知识库列表' })
  @Get()
  getAll(@Query('user_id') user_id: string, @Req() req) {
    const _user_id = user_id || req.user.user_id;
    return this.docsService.getAll(_user_id);
  }

  @ApiOperation({ summary: '创建知识库' })
  @Post()
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  create(@Body() createVectorDto: CreateDocsDto, @Req() req) {
    console.info('req.user.user_id', req.user);
    const user_id = req.user.user_id;
    return this.docsService.create(createVectorDto, user_id);
  }

  @Patch(':id')
  edit() {}

  @Delete(':id')
  delete() {}
}
