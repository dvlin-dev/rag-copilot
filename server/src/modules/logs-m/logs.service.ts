import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Logs } from 'src/entity/logs.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LogsService {
  constructor(
    @InjectRepository(Logs) private readonly logsRepository: Repository<Logs>
  ) {}

  findById(id: string) {
    return this.logsRepository.findOne({
      where: {
        user: {
          id,
        },
      },
      relations: {
        user: true,
      },
    });
  }
}
