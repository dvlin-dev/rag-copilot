import { Injectable } from '@nestjs/common';
import { CreateDocsDto } from './dto/create-vector.dto';
import { PrismaService } from 'src/utils/prisma/prisma.service';

@Injectable()
export class DocsService {
  constructor(private prisma: PrismaService) {}

  get(id: string) {
    return this.prisma.docs.findUnique({
      where: {
        id,
      },
    });
  }

  getAll(user_id: string) {
    return this.prisma.docs.findMany({
      where: {
        user_id,
      },
    });
  }
  create(createDocsDto: CreateDocsDto, user_id: string) {
    const { name, description } = createDocsDto;
    return this.prisma.docs.create({
      data: {
        name,
        description,
        user_id,
      },
    });
  }
}
