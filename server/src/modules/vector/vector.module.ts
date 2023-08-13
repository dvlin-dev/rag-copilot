import { Module } from '@nestjs/common';
import { VectorController } from './vector.controller';
import { VectorService } from './vector.service';

@Module({
  controllers: [VectorController],
  providers: [VectorService],
  exports: [VectorService],
})
export class VectorModule {}
