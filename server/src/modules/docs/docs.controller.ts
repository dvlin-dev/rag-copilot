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
  @Get(':id/detail')
  get(@Query('id') id: string) {
    return this.docsService.get(id);
  }

  @ApiOperation({ summary: '获取知识库列表' })
  @ApiResponse({ status: 200, description: '成功获取知识库列表' })
  @Get('/list')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  async getAll(@Req() req) {
    const user_id = req.user.user_id;
    const lists = await this.docsService.getAll(user_id);
    return {
      lists,
    };
  }

  @ApiOperation({ summary: '创建知识库' })
  @Post()
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  create(@Body() createVectorDto: CreateDocsDto, @Req() req) {
    const user_id = req.user.user_id;
    return this.docsService.create(createVectorDto, user_id);
  }

  @Patch(':id')
  edit() {}

  @Delete(':id')
  delete() {}
}
