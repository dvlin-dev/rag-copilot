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
import { DocsService } from './docs.service';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { CreateDocsDto } from './dto/create-vector.dto';
import { JwtGuard } from 'src/guards/jwt.guard';
import { UpdateDocsDto } from './dto/update-vector.dto';

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
    const data = await this.docsService.getAll(user_id);
    return {
      data,
    };
  }

  @ApiOperation({ summary: '创建知识库' })
  @Post()
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  create(@Body() createDocsDto: CreateDocsDto, @Req() req) {
    const user_id = req.user.user_id;
    return this.docsService.create(createDocsDto, user_id);
  }

  @ApiOperation({ summary: '更新知识库信息' })
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @Patch('')
  update(@Body() updateDocsDto: UpdateDocsDto) {
    return this.docsService.update(updateDocsDto);
  }

  @ApiOperation({ summary: '删除知识库' })
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.docsService.delete(id);
  }
}
