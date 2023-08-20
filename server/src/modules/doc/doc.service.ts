import { Injectable } from '@nestjs/common';
import { CreateDocDto } from './dto/create-doc.dto';
import { PrismaService } from 'src/utils/prisma/prisma.service';
import { UpdateDocDto } from './dto/update-doc.dto';

@Injectable()
export class DocService {
  constructor(private prisma: PrismaService) {}

  get(id: string) {
    return this.prisma.doc.findUnique({
      where: {
        id,
      },
    });
  }

  getAll(userId: string) {
    return this.prisma.doc.findMany({
      where: {
        userId,
      },
    });
  }

  create(createdocDto: CreateDocDto, userId: string) {
    const { name, description } = createdocDto;
    return this.prisma.doc.create({
      data: {
        name,
        description,
        userId,
      },
    });
  }

  async update(updatedocDto: UpdateDocDto) {
    const { id, name, description } = updatedocDto;
    return this.prisma.doc.update({
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
    return this.prisma.doc.delete({
      where: {
        id,
      },
    });
  }
}
