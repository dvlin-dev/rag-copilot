import { Injectable } from '@nestjs/common';
import { CreateDocsDto } from './dto/create-vector.dto';
import { PrismaService } from 'src/utils/prisma/prisma.service';
import { UpdateDocsDto } from './dto/update-vector.dto';

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

  getAll(userId: string) {
    return this.prisma.docs.findMany({
      where: {
        userId,
      },
    });
  }

  create(createDocsDto: CreateDocsDto, userId: string) {
    const { name, description } = createDocsDto;
    return this.prisma.docs.create({
      data: {
        name,
        description,
        userId,
      },
    });
  }

  async update(updateDocsDto: UpdateDocsDto) {
    const { id, name, description } = updateDocsDto;
    return this.prisma.docs.update({
      where: {
        id,
      },
      data: {
        name,
        description,
      },
    });
  }

  delete(id: string) {
    return this.prisma.docs.delete({
      where: {
        id,
      },
    });
  }
}
