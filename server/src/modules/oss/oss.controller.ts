import {
  ClassSerializerInterceptor,
  Controller,
  Post,
  UploadedFile,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { OssService } from './oss.service';
import { ApiBody, ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TypeormFilter } from 'src/filters/typeorm.filter';

@ApiTags('OSS')
@UseInterceptors(ClassSerializerInterceptor)
@UseFilters(new TypeormFilter())
@Controller('oss')
export class OssController {
  constructor(private readonly ossService: OssService) {}

  @Post()
  @ApiConsumes('multipart/form-data') // 设置请求的内容类型
  @ApiBody({
    // 描述请求的内容
    description: '上传文件',
    type: 'multipart/form-data',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: '文件上传成功' })
  @ApiResponse({ status: 400, description: '请求错误' })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file) {
    const fileName = await this.ossService.uploadFile(
      file.originalname,
      file.buffer
    );
    return { url: `https://qiniuyun.devlink.wiki/${fileName}` };
  }
}
