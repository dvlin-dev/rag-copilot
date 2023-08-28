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
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { VectorService } from './vector.service';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { CreateVectorDto } from './dto/create-vector.dto';
import { JwtGuard } from 'src/guards/jwt.guard';
import { SearchVectorDto } from './dto/seatch.dto';
import { UpdateVectorDto } from './dto/update-vector.dto';

@ApiTags('向量')
@UseInterceptors(ClassSerializerInterceptor)
@Controller('vector')
export class VectorController {
  constructor(
    private vectorService: VectorService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService
  ) {}

  @ApiOperation({ summary: '获取向量详情' })
  @ApiResponse({ status: 200, description: '成功获取用户资料' })
  @Get(':id')
  get(@Query('id') id: string) {
    return this.vectorService.get(id);
  }

  @ApiOperation({ summary: '获取所有的向量列表' })
  @ApiResponse({ status: 200, description: '成功获取用户资料' })
  @Get(':docId/list')
  async getAll(@Param('docId') docId: string) {
    return this.vectorService.getAll(docId);
  }

  @ApiOperation({ summary: '添加向量数据' })
  @Post()
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  create(@Body() createVectorDto: CreateVectorDto) {
    return this.vectorService.create(createVectorDto);
  }

  @ApiOperation({ summary: '更新向量信息' })
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @Patch('')
  update(@Body() updateVectorDto: UpdateVectorDto) {
    return this.vectorService.update(updateVectorDto);
  }

  @ApiOperation({ summary: '删除向量' })
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.vectorService.delete(id);
  }

  @ApiOperation({ summary: '相似度搜索' })
  @ApiResponse({ status: 200, description: '成功获取' })
  @Get(':docId/similarity_search')
  async similaritySearch(
    @Param('docIds') docIds: string[],
    @Query() searchVectorDto: SearchVectorDto
  ) {
    return this.vectorService.similaritySearch(docIds, searchVectorDto);
  }

  @ApiOperation({ summary: 'chat_test' })
  @ApiResponse({ status: 200, description: '成功获取' })
  @Get(':docId/chat_test')
  async chatTest(
    @Param('docId') docId: string,
    @Query() searchVectorDto: SearchVectorDto
  ) {
    return this.vectorService.chat_test(docId, searchVectorDto);
  }
}
