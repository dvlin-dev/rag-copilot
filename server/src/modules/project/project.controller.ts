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
import { ProjectService } from './project.service';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { CreateProjectDto } from './dto/create-project.dto';
import { JwtGuard } from 'src/guards/jwt.guard';
import { UpdateProjectDto } from './dto/update-project.dto';

@ApiTags('项目')
@UseInterceptors(ClassSerializerInterceptor)
@Controller('project')
export class ProjectController {
  constructor(
    private projectService: ProjectService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService
  ) {}

  @ApiOperation({ summary: '获取项目详情' })
  @ApiResponse({ status: 200, description: '成功获取项目资料' })
  @Get(':id/detail')
  get(@Query('id') id: string) {
    return this.projectService.get(id);
  }

  @ApiOperation({ summary: '获取项目列表' })
  @ApiResponse({ status: 200, description: '成功获取项目列表' })
  @Get('/list')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  async getAll(@Req() req) {
    const userId = req.user.userId;
    const data = await this.projectService.getAll(userId);
    return {
      data,
    };
  }

  @ApiOperation({ summary: '创建项目' })
  @Post()
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  create(@Body() createProjectDto: CreateProjectDto, @Req() req) {
    const userId = req.user.userId;
    return this.projectService.create(createProjectDto, userId);
  }

  @ApiOperation({ summary: '更新项目信息' })
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @Patch('')
  update(@Body() updateProjectDto: UpdateProjectDto) {
    return this.projectService.update(updateProjectDto);
  }

  @ApiOperation({ summary: '删除项目' })
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.projectService.delete(id);
  }
}
