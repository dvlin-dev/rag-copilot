import { Module } from '@nestjs/common';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { VectorService } from '../vector/vector.service';

@Module({
  controllers: [ProjectController],
  providers: [ProjectService, VectorService],
  exports: [ProjectService],
})
export class ProjectModule {}
