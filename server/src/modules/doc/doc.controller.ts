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
import { DocService } from './doc.service';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { CreateDocDto } from './dto/create-doc.dto';
import { JwtGuard } from 'src/guards/jwt.guard';
import { UpdateDocDto } from './dto/update-doc.dto';

@ApiTags('知识库')
@UseInterceptors(ClassSerializerInterceptor)
@Controller('doc')
export class DocController {
  constructor(
    private docService: DocService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService
  ) {}

  @ApiOperation({ summary: '获取知识库详情' })
  @ApiResponse({ status: 200, description: '成功获取知识库资料' })
  @Get(':id/detail')
  get(@Query('id') id: string) {
    return this.docService.get(id);
  }

  @ApiOperation({ summary: '获取知识库列表' })
  @ApiResponse({ status: 200, description: '成功获取知识库列表' })
  @Get('/list')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  async getAll(@Req() req) {
    const userId = req.user.userId;
    return this.docService.getAll(userId);
  }

  @ApiOperation({ summary: '创建知识库' })
  @Post()
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  create(@Body() createDocsDto: CreateDocDto, @Req() req) {
    const userId = req.user.userId;
    return this.docService.create(createDocsDto, userId);
  }

  @ApiOperation({ summary: '更新知识库信息' })
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @Patch('')
  update(@Body() updateDocsDto: UpdateDocDto) {
    return this.docService.update(updateDocsDto);
  }

  @ApiOperation({ summary: '删除知识库' })
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.docService.delete(id);
  }
}
